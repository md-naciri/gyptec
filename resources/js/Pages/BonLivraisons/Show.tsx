import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link } from '@inertiajs/react';
import { formatDateFr } from '@/utils/date';

export default function Show({ bon }: { bon: any }) {
    
    const total = bon.lignes.reduce((sum: number, l: any) => sum + parseFloat(l.montant), 0);

    return (
        <AuthenticatedLayout>
            <Head title="Détails BL" />
            <PageHeader 
                title={`Détails Bon de Livraison ${bon.numero_bl ? `#${bon.numero_bl}` : ''}`} 
                subtitle={`Créé le ${formatDateFr(bon.date)}`}
                action={
                    <Link
                        href={route('bon-livraisons.index')}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 shadow-sm transition"
                    >
                        Retour
                    </Link>
                }
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 border border-gray-100">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Informations</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <span className="block text-sm text-gray-500">Date</span>
                                    <span className="font-medium">{formatDateFr(bon.date)}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Camion</span>
                                    <span className="font-medium">{bon.matricule_camion || '-'}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Destination</span>
                                    <span className="font-medium">{bon.destination || '-'}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Créé par</span>
                                    <span className="font-medium">{bon.user?.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Produits Livrés</h3>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantité</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Prix U. (DH)</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant (DH)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bon.lignes.map((ligne: any) => (
                                            <tr key={ligne.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ligne.client?.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ligne.produit?.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                    {ligne.type === 'echantillon' ? (
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Échantillon</span>
                                                    ) : (
                                                        <span className="text-gray-500">Vente</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">{ligne.quantite} {ligne.produit?.unite}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{ligne.prix_unitaire}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">{ligne.montant}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50 border-t-2 border-gray-200">
                                            <td colSpan={5} className="px-6 py-4 text-right text-sm font-bold text-gray-900">TOTAL</td>
                                            <td className="px-6 py-4 text-right text-lg font-bold text-indigo-700">{total.toFixed(2)} DH</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
