<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'nom',
        'code_client',
        'complement_ident',
        'telephone',
        'adresse',
        'agent_referent_id',
        'notes',
        'actif',
        'solde_initial',
    ];

    protected $casts = [
        'actif' => 'boolean',
        'solde_initial' => 'decimal:2',
    ];

    protected $appends = ['solde', 'nom_affichage'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($client) {
            if (empty($client->code_client)) {
                $lastClient = self::orderBy('id', 'desc')->first();
                $nextId = $lastClient ? $lastClient->id + 1 : 1;
                $client->code_client = 'C-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function getNomAffichageAttribute()
    {
        $name = $this->nom;
        if ($this->complement_ident) {
            $name .= ' (' . $this->complement_ident . ')';
        }
        $name .= ' [' . $this->code_client . ']';
        return $name;
    }

    public function agentReferent()
    {
        return $this->belongsTo(User::class, 'agent_referent_id');
    }

    public function prix()
    {
        return $this->hasMany(PrixClient::class);
    }

    public function encaissements()
    {
        return $this->hasMany(Encaissement::class);
    }

    public function venteLignes()
    {
        return $this->hasMany(VenteLigne::class);
    }

    public function remises()
    {
        return $this->hasMany(Remise::class);
    }

    public function scopeWithSolde($query)
    {
        $query->select('clients.*')
              ->selectRaw('(clients.solde_initial + 
                  COALESCE((SELECT SUM(quantite * prix_unitaire) FROM vente_lignes WHERE vente_lignes.client_id = clients.id AND type = "vente"), 0) - 
                  COALESCE((SELECT SUM(montant) FROM encaissements WHERE encaissements.client_id = clients.id AND statut NOT IN ("impaye", "annule", "remplace")), 0) -
                  COALESCE((SELECT SUM(montant) FROM remises WHERE remises.client_id = clients.id), 0)
              ) as solde_calcule');
    }

    public function getSoldeAttribute()
    {
        // Si le solde a été calculé via le scope, on le retourne directement
        if (array_key_exists('solde_calcule', $this->attributes)) {
            return (float) $this->attributes['solde_calcule'];
        }

        // Sinon, calcul dynamique sécurisé (mais N+1 si appelé en boucle sans scope)
        $ventes = VenteLigne::where('client_id', $this->id)
            ->where('type', 'vente')
            ->sum('montant');

        $encaissements = Encaissement::where('client_id', $this->id)
            ->whereNotIn('statut', ['impaye', 'annule', 'remplace'])
            ->sum('montant');
            
        $remises = Remise::where('client_id', $this->id)->sum('montant');

        return (float) $this->solde_initial + $ventes - $encaissements - $remises;
    }
}
