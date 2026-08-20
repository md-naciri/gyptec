<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProduitController extends Controller
{
    public function index()
    {
        return Inertia::render('Produits/Index', [
            'produits' => Produit::orderBy('nom')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Produits/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'unite' => 'required|string|max:255',
            'prix_defaut' => 'required|numeric|min:0',
            'actif' => 'boolean',
        ]);

        Produit::create($validated);
        return redirect()->route('produits.index')->with('success', 'Produit créé avec succès.');
    }

    public function edit(Produit $produit)
    {
        return Inertia::render('Produits/Edit', [
            'produit' => $produit,
        ]);
    }

    public function update(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'unite' => 'required|string|max:255',
            'prix_defaut' => 'required|numeric|min:0',
            'actif' => 'boolean',
        ]);

        $produit->update($validated);
        return redirect()->route('produits.index')->with('success', 'Produit mis à jour.');
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();
        return redirect()->route('produits.index')->with('success', 'Produit supprimé.');
    }
}
