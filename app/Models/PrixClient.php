<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrixClient extends Model
{
    protected $fillable = [
        'client_id',
        'produit_id',
        'prix_unitaire',
    ];

    protected $casts = [
        'prix_unitaire' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}
