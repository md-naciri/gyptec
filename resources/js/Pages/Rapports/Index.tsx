import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import FilterCard from '@/Components/FilterCard';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';

export default function RapportsIndex({ clients, rapportData, filters, kpis }: any) {
    const [dateDebut, setDateDebut] = useState(filters.date_debut || '');
    const [dateFin, setDateFin] = useState(filters.date_fin || '');
    const [clientId, setClientId] = useState(filters.client_id || '');
    const [soldeFilter, setSoldeFilter] = useState('all'); // all, debiteur, crediteur

    const handleFilter = () => {
        router.get(route('rapports.index'), {
            date_debut: dateDebut,
            date_fin: dateFin,
            client_id: clientId,
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setDateDebut('');
        setDateFin('');
        setClientId('');
        setSoldeFilter('all');
        router.get(route('rapports.index'));
    };

    const filteredData = rapportData.filter((client: any) => {
        if (soldeFilter === 'debiteur' && client.solde_actuel <= 0) return false;
        if (soldeFilter === 'crediteur' && client.solde_actuel >= 0) return false;
        return true;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Rapports" />
            <PageHeader 
                title="Rapports Financiers & Balances" 
                subtitle="Analyse globale de l'activité, chiffre d'affaires et soldes clients"
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filtres */}
                    <FilterCard>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="w-full md:w-1/3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client (Optionnel)</label>
                                <ClientSelect
                                    clients={clients}
                                    value={clientId}
                                    onChange={(val: any) => setClientId(val)}
                                    placeholder="Tous les clients"
                                />
                            </div>
                            <div className="w-full md:w-1/3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Période (Du / Au)</label>
                                <DatePicker
                                    isRange={true}
                                    startDate={dateDebut ? new Date(dateDebut) : null}
                                    endDate={dateFin ? new Date(dateFin) : null}
                                    onRangeChange={({ startDate, endDate }) => {
                                        const format = (d: Date | null) => {
                                            if (!d) return '';
                                            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                                            return d.toISOString().split('T')[0];
                                        };
                                        setDateDebut(format(startDate));
                                        setDateFin(format(endDate));
                                    }}
                                />
                            </div>
                            <div className="flex gap-2">
                                <PrimaryButton onClick={handleFilter}>
                                    Filtrer
                                </PrimaryButton>
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 h-10 text-sm font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                >
                                    Réinitialiser
                                </button>
                            </div>
                        </div>
                    </FilterCard>

                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-sm font-medium text-gray-500 uppercase">Chiffre d'Affaires (Période)</p>
                            <p className="text-2xl font-bold text-indigo-600">{Number(kpis.total_ca).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-sm font-medium text-gray-500 uppercase">Total Encaissé (Période)</p>
                            <p className="text-2xl font-bold text-green-600">{Number(kpis.total_encaisse).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-sm font-medium text-gray-500 uppercase">Solde Global (Actuel)</p>
                            <p className={`text-2xl font-bold ${kpis.total_solde > 0 ? 'text-red-600' : kpis.total_solde < 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                                {Number(Math.abs(kpis.total_solde)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                                {kpis.total_solde > 0 && <span className="text-sm ml-2 font-normal text-gray-500">(Nous est dû)</span>}
                                {kpis.total_solde < 0 && <span className="text-sm ml-2 font-normal text-gray-500">(En crédit)</span>}
                            </p>
                        </div>
                    </div>

                    {/* Tableau */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden border border-gray-200">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Détails par Client</h3>
                            <div className="w-full sm:w-auto min-w-[200px]">
                                <SelectInput 
                                    className="w-full"
                                    value={soldeFilter}
                                    onChange={(e: any) => setSoldeFilter(e.target.value)}
                                >
                                    <option value="all">Tous les clients</option>
                                    <option value="debiteur">Clients Débiteurs (Dettes &gt; 0)</option>
                                    <option value="crediteur">Clients Créditeurs (Solde &lt; 0)</option>
                                </SelectInput>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">CA (Période)</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Encaissé (Période)</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Solde Actuel</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((client: any) => (
                                            <tr key={client.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {client.code_client} - {client.nom}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                    {Number(client.ca_total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                    {Number(client.encaisse_total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${client.solde_actuel > 0 ? 'text-red-600' : client.solde_actuel < 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                                                    {Number(client.solde_actuel).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    {client.solde_actuel > 0 ? (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Débiteur</span>
                                                    ) : client.solde_actuel < 0 ? (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Créditeur</span>
                                                    ) : (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">À jour</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                Aucune donnée ne correspond aux critères.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
