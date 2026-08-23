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

    public function exportExcel(Request $request)
    {
        $dateDebut = $request->input('date_debut');
        $dateFin = $request->input('date_fin');
        $clientId = $request->input('client_id');
        $soldeFilter = $request->input('solde_filter', 'all');

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

        if ($soldeFilter === 'debiteur') {
            $clientsData = $clientsData->filter(fn($c) => $c['solde_actuel'] > 0);
        } elseif ($soldeFilter === 'crediteur') {
            $clientsData = $clientsData->filter(fn($c) => $c['solde_actuel'] < 0);
        }

        $totalCA = $clientsData->sum('ca_total');
        $totalEncaisse = $clientsData->sum('encaisse_total');
        $totalSolde = $clientsData->sum('solde_actuel');

        $fileName = 'Rapport_Global_' . date('Y_m_d') . '.xlsx';
        
        return response()->streamDownload(function () use ($clientsData, $totalCA, $totalEncaisse, $totalSolde) {
            $options = new \OpenSpout\Writer\XLSX\Options();
            $options->setColumnWidth(25, 1);
            $options->setColumnWidth(20, 2);
            $options->setColumnWidth(20, 3);
            $options->setColumnWidth(20, 4);
            $options->setColumnWidth(20, 5);

            $writer = new \OpenSpout\Writer\XLSX\Writer($options);
            $writer->openToFile('php://output');

            $border = new \OpenSpout\Common\Entity\Style\Border(
                new \OpenSpout\Common\Entity\Style\BorderPart(\OpenSpout\Common\Entity\Style\Border::BOTTOM, \OpenSpout\Common\Entity\Style\Color::BLACK, \OpenSpout\Common\Entity\Style\Border::WIDTH_THIN, \OpenSpout\Common\Entity\Style\Border::STYLE_SOLID),
                new \OpenSpout\Common\Entity\Style\BorderPart(\OpenSpout\Common\Entity\Style\Border::LEFT, \OpenSpout\Common\Entity\Style\Color::BLACK, \OpenSpout\Common\Entity\Style\Border::WIDTH_THIN, \OpenSpout\Common\Entity\Style\Border::STYLE_SOLID),
                new \OpenSpout\Common\Entity\Style\BorderPart(\OpenSpout\Common\Entity\Style\Border::RIGHT, \OpenSpout\Common\Entity\Style\Color::BLACK, \OpenSpout\Common\Entity\Style\Border::WIDTH_THIN, \OpenSpout\Common\Entity\Style\Border::STYLE_SOLID),
                new \OpenSpout\Common\Entity\Style\BorderPart(\OpenSpout\Common\Entity\Style\Border::TOP, \OpenSpout\Common\Entity\Style\Color::BLACK, \OpenSpout\Common\Entity\Style\Border::WIDTH_THIN, \OpenSpout\Common\Entity\Style\Border::STYLE_SOLID)
            );

            $titleStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setFontBold()
                ->setFontSize(14);

            $headerStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setFontBold()
                ->setFontColor(\OpenSpout\Common\Entity\Style\Color::WHITE)
                ->setBackgroundColor('3661A0')
                ->setBorder($border);

            $rowStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setBorder($border)
                ->setFormat('#,##0.00\ "DH"');
                
            $rowStyleText = (new \OpenSpout\Common\Entity\Style\Style())
                ->setBorder($border);

            $totalStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setFontBold()
                ->setBackgroundColor('E2E8F0')
                ->setBorder($border)
                ->setFormat('#,##0.00\ "DH"');

            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['RAPPORT GLOBAL - GYPTEC SYSTEM'], $titleStyle));
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['Date de génération: ' . date('d/m/Y H:i')]));
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['']));

            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues([
                'Client', 'CA (Période)', 'Encaissé (Période)', 'Solde Actuel', 'Statut'
            ], $headerStyle));

            foreach ($clientsData as $client) {
                $statut = $client['solde_actuel'] > 0 ? 'Débiteur' : ($client['solde_actuel'] < 0 ? 'Créditeur' : 'À jour');
                
                $row = new \OpenSpout\Common\Entity\Row([
                    \OpenSpout\Common\Entity\Cell::fromValue($client['code_client'] . ' - ' . $client['nom'], $rowStyleText),
                    \OpenSpout\Common\Entity\Cell::fromValue($client['ca_total'], $rowStyle),
                    \OpenSpout\Common\Entity\Cell::fromValue($client['encaisse_total'], $rowStyle),
                    \OpenSpout\Common\Entity\Cell::fromValue($client['solde_actuel'], $rowStyle),
                    \OpenSpout\Common\Entity\Cell::fromValue($statut, $rowStyleText),
                ]);
                $writer->addRow($row);
            }

            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['']));
            
            $totalRow = new \OpenSpout\Common\Entity\Row([
                \OpenSpout\Common\Entity\Cell::fromValue('TOTAL GLOBAL', $totalStyle),
                \OpenSpout\Common\Entity\Cell::fromValue($totalCA, $totalStyle),
                \OpenSpout\Common\Entity\Cell::fromValue($totalEncaisse, $totalStyle),
                \OpenSpout\Common\Entity\Cell::fromValue($totalSolde, $totalStyle),
                \OpenSpout\Common\Entity\Cell::fromValue('', $totalStyle),
            ]);
            $writer->addRow($totalRow);

            $writer->close();
        }, $fileName);
    }
}
