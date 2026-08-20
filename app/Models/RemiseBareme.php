<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RemiseBareme extends Model
{
    protected $fillable = [
        'client_id',
        'produit_id',
        'annee',
        'taux_dh_par_tonne',
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
