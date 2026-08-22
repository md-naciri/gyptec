<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::withSolde()->orderBy('nom')->get();
        return Inertia::render('Clients/Index', [
            'clients' => $clients,
        ]);
    }

    public function create()
    {
        $users = User::all();
        $existingNames = Client::pluck('nom')->toArray();
        return inertia('Clients/Create', compact('users', 'existingNames'));
    }

    public function store(Request $request)
    {
        $exists = Client::whereRaw('LOWER(nom) = ?', [strtolower(trim($request->nom))])->exists();
        
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'complement_ident' => $exists ? 'required|string|max:255' : 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'notes' => 'nullable|string',
            'actif' => 'boolean',
            'solde_initial' => 'nullable|numeric',
        ]);

        if (empty($validated['solde_initial'])) {
            $validated['solde_initial'] = 0;
        }

        Client::create($validated);
        return redirect()->route('clients.index')->with('success', 'Client créé avec succès.');
    }

    public function show(Client $client)
    {
        $client->append('solde');

        // Historique Ventes (BL)
        $bls = \App\Models\BonLivraison::with('lignes.produit')
            ->whereHas('lignes', function($q) use ($client) {
                $q->where('client_id', $client->id);
            })
            ->orderByDesc('date')
            ->get()
            ->map(function($bl) use ($client) {
                $clientLignes = $bl->lignes->where('client_id', $client->id);
                // On garde seulement la somme des lignes de 'vente' pour le total de l'historique
                $total = $clientLignes->where('type', 'vente')->sum(function($l) { return $l->quantite * $l->prix_unitaire; });
                
                // Mais on liste TOUTES les lignes (y compris échantillons, type == 'echantillon')
                $lignesProduits = $clientLignes->map(function($l) {
                    $unite = $l->produit && $l->produit->unite ? $l->produit->unite : '';
                    return [
                        'produit_nom' => $l->produit ? $l->produit->nom : 'Produit inconnu',
                        'unite' => $unite,
                        'quantite' => $l->quantite,
                        'prix_unitaire' => $l->prix_unitaire,
                        'montant' => $l->quantite * $l->prix_unitaire,
                        'type' => $l->type
                    ];
                })->values();

                return [
                    'id' => $bl->id,
                    'type_doc' => 'vente',
                    'date' => $bl->date,
                    'numero' => $bl->numero_bl,
                    'montant' => $total,
                    'details' => $clientLignes->count() . ' produit(s)',
                    'lignes_produit' => $lignesProduits
                ];
            });

        $encaissements = $client->encaissements()->with('user')->orderBy('date', 'desc')->get()->map(function($e) {
            $modeMap = [
                'especes' => 'Espèces',
                'cheque' => 'Chèque',
                'virement' => 'Virement',
                'effet' => 'Effet'
            ];
            $modeLabel = $modeMap[$e->mode_paiement] ?? ucfirst($e->mode_paiement);

            return [
                'type_doc' => 'encaissement',
                'id' => $e->id,
                'date' => $e->date,
                'montant' => $e->montant,
                'statut' => $e->statut,
                'mode_paiement' => $modeLabel,
                'numero' => $e->reference,
                'user' => $e->user->name ?? 'N/A'
            ];
        });

        $remises = $client->remises()->orderBy('created_at', 'desc')->get()->map(function($r) {
            return [
                'type_doc' => 'remise',
                'id' => $r->id,
                'date' => $r->created_at->format('Y-m-d'),
                'montant' => $r->montant,
                'numero' => $r->annee,
                'notes' => $r->notes,
            ];
        });

        $timeline = $bls->concat($encaissements)->concat($remises)->sortByDesc('date')->values();

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'timeline' => $timeline
        ]);
    }

    public function edit(Client $client)
    {
        $users = User::all();
        $existingNames = Client::where('id', '!=', $client->id)->pluck('nom')->toArray();
        return inertia('Clients/Edit', compact('client', 'users', 'existingNames'));
    }

    public function update(Request $request, Client $client)
    {
        $exists = Client::whereRaw('LOWER(nom) = ?', [strtolower(trim($request->nom))])->where('id', '!=', $client->id)->exists();

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'complement_ident' => $exists ? 'required|string|max:255' : 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'notes' => 'nullable|string',
            'actif' => 'boolean',
            'solde_initial' => 'nullable|numeric',
        ]);

        if (empty($validated['solde_initial'])) {
            $validated['solde_initial'] = 0;
        }

        $client->update($validated);
        return redirect()->route('clients.index')->with('success', 'Client mis à jour avec succès.');
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->route('clients.index')->with('success', 'Client supprimé.');
    }

    public function exportExcel(Client $client)
    {
        $client->append('solde');

        $bls = \App\Models\BonLivraison::with('lignes.produit')
            ->whereHas('lignes', function($q) use ($client) {
                $q->where('client_id', $client->id);
            })
            ->orderByDesc('date')
            ->get()
            ->map(function($bl) use ($client) {
                $clientLignes = $bl->lignes->where('client_id', $client->id);
                $total = $clientLignes->where('type', 'vente')->sum(function($l) { return $l->quantite * $l->prix_unitaire; });
                
                $lignesProduits = $clientLignes->map(function($l) {
                    $unite = $l->produit && $l->produit->unite ? $l->produit->unite : '';
                    return [
                        'produit_nom' => $l->produit ? $l->produit->nom : 'Produit inconnu',
                        'unite' => $unite,
                        'quantite' => $l->quantite,
                        'prix_unitaire' => $l->prix_unitaire,
                        'montant' => $l->quantite * $l->prix_unitaire,
                        'type' => $l->type
                    ];
                })->values();

                return [
                    'id' => $bl->id,
                    'type_doc' => 'vente',
                    'date' => $bl->date,
                    'numero' => $bl->numero_bl,
                    'montant' => $total,
                    'details' => $clientLignes->count() . ' produit(s)',
                    'lignes_produit' => $lignesProduits
                ];
            });

        $encaissements = $client->encaissements()->with('user')->orderBy('date', 'desc')->get()->map(function($e) {
                $modeMap = [
                    'especes' => 'Espèces',
                    'cheque' => 'Chèque',
                    'virement' => 'Virement',
                    'effet' => 'Effet'
                ];
                $modeLabel = $modeMap[$e->mode_paiement] ?? ucfirst($e->mode_paiement);

                return [
                    'type_doc' => 'encaissement',
                    'id' => $e->id,
                    'date' => $e->date,
                    'montant' => $e->montant,
                    'statut' => $e->statut,
                    'mode_paiement' => $modeLabel,
                    'numero' => $e->reference,
                    'user' => $e->user->name ?? 'N/A'
                ];
        });

        $remises = $client->remises()->orderBy('created_at', 'desc')->get()->map(function($r) {
            return [
                'type_doc' => 'remise',
                'id' => $r->id,
                'date' => $r->created_at->format('Y-m-d'),
                'montant' => $r->montant,
                'numero' => $r->annee,
                'notes' => $r->notes,
            ];
        });

        $timeline = $bls->concat($encaissements)->concat($remises)->sortByDesc('date')->values();

        $totalAchats = $bls->sum('montant');
        $totalPaye = $encaissements->whereNotIn('statut', ['impaye', 'annule', 'remplace'])->sum('montant') + $remises->sum('montant');
        $resteAPayer = $client->solde_initial + $totalAchats - $totalPaye;

        $fileName = 'Releve_Compte_' . \Illuminate\Support\Str::slug($client->nom) . '_' . date('Y_m_d') . '.xlsx';
        
        return response()->streamDownload(function () use ($client, $timeline, $totalAchats, $totalPaye, $resteAPayer) {
            $options = new \OpenSpout\Writer\XLSX\Options();
            $options->setColumnWidth(15, 1);
            $options->setColumnWidth(25, 2);
            $options->setColumnWidth(45, 3);
            $options->setColumnWidth(25, 4);
            $options->setColumnWidth(20, 5);
            $options->setColumnWidth(20, 6);

            $writer = new \OpenSpout\Writer\XLSX\Writer($options);
            $writer->openToFile('php://output');

            $border = new \OpenSpout\Common\Entity\Style\Border(
                new \OpenSpout\Common\Entity\Style\BorderPart(\OpenSpout\Common\Entity\Style\Border::BOTTOM, \OpenSpout\Common\Entity\Style\Color::BLACK, \OpenSpout\Common\Entity\Style\Border::WIDTH_THIN, \OpenSpout\Common\Entity\Style\Border::STYLE_SOLID),
                new \OpenSpout\Common\Entity\Style\BorderPart(\OpenSpout\Common\Entity\Style\Border::LEFT, \OpenSpout\Common\Entity\Style\Color::BLACK, \OpenSpout\Common\Entity\Style\Border::WIDTH_THIN, \OpenSpout\Common\Entity\Style\Border::STYLE_SOLID),
                new \OpenSpout\Common\Entity\Style\BorderPart(\OpenSpout\Common\Entity\Style\Border::RIGHT, \OpenSpout\Common\Entity\Style\Color::BLACK, \OpenSpout\Common\Entity\Style\Border::WIDTH_THIN, \OpenSpout\Common\Entity\Style\Border::STYLE_SOLID),
                new \OpenSpout\Common\Entity\Style\BorderPart(\OpenSpout\Common\Entity\Style\Border::TOP, \OpenSpout\Common\Entity\Style\Color::BLACK, \OpenSpout\Common\Entity\Style\Border::WIDTH_THIN, \OpenSpout\Common\Entity\Style\Border::STYLE_SOLID)
            );

            $headerStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setFontBold()
                ->setFontColor(\OpenSpout\Common\Entity\Style\Color::WHITE)
                ->setBackgroundColor('3661A0')
                ->setBorder($border);

            $recapStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setFontBold()
                ->setBackgroundColor('E2E8F0')
                ->setBorder($border);

            $recapDetailStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setFontBold()
                ->setBorder($border)
                ->setFormat('#,##0.00\ "DH"');

            $blStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setBackgroundColor('F1F5F9')
                ->setBorder($border)
                ->setFormat('#,##0.00\ "DH"');
                
            $productRowStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setFontItalic()
                ->setFontColor('475569')
                ->setBorder($border)
                ->setFormat('#,##0.00\ "DH"');
                
            $normalStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setBorder($border)
                ->setFormat('#,##0.00\ "DH"');

            $emptyStyle = (new \OpenSpout\Common\Entity\Style\Style());

            $clientHeaderStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setFontBold()
                ->setFontSize(14)
                ->setFontColor(\OpenSpout\Common\Entity\Style\Color::BLACK);

            // Ajouter le nom du client tout en haut
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues([
                "CLIENT : {$client->code_client} - {$client->nom}"
            ], $clientHeaderStyle));

            // Ajouter une section "Solde Initial" séparée du tableau
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['']));
            
            $soldeInitialStyle = (new \OpenSpout\Common\Entity\Style\Style())
                ->setFontBold()
                ->setFontColor(\OpenSpout\Common\Entity\Style\Color::BLACK)
                ->setBackgroundColor('F3F4F6')
                ->setBorder($border);

            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues([
                'SOLDE INITIAL', '', '', '', '', number_format($client->solde_initial, 2, '.', '') . ' DH'
            ], $soldeInitialStyle));

            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['']));
            
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues([
                'Date', 'Document', 'Réf / Détails', 'Statut / Mode', 'Débit (Achat)', 'Crédit (Paiement)'
            ], $headerStyle));

            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['RÉCAPITULATIF DU COMPTE', '', '', '', '', ''], $recapStyle));
            
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['Total Achats', '', '', '', $totalAchats, 0], $recapDetailStyle));
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['Total Payé (Inclus Remises)', '', '', '', 0, $totalPaye], $recapDetailStyle));
            
            $debitReste = $resteAPayer > 0 ? $resteAPayer : 0;
            $creditReste = $resteAPayer < 0 ? abs($resteAPayer) : 0;
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['RESTE À PAYER (Solde Actuel)', '', '', '', $debitReste, $creditReste], $recapDetailStyle));
            
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['', '', '', '', '', ''], $emptyStyle));

            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues(['HISTORIQUE DÉTAILLÉ', '', '', '', '', ''], $recapStyle));

            foreach ($timeline as $item) {
                $formattedDate = \Carbon\Carbon::parse($item['date'])->format('d/m/Y');
                
                if ($item['type_doc'] === 'vente') {
                    $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues([
                        $formattedDate,
                        'Bon de Livraison',
                        $item['numero'] . ' (' . $item['details'] . ')',
                        '',
                        $item['montant'],
                        ''
                    ], $blStyle));
    
                    foreach ($item['lignes_produit'] as $ligne) {
                        $details = $ligne['quantite'] . ' ' . $ligne['unite'] . ' × ' . $ligne['produit_nom'] . ' × ' . number_format($ligne['prix_unitaire'], 2, ',', ' ') . ' DH' . ($ligne['type'] === 'echantillon' ? ' (Échantillon)' : '');
                        
                        $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues([
                            '',
                            '  ↳ Produit',
                            $details,
                            '',
                            $ligne['montant'],
                            ''
                        ], $productRowStyle));
                    }
                } elseif ($item['type_doc'] === 'encaissement') {
                    $details = $item['mode_paiement'] . ($item['numero'] ? ' - ' . $item['numero'] : '');
                    $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues([
                        $formattedDate,
                        'Paiement',
                        $details,
                        $item['statut'],
                        '',
                        $item['montant']
                    ], $normalStyle));
                } elseif ($item['type_doc'] === 'remise') {
                    $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues([
                        $formattedDate,
                        'Remise Annuelle',
                        'Année ' . $item['numero'] . ($item['notes'] ? ' - ' . $item['notes'] : ''),
                        'Validé',
                        '',
                        $item['montant']
                    ], $normalStyle));
                }
            }

            $writer->close();
        }, $fileName);
    }
}
