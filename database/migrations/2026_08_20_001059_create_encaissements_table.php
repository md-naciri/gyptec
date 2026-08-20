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
        Schema::create('encaissements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('date');
            $table->decimal('montant', 15, 2);
            $table->enum('mode_paiement', ['espece', 'cheque', 'virement', 'effet', 'versement']);
            $table->string('reference')->nullable();
            $table->enum('statut', ['encaisse', 'en_attente', 'impaye', 'remplace', 'annule'])->default('encaisse');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encaissements');
    }
};
