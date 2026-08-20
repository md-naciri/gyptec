<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Client;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        Client::create([
            'nom' => 'Client A',
            'telephone' => '0600000001',
            'adresse' => 'Adresse A',
            'agent_referent_id' => 2, // Commercial
        ]);
        
        Client::create([
            'nom' => 'Client B',
            'telephone' => '0600000002',
            'adresse' => 'Adresse B',
            'agent_referent_id' => 2,
        ]);
    }
}
