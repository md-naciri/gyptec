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

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Créances Clients (Somme des soldes > 0)
        // Les soldes sont dynamiques (calculés via l'accessor ou withSolde)
        $clientsWithSolde = Client::withSolde()->get();
        $totalCreances = $clientsWithSolde->where('solde', '>', 0)->sum('solde');

        // 2. Chiffre d'Affaires Mensuel (Mois en cours)
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $caMensuel = BonLivraison::whereBetween('date', [$startOfMonth, $endOfMonth])
                                 ->join('vente_lignes', 'bon_livraisons.id', '=', 'vente_lignes.bon_livraison_id')
                                 ->sum('vente_lignes.montant');

        // 3. Encaissements Mensuels (Mois en cours, statut encaisse)
        $encaissementsMensuels = Encaissement::whereBetween('date', [$startOfMonth, $endOfMonth])
                                            ->where('statut', 'encaisse')
                                            ->sum('montant');

        // 4. Chèques / Effets en Attente (7 prochains jours)
        $today = Carbon::today();
        $nextWeek = Carbon::today()->addDays(7);

        $echeancesProchesQuery = Encaissement::with('client')
            ->whereIn('mode_paiement', ['cheque', 'effet'])
            ->whereBetween('date_echeance', [$today, $nextWeek])
            ->whereNotIn('statut', ['impaye', 'annule', 'remplace']);
        
        $chequesEnAttente = (clone $echeancesProchesQuery)
            ->select(DB::raw('COUNT(*) as count'), DB::raw('SUM(montant) as total'))
            ->first();
            
        $listeEcheances = $echeancesProchesQuery
            ->orderBy('date_echeance', 'asc')
            ->get()
            ->map(function ($e) {
                return [
                    'id' => $e->id,
                    'client' => $e->client ? $e->client->nom_affichage : 'Inconnu',
                    'client_id' => $e->client_id,
                    'montant' => $e->montant,
                    'date_echeance' => Carbon::parse($e->date_echeance)->format('Y-m-d'),
                    'mode_paiement' => $e->mode_paiement,
                    'reference' => $e->reference,
                    'statut' => $e->statut,
                ];
            });

        // 5. Évolution Annuelle (CA vs Encaissements sur les 6 derniers mois)
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();
        
        $ventesParMois = BonLivraison::where('date', '>=', $sixMonthsAgo)
            ->join('vente_lignes', 'bon_livraisons.id', '=', 'vente_lignes.bon_livraison_id')
            ->selectRaw('DATE_FORMAT(date, "%Y-%m") as mois, SUM(vente_lignes.montant) as total_ventes')
            ->groupBy('mois')
            ->pluck('total_ventes', 'mois');

        $encaissementsParMois = Encaissement::where('date', '>=', $sixMonthsAgo)
            ->where('statut', 'encaisse')
            ->selectRaw('DATE_FORMAT(date, "%Y-%m") as mois, SUM(montant) as total_encaisse')
            ->groupBy('mois')
            ->pluck('total_encaisse', 'mois');

        $evolutionAnnuelle = [];
        for ($i = 0; $i < 6; $i++) {
            $month = Carbon::now()->subMonths(5 - $i)->format('Y-m');
            $evolutionAnnuelle[] = [
                'name' => Carbon::now()->subMonths(5 - $i)->locale('fr')->translatedFormat('M Y'),
                'Ventes' => isset($ventesParMois[$month]) ? (float) $ventesParMois[$month] : 0,
                'Encaissements' => isset($encaissementsParMois[$month]) ? (float) $encaissementsParMois[$month] : 0,
            ];
        }

        // 6. Répartition par Produit (Tonnage vendu sur le mois en cours)
        $produitsTonnage = VenteLigne::join('bon_livraisons', 'vente_lignes.bon_livraison_id', '=', 'bon_livraisons.id')
            ->join('produits', 'vente_lignes.produit_id', '=', 'produits.id')
            ->whereBetween('bon_livraisons.date', [$startOfMonth, $endOfMonth])
            ->select('produits.nom', DB::raw('SUM(vente_lignes.quantite) as tonnage_total'))
            ->groupBy('produits.nom')
            ->orderBy('tonnage_total', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->nom,
                    'Tonnage' => (float) $item->tonnage_total
                ];
            });

        // 7. Top 5 Clients les plus endettés
        $topClientsEndettes = $clientsWithSolde->where('solde', '>', 0)
                                               ->sortByDesc('solde')
                                               ->take(5)
                                               ->values();

        return Inertia::render('Dashboard', [
            'kpis' => [
                'total_creances' => $totalCreances,
                'ca_mensuel' => $caMensuel,
                'encaissements_mensuels' => $encaissementsMensuels,
                'cheques_en_attente_count' => $chequesEnAttente->count ?? 0,
                'cheques_en_attente_total' => $chequesEnAttente->total ?? 0,
            ],
            'evolutionAnnuelle' => $evolutionAnnuelle,
            'repartitionProduits' => $produitsTonnage,
            'topClientsEndettes' => $topClientsEndettes,
            'listeEcheances' => $listeEcheances,
        ]);
    }
}
