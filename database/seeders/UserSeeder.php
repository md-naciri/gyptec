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
        $superadmin = User::firstOrCreate(
            ['email' => 'superadmin@gyptec.local'],
            [
                'name' => 'Superadmin',
                'password' => Hash::make('password'),
            ]
        );
        if (!$superadmin->hasRole('superadmin')) {
            $superadmin->assignRole('superadmin');
        }

        // $admin = User::firstOrCreate(
        //     ['email' => 'admin@gyptec.local'],
        //     [
        //         'name' => 'Admin',
        //         'password' => Hash::make('password'),
        //     ]
        // );
        // if (!$admin->hasRole('admin')) {
        //     $admin->assignRole('admin');
        // }

        // $commercial = User::firstOrCreate(
        //     ['email' => 'commercial@gyptec.local'],
        //     [
        //         'name' => 'Commercial',
        //         'password' => Hash::make('password'),
        //     ]
        // );
        // if (!$commercial->hasRole('commercial')) {
        //     $commercial->assignRole('commercial');
        // }

        // $comptable = User::firstOrCreate(
        //     ['email' => 'comptable@gyptec.local'],
        //     [
        //         'name' => 'Comptable',
        //         'password' => Hash::make('password'),
        //     ]
        // );
        // if (!$comptable->hasRole('comptable')) {
        //     $comptable->assignRole('comptable');
        // }
    }
}
