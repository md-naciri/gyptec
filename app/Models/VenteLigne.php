<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VenteLigne extends Model
{
    protected $fillable = [
        'bon_livraison_id',
        'client_id',
        'produit_id',
        'quantite',
        'type',
        'prix_unitaire',
        'montant',
    ];

    protected $casts = [
        'quantite' => 'decimal:2',
        'prix_unitaire' => 'decimal:2',
        'montant' => 'decimal:2',
    ];

    public function bonLivraison()
    {
        return $this->belongsTo(BonLivraison::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}
