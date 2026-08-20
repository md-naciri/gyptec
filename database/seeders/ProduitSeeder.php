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
            ['nom' => 'STAFF', 'unite' => 'tonne', 'prix_defaut' => 1500],
            ['nom' => 'PROJETE STANDARD', 'unite' => 'tonne', 'prix_defaut' => 1200],
            ['nom' => 'MORTIER PROJETE ULTRA', 'unite' => 'tonne', 'prix_defaut' => 1800],
            ['nom' => 'MOULAGE', 'unite' => 'tonne', 'prix_defaut' => 1600],
            ['nom' => 'ENDUIT FINO EXTRA', 'unite' => 'sac', 'prix_defaut' => 45],
            ['nom' => 'TALOUCHE', 'unite' => 'sac', 'prix_defaut' => 50],
            ['nom' => 'GYPSE STAFF 40kg', 'unite' => 'sac', 'prix_defaut' => 60],
            ['nom' => 'GYPSE MOULAGE 40kg', 'unite' => 'sac', 'prix_defaut' => 65],
        ];

        foreach ($produits as $p) {
            Produit::create($p);
        }
    }
}
