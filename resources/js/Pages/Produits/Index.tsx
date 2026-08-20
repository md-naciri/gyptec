import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function Index({ produits }: { produits: any[] }) {
    const { delete: destroy } = useForm();
    const [showConfirm, setShowConfirm] = useState(false);
    const [produitToDelete, setProduitToDelete] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setProduitToDelete(id);
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        if (produitToDelete) {
            destroy(route('produits.destroy', produitToDelete));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Produits" />
            <PageHeader 
                title="Catalogue Produits" 
                subtitle="Gestion des articles et de leurs prix par défaut"
                action={
                    <Link
                        href={route('produits.create')}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition shadow-sm font-medium"
                    >
                        + Nouveau Produit
                    </Link>
                }
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix par Défaut (DH)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {produits.map((produit) => (
                                            <tr key={produit.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produit.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produit.unite}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produit.prix_defaut}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${produit.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {produit.actif ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('produits.edit', produit.id)} title="Modifier" className="text-gray-600 hover:text-blue-600 bg-gray-50 p-1.5 rounded-md hover:bg-blue-50 transition-colors">
                                                            <Pencil size={18} />
                                                        </Link>
                                                        <button onClick={() => handleDelete(produit.id)} title="Supprimer" className="text-gray-600 hover:text-red-600 bg-gray-50 p-1.5 rounded-md hover:bg-red-50 transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {produits.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Aucun produit trouvé.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <ConfirmModal 
                        show={showConfirm}
                        onClose={() => setShowConfirm(false)}
                        onConfirm={confirmDelete}
                        title="Supprimer le produit"
                        message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
                        confirmText="Supprimer"
                        type="danger"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
