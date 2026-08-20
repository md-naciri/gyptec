import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import FilterCard from '@/Components/FilterCard';
import TextInput from '@/Components/TextInput';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Pencil, Trash2, PlusCircle } from 'lucide-react';

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
            <PageHeader 
                title="Liste des Clients" 
                subtitle="Gestion du portefeuille client et suivi des soldes"
                action={
                    <Link
                        href={route('clients.create')}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition shadow-sm font-medium"
                    >
                        + Nouveau Client
                    </Link>
                }
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    <FilterCard className="flex items-center">
                        <label className="text-gray-600 font-medium mr-4 whitespace-nowrap">Recherche :</label>
                        <TextInput
                            type="text"
                            className="flex-1"
                            placeholder="Chercher par nom, code (ex: C-0001) ou complément..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </FilterCard>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-0 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client (Code - Nom)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Solde Actuel (DH)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredClients.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Aucun client trouvé.</td>
                                            </tr>
                                        ) : (
                                            filteredClients.map((client) => (
                                                <tr key={client.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Link href={route('clients.show', client.id)} className="text-indigo-600 hover:text-indigo-900 hover:underline font-bold text-sm">
                                                            {client.code_client} - {client.nom}
                                                        </Link>
                                                        {client.complement_ident && (
                                                            <span className="ml-2 text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                                                                ({client.complement_ident})
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.telephone || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.agent_referent?.name || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                                                        <span className={client.solde > 0 ? 'text-red-600' : (client.solde < 0 ? 'text-green-600' : 'text-gray-900')}>
                                                            {client.solde > 0 ? '+' : ''}{Number(client.solde).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {client.actif ? 'Actif' : 'Inactif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link href={route('encaissements.create', { client_id: client.id })} title="Nouvel encaissement" className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded-md hover:bg-green-100 transition-colors">
                                                                <PlusCircle size={18} />
                                                            </Link>
                                                            <Link href={route('clients.show', client.id)} title="Détails" className="text-gray-600 hover:text-primary-600 bg-gray-50 p-1.5 rounded-md hover:bg-primary-50 transition-colors">
                                                                <Eye size={18} />
                                                            </Link>
                                                            <Link href={route('clients.edit', client.id)} title="Modifier" className="text-gray-600 hover:text-blue-600 bg-gray-50 p-1.5 rounded-md hover:bg-blue-50 transition-colors">
                                                                <Pencil size={18} />
                                                            </Link>
                                                            <button onClick={() => handleDelete(client.id)} title="Supprimer" className="text-gray-600 hover:text-red-600 bg-gray-50 p-1.5 rounded-md hover:bg-red-50 transition-colors">
                                                                <Trash2 size={18} />
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
                    </div>
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
