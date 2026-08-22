import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Loader2, Save, AlertCircle, Percent } from 'lucide-react';

export default function RemisesBaremes({ annee, clients, produits, baremes }: any) {
    const [selectedAnnee, setSelectedAnnee] = useState(annee);

    // Initialiser les données du formulaire
    const initialBaremes = clients.map((client: any) => {
        const clientBaremes: any = {};
        produits.forEach((produit: any) => {
            const bareme = baremes.find((b: any) => b.client_id === client.id && b.produit_id === produit.id);
            clientBaremes[produit.id] = bareme ? bareme.taux_dh_par_tonne : '';
        });
        return {
            client_id: client.id,
            taux: clientBaremes
        };
    });

    const { data, setData, post, processing, errors } = useForm({
        annee: annee,
        baremes_flat: [] // On va le remplir juste avant l'envoi
    });

    const [matrix, setMatrix] = useState(initialBaremes);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients.filter((c: any) => 
        c.nom_affichage.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTauxChange = (clientId: number, produitId: number, value: string) => {
        const newMatrix = [...matrix];
        const clientRow = newMatrix.find(row => row.client_id === clientId);
        if (clientRow) {
            clientRow.taux[produitId] = value;
            setMatrix(newMatrix);
        }
    };

    const submit = (e: any) => {
        e.preventDefault();
        
        // Aplatir la matrice pour le serveur
        const flatBaremes: any[] = [];
        matrix.forEach((row: any) => {
            Object.keys(row.taux).forEach((prodId) => {
                if (row.taux[prodId] !== '' && row.taux[prodId] !== null) {
                    flatBaremes.push({
                        client_id: row.client_id,
                        produit_id: parseInt(prodId),
                        taux_dh_par_tonne: parseFloat(row.taux[prodId])
                    });
                }
            });
        });

        router.post(route('remises.saveBaremes'), {
            annee: selectedAnnee,
            baremes: flatBaremes
        }, {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Barèmes Remises" />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* La "Super Card" */}
                    <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5">
                        
                        {/* En-tête interne */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] dark:text-white tracking-tight mb-2">Barèmes de Remise</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">Définition des objectifs et taux de remise annuels par client</p>
                            </div>
                        </div>

                        {/* Îlot 1 : Toolbar (Filtres & Info) */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 lg:p-8 shadow-sm mb-8 flex flex-col lg:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-white/5">
                            <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-1/3 flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Année</label>
                                    <SelectInput 
                                        className="w-full h-11"
                                        value={selectedAnnee}
                                        onChange={(e: any) => {
                                            setSelectedAnnee(e.target.value);
                                            router.get(route('remises.baremes'), { annee: e.target.value });
                                        }}
                                    >
                                        {[2024, 2025, 2026, 2027, 2028].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </SelectInput>
                                </div>
                                <div className="w-full sm:w-2/3 flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recherche Rapide</label>
                                    <div className="relative">
                                        <TextInput
                                            type="text"
                                            placeholder="Rechercher un client..."
                                            className="w-full pl-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Search size={18} className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 text-sm text-emerald-800 dark:text-emerald-400 flex items-start gap-3">
                                <Percent size={20} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                <p className="font-medium">
                                    Saisissez le montant de la remise (DH par Tonne) accordée à chaque client pour chaque produit. Laissez vide si aucune remise.
                                </p>
                            </div>
                        </div>

                        {/* Îlot 2 : La Matrice (Tableau) */}
                        <form onSubmit={submit} className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 dark:border-white/5 relative">
                            {processing && (
                                <div className="absolute inset-0 bg-white/60 dark:bg-[#1f2430]/60 backdrop-blur-sm z-30 flex items-center justify-center rounded-[1.5rem]">
                                    <div className="bg-[#29303d] dark:bg-white text-white dark:text-[#29303d] px-6 py-3 rounded-full font-bold flex items-center gap-3 shadow-xl">
                                        <Loader2 size={18} className="animate-spin" />
                                        Enregistrement en cours...
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead className="bg-gray-50/50 dark:bg-[#181c25]/50">
                                        <tr>
                                            <th className="px-6 py-5 border-b border-gray-100 dark:border-white/5 text-xs font-bold text-[#29303d] dark:text-white uppercase tracking-wider sticky left-0 bg-gray-50/90 dark:bg-[#181c25]/90 backdrop-blur-md z-20 shadow-[1px_0_0_0_#f3f4f6] dark:shadow-[1px_0_0_0_#ffffff0d]">
                                                Client \ Produit (DH/T)
                                            </th>
                                            {produits.map((p: any) => (
                                                <th key={p.id} className="px-4 py-5 border-b border-gray-100 dark:border-white/5 text-center min-w-[140px]">
                                                    <div className="text-[13px] font-bold text-[#29303d] dark:text-white">{p.nom}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {filteredClients.map((client: any) => {
                                            const rowData = matrix.find((r: any) => r.client_id === client.id);
                                            return (
                                                <tr key={client.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4 font-bold text-[15px] text-[#29303d] dark:text-white sticky left-0 bg-white dark:bg-[#1f2430] group-hover:bg-gray-50/50 dark:group-hover:bg-[#181c25]/50 shadow-[1px_0_0_0_#f3f4f6] dark:shadow-[1px_0_0_0_#ffffff0d] z-10 transition-colors">
                                                        {client.nom_affichage}
                                                    </td>
                                                    {produits.map((p: any) => (
                                                        <td key={p.id} className="px-3 py-3">
                                                            <TextInput
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                placeholder="-"
                                                                className="w-full text-center font-bold text-emerald-700 dark:text-emerald-400 h-11 bg-gray-50 dark:bg-[#181c25] border-transparent hover:border-emerald-200 dark:hover:border-emerald-900/50 focus:bg-white dark:focus:bg-[#1f2430] focus:ring-emerald-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 placeholder:font-medium"
                                                                value={rowData ? rowData.taux[p.id] : ''}
                                                                onChange={(e) => handleTauxChange(client.id, p.id, e.target.value)}
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                        {filteredClients.length === 0 && (
                                            <tr>
                                                <td colSpan={produits.length + 1} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <AlertCircle size={48} className="mb-4 opacity-30" />
                                                        <p className="text-lg font-medium text-gray-600">Aucun client trouvé.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Actions (Footer du form) */}
                            <div className="p-6 bg-gray-50/80 dark:bg-[#181c25]/80 border-t border-gray-100 dark:border-white/5 flex justify-end">
                                <PrimaryButton disabled={processing} className="!bg-[#29303d] hover:!bg-black gap-2 !h-12 !px-8">
                                    <Save size={18} />
                                    <span>Enregistrer les barèmes</span>
                                </PrimaryButton>
                            </div>
                        </form>

                    </div> {/* Fin Super Card */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
