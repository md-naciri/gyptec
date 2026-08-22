<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Ajouter 'rendu' aux valeurs possibles de l'ENUM
        DB::statement("ALTER TABLE encaissements MODIFY COLUMN statut ENUM('encaisse', 'en_attente', 'impaye', 'remplace', 'annule', 'rendu') DEFAULT 'encaisse'");
        
        // 2. Mettre à jour les données existantes
        DB::table('encaissements')
            ->whereIn('statut', ['annule', 'remplace'])
            ->update(['statut' => 'rendu']);
            
        // 3. Retirer 'annule' et 'remplace' de l'ENUM
        DB::statement("ALTER TABLE encaissements MODIFY COLUMN statut ENUM('encaisse', 'en_attente', 'impaye', 'rendu') DEFAULT 'encaisse'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE encaissements MODIFY COLUMN statut ENUM('encaisse', 'en_attente', 'impaye', 'rendu', 'annule', 'remplace') DEFAULT 'encaisse'");
        
        DB::table('encaissements')
            ->where('statut', 'rendu')
            ->update(['statut' => 'annule']);
            
        DB::statement("ALTER TABLE encaissements MODIFY COLUMN statut ENUM('encaisse', 'en_attente', 'impaye', 'remplace', 'annule') DEFAULT 'encaisse'");
    }
};
