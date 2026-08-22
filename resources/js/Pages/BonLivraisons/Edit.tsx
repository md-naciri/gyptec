import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';
import SelectInput from '@/Components/SelectInput';
import { useState } from 'react';
import { getTodayDateCasablanca } from '@/utils/date';
import { Truck, MapPin, Map, FileText, Plus, X, Box, Save, ChevronLeft, AlertCircle } from 'lucide-react';

export default function Edit({ bonLivraison, clients, produits, prixClients }: { bonLivraison: any, clients: any[], produits: any[], prixClients: any[] }) {
    
    const { data, setData, put, processing, errors } = useForm({
        date: bonLivraison.date,
        numero_bl: bonLivraison.numero_bl || '',
        matricule_camion: bonLivraison.matricule_camion || '',
        destination: bonLivraison.destination || '',
        zone: bonLivraison.zone || '',
        lignes: bonLivraison.lignes.length > 0 ? bonLivraison.lignes.map((l: any) => ({
            id: l.id,
            client_id: l.client_id.toString(),
            produit_id: l.produit_id.toString(),
            quantite: l.quantite,
            type: l.type,
            prix_unitaire: l.prix_unitaire
        })) : [
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
        const newLignes = data.lignes.filter((_: any, i: number) => i !== index);
        setData('lignes', newLignes);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('bon-livraisons.update', bonLivraison.id));
    };

    // Calculate total BL
    const totalBl = data.lignes.reduce((sum: number, ligne: any) => {
        if (ligne.type === 'vente' && ligne.quantite && ligne.prix_unitaire) {
            return sum + (parseFloat(ligne.quantite) * parseFloat(ligne.prix_unitaire));
        }
        return sum;
    }, 0);

    return (
        <AuthenticatedLayout>
            <Head title={`Modifier BL #${bonLivraison.numero_bl || bonLivraison.id}`} />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* Bouton Retour */}
                    <div className="mb-6">
                        <Link href={route('bon-livraisons.index')} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#29303d] transition-colors">
                            <ChevronLeft size={16} className="mr-1" />
                            Retour à la liste des Ventes
                        </Link>
                    </div>

                    <form onSubmit={submit}>
                        {/* La "Super Card" */}
                        <div className="bg-[#ecebe8] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50">
                            
                            {/* En-tête interne */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-black text-[#29303d] tracking-tight mb-2">
                                        Modifier BL #{bonLivraison.numero_bl || bonLivraison.id}
                                    </h1>
                                    <p className="text-gray-600 font-medium">Modifier les informations de l'expédition</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link href={route('bon-livraisons.index')} className="h-11 px-6 rounded-full bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                        <ChevronLeft size={18} />
                                        <span className="hidden sm:inline">Annuler</span>
                                    </Link>
                                    <div className="bg-indigo-50 px-6 py-3 rounded-full border border-indigo-100 flex items-center gap-3">
                                        <span className="text-sm font-bold text-indigo-800 uppercase tracking-wider">Total Estimé</span>
                                        <span className="text-2xl font-black text-indigo-600">{totalBl.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm">DH</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                
                                {/* COLONNE GAUCHE : Infos Générales */}
                                <div className="xl:col-span-1 space-y-8">
                                    {/* Îlot 1 : Infos Générales */}
                                    <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                                <FileText size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#29303d]">Détails du document</h3>
                                        </div>
                                        
                                        <div className="space-y-5">
                                            <div>
                                                <InputLabel htmlFor="date" value="Date *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
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
                                                <InputLabel htmlFor="numero_bl" value="Numéro BL" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                                <TextInput id="numero_bl" className="w-full h-12" value={data.numero_bl} onChange={e => setData('numero_bl', e.target.value)} placeholder="Ex: BL-2026-001" />
                                                <InputError message={errors.numero_bl} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Îlot 2 : Logistique */}
                                    <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                                <Truck size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#29303d]">Logistique & Transport</h3>
                                        </div>
                                        
                                        <div className="space-y-5">
                                            <div>
                                                <InputLabel htmlFor="matricule_camion" value="Camion (Matricule)" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                                <div className="relative">
                                                    <TextInput id="matricule_camion" className="w-full h-12 pl-11" value={data.matricule_camion} onChange={e => setData('matricule_camion', e.target.value)} placeholder="Ex: 1234-A-1" />
                                                    <Truck size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                                </div>
                                                <InputError message={errors.matricule_camion} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="destination" value="Destination" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                                <div className="relative">
                                                    <TextInput id="destination" className="w-full h-12 pl-11" value={data.destination} onChange={e => setData('destination', e.target.value)} placeholder="Ville ou adresse" />
                                                    <MapPin size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* COLONNE DROITE : Lignes de BL */}
                                <div className="xl:col-span-2">
                                    <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm border border-gray-100">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                    <Box size={20} />
                                                </div>
                                                <h3 className="text-xl font-bold text-[#29303d]">Lignes de Vente</h3>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={addLigne} 
                                                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                            >
                                                <Plus size={16} />
                                                <span>Ajouter une ligne</span>
                                            </button>
                                        </div>

                                        {typeof errors.lignes === 'string' && (
                                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm flex items-center gap-2">
                                                <AlertCircle size={18} />
                                                {errors.lignes}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {data.lignes.map((ligne: any, index: number) => (
                                                <div key={ligne.id || index} className="p-4 sm:p-5 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-end transition-colors hover:bg-gray-50 relative group">
                                                    
                                                    {data.lignes.length > 1 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeLigne(index)}
                                                            className="absolute -right-3 -top-3 bg-white border border-gray-200 text-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-100 shadow-sm transition-colors z-10"
                                                            title="Supprimer la ligne"
                                                        >
                                                            <X size={16} strokeWidth={3} />
                                                        </button>
                                                    )}

                                                    <div className="flex flex-col gap-4">
                                                        
                                                        {/* Ligne 1 : Client & Produit */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <InputLabel value="Client *" className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1.5" />
                                                                <ClientSelect
                                                                    clients={clients}
                                                                    value={ligne.client_id}
                                                                    onChange={(val: any) => handleLigneChange(index, 'client_id', val || '')}
                                                                    required
                                                                />
                                                                <InputError message={(errors as any)[`lignes.${index}.client_id`]} className="mt-1 text-[10px]" />
                                                            </div>
                                                            <div>
                                                                <InputLabel value="Produit *" className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1.5" />
                                                                <SelectInput 
                                                                    className="w-full h-11 !rounded-xl"
                                                                    value={ligne.produit_id}
                                                                    onChange={(e: any) => handleLigneChange(index, 'produit_id', e.target.value)}
                                                                    required
                                                                >
                                                                    <option value="">-- Choisir un produit --</option>
                                                                    {produits.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                                                                </SelectInput>
                                                                <InputError message={(errors as any)[`lignes.${index}.produit_id`]} className="mt-1 text-[10px]" />
                                                            </div>
                                                        </div>

                                                        {/* Ligne 2 : Type, Quantité, Prix */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <InputLabel value="Type" className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1.5" />
                                                                <SelectInput 
                                                                    className="w-full h-11 !rounded-xl"
                                                                    value={ligne.type}
                                                                    onChange={(e: any) => handleLigneChange(index, 'type', e.target.value)}
                                                                >
                                                                    <option value="vente">Vente</option>
                                                                    <option value="echantillon">Échantillon</option>
                                                                </SelectInput>
                                                            </div>
                                                            <div>
                                                                <InputLabel value="Qté (T) *" className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1.5" />
                                                                <input 
                                                                    type="number" step="0.01" min="0.01" required
                                                                    className="block w-full h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm sm:text-sm font-bold text-[#29303d]"
                                                                    value={ligne.quantite}
                                                                    onChange={e => handleLigneChange(index, 'quantite', e.target.value)}
                                                                />
                                                                <InputError message={(errors as any)[`lignes.${index}.quantite`]} className="mt-1 text-[10px]" />
                                                            </div>
                                                            <div>
                                                                <InputLabel value="Prix U. (DH) *" className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1.5" />
                                                                <input 
                                                                    type="number" step="0.01" min="0" required
                                                                    className={`block w-full h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm sm:text-sm font-bold ${ligne.type === 'echantillon' ? 'bg-gray-200 text-gray-500' : 'text-indigo-600'}`}
                                                                    value={ligne.prix_unitaire}
                                                                    onChange={e => handleLigneChange(index, 'prix_unitaire', e.target.value)}
                                                                    disabled={ligne.type === 'echantillon'}
                                                                />
                                                                <InputError message={(errors as any)[`lignes.${index}.prix_unitaire`]} className="mt-1 text-[10px]" />
                                                            </div>
                                                            
                                                            {/* Sous-total de la ligne */}
                                                            <div className="col-span-1 md:col-span-3 mt-2 flex justify-end items-center">
                                                                <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-gray-400 uppercase">Sous-total :</span>
                                                                    <span className="font-black text-indigo-700">
                                                                        {ligne.quantite && ligne.prix_unitaire && ligne.type === 'vente' 
                                                                            ? (parseFloat(ligne.quantite) * parseFloat(ligne.prix_unitaire)).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'
                                                                            : (ligne.type === 'echantillon' ? '0.00 DH' : '-')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions du formulaire */}
                            <div className="mt-10 flex flex-col sm:flex-row justify-end items-center gap-4">
                                <Link href={route('bon-livraisons.index')} className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 font-bold transition-colors text-center">
                                    Annuler
                                </Link>
                                <PrimaryButton type="submit" disabled={processing} className="!h-12 !rounded-full !px-8 text-base shadow-lg shadow-primary-500/20 gap-2">
                                    <Save size={20} />
                                    <span>Enregistrer les modifications</span>
                                </PrimaryButton>
                            </div>

                        </div> {/* Fin Super Card */}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
