<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
});

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\PrixClientController;

use App\Http\Controllers\BonLivraisonController;
use App\Http\Controllers\EncaissementController;

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Phase 1 Routes
    Route::resource('clients', ClientController::class);
    Route::resource('produits', ProduitController::class);
    Route::get('prix-clients', [PrixClientController::class, 'index'])->name('prix-clients.index');
    Route::post('prix-clients', [PrixClientController::class, 'store'])->name('prix-clients.store');

    // Mouvements et Historique
    Route::resource('bon-livraisons', BonLivraisonController::class);
    Route::resource('encaissements', EncaissementController::class);
    Route::get('/rapports', [App\Http\Controllers\RapportController::class, 'index'])->name('rapports.index');
    Route::patch('encaissements/{encaissement}/statut', [App\Http\Controllers\EncaissementController::class, 'updateStatut'])->name('encaissements.updateStatut');

    // Remises Annuelles
    Route::get('/remises/baremes', [App\Http\Controllers\RemiseController::class, 'baremes'])->name('remises.baremes');
    Route::post('/remises/baremes', [App\Http\Controllers\RemiseController::class, 'saveBaremes'])->name('remises.saveBaremes');
    Route::get('/remises/calculs', [App\Http\Controllers\RemiseController::class, 'calculs'])->name('remises.calculs');
    Route::post('/remises/valider', [App\Http\Controllers\RemiseController::class, 'valider'])->name('remises.valider');
});

require __DIR__.'/auth.php';
