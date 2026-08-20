<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BonLivraison extends Model
{
    protected $fillable = [
        'date',
        'numero_bl',
        'matricule_camion',
        'destination',
        'zone',
        'user_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lignes()
    {
        return $this->hasMany(VenteLigne::class);
    }
}
