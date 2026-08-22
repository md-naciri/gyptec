import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import ConfirmModal from '@/Components/ConfirmModal';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Trash2, Plus, AlertCircle, RefreshCw, Edit } from 'lucide-react';
import { formatDateFr } from '@/utils/date';

export default function Index({ bons, clients, filters }: { bons: any, clients: any[], filters: any }) {
    const { delete: destroy } = useForm();
    const [clientId, setClientId] = useState(filters.client_id || '');
    const [camion, setCamion] = useState(filters.camion || '');
    const [numero, setNumero] = useState(filters.numero || '');
    const [dateDebut, setDateDebut] = useState(filters.date_debut || '');
    const [dateFin, setDateFin] = useState(filters.date_fin || '');
    const [showConfirm, setShowConfirm] = useState(false);
    const [bonToDelete, setBonToDelete] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setBonToDelete(id);
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        if (bonToDelete) {
            destroy(route('bon-livraisons.destroy', bonToDelete));
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('bon-livraisons.index'), { 
            camion, 
            numero,
            client_id: clientId,
            date_debut: dateDebut,
            date_fin: dateFin 
        }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bons de Livraison" />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* La "Super Card" */}
                    <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5">
                        
                        {/* En-tête interne */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] dark:text-white tracking-tight mb-2">Ventes & Expéditions</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">Historique des bons de livraison</p>
                            </div>
                            <Link href={route('bon-livraisons.create')}>
                                <PrimaryButton className="!h-12 !rounded-full !px-8 text-base shadow-lg shadow-primary-500/20 gap-2">
                                    <Plus size={20} />
                                    <span>Nouveau BL</span>
                                </PrimaryButton>
                            </Link>
                        </div>

                        {/* Îlot 1 : La Toolbar (Filtres) */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 lg:p-8 shadow-sm mb-8 border border-gray-100 dark:border-white/5">
                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</label>
                                        <ClientSelect
                                            clients={clients}
                                            value={clientId}
                                            onChange={(val: any) => setClientId(val || '')}
                                            placeholder="Tous les clients"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N° BL</label>
                                        <TextInput 
                                            type="text" 
                                            value={numero} 
                                            onChange={e => setNumero(e.target.value)}
                                            className="w-full"
                                            placeholder="Ex: BL-2023-..."
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Camion / Immat.</label>
                                        <TextInput 
                                            type="text" 
                                            value={camion} 
                                            onChange={e => setCamion(e.target.value)}
                                            className="w-full"
                                            placeholder="Ex: 1234-A-1"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Création Du</label>
                                        <DatePicker
                                            selected={dateDebut ? new Date(dateDebut) : null}
                                            onChange={(d) => {
                                                if (d) {
                                                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                                                    setDateDebut(d.toISOString().split('T')[0]);
                                                } else {
                                                    setDateDebut('');
                                                }
                                            }}
                                            placeholderText="Début"
                                            isClearable
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Création Au</label>
                                        <DatePicker
                                            selected={dateFin ? new Date(dateFin) : null}
                                            onChange={(d) => {
                                                if (d) {
                                                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                                                    setDateFin(d.toISOString().split('T')[0]);
                                                } else {
                                                    setDateFin('');
                                                }
                                            }}
                                            placeholderText="Fin"
                                            minDate={dateDebut ? new Date(dateDebut) : undefined}
                                            isClearable
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-100">
                                    {(clientId || numero || camion || dateDebut || dateFin) && (
                                        <button 
                                            type="button" 
                                            onClick={() => window.location.href = route('bon-livraisons.index')} 
                                            className="text-gray-500 dark:text-gray-400 hover:text-[#29303d] dark:hover:text-white text-sm font-semibold h-11 px-6 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                                        >
                                            <RefreshCw size={16} />
                                            <span>Réinitialiser</span>
                                        </button>
                                    )}
                                    <PrimaryButton type="submit" className="!bg-[#29303d] hover:!bg-black">
                                        Appliquer les filtres
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                        {/* Îlot 2 : Le Tableau */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1f2430]">
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N° BL</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Camion</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nb Lignes</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Agent</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#1f2430]">
                                        {bons.data.map((bon: any) => (
                                            <tr key={bon.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{formatDateFr(bon.date)}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400 font-bold">{bon.numero_bl || '-'}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">{bon.matricule_camion || '-'}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm">
                                                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-black">
                                                        {bon.lignes.length} {bon.lignes.length > 1 ? 'articles' : 'article'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">{bon.user?.name}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                                    <div className="flex justify-end items-center gap-2">
                                                        <Link href={route('bon-livraisons.show', bon.id)} title="Détails" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                            <Eye size={16} />
                                                        </Link>
                                                        <Link href={route('bon-livraisons.edit', bon.id)} title="Modifier" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                            <Edit size={16} />
                                                        </Link>
                                                        <button onClick={() => handleDelete(bon.id)} title="Supprimer" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {bons.data.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <AlertCircle size={48} className="mb-4 opacity-30" />
                                                        <p className="text-lg font-medium text-gray-600">Aucun bon de livraison trouvé.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination (Styled to match the new crisp layout) */}
                            {bons.links && bons.links.length > 3 && (
                                <div className="border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#1f2430] p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Affichage de <span className="text-gray-900 dark:text-white font-bold">{bons.from}</span> à <span className="text-gray-900 dark:text-white font-bold">{bons.to}</span> sur <span className="text-gray-900 dark:text-white font-bold">{bons.total}</span> résultats
                                    </div>
                                    <div className="flex gap-2">
                                        {bons.links.map((link: any, idx: number) => (
                                            <Link 
                                                key={idx}
                                                href={link.url || '#'} 
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                                    link.active 
                                                        ? 'bg-[#29303d] dark:bg-white text-white dark:text-[#29303d] shadow-md' 
                                                        : 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div> {/* Fin Super Card */}
                    
                    <ConfirmModal 
                        show={showConfirm}
                        onClose={() => setShowConfirm(false)}
                        onConfirm={confirmDelete}
                        title="Supprimer le bon de livraison"
                        message="Êtes-vous sûr de vouloir supprimer ce bon de livraison ? Cette action est irréversible et supprimera le bon de l'historique du client."
                        confirmText="Supprimer"
                        type="danger"
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
