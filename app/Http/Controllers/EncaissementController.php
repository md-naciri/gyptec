<?php

namespace App\Http\Controllers;

use App\Models\Encaissement;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EncaissementController extends Controller
{
    public function index(Request $request)
    {
        $query = Encaissement::with(['client', 'user'])->orderByDesc('date')->orderByDesc('id');
        
        if ($request->has('client_id') && $request->client_id) {
            $query->where('client_id', $request->client_id);
        }
        if ($request->has('statut') && $request->statut) {
            $query->where('statut', $request->statut);
        }
        if ($request->has('date_debut') && $request->date_debut) {
            $query->whereDate('date', '>=', $request->date_debut);
        }
        if ($request->has('date_fin') && $request->date_fin) {
            $query->whereDate('date', '<=', $request->date_fin);
        }

        $encaissements = $query->paginate(20);

        $echeancesCetteSemaine = Encaissement::where('statut', 'en_attente')
            ->whereDate('date_echeance', '>=', now()->startOfDay())
            ->whereDate('date_echeance', '<=', now()->addDays(7)->endOfDay())
            ->count();

        return Inertia::render('Encaissements/Index', [
            'encaissements' => $encaissements,
            'clients' => Client::where('actif', true)->orderBy('nom')->get(),
            'filters' => $request->only(['client_id', 'statut', 'date_debut', 'date_fin']),
            'echeancesCetteSemaine' => $echeancesCetteSemaine,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Encaissements/Create', [
            'clients' => Client::where('actif', true)->orderBy('nom')->get(),
            'preselectedClientId' => $request->get('client_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'date' => 'required|date',
            'date_echeance' => 'nullable|date',
            'montant' => 'required|numeric|min:0.01',
            'mode_paiement' => 'required|in:espece,cheque,virement,effet,versement',
            'reference' => 'required_if:mode_paiement,cheque,effet|nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Default statut based on mode
        $statut = 'encaisse';
        if (in_array($validated['mode_paiement'], ['cheque', 'effet'])) {
            $statut = 'en_attente';
        }

        Encaissement::create([
            ...$validated,
            'statut' => $statut,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('encaissements.index')->with('success', 'Encaissement enregistré avec succès.');
    }

    public function updateStatut(Request $request, Encaissement $encaissement)
    {
        $validated = $request->validate([
            'statut' => 'required|in:encaisse,en_attente,impaye,remplace,annule',
            'notes' => 'nullable|string',
        ]);

        $updateData = ['statut' => $validated['statut']];
        if ($request->has('notes') && $validated['notes']) {
            $updateData['notes'] = $encaissement->notes 
                ? $encaissement->notes . "\n[" . now()->format('Y-m-d') . "] " . $validated['notes']
                : "[" . now()->format('Y-m-d') . "] " . $validated['notes'];
        }

        $encaissement->update($updateData);

        return redirect()->back()->with('success', 'Statut mis à jour.');
    }

    public function destroy(Encaissement $encaissement)
    {
        $encaissement->delete();
        return redirect()->route('encaissements.index')->with('success', 'Encaissement supprimé.');
    }
}
