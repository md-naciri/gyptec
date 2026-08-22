import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';

export default function Index({ clients, produits, prixClients }: { clients: any[], produits: any[], prixClients: any[] }) {
    // State to hold local edits before saving
    const [localPrices, setLocalPrices] = useState<{ [key: string]: string | number }>({});
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter clients based on search term
    const filteredClients = clients.filter(c => c.nom.toLowerCase().includes(searchTerm.toLowerCase()));

    // Get the current price (either locally edited or from DB, or default)
    const getPrice = (clientId: number, produitId: number) => {
        const key = `${clientId}-${produitId}`;
        if (localPrices[key] !== undefined) {
            return localPrices[key];
        }
        
        const customPrice = prixClients.find(p => p.client_id === clientId && p.produit_id === produitId);
        if (customPrice) {
            return customPrice.prix_unitaire;
        }

        return '';
    };

    const handlePriceChange = (clientId: number, produitId: number, value: string) => {
        const key = `${clientId}-${produitId}`;
        setLocalPrices(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = (clientId: number, produitId: number) => {
        const key = `${clientId}-${produitId}`;
        const val = localPrices[key];
        
        if (val === undefined) return; // Not modified

        setSaving(true);
        router.post(route('prix-clients.store'), {
            client_id: clientId,
            produit_id: produitId,
            prix_unitaire: val === '' ? null : parseFloat(val as string)
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Prix par Client" />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* La "Super Card" */}
                    <div className="bg-[#ecebe8] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50">
                        
                        {/* En-tête interne */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] tracking-tight mb-2">Tarification par Client</h1>
                                <p className="text-gray-600 text-lg">Matrice des prix personnalisés par client</p>
                            </div>
                        </div>

                        {/* Îlot 1 : Toolbar (Recherche & Info) */}
                        <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="w-full md:w-1/3 flex flex-col gap-2 relative">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recherche Rapide</label>
                                <div className="relative">
                                    <TextInput
                                        type="text"
                                        placeholder="Rechercher un client..."
                                        className="w-full pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>
                            <div className="w-full md:w-2/3 bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
                                <AlertCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                <p className="font-medium">
                                    Laissez une case vide pour utiliser le prix par défaut du produit.<br/>
                                    <strong className="font-bold">Appuyez sur Entrée</strong> (ou cliquez en dehors de la case) pour sauvegarder instantanément vos modifications.
                                </p>
                            </div>
                        </div>

                        {/* Îlot 2 : La Matrice (Tableau) */}
                        <div className="bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 relative">
                            {saving && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-30 flex items-center justify-center rounded-[1.5rem]">
                                    <div className="bg-[#29303d] text-white px-6 py-3 rounded-full font-bold flex items-center gap-3 shadow-xl">
                                        <Loader2 size={18} className="animate-spin" />
                                        Sauvegarde en cours...
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-5 border-b border-gray-100 text-xs font-bold text-[#29303d] uppercase tracking-wider sticky left-0 bg-gray-50/90 backdrop-blur-md z-20 shadow-[1px_0_0_0_#f3f4f6]">
                                                Client \ Produit
                                            </th>
                                            {produits.map(produit => (
                                                <th key={produit.id} className="px-4 py-5 border-b border-gray-100 text-center min-w-[140px]">
                                                    <div className="text-[13px] font-bold text-[#29303d] mb-1">{produit.nom}</div>
                                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Défaut: {produit.prix_defaut}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredClients.map(client => (
                                            <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4 font-bold text-[15px] text-[#29303d] sticky left-0 bg-white group-hover:bg-gray-50/50 shadow-[1px_0_0_0_#f3f4f6] z-10 transition-colors">
                                                    {client.nom}
                                                </td>
                                                {produits.map(produit => (
                                                    <td key={produit.id} className="px-3 py-3">
                                                        <TextInput
                                                            type="number"
                                                            step="0.01"
                                                            placeholder={produit.prix_defaut.toString()}
                                                            className="w-full text-center font-bold text-[#29303d] h-11 bg-gray-50 border-transparent hover:border-gray-200 focus:bg-white transition-all placeholder:text-gray-300 placeholder:font-medium"
                                                            value={getPrice(client.id, produit.id)}
                                                            onChange={(e) => handlePriceChange(client.id, produit.id, e.target.value)}
                                                            onBlur={() => handleSave(client.id, produit.id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    (e.target as HTMLInputElement).blur();
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        {filteredClients.length === 0 && (
                                            <tr>
                                                <td colSpan={produits.length + 1} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <AlertCircle size={48} className="mb-4 opacity-30" />
                                                        <p className="text-lg font-medium text-gray-600">Aucun client ne correspond à votre recherche.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div> {/* Fin Super Card */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
