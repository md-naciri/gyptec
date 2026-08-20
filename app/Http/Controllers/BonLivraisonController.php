<?php

namespace App\Http\Controllers;

use App\Models\BonLivraison;
use App\Models\VenteLigne;
use App\Models\Client;
use App\Models\Produit;
use App\Models\PrixClient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class BonLivraisonController extends Controller
{
    public function index(Request $request)
    {
        $query = BonLivraison::with(['user', 'lignes'])->orderByDesc('date')->orderByDesc('id');
        
        if ($request->has('camion') && $request->camion) {
            $query->where('matricule_camion', 'like', '%' . $request->camion . '%');
        }
        if ($request->has('numero') && $request->numero) {
            $query->where('numero_bl', 'like', '%' . $request->numero . '%');
        }
        if ($request->has('date_debut') && $request->date_debut) {
            $query->whereDate('date', '>=', $request->date_debut);
        }
        if ($request->has('date_fin') && $request->date_fin) {
            $query->whereDate('date', '<=', $request->date_fin);
        }

        $bons = $query->paginate(20);

        return Inertia::render('BonLivraisons/Index', [
            'bons' => $bons,
            'filters' => $request->only(['camion', 'numero', 'date_debut', 'date_fin']),
        ]);
    }

    public function create()
    {
        return Inertia::render('BonLivraisons/Create', [
            'clients' => Client::where('actif', true)->orderBy('nom')->get(),
            'produits' => Produit::where('actif', true)->orderBy('nom')->get(),
            'prixClients' => PrixClient::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'numero_bl' => 'nullable|string|unique:bon_livraisons,numero_bl',
            'matricule_camion' => 'nullable|string|max:255',
            'destination' => 'nullable|string|max:255',
            'zone' => 'nullable|string|max:255',
            'lignes' => 'required|array|min:1',
            'lignes.*.client_id' => 'required|exists:clients,id',
            'lignes.*.produit_id' => 'required|exists:produits,id',
            'lignes.*.quantite' => 'required|numeric|min:0.01',
            'lignes.*.type' => 'required|in:vente,echantillon',
            'lignes.*.prix_unitaire' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $bl = BonLivraison::create([
                'date' => $validated['date'],
                'numero_bl' => $validated['numero_bl'],
                'matricule_camion' => $validated['matricule_camion'],
                'destination' => $validated['destination'],
                'zone' => $validated['zone'],
                'user_id' => $request->user()->id,
            ]);

            foreach ($validated['lignes'] as $ligne) {
                $montant = 0;
                if ($ligne['type'] === 'vente') {
                    $montant = $ligne['quantite'] * $ligne['prix_unitaire'];
                }

                VenteLigne::create([
                    'bon_livraison_id' => $bl->id,
                    'client_id' => $ligne['client_id'],
                    'produit_id' => $ligne['produit_id'],
                    'quantite' => $ligne['quantite'],
                    'type' => $ligne['type'],
                    'prix_unitaire' => $ligne['prix_unitaire'],
                    'montant' => $montant,
                ]);
            }
        });

        return redirect()->route('bon-livraisons.index')->with('success', 'Bon de livraison créé.');
    }

    public function show(BonLivraison $bonLivraison)
    {
        $bonLivraison->load(['user', 'lignes.client', 'lignes.produit']);
        
        return Inertia::render('BonLivraisons/Show', [
            'bon' => $bonLivraison
        ]);
    }

    public function edit(BonLivraison $bonLivraison)
    {
        return redirect()->route('bon-livraisons.show', $bonLivraison->id); // Simplify for now
    }

    public function destroy(BonLivraison $bonLivraison)
    {
        $bonLivraison->delete();
        return redirect()->route('bon-livraisons.index')->with('success', 'Bon de livraison supprimé.');
    }
}
