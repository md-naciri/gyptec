import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import FilterCard from '@/Components/FilterCard';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

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
            <PageHeader 
                title="Paramétrage des Barèmes de Remise" 
                subtitle="Définition des objectifs et taux de remise annuels par client"
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Filtre Année et Recherche */}
                    <FilterCard className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <label className="font-medium text-gray-700 whitespace-nowrap">Année de référence :</label>
                            <SelectInput 
                                className="w-full sm:w-auto"
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
                        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-auto">
                            <TextInput
                                type="text"
                                placeholder="Rechercher un client..."
                                className="w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </FilterCard>

                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <form onSubmit={submit}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">Client</th>
                                            {produits.map((p: any) => (
                                                <th key={p.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {p.nom} (DH/Tonne)
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredClients.map((client: any) => {
                                            const rowData = matrix.find((r: any) => r.client_id === client.id);
                                            return (
                                                <tr key={client.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                                                        {client.nom_affichage}
                                                    </td>
                                                    {produits.map((p: any) => (
                                                        <td key={p.id} className="px-4 py-2 text-center bg-white">
                                                            <TextInput
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                className="w-24 text-center"
                                                                value={rowData ? rowData.taux[p.id] : ''}
                                                                onChange={(e) => handleTauxChange(client.id, p.id, e.target.value)}
                                                                placeholder="-"
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                        {filteredClients.length === 0 && (
                                            <tr>
                                                <td colSpan={produits.length + 1} className="px-6 py-12 text-center text-gray-500">
                                                    Aucun client trouvé.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="p-4 bg-gray-50 border-t flex justify-end">
                                <PrimaryButton disabled={processing}>
                                    Enregistrer les barèmes
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
