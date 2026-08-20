<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@gyptec.local',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        $commercial = User::create([
            'name' => 'Commercial',
            'email' => 'commercial@gyptec.local',
            'password' => Hash::make('password'),
        ]);
        $commercial->assignRole('commercial');

        $comptable = User::create([
            'name' => 'Comptable',
            'email' => 'comptable@gyptec.local',
            'password' => Hash::make('password'),
        ]);
        $comptable->assignRole('comptable');
    }
}
