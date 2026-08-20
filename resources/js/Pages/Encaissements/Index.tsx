import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import FilterCard from '@/Components/FilterCard';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { formatDateFr } from '@/utils/date';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';

export default function Index({ encaissements, clients, filters, echeancesCetteSemaine }: { encaissements: any, clients: any[], filters: any, echeancesCetteSemaine: number }) {
    const { delete: destroy } = useForm();
    const [clientId, setClientId] = useState(filters.client_id || '');
    const [statut, setStatut] = useState(filters.statut || '');
    const [dateDebut, setDateDebut] = useState(filters.date_debut || '');
    const [dateFin, setDateFin] = useState(filters.date_fin || '');
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

    const getEcheanceColor = (dateStr: string, statut: string) => {
        if (!dateStr || statut !== 'en_attente') return 'text-gray-900';
        const echeance = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const in7Days = new Date(today);
        in7Days.setDate(today.getDate() + 7);
        
        if (echeance <= today) {
            return 'text-green-600 font-semibold';
        }
        if (echeance <= in7Days) {
            return 'text-red-600 font-semibold';
        }
        return 'text-gray-900';
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('encaissements.index'), { 
            client_id: clientId, 
            statut,
            date_debut: dateDebut,
            date_fin: dateFin
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
            <PageHeader 
                title="Encaissements" 
                subtitle="Suivi des paiements et des échéances clients"
                action={
                    <Link
                        href={route('encaissements.create')}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition shadow-sm font-medium"
                    >
                        + Nouvel Encaissement
                    </Link>
                }
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Filtres */}
                    <FilterCard>
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                            <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                                <ClientSelect
                                    clients={clients}
                                    value={clientId}
                                    onChange={(val: any) => setClientId(val || '')}
                                    placeholder="Tous les clients"
                                />
                            </div>
                            <div className="w-full sm:w-auto min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Du (Date)</label>
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
                            <div className="w-full sm:w-auto min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Au (Date)</label>
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
                            <div className="w-full sm:w-auto min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                <SelectInput 
                                    className="w-full"
                                    value={statut}
                                    onChange={(e: any) => setStatut(e.target.value)}
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="encaisse">Encaissé</option>
                                    <option value="en_attente">En attente</option>
                                    <option value="impaye">Impayé</option>
                                    <option value="remplace">Remplacé</option>
                                    <option value="annule">Annulé</option>
                                </SelectInput>
                            </div>
                            <PrimaryButton type="submit" className="mt-2 sm:mt-0">
                                Filtrer
                            </PrimaryButton>
                            {(clientId || statut || dateDebut || dateFin) && (
                                <Link href={route('encaissements.index')} className="text-gray-500 hover:text-gray-700 underline text-sm ml-2 pb-2 mt-2 sm:mt-0 h-10 flex items-center">
                                    Réinitialiser
                                </Link>
                            )}
                        </form>
                    </FilterCard>

                    {/* Résumé */}
                    {echeancesCetteSemaine > 0 && (
                        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-center shadow-sm">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700 font-medium">
                                    {echeancesCetteSemaine} chèque(s)/effet(s) à échéance dans les 7 prochains jours.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Tableau */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-0 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant (DH)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {encaissements.data.map((enc: any) => (
                                            <tr key={enc.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDateFr(enc.date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enc.client?.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">{enc.montant}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{enc.mode_paiement}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {['cheque', 'effet'].includes(enc.mode_paiement) ? (
                                                        <span className={getEcheanceColor(enc.date_echeance, enc.statut)}>
                                                            {enc.date_echeance ? formatDateFr(enc.date_echeance) : '-'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enc.reference || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <SelectInput
                                                        value={enc.statut}
                                                        onChange={(e: any) => handleStatutChange(enc.id, e.target.value)}
                                                        className={`text-xs font-bold rounded-full py-1 pl-3 pr-8 !h-8 border-0 ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 ${
                                                            enc.statut === 'encaisse' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                                                            enc.statut === 'en_attente' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' : 
                                                            enc.statut === 'impaye' ? 'bg-red-50 text-red-700 ring-red-600/10' : 
                                                            'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                        }`}
                                                    >
                                                        <option value="encaisse">Encaissé</option>
                                                        <option value="en_attente">En attente</option>
                                                        <option value="impaye">Impayé</option>
                                                        <option value="remplace">Remplacé</option>
                                                        <option value="annule">Annulé</option>
                                                    </SelectInput>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleDelete(enc.id)} title="Supprimer" className="text-gray-600 hover:text-red-600 bg-gray-50 p-1.5 rounded-md hover:bg-red-50 transition-colors inline-flex">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {encaissements.data.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">Aucun encaissement trouvé.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {encaissements.links && encaissements.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-1">
                                        {encaissements.links.map((link: any, idx: number) => (
                                            <Link 
                                                key={idx}
                                                href={link.url || '#'} 
                                                className={`px-3 py-1 border rounded ${link.active ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                        </div>
                    </div>

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
