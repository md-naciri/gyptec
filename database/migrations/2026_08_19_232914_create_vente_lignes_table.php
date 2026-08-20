<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vente_lignes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bon_livraison_id')->constrained('bon_livraisons')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('produit_id')->constrained('produits')->cascadeOnDelete();
            $table->decimal('quantite', 10, 2);
            $table->enum('type', ['vente', 'echantillon'])->default('vente');
            $table->decimal('prix_unitaire', 10, 2);
            $table->decimal('montant', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vente_lignes');
    }
};
