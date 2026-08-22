import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import { formatDateFr } from '@/utils/date';
import DatePicker from '@/Components/DatePicker';
import SelectInput from '@/Components/SelectInput';
import { Plus, AlertCircle, RefreshCw, ChevronLeft, CreditCard, ShoppingBag, Receipt, Scale, Download, Printer, ChevronDown, ChevronUp, FileText, Box } from 'lucide-react';

export default function Show({ client, timeline }: { client: any, timeline: any[] }) {
    const [filterType, setFilterType] = useState('all');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [expandedAll, setExpandedAll] = useState(true);

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
            <Head title={`Fiche Client - ${client.nom}`} />
            
            <style>{`
                @media print {
                    @page { size: landscape; margin: 1cm; }
                }
            `}</style>

            <div className="py-8 lg:py-12 print:py-0 print:bg-white">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 print:px-0">
                    
                    {/* Bouton Retour */}
                    <div className="mb-6 print:hidden">
                        <Link href={route('clients.index')} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#29303d] transition-colors">
                            <ChevronLeft size={16} className="mr-1" />
                            Retour à la liste des clients
                        </Link>
                    </div>

                    {/* La "Super Card" */}
                    <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5 print:bg-transparent print:border-none print:shadow-none print:p-0">
                        {/* En-tête interne */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 print:mb-6">
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex w-16 h-16 rounded-full bg-white dark:bg-[#1f2430] shadow-sm border border-gray-100 dark:border-white/10 items-center justify-center text-xl font-black text-indigo-600 dark:text-indigo-400">
                                    {client.nom.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-black text-[#29303d] dark:text-white tracking-tight mb-1">
                                        {client.code_client} - {client.nom}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-base font-medium">
                                        {client.complement_ident ? client.complement_ident : 'Client Standard'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 print:hidden">
                                <a href={route('clients.exportExcel', client.id)} target="_blank" className="inline-flex items-center justify-center h-11 px-6 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors gap-2 text-sm shadow-sm border border-emerald-100 dark:border-emerald-800/30">
                                    <Download size={18} /> <span className="hidden sm:inline">Exporter Excel</span>
                                </a>
                                <button onClick={() => window.print()} className="inline-flex items-center justify-center h-11 px-6 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors gap-2 text-sm shadow-sm border border-gray-100 dark:border-white/10">
                                    <Printer size={18} /> <span className="hidden sm:inline">Imprimer</span>
                                </button>
                                <Link href={route('encaissements.create', { client_id: client.id })}>
                                    <PrimaryButton className="!h-11 !rounded-full !px-6 shadow-sm gap-2 !bg-emerald-600 hover:!bg-emerald-700">
                                        <Plus size={18} />
                                        <span className="hidden sm:inline">Nouveau Paiement</span>
                                    </PrimaryButton>
                                </Link>
                                <Link href={route('bon-livraisons.create', { client_id: client.id })}>
                                    <PrimaryButton className="!h-11 !rounded-full !px-6 shadow-sm gap-2 !bg-[#29303d] hover:!bg-black">
                                        <Plus size={18} />
                                        <span className="hidden sm:inline">Nouveau BL</span>
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>

                        {/* Encart Solde Initial (Point de départ) */}
                        <div className="bg-gray-50/80 dark:bg-[#1f2430] rounded-[1.5rem] border border-gray-100 dark:border-white/5 p-4 sm:px-6 flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#181c25] shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Solde Initial</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-gray-900 dark:text-white">
                                    {Number(client.solde_initial).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-xs text-gray-500 dark:text-gray-400">DH</span>
                                </p>
                            </div>
                        </div>

                        {/* Îlot 1 : KPIs (Stats du Client) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group border border-gray-100 dark:border-white/5">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-3">
                                    <ShoppingBag size={24} />
                                </div>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total Achats (BLs)</p>
                                <p className="text-2xl font-black text-[#29303d] dark:text-white">
                                    {Number(timeline.filter(t => t.type_doc === 'vente').reduce((sum, t) => sum + t.montant, 0)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm text-gray-400 font-bold">DH</span>
                                </p>
                            </div>
                            <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group border border-gray-100 dark:border-white/5">
                                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                                    <Receipt size={24} />
                                </div>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total Payé</p>
                                <p className="text-2xl font-black text-[#29303d] dark:text-white">
                                    {Number(timeline.filter(t => t.type_doc === 'encaissement' && !['impaye', 'annule', 'remplace'].includes(t.statut)).reduce((sum, t) => sum + Number(t.montant), 0)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm text-gray-400 font-bold">DH</span>
                                </p>
                            </div>
                            <div className={`rounded-[1.5rem] p-6 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group ${client.solde > 0 ? 'bg-rose-50 dark:bg-[#1f2430] border border-rose-100 dark:border-rose-900/50' : 'bg-indigo-50 dark:bg-[#1f2430] border border-indigo-100 dark:border-indigo-900/50'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${client.solde > 0 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                                    <CreditCard size={24} />
                                </div>
                                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${client.solde > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-indigo-700 dark:text-indigo-400'}`}>
                                    {client.solde > 0 ? 'Reste à Payer (Dette)' : 'Crédit Client'}
                                </p>
                                <p className={`text-2xl font-black ${client.solde > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                    {Math.abs(client.solde).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm opacity-50 font-bold">DH</span>
                                </p>
                            </div>
                        </div>

                        {/* Îlot 2 : Historique Chronologique (Timeline) */}
                        <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5 print:shadow-none print:border-none">
                            
                            {/* Toolbar des filtres Timeline */}
                            <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#181c25]/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 print:hidden rounded-t-[1.5rem]">
                                <h3 className="font-bold text-lg text-[#29303d] dark:text-white">Historique des Transactions</h3>
                                
                                <div className="flex flex-wrap gap-3 items-center">
                                    <div className="w-full sm:w-auto min-w-[200px]">
                                        <SelectInput 
                                            className="w-full !rounded-xl"
                                            value={filterType}
                                            onChange={(e: any) => setFilterType(e.target.value)}
                                        >
                                            <option value="all">Ventes et Paiements</option>
                                            <option value="vente">Ventes (BLs) uniquement</option>
                                            <option value="encaissement">Paiements uniquement</option>
                                        </SelectInput>
                                    </div>
                                    <div className="w-full sm:w-auto min-w-[150px]">
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
                                            placeholderText="Du (Date)"
                                            className="w-full !rounded-xl"
                                            isClearable
                                        />
                                    </div>
                                    <div className="w-full sm:w-auto min-w-[150px]">
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
                                            placeholderText="Au (Date)"
                                            className="w-full !rounded-xl"
                                            isClearable
                                        />
                                    </div>
                                    <button 
                                        onClick={() => setExpandedAll(!expandedAll)} 
                                        className="h-[42px] px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181c25] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold text-sm transition-colors flex items-center gap-2"
                                    >
                                        {expandedAll ? <><ChevronUp size={16} /> Tout replier</> : <><ChevronDown size={16} /> Tout développer</>}
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-visible print:overflow-visible">
                                <table className="w-full text-left border-collapse print:text-xs">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-[#1f2430] border-b border-gray-100 dark:border-white/5">
                                            <th className="px-3 sm:px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24 sm:w-32">Date</th>
                                            <th className="px-3 sm:px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Document</th>
                                            <th className="px-3 sm:px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Réf / Détails</th>
                                            <th className="px-3 sm:px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut / Mode</th>
                                            <th className="px-3 sm:px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Débit</th>
                                            <th className="px-3 sm:px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Crédit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 [&>tr:last-child>td:first-child]:rounded-bl-[1.5rem] [&>tr:last-child>td:last-child]:rounded-br-[1.5rem]">
                                        {filteredTimeline.length > 0 ? (
                                            filteredTimeline.map((item, idx) => {
                                                if (item.type_doc === 'vente') {
                                                    return (
                                                        <React.Fragment key={`${item.type_doc}-${item.id}-${idx}`}>
                                                            <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group">
                                                                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">{formatDateFr(item.date)}</td>
                                                                <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                                                            <ShoppingBag size={14} />
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-bold text-[#29303d] dark:text-white print:text-[11px]">Bon de Livraison</span>
                                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                                                                                <Box size={10} />
                                                                                {item.lignes_produit?.length || 0} prod.
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm">
                                                                    <Link href={route('bon-livraisons.show', item.id)} className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline">
                                                                        {item.numero}
                                                                    </Link>
                                                                </td>
                                                                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-300 dark:text-gray-600">
                                                                    -
                                                                </td>
                                                                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-right font-black text-rose-600 dark:text-rose-400">
                                                                    {Number(item.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                                </td>
                                                                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-right text-gray-300 dark:text-gray-600">-</td>
                                                            </tr>
                                                            {expandedAll && item.lignes_produit?.map((ligne: any, lIdx: number) => (
                                                                <tr key={`${idx}-ligne-${lIdx}`} className="bg-gray-50/30 dark:bg-[#181c25]/30">
                                                                    <td className="px-3 sm:px-6 py-2 border-l-2 border-blue-200 dark:border-blue-900/50"></td>
                                                                    <td colSpan={2} className="px-3 sm:px-6 py-2">
                                                                        <div className="flex items-center gap-2 pl-4 border-l-2 border-gray-200 dark:border-white/10">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                                                            <span className="text-[13px] text-gray-600 dark:text-gray-400 font-medium">
                                                                                <span className="font-bold text-gray-800 dark:text-white">{Number(ligne.quantite)} {ligne.unite}</span> × {ligne.produit_nom} × {Number(ligne.prix_unitaire).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                                                                                {ligne.type === 'echantillon' && <span className="ml-2 text-[10px] font-bold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">Éch.</span>}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-3 sm:px-6 py-2 text-[13px] text-gray-500 dark:text-gray-400 text-right" colSpan={2}>
                                                                        {Number(ligne.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                                    </td>
                                                                    <td className="px-3 sm:px-6 py-2"></td>
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    );
                                                } else if (item.type_doc === 'encaissement') {
                                                    return (
                                                        <tr key={`${item.type_doc}-${item.id}-${idx}`} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors group">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">{formatDateFr(item.date)}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-3">
                                                                        <Receipt size={14} />
                                                                    </div>
                                                                    <span className="font-bold text-[#29303d] dark:text-white">Paiement</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    {item.mode_paiement} {item.numero ? `- ${item.numero}` : ''}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                                    item.statut === 'encaisse' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                                    item.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                                }`}>
                                                                    {item.statut}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400 dark:text-gray-600">-</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right font-black text-emerald-600 dark:text-emerald-400">
                                                                {Number(item.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                            </td>
                                                        </tr>
                                                    );
                                                } else if (item.type_doc === 'remise') {
                                                    return (
                                                        <tr key={`${item.type_doc}-${item.id}-${idx}`} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors group">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">{formatDateFr(item.date)}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                                                                        <RefreshCw size={14} />
                                                                    </div>
                                                                    <span className="font-bold text-[#29303d] dark:text-white">Remise Annuelle</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    Exercice {item.numero}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                                    Validée
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400 dark:text-gray-600">-</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right font-black text-indigo-600 dark:text-indigo-400">
                                                                {Number(item.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                return null;
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <AlertCircle size={48} className="mb-4 opacity-30" />
                                                        <p className="text-lg font-medium text-gray-600">Aucune transaction trouvée.</p>
                                                    </div>
                                                </td>
                                            </tr>
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

