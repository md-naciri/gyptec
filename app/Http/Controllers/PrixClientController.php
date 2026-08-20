<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Produit;
use App\Models\PrixClient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrixClientController extends Controller
{
    public function index()
    {
        // Need to load all clients, all products, and specific prices
        $clients = Client::where('actif', true)->orderBy('nom')->get();
        $produits = Produit::where('actif', true)->orderBy('nom')->get();
        $prixClients = PrixClient::all();

        return Inertia::render('PrixClients/Index', [
            'clients' => $clients,
            'produits' => $produits,
            'prixClients' => $prixClients,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'produit_id' => 'required|exists:produits,id',
            'prix_unitaire' => 'nullable|numeric|min:0',
        ]);

        if (is_null($validated['prix_unitaire'])) {
            // Delete if exists and value is null (revert to default price)
            PrixClient::where('client_id', $validated['client_id'])
                      ->where('produit_id', $validated['produit_id'])
                      ->delete();
        } else {
            // Update or Create
            PrixClient::updateOrCreate(
                ['client_id' => $validated['client_id'], 'produit_id' => $validated['produit_id']],
                ['prix_unitaire' => $validated['prix_unitaire']]
            );
        }

        return redirect()->back();
    }
}
