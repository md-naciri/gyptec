import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';
import SelectInput from '@/Components/SelectInput';
import { useState, useEffect } from 'react';
import { getTodayDateCasablanca } from '@/utils/date';

export default function Create({ clients, produits, prixClients }: { clients: any[], produits: any[], prixClients: any[] }) {
    const today = getTodayDateCasablanca();
    
    const { data, setData, post, processing, errors } = useForm({
        date: today,
        numero_bl: '',
        matricule_camion: '',
        destination: '',
        zone: '',
        lignes: [
            { id: Date.now(), client_id: '', produit_id: '', quantite: '', type: 'vente', prix_unitaire: '' }
        ]
    });

    // Handle price auto-fill when client or product changes
    const updateLignePrix = (index: number, clientId: string, produitId: string) => {
        if (!clientId || !produitId) return;
        
        const client_id = parseInt(clientId);
        const produit_id = parseInt(produitId);
        
        // 1. Check if specific price exists
        const customPrice = prixClients.find(p => p.client_id === client_id && p.produit_id === produit_id);
        
        // 2. Otherwise get product default price
        let newPrice = '';
        if (customPrice) {
            newPrice = customPrice.prix_unitaire;
        } else {
            const prod = produits.find(p => p.id === produit_id);
            if (prod) {
                newPrice = prod.prix_defaut;
            }
        }
        
        const newLignes = [...data.lignes];
        newLignes[index].prix_unitaire = newPrice;
        setData('lignes', newLignes);
    };

    const handleLigneChange = (index: number, field: string, value: string) => {
        const newLignes: any = [...data.lignes];
        newLignes[index][field] = value;
        setData('lignes', newLignes);
        
        if (field === 'client_id' || field === 'produit_id') {
            updateLignePrix(index, newLignes[index].client_id, newLignes[index].produit_id);
        }
        
        if (field === 'type' && value === 'echantillon') {
            newLignes[index].prix_unitaire = 0;
            setData('lignes', newLignes);
        } else if (field === 'type' && value === 'vente') {
            // Re-fetch price
            updateLignePrix(index, newLignes[index].client_id, newLignes[index].produit_id);
        }
    };

    const addLigne = () => {
        setData('lignes', [
            ...data.lignes,
            { id: Date.now(), client_id: '', produit_id: '', quantite: '', type: 'vente', prix_unitaire: '' }
        ]);
    };

    const removeLigne = (index: number) => {
        const newLignes = data.lignes.filter((_, i) => i !== index);
        setData('lignes', newLignes);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bon-livraisons.store'));
    };

    // Calculate total BL
    const totalBl = data.lignes.reduce((sum, ligne) => {
        if (ligne.type === 'vente' && ligne.quantite && ligne.prix_unitaire) {
            return sum + (parseFloat(ligne.quantite) * parseFloat(ligne.prix_unitaire));
        }
        return sum;
    }, 0);

    return (
        <AuthenticatedLayout>
            <Head title="Nouveau BL" />
            <PageHeader 
                title="Saisie d'un Bon de Livraison" 
                subtitle="Créer un nouveau BL pour enregistrer une vente"
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        
                        {/* HEADER SECTION */}
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Informations Générales</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <InputLabel htmlFor="date" value="Date *" />
                                    <DatePicker
                                        id="date"
                                        selected={data.date ? new Date(data.date) : null}
                                        onChange={(d) => {
                                            if (d) {
                                                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                                                setData('date', d.toISOString().split('T')[0]);
                                            } else {
                                                setData('date', '');
                                            }
                                        }}
                                        required
                                    />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="numero_bl" value="Numéro BL" />
                                    <TextInput id="numero_bl" className="mt-1 block w-full" value={data.numero_bl} onChange={e => setData('numero_bl', e.target.value)} placeholder="Ex: BL-2026-001" />
                                    <InputError message={errors.numero_bl} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="matricule_camion" value="Camion (Matricule)" />
                                    <TextInput id="matricule_camion" className="mt-1 block w-full" value={data.matricule_camion} onChange={e => setData('matricule_camion', e.target.value)} />
                                    <InputError message={errors.matricule_camion} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="destination" value="Destination" />
                                    <TextInput id="destination" className="mt-1 block w-full" value={data.destination} onChange={e => setData('destination', e.target.value)} />
                                    <InputError message={errors.destination} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="zone" value="Zone" />
                                    <TextInput id="zone" className="mt-1 block w-full" value={data.zone} onChange={e => setData('zone', e.target.value)} />
                                    <InputError message={errors.zone} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* LIGNES SECTION */}
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-100">
                            <div className="flex justify-between items-center border-b pb-2 mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Lignes de Vente</h3>
                                <button type="button" onClick={addLigne} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded text-sm font-medium transition">
                                    + Ajouter une ligne
                                </button>
                            </div>

                            {typeof errors.lignes === 'string' && (
                                <InputError message={errors.lignes} className="mb-4" />
                            )}

                            <div className="space-y-4">
                                {data.lignes.map((ligne, index) => (
                                    <div key={ligne.id} className="flex flex-col md:flex-row gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                                        
                                        <div className="flex-1 min-w-[200px]">
                                            <InputLabel value="Client *" />
                                            <ClientSelect
                                                clients={clients}
                                                value={ligne.client_id}
                                                onChange={(val: any) => handleLigneChange(index, 'client_id', val || '')}
                                                required
                                            />
                                            <InputError message={(errors as any)[`lignes.${index}.client_id`]} className="mt-1 text-xs" />
                                        </div>

                                        <div className="flex-1 min-w-[150px]">
                                            <InputLabel value="Produit *" />
                                            <SelectInput 
                                                className="w-full"
                                                value={ligne.produit_id}
                                                onChange={(e: any) => handleLigneChange(index, 'produit_id', e.target.value)}
                                                required
                                            >
                                                <option value="">-- Produit --</option>
                                                {produits.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                                            </SelectInput>
                                            <InputError message={(errors as any)[`lignes.${index}.produit_id`]} className="mt-1 text-xs" />
                                        </div>

                                        <div className="w-24">
                                            <InputLabel value="Qté *" />
                                            <input 
                                                type="number" step="0.01" min="0.01" required
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm sm:text-sm"
                                                value={ligne.quantite}
                                                onChange={e => handleLigneChange(index, 'quantite', e.target.value)}
                                            />
                                            <InputError message={(errors as any)[`lignes.${index}.quantite`]} className="mt-1 text-xs" />
                                        </div>

                                        <div className="w-32">
                                            <InputLabel value="Type" />
                                            <SelectInput 
                                                className="w-full"
                                                value={ligne.type}
                                                onChange={(e: any) => handleLigneChange(index, 'type', e.target.value)}
                                            >
                                                <option value="vente">Vente</option>
                                                <option value="echantillon">Échantillon</option>
                                            </SelectInput>
                                        </div>

                                        <div className="w-28">
                                            <InputLabel value="Prix U. (DH) *" />
                                            <input 
                                                type="number" step="0.01" min="0" required
                                                className={`mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm sm:text-sm ${ligne.type === 'echantillon' ? 'bg-gray-200' : ''}`}
                                                value={ligne.prix_unitaire}
                                                onChange={e => handleLigneChange(index, 'prix_unitaire', e.target.value)}
                                                disabled={ligne.type === 'echantillon'}
                                            />
                                            <InputError message={(errors as any)[`lignes.${index}.prix_unitaire`]} className="mt-1 text-xs" />
                                        </div>

                                        <div className="w-32 font-medium text-right pt-7 pr-2 text-indigo-700">
                                            {ligne.quantite && ligne.prix_unitaire && ligne.type === 'vente' 
                                                ? (parseFloat(ligne.quantite) * parseFloat(ligne.prix_unitaire)).toFixed(2) + ' DH'
                                                : (ligne.type === 'echantillon' ? '0.00 DH' : '-')}
                                        </div>

                                        {data.lignes.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeLigne(index)}
                                                className="absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-200"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 flex justify-end border-t pt-4">
                                <div className="text-xl font-bold text-gray-900">
                                    Total Estimé : <span className="text-indigo-600">{totalBl.toFixed(2)} DH</span>
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <div className="flex justify-end gap-4 mb-10">
                            <Link href={route('bon-livraisons.index')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium transition">
                                Annuler
                            </Link>
                            <PrimaryButton disabled={processing} className="px-8 py-2 text-base">
                                Enregistrer le BL
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
