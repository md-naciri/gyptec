import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, AlertCircle, PlusCircle } from 'lucide-react';

export default function Index({ clients }: { clients: any[] }) {
    const [search, setSearch] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setClientToDelete(id);
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        if (clientToDelete) {
            router.delete(route('clients.destroy', clientToDelete));
        }
    };

    const filteredClients = clients.filter(client => {
        const searchString = `${client.code_client || ''} ${client.nom} ${client.complement_ident || ''}`.toLowerCase();
        return searchString.includes(search.toLowerCase());
    });

    return (
        <AuthenticatedLayout>
            <Head title="Clients" />

            {/* Arrière-plan global (défini dans le layout mais on s'assure du padding) */}
            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* La "Super Card" : le conteneur principal de type Tabella */}
                    <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5">
                        
                        {/* En-tête interne à la Super Card */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] dark:text-white tracking-tight mb-2">Clients</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">Gestion du portefeuille client et suivi des soldes</p>
                            </div>
                            <Link href={route('clients.create')}>
                                <PrimaryButton className="!h-12 !rounded-full !px-8 text-base shadow-lg shadow-primary-500/20 gap-2">
                                    <Plus size={20} />
                                    <span>Nouveau Client</span>
                                </PrimaryButton>
                            </Link>
                        </div>

                        {/* Îlot 1 : La Toolbar (Recherche) */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 shadow-sm mb-8 border border-gray-100 dark:border-white/5">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="w-full md:w-1/2 flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recherche Rapide</label>
                                    <TextInput
                                        type="text"
                                        className="w-full"
                                        placeholder="Chercher par nom, code (ex: C-0001) ou complément..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Îlot 2 : Le Tableau */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 dark:border-white/5">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1f2430]">
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client (Code - Nom)</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Téléphone</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solde Actuel (DH)</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#1f2430]">
                                        {filteredClients.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <AlertCircle size={48} className="mb-4 opacity-30" />
                                                        <p className="text-lg font-medium text-gray-600">Aucun client trouvé.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredClients.map((client) => (
                                                <tr key={client.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                                                                {client.nom.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <Link href={route('clients.show', client.id)} className="text-[#29303d] dark:text-white hover:text-primary-600 dark:hover:text-primary-400 font-bold text-[15px] transition-colors">
                                                                    {client.code_client} - {client.nom}
                                                                </Link>
                                                                {client.complement_ident && (
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                                                        {client.complement_ident}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-medium">{client.telephone || '-'}</td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-right font-black text-[#29303d] dark:text-white text-base">
                                                        <span className={client.solde > 0 ? 'text-red-600 dark:text-red-400' : (client.solde < 0 ? 'text-green-600 dark:text-green-400' : 'text-[#29303d] dark:text-white')}>
                                                            {client.solde > 0 ? '+' : ''}{Number(client.solde).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${client.actif ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                            {client.actif ? 'Actif' : 'Inactif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                                        <div className="flex justify-end items-center gap-2">
                                                            {/* Actions visibles en permanence, style discret Tabella */}
                                                            <Link href={route('encaissements.create', { client_id: client.id })} title="Nouvel encaissement" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                                <PlusCircle size={16} />
                                                            </Link>
                                                            <Link href={route('clients.show', client.id)} title="Détails" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                                <Eye size={16} />
                                                            </Link>
                                                            <Link href={route('clients.edit', client.id)} title="Modifier" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                                <Pencil size={16} />
                                                            </Link>
                                                            <button onClick={() => handleDelete(client.id)} title="Supprimer" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
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
                        title="Supprimer le client"
                        message="Voulez-vous vraiment supprimer ce client ? Cette action est irréversible et supprimera tout son historique (Bons de livraisons, Encaissements)."
                        confirmText="Supprimer"
                        type="danger"
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
