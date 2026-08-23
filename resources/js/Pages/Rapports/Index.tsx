import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';
import { RefreshCw, TrendingUp, DollarSign, Wallet, AlertCircle, Download } from 'lucide-react';

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

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* La "Super Card" */}
                    <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5">
                        
                        {/* En-tête interne */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] dark:text-white tracking-tight mb-2">Rapports & Balances</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">Analyse globale de l'activité, chiffre d'affaires et soldes clients</p>
                            </div>
                            <div className="flex gap-3">
                                <a href={route('rapports.exportExcel', { date_debut: dateDebut, date_fin: dateFin, client_id: clientId, solde_filter: soldeFilter })} target="_blank" className="inline-flex items-center justify-center h-11 px-6 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors gap-2 text-sm shadow-sm border border-emerald-100 dark:border-emerald-800/30">
                                    <Download size={18} /> <span className="hidden sm:inline">Exporter Excel</span>
                                </a>
                            </div>
                        </div>

                        {/* Îlot 1 : Les KPIs (Stats) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-8 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group border border-gray-100 dark:border-white/5">
                                <div className="absolute -right-4 -top-4 text-indigo-50 dark:text-indigo-900/20 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                    <TrendingUp size={120} />
                                </div>
                                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 relative z-10">
                                    <TrendingUp size={28} />
                                </div>
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 relative z-10">Chiffre d'Affaires</p>
                                <p className="text-3xl font-black text-[#29303d] dark:text-white relative z-10">{Number(kpis.total_ca).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-lg text-gray-400 font-bold">DH</span></p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium relative z-10">Sur la période sélectionnée</p>
                            </div>

                            <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-8 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group border border-gray-100 dark:border-white/5">
                                <div className="absolute -right-4 -top-4 text-emerald-50 dark:text-emerald-900/20 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                    <DollarSign size={120} />
                                </div>
                                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 relative z-10">
                                    <DollarSign size={28} />
                                </div>
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 relative z-10">Total Encaissé</p>
                                <p className="text-3xl font-black text-[#29303d] dark:text-white relative z-10">{Number(kpis.total_encaisse).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-lg text-gray-400 font-bold">DH</span></p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium relative z-10">Sur la période sélectionnée</p>
                            </div>

                            <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-8 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group border border-gray-100 dark:border-white/5">
                                <div className="absolute -right-4 -top-4 text-rose-50 dark:text-rose-900/20 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                    <Wallet size={120} />
                                </div>
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 relative z-10 ${kpis.total_solde > 0 ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                    <Wallet size={28} />
                                </div>
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 relative z-10">Solde Global</p>
                                <p className={`text-3xl font-black relative z-10 ${kpis.total_solde > 0 ? 'text-rose-600 dark:text-rose-400' : kpis.total_solde < 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#29303d] dark:text-white'}`}>
                                    {Number(Math.abs(kpis.total_solde)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-lg opacity-50 font-bold">DH</span>
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium relative z-10">
                                    {kpis.total_solde > 0 ? 'Total dû par les clients' : kpis.total_solde < 0 ? 'Total en crédit chez les clients' : 'Aucun solde'}
                                </p>
                            </div>
                        </div>

                        {/* Îlot 2 : La Toolbar (Filtres) */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 lg:p-8 shadow-sm mb-8 border border-gray-100 dark:border-white/5">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client (Optionnel)</label>
                                        <ClientSelect
                                            clients={clients}
                                            value={clientId}
                                            onChange={(val: any) => setClientId(val)}
                                            placeholder="Tous les clients"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Période (Du / Au)</label>
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
                                </div>
                                <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <button 
                                        type="button" 
                                        onClick={resetFilters}
                                        className="text-gray-500 dark:text-gray-400 hover:text-[#29303d] dark:hover:text-white text-sm font-semibold h-11 px-6 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                        <RefreshCw size={16} />
                                        <span>Réinitialiser</span>
                                    </button>
                                    <PrimaryButton onClick={handleFilter} className="!bg-[#29303d] hover:!bg-black">
                                        Actualiser les données
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>

                        {/* Îlot 3 : Le Tableau détaillé */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 dark:border-white/5">
                            
                            {/* Sub-header pour le tableau */}
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-[#181c25]/50">
                                <h3 className="font-bold text-lg text-[#29303d] dark:text-white">Détails par Client</h3>
                                <div className="w-full sm:w-auto min-w-[250px]">
                                    <SelectInput 
                                        className="w-full !rounded-xl"
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
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1f2430]">
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">CA (Période)</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Encaissé (Période)</th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solde Actuel</th>
                                            <th className="px-6 py-5 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {filteredData.length > 0 ? (
                                            filteredData.map((client: any) => (
                                                <tr key={client.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="font-bold text-[#29303d] dark:text-white text-[15px]">
                                                            {client.code_client} - {client.nom}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-right font-medium text-gray-600 dark:text-gray-400">
                                                        {Number(client.ca_total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-right font-medium text-emerald-600 dark:text-emerald-400">
                                                        {Number(client.encaisse_total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className={`px-6 py-5 whitespace-nowrap text-right font-black text-base ${client.solde_actuel > 0 ? 'text-rose-600 dark:text-rose-400' : client.solde_actuel < 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#29303d] dark:text-white'}`}>
                                                        {Number(client.solde_actuel).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                                        {client.solde_actuel > 0 ? (
                                                            <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">Débiteur</span>
                                                        ) : client.solde_actuel < 0 ? (
                                                            <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">Créditeur</span>
                                                        ) : (
                                                            <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">À jour</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <AlertCircle size={48} className="mb-4 opacity-30" />
                                                        <p className="text-lg font-medium text-gray-600">Aucune donnée ne correspond aux critères.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div> {/* Fin Super Card */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
