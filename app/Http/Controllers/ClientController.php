<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::with('agentReferent')->withSolde()->orderBy('nom')->get();
        return Inertia::render('Clients/Index', [
            'clients' => $clients,
        ]);
    }

    public function create()
    {
        $users = User::all();
        $existingNames = Client::pluck('nom')->toArray();
        return inertia('Clients/Create', compact('users', 'existingNames'));
    }

    public function store(Request $request)
    {
        $exists = Client::whereRaw('LOWER(nom) = ?', [strtolower(trim($request->nom))])->exists();
        
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'complement_ident' => $exists ? 'required|string|max:255' : 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'agent_referent_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
            'actif' => 'boolean',
            'solde_initial' => 'nullable|numeric',
        ]);

        if (empty($validated['solde_initial'])) {
            $validated['solde_initial'] = 0;
        }

        Client::create($validated);
        return redirect()->route('clients.index')->with('success', 'Client créé avec succès.');
    }

    public function show(Client $client)
    {
        $client->load('agentReferent');
        $client->append('solde');

        // Historique Ventes (BL)
        $bls = \App\Models\BonLivraison::with('lignes.produit')
            ->whereHas('lignes', function($q) use ($client) {
                $q->where('client_id', $client->id);
            })
            ->orderByDesc('date')
            ->get()
            ->map(function($bl) use ($client) {
                $clientLignes = $bl->lignes->where('client_id', $client->id);
                $total = $clientLignes->where('type', 'vente')->sum(function($l) { return $l->quantite * $l->prix_unitaire; });
                return [
                    'id' => $bl->id,
                    'type_doc' => 'vente',
                    'date' => $bl->date,
                    'numero' => $bl->numero_bl,
                    'montant' => $total,
                    'details' => $clientLignes->count() . ' produit(s)'
                ];
            });

        $encaissements = $client->encaissements()->with('user')->orderBy('date', 'desc')->get()->map(function($e) {
            return [
                'type_doc' => 'encaissement',
                'id' => $e->id,
                'date' => $e->date,
                'montant' => $e->montant,
                'statut' => $e->statut,
                'mode_paiement' => $e->mode_paiement,
                'numero' => $e->reference,
                'user' => $e->user->name ?? 'N/A'
            ];
        });

        $remises = $client->remises()->orderBy('created_at', 'desc')->get()->map(function($r) {
            return [
                'type_doc' => 'remise',
                'id' => $r->id,
                'date' => $r->created_at->format('Y-m-d'),
                'montant' => $r->montant,
                'numero' => $r->annee,
                'notes' => $r->notes,
            ];
        });

        $timeline = $bls->concat($encaissements)->concat($remises)->sortByDesc('date')->values();

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'timeline' => $timeline
        ]);
    }

    public function edit(Client $client)
    {
        $users = User::all();
        $existingNames = Client::where('id', '!=', $client->id)->pluck('nom')->toArray();
        return inertia('Clients/Edit', compact('client', 'users', 'existingNames'));
    }

    public function update(Request $request, Client $client)
    {
        $exists = Client::whereRaw('LOWER(nom) = ?', [strtolower(trim($request->nom))])->where('id', '!=', $client->id)->exists();

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'complement_ident' => $exists ? 'required|string|max:255' : 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'agent_referent_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
            'actif' => 'boolean',
            'solde_initial' => 'nullable|numeric',
        ]);

        if (empty($validated['solde_initial'])) {
            $validated['solde_initial'] = 0;
        }

        $client->update($validated);
        return redirect()->route('clients.index')->with('success', 'Client mis à jour avec succès.');
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->route('clients.index')->with('success', 'Client supprimé.');
    }
}
