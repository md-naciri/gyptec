import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import FilterCard from '@/Components/FilterCard';
import TextInput from '@/Components/TextInput';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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
            <PageHeader 
                title="Tarification par Client" 
                subtitle="Matrice des prix personnalisés par client"
            />

            <div className="py-4">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    <FilterCard className="flex items-center">
                        <label className="text-gray-600 font-medium mr-4 whitespace-nowrap">Recherche :</label>
                        <TextInput
                            type="text"
                            placeholder="Rechercher un client..."
                            className="flex-1 max-w-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </FilterCard>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-0 text-gray-900">
                            <p className="mb-4 text-sm text-gray-600">
                                Laissez vide pour utiliser le prix par défaut du produit. Appuyez sur Entrée (ou perdez le focus) pour sauvegarder la modification.
                            </p>
                            
                            <div className="overflow-x-auto relative">
                                {saving && (
                                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                                        <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm">Sauvegarde...</span>
                                    </div>
                                )}
                                <table className="min-w-full border-collapse border border-gray-200 text-sm text-left">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="border border-gray-200 px-4 py-2 font-medium text-gray-900 sticky left-0 bg-gray-50 z-20">
                                                Client \ Produit
                                            </th>
                                            {produits.map(produit => (
                                                <th key={produit.id} className="border border-gray-200 px-4 py-2 font-medium text-gray-900 text-center min-w-[120px]">
                                                    {produit.nom} <br />
                                                    <span className="text-xs text-gray-500 font-normal">(Défaut: {produit.prix_defaut})</span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClients.map(client => (
                                            <tr key={client.id} className="hover:bg-gray-50">
                                                <td className="border border-gray-200 px-4 py-2 font-medium text-gray-900 sticky left-0 bg-white">
                                                    {client.nom}
                                                </td>
                                                {produits.map(produit => (
                                                    <td key={produit.id} className="border border-gray-200 px-2 py-1 bg-white">
                                                        <TextInput
                                                            type="number"
                                                            step="0.01"
                                                            placeholder={produit.prix_defaut.toString()}
                                                            className="w-full text-center"
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
                                                <td colSpan={produits.length + 1} className="px-4 py-8 text-center text-gray-500">
                                                    Aucun client ne correspond à votre recherche.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
