<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\BonLivraison;
use App\Models\Encaissement;
use App\Models\VenteLigne;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RapportController extends Controller
{
    public function index(Request $request)
    {
        $dateDebut = $request->input('date_debut');
        $dateFin = $request->input('date_fin');
        $clientId = $request->input('client_id');

        $clients = Client::orderBy('nom')->get();

        $clientsQuery = Client::query();
        
        if ($clientId) {
            $clientsQuery->where('id', $clientId);
        }

        $clientsData = $clientsQuery->get()->map(function ($client) use ($dateDebut, $dateFin) {
            
            $caQuery = VenteLigne::join('bon_livraisons', 'vente_lignes.bon_livraison_id', '=', 'bon_livraisons.id')
                ->where('vente_lignes.client_id', $client->id);
                
            if ($dateDebut) {
                $caQuery->where('bon_livraisons.date', '>=', Carbon::parse($dateDebut)->startOfDay());
            }
            if ($dateFin) {
                $caQuery->where('bon_livraisons.date', '<=', Carbon::parse($dateFin)->endOfDay());
            }
            $caTotal = $caQuery->sum('vente_lignes.montant');

            $encaisseQuery = Encaissement::where('client_id', $client->id)
                ->where('statut', 'encaisse');
                
            if ($dateDebut) {
                $encaisseQuery->where('date', '>=', Carbon::parse($dateDebut)->startOfDay());
            }
            if ($dateFin) {
                $encaisseQuery->where('date', '<=', Carbon::parse($dateFin)->endOfDay());
            }
            $encaisseTotal = $encaisseQuery->sum('montant');

            $soldeActuel = $client->getSoldeAttribute();

            return [
                'id' => $client->id,
                'code_client' => $client->code_client,
                'nom' => $client->nom,
                'ca_total' => $caTotal,
                'encaisse_total' => $encaisseTotal,
                'solde_actuel' => $soldeActuel,
            ];
        });

        $totalCA = $clientsData->sum('ca_total');
        $totalEncaisse = $clientsData->sum('encaisse_total');
        $totalSolde = $clientsData->sum('solde_actuel');

        return Inertia::render('Rapports/Index', [
            'clients' => $clients,
            'rapportData' => $clientsData,
            'filters' => [
                'date_debut' => $dateDebut,
                'date_fin' => $dateFin,
                'client_id' => $clientId,
            ],
            'kpis' => [
                'total_ca' => $totalCA,
                'total_encaisse' => $totalEncaisse,
                'total_solde' => $totalSolde
            ]
        ]);
    }
}
