<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remise extends Model
{
    protected $fillable = [
        'client_id',
        'annee',
        'montant',
        'reference',
        'notes',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
