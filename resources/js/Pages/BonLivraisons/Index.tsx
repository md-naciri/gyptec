import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import FilterCard from '@/Components/FilterCard';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { formatDateFr } from '@/utils/date';
import DatePicker from '@/Components/DatePicker';

export default function Index({ bons, filters }: { bons: any, filters: any }) {
    const { delete: destroy } = useForm();
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
            date_debut: dateDebut,
            date_fin: dateFin 
        }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bons de Livraison" />
            <PageHeader 
                title="Bons de Livraison (Ventes)" 
                subtitle="Historique des ventes et expéditions"
                action={
                    <Link
                        href={route('bon-livraisons.create')}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition shadow-sm font-medium"
                    >
                        + Nouveau BL
                    </Link>
                }
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    <FilterCard>
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">N° BL</label>
                                <TextInput 
                                    type="text" 
                                    value={numero} 
                                    onChange={e => setNumero(e.target.value)}
                                    className="w-full"
                                    placeholder="Rechercher..."
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Camion</label>
                                <TextInput 
                                    type="text" 
                                    value={camion} 
                                    onChange={e => setCamion(e.target.value)}
                                    className="w-full"
                                    placeholder="Rechercher..."
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
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
                            <div className="flex-1 min-w-[150px]">
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
                            <PrimaryButton type="submit">
                                Filtrer
                            </PrimaryButton>
                            {(numero || camion || dateDebut || dateFin) && (
                                <Link href={route('bon-livraisons.index')} className="text-gray-500 hover:text-gray-700 underline text-sm ml-2 pb-2 h-9 flex items-center">
                                    Réinitialiser
                                </Link>
                            )}
                        </form>
                    </FilterCard>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-0 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° BL</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camion</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nb Lignes</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bons.data.map((bon: any) => (
                                            <tr key={bon.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDateFr(bon.date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bon.numero_bl || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bon.matricule_camion || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                                                        {bon.lignes.length}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bon.user?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('bon-livraisons.show', bon.id)} title="Détails" className="text-gray-600 hover:text-primary-600 bg-gray-50 p-1.5 rounded-md hover:bg-primary-50 transition-colors">
                                                            <Eye size={18} />
                                                        </Link>
                                                        <button onClick={() => handleDelete(bon.id)} title="Supprimer" className="text-gray-600 hover:text-red-600 bg-gray-50 p-1.5 rounded-md hover:bg-red-50 transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {bons.data.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Aucun bon de livraison trouvé.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination simple si > 1 page */}
                            {bons.links && bons.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-1">
                                        {bons.links.map((link: any, idx: number) => (
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
                        title="Supprimer le bon de livraison"
                        message="Êtes-vous sûr de vouloir supprimer ce bon de livraison ? Cette action est irréversible."
                        confirmText="Supprimer"
                        type="danger"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
