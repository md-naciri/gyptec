<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Produit;
use App\Models\RemiseBareme;
use App\Models\Remise;
use App\Models\VenteLigne;
use App\Models\BonLivraison;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RemiseController extends Controller
{
    // Affiche la matrice de paramétrage des barèmes
    public function baremes(Request $request)
    {
        $annee = $request->input('annee', Carbon::now()->year);
        
        $clients = Client::orderBy('nom')->get();
        $produits = Produit::orderBy('nom')->get();
        $baremes = RemiseBareme::where('annee', $annee)->get();

        return Inertia::render('Remises/Baremes', [
            'annee' => $annee,
            'clients' => $clients,
            'produits' => $produits,
            'baremes' => $baremes,
        ]);
    }

    // Sauvegarde la matrice des barèmes
    public function saveBaremes(Request $request)
    {
        $request->validate([
            'annee' => 'required|integer',
            'baremes' => 'required|array',
            'baremes.*.client_id' => 'required|exists:clients,id',
            'baremes.*.produit_id' => 'required|exists:produits,id',
            'baremes.*.taux_dh_par_tonne' => 'required|numeric|min:0',
        ]);

        $annee = $request->input('annee');
        $baremesData = $request->input('baremes');

        DB::transaction(function () use ($annee, $baremesData) {
            foreach ($baremesData as $item) {
                if (isset($item['taux_dh_par_tonne']) && $item['taux_dh_par_tonne'] >= 0) {
                    RemiseBareme::updateOrCreate(
                        [
                            'client_id' => $item['client_id'],
                            'produit_id' => $item['produit_id'],
                            'annee' => $annee,
                        ],
                        [
                            'taux_dh_par_tonne' => $item['taux_dh_par_tonne']
                        ]
                    );
                }
            }
        });

        return redirect()->back()->with('success', 'Barèmes enregistrés avec succès.');
    }

    // Affiche le calcul des remises pour l'année
    public function calculs(Request $request)
    {
        $annee = $request->input('annee', Carbon::now()->year);
        
        $clients = Client::orderBy('nom')->get();
        $baremes = RemiseBareme::where('annee', $annee)->get();
        
        // Tonnnage vendu cette année par client et par produit
        $ventes = VenteLigne::join('bon_livraisons', 'vente_lignes.bon_livraison_id', '=', 'bon_livraisons.id')
            ->select('vente_lignes.client_id', 'vente_lignes.produit_id', DB::raw('SUM(vente_lignes.quantite) as tonnage'))
            ->whereYear('bon_livraisons.date', $annee)
            ->where('vente_lignes.type', 'vente')
            ->groupBy('vente_lignes.client_id', 'vente_lignes.produit_id')
            ->get();
            
        // Remises déjà validées pour cette année
        $remisesValidees = Remise::where('annee', $annee)->get()->keyBy('client_id');

        $calculsData = $clients->map(function ($client) use ($baremes, $ventes, $remisesValidees, $annee) {
            $clientVentes = $ventes->where('client_id', $client->id);
            $clientBaremes = $baremes->where('client_id', $client->id)->keyBy('produit_id');
            
            $totalRemise = 0;
            $details = [];
            
            foreach ($clientVentes as $vente) {
                $produit_id = $vente->produit_id;
                $tonnage = $vente->tonnage;
                $taux = isset($clientBaremes[$produit_id]) ? $clientBaremes[$produit_id]->taux_dh_par_tonne : 0;
                $montant = $tonnage * $taux;
                
                $totalRemise += $montant;
                $details[] = [
                    'produit_id' => $produit_id,
                    'tonnage' => $tonnage,
                    'taux' => $taux,
                    'montant' => $montant
                ];
            }
            
            $estValidee = isset($remisesValidees[$client->id]);
            
            return [
                'client_id' => $client->id,
                'client_nom' => $client->nom_affichage,
                'total_remise' => $totalRemise,
                'est_validee' => $estValidee,
                'remise_validee_id' => $estValidee ? $remisesValidees[$client->id]->id : null,
                'details' => $details
            ];
        })->filter(function ($calc) {
            // Ne renvoyer que les clients ayant droit à une remise ou l'ayant déjà validée
            return $calc['total_remise'] > 0 || $calc['est_validee'];
        })->values();

        return Inertia::render('Remises/Calculs', [
            'annee' => $annee,
            'calculsData' => $calculsData,
        ]);
    }

    // Valider (enregistrer) une remise calculée
    public function valider(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'annee' => 'required|integer',
            'montant' => 'required|numeric|min:0.01',
        ]);

        // Vérifier si elle n'est pas déjà validée
        $exists = Remise::where('client_id', $request->client_id)
            ->where('annee', $request->annee)
            ->exists();
            
        if ($exists) {
            return redirect()->back()->with('error', 'La remise pour ce client et cette année est déjà validée.');
        }

        Remise::create([
            'client_id' => $request->client_id,
            'annee' => $request->annee,
            'montant' => $request->montant,
            'notes' => 'Remise annuelle calculée pour ' . $request->annee,
        ]);

        return redirect()->back()->with('success', 'Remise validée avec succès. Le solde du client a été mis à jour.');
    }
}
