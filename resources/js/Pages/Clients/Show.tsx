import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { formatDateFr } from '@/utils/date';
import DatePicker from '@/Components/DatePicker';
import SelectInput from '@/Components/SelectInput';

export default function Show({ client, timeline }: { client: any, timeline: any[] }) {
    const [filterType, setFilterType] = useState('all');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');

    const filteredTimeline = useMemo(() => {
        return timeline.filter(item => {
            if (filterType !== 'all' && item.type_doc !== filterType) return false;
            if (dateDebut && item.date < dateDebut) return false;
            if (dateFin && item.date > dateFin) return false;
            return true;
        });
    }, [timeline, filterType, dateDebut, dateFin]);

    return (
        <AuthenticatedLayout>
            <Head title={`Fiche ${client.nom}`} />
            <PageHeader 
                title={`Fiche Client : ${client.code_client} - ${client.nom} ${client.complement_ident ? `(${client.complement_ident})` : ''}`}
                subtitle="Détails du compte, solde et historique des transactions"
                action={
                    <div className="flex gap-3">
                        <Link
                            href={route('encaissements.create', { client_id: client.id })}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm transition"
                        >
                            + Nouveau Paiement
                        </Link>
                        <Link
                            href={route('bon-livraisons.create', { client_id: client.id })}
                            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 shadow-sm transition"
                        >
                            + Nouveau BL
                        </Link>
                    </div>
                }
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Récapitulatif Solde */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                            <span className="text-sm text-gray-500 uppercase font-semibold">Solde Initial</span>
                            <span className="text-2xl font-bold text-gray-900 mt-2">{Number(client.solde_initial).toFixed(2)} DH</span>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                            <span className="text-sm text-gray-500 uppercase font-semibold">Total Achats</span>
                            <span className="text-2xl font-bold text-gray-900 mt-2">
                                {Number(timeline.filter(t => t.type_doc === 'vente').reduce((sum, t) => sum + t.montant, 0)).toFixed(2)} DH
                            </span>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                            <span className="text-sm text-gray-500 uppercase font-semibold">Total Payé</span>
                            <span className="text-2xl font-bold text-green-600 mt-2">
                                {Number(timeline.filter(t => t.type_doc === 'encaissement' && !['impaye', 'annule', 'remplace'].includes(t.statut)).reduce((sum, t) => sum + Number(t.montant), 0)).toFixed(2)} DH
                            </span>
                        </div>
                        <div className={`p-6 rounded-lg shadow-sm border flex flex-col justify-center items-center ${client.solde > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <span className={`text-sm uppercase font-bold ${client.solde > 0 ? 'text-red-800' : 'text-green-800'}`}>
                                {client.solde > 0 ? 'Reste à payer (Dette)' : 'Crédit (Solde en faveur)'}
                            </span>
                            <span className={`text-3xl font-black mt-2 ${client.solde > 0 ? 'text-red-700' : 'text-green-700'}`}>
                                {Math.abs(client.solde).toFixed(2)} DH
                            </span>
                        </div>
                    </div>

                    {/* Timeline avec filtres */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6 text-gray-900 border-b border-gray-100">
                            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-2">
                                <h3 className="text-lg font-bold">Historique Chronologique</h3>
                                
                                <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-3 rounded-md">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Afficher</label>
                                        <SelectInput 
                                            className="w-full"
                                            value={filterType}
                                            onChange={(e: any) => setFilterType(e.target.value)}
                                        >
                                            <option value="all">Tout</option>
                                            <option value="vente">Ventes (BL) uniquement</option>
                                            <option value="encaissement">Paiements uniquement</option>
                                        </SelectInput>
                                    </div>
                                    <div className="min-w-[140px]">
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Du</label>
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
                                            placeholderText="Date début"
                                            isClearable
                                        />
                                    </div>
                                    <div className="min-w-[140px]">
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Au</label>
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
                                            placeholderText="Date fin"
                                            minDate={dateDebut ? new Date(dateDebut) : undefined}
                                            isClearable
                                        />
                                    </div>
                                    {(filterType !== 'all' || dateDebut || dateFin) && (
                                        <button 
                                            className="text-xs text-gray-500 hover:text-gray-900 underline mb-2"
                                            onClick={() => { setFilterType('all'); setDateDebut(''); setDateFin(''); }}
                                        >
                                            Réinitialiser
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réf / Détails</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut / Mode</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Débit (Achat)</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Crédit (Paiement)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTimeline.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Aucune transaction trouvée pour ces filtres.</td>
                                            </tr>
                                        ) : (
                                            filteredTimeline.map((item, idx) => (
                                                <tr key={idx} className={`hover:bg-gray-50 transition ${item.type_doc === 'encaissement' && ['impaye', 'annule', 'remplace'].includes(item.statut) ? 'opacity-50 line-through' : ''} ${item.type_doc === 'remise' ? 'bg-blue-50/30' : ''}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateFr(item.date)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                                        {item.type_doc === 'vente' ? (
                                                            <Link href={route('bon-livraisons.show', item.id)} className="text-indigo-600 hover:underline">BL #{item.numero}</Link>
                                                        ) : item.type_doc === 'encaissement' ? (
                                                            <span className="text-green-600">Paiement</span>
                                                        ) : (
                                                            <span className="text-blue-600">Remise Annuelle</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.type_doc === 'vente' ? item.details : item.type_doc === 'remise' ? `Exercice ${item.numero}` : item.numero || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {item.type_doc === 'encaissement' ? (
                                                            <div className="flex gap-2 items-center">
                                                                <span className="capitalize font-medium text-gray-600">{item.mode}</span>
                                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                                    item.statut === 'encaisse' ? 'bg-green-100 text-green-800' :
                                                                    item.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>{item.statut}</span>
                                                            </div>
                                                        ) : item.type_doc === 'remise' ? (
                                                            <span className="text-blue-500 italic">Validée</span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-red-600">
                                                        {item.type_doc === 'vente' ? Number(item.montant).toFixed(2) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">
                                                        {['encaissement', 'remise'].includes(item.type_doc) ? Number(item.montant).toFixed(2) : '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
