import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, AlertCircle, Package } from 'lucide-react';

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

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* La "Super Card" */}
                    <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5">
                        
                        {/* En-tête interne */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] dark:text-white tracking-tight mb-2">Catalogue Produits</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">Gestion des articles et de leurs prix par défaut</p>
                            </div>
                            <Link href={route('produits.create')}>
                                <PrimaryButton className="!h-12 !rounded-full !px-8 text-base shadow-lg shadow-primary-500/20 gap-2">
                                    <Plus size={20} />
                                    <span>Nouveau Produit</span>
                                </PrimaryButton>
                            </Link>
                        </div>

                        {/* Îlot 1 : Le Tableau */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 dark:border-white/5">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1f2430]">
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom du Produit</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unité</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix par Défaut (DH)</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#1f2430]">
                                        {produits.map((produit) => (
                                            <tr key={produit.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 flex items-center justify-center">
                                                            <Package size={20} />
                                                        </div>
                                                        <span className="text-[15px] font-bold text-[#29303d] dark:text-white">{produit.nom}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">{produit.unite}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right text-base font-black text-[#29303d] dark:text-white">{Number(produit.prix_defaut).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${produit.actif ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                        {produit.actif ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                                    <div className="flex justify-end items-center gap-2">
                                                        <Link href={route('produits.edit', produit.id)} title="Modifier" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                            <Pencil size={16} />
                                                        </Link>
                                                        <button onClick={() => handleDelete(produit.id)} title="Supprimer" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {produits.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <AlertCircle size={48} className="mb-4 opacity-30" />
                                                        <p className="text-lg font-medium text-gray-600">Aucun produit trouvé.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div> {/* Fin Super Card */}

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
