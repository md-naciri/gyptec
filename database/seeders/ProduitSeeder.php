<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Produit;

class ProduitSeeder extends Seeder
{
    public function run(): void
    {
        $produits = [
            ['nom' => 'ENDUIT FINO EXTRA', 'unite' => 'tonne', 'prix_defaut' => 2400],
            ['nom' => 'GYPSE STAFF', 'unite' => 'tonne', 'prix_defaut' => 600],
            ['nom' => 'MORTIER PROJETE ULTRA', 'unite' => 'tonne', 'prix_defaut' => 1060],
            ['nom' => 'MOULAGE', 'unite' => 'tonne', 'prix_defaut' => 600],
            ['nom' => 'PROJETE STANDARD', 'unite' => 'tonne', 'prix_defaut' => 950],
            ['nom' => 'TALOUCHE', 'unite' => 'tonne', 'prix_defaut' => 740],
        ];

        foreach ($produits as $p) {
            Produit::firstOrCreate(['nom' => $p['nom']], $p);
        }
    }
}
