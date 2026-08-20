<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Encaissement extends Model
{
    protected $fillable = [
        'client_id',
        'user_id',
        'date',
        'date_echeance',
        'montant',
        'mode_paiement',
        'reference',
        'statut',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'date_echeance' => 'date',
        'montant' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
