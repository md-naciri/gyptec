import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import ConfirmModal from '@/Components/ConfirmModal';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Edit, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { formatDateFr } from '@/utils/date';

export default function Index({ encaissements, clients, filters, echeancesCetteSemaine }: { encaissements: any, clients: any[], filters: any, echeancesCetteSemaine: number }) {
    const { delete: destroy } = useForm();
    const [clientId, setClientId] = useState(filters.client_id || '');
    const [statut, setStatut] = useState(filters.statut || '');
    const [dateDebut, setDateDebut] = useState(filters.date_debut || '');
    const [dateFin, setDateFin] = useState(filters.date_fin || '');
    const [echeanceDebut, setEcheanceDebut] = useState(filters.echeance_debut || '');
    const [echeanceFin, setEcheanceFin] = useState(filters.echeance_fin || '');
    const [reference, setReference] = useState(filters.reference || '');
    const [showConfirm, setShowConfirm] = useState(false);
    const [encaissementToDelete, setEncaissementToDelete] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setEncaissementToDelete(id);
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        if (encaissementToDelete) {
            destroy(route('encaissements.destroy', encaissementToDelete));
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('encaissements.index'), { 
            client_id: clientId, 
            statut,
            date_debut: dateDebut,
            date_fin: dateFin,
            echeance_debut: echeanceDebut,
            echeance_fin: echeanceFin,
            reference
        }, { preserveState: true });
    };

    const handleStatutChange = (id: number, newStatut: string) => {
        router.patch(route('encaissements.updateStatut', id), { statut: newStatut }, {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Encaissements" />

            {/* Arrière-plan global */}
            <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f121a] py-8 lg:py-12 transition-colors duration-300">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* La "Super Card" : le conteneur principal de type Tabella */}
                    <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5">
                        
                        {/* En-tête interne à la Super Card */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] dark:text-white tracking-tight mb-2">Encaissements</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">Suivi des paiements et des échéances clients</p>
                            </div>
                            <Link href={route('encaissements.create')}>
                                <PrimaryButton className="!h-12 !rounded-full !px-8 text-base shadow-lg shadow-primary-500/20 gap-2">
                                    <Plus size={20} />
                                    <span>Nouvel Encaissement</span>
                                </PrimaryButton>
                            </Link>
                        </div>

                        {/* Îlot 1 : Résumé / Alertes */}
                        {echeancesCetteSemaine > 0 && (
                            <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-5 mb-8 shadow-sm flex items-center gap-4 border border-red-100 dark:border-red-900/50">
                                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-full flex-shrink-0">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#29303d] dark:text-white text-lg">Attention aux échéances</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Il y a <span className="font-bold text-red-600 dark:text-red-400">{echeancesCetteSemaine}</span> chèque(s)/effet(s) à échéance dans les 7 prochains jours.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Îlot 2 : La Toolbar (Filtres) */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 lg:p-8 shadow-sm mb-8 border border-gray-100 dark:border-white/5">
                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recherche</label>
                                        <TextInput
                                            type="text"
                                            value={reference}
                                            onChange={(e) => setReference(e.target.value)}
                                            placeholder="Référence ou N° chèque..."
                                            className="w-full"
                                        />
                                    </div>
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
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</label>
                                        <SelectInput 
                                            className="w-full"
                                            value={statut}
                                            onChange={(e: any) => setStatut(e.target.value)}
                                        >
                                            <option value="">Tous les statuts</option>
                                            <option value="encaisse">Encaissé</option>
                                            <option value="en_attente">En attente</option>
                                            <option value="impaye">Impayé</option>
                                            <option value="rendu">Rendu</option>
                                        </SelectInput>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Échéance Du</label>
                                        <DatePicker
                                            selected={echeanceDebut ? new Date(echeanceDebut) : null}
                                            onChange={(d) => {
                                                if (d) {
                                                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                                                    setEcheanceDebut(d.toISOString().split('T')[0]);
                                                } else {
                                                    setEcheanceDebut('');
                                                }
                                            }}
                                            placeholderText="Début échéance"
                                            isClearable
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Échéance Au</label>
                                        <DatePicker
                                            selected={echeanceFin ? new Date(echeanceFin) : null}
                                            onChange={(d) => {
                                                if (d) {
                                                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                                                    setEcheanceFin(d.toISOString().split('T')[0]);
                                                } else {
                                                    setEcheanceFin('');
                                                }
                                            }}
                                            placeholderText="Fin échéance"
                                            minDate={echeanceDebut ? new Date(echeanceDebut) : undefined}
                                            isClearable
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
                                    {(clientId || statut || dateDebut || dateFin || echeanceDebut || echeanceFin || reference) && (
                                        <button 
                                            type="button" 
                                            onClick={() => window.location.href = route('encaissements.index')} 
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

                        {/* Îlot 3 : Le Tableau */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 dark:border-white/5">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1f2430]">
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Montant (DH)</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mode</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Échéance</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Référence</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#1f2430]">
                                        {encaissements.data.map((enc: any) => (
                                            <tr key={enc.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{formatDateFr(enc.date)}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">{enc.client?.nom}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right font-black text-[#29303d] dark:text-white text-base">{enc.montant}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{enc.mode_paiement}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm">
                                                    {['cheque', 'effet'].includes(enc.mode_paiement) ? (
                                                        <span className={`font-semibold ${
                                                            !enc.date_echeance ? 'text-gray-900 dark:text-white' :
                                                            (() => {
                                                                const echeance = new Date(enc.date_echeance);
                                                                echeance.setHours(0, 0, 0, 0);
                                                                const today = new Date();
                                                                today.setHours(0, 0, 0, 0);
                                                                const diffDays = Math.ceil((echeance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                                                if (diffDays <= 0) return "text-emerald-600 dark:text-emerald-400";
                                                                if (diffDays <= 7) return "text-red-600 dark:text-red-400";
                                                                return "text-gray-900 dark:text-white";
                                                            })()
                                                        }`}>
                                                            {enc.date_echeance ? formatDateFr(enc.date_echeance) : '-'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300 dark:text-gray-600">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{enc.reference || '-'}</td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <SelectInput
                                                        value={enc.statut}
                                                        onChange={(e: any) => handleStatutChange(enc.id, e.target.value)}
                                                        className={`text-xs font-bold rounded-full py-1 pl-4 pr-10 !h-9 border-0 shadow-none cursor-pointer transition-all ${
                                                            enc.statut === 'encaisse' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50' : 
                                                            enc.statut === 'en_attente' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50' : 
                                                            enc.statut === 'impaye' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50' : 
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <option value="encaisse">Encaissé</option>
                                                        <option value="en_attente">En attente</option>
                                                        <option value="impaye">Impayé</option>
                                                        <option value="rendu">Rendu</option>
                                                    </SelectInput>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                                    <div className="flex justify-end items-center gap-2">
                                                        {/* Les actions restent toujours visibles */}
                                                        <Link href={route('encaissements.edit', enc.id)} title="Modifier" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                            <Edit size={16} />
                                                        </Link>
                                                        <button onClick={() => handleDelete(enc.id)} title="Supprimer" className="text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-white/5 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2.5 rounded-xl transition-all border border-gray-100 dark:border-white/10">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {encaissements.data.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <AlertCircle size={48} className="mb-4 opacity-30" />
                                                        <p className="text-lg font-medium text-gray-600">Aucun encaissement trouvé.</p>
                                                        <p className="text-sm mt-2">Modifiez vos filtres ou créez un nouvel encaissement.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination (Styled to match the new crisp layout) */}
                            {encaissements.links && encaissements.links.length > 3 && (
                                <div className="border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#1f2430] p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Affichage de <span className="text-gray-900 dark:text-white font-bold">{encaissements.from}</span> à <span className="text-gray-900 dark:text-white font-bold">{encaissements.to}</span> sur <span className="text-gray-900 dark:text-white font-bold">{encaissements.total}</span> résultats
                                    </div>
                                    <div className="flex gap-2">
                                        {encaissements.links.map((link: any, idx: number) => (
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
                        title="Supprimer l'encaissement"
                        message="Êtes-vous sûr de vouloir supprimer cet encaissement ? Cette action supprimera définitivement le paiement de l'historique du client."
                        confirmText="Supprimer"
                        type="danger"
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
