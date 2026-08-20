<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $fillable = [
        'nom',
        'unite',
        'prix_defaut',
        'actif',
    ];

    protected $casts = [
        'prix_defaut' => 'decimal:2',
        'actif' => 'boolean',
    ];

    public function prix()
    {
        return $this->hasMany(PrixClient::class);
    }
}
