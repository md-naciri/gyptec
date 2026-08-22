import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Wallet, AlertTriangle, Clock, ArrowRight, Activity, Box } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard({ kpis, evolutionAnnuelle, repartitionProduits, topClientsEndettes, listeEcheances = [] }: any) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* La "Super Card" */}
                    <div className="bg-[#ecebe8] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50">
                        
                        {/* En-tête interne */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] tracking-tight mb-2">Tableau de Bord</h1>
                                <p className="text-gray-600 text-lg">Aperçu global des performances et des alertes</p>
                            </div>
                        </div>

                        {/* Îlot 1 : KPIs (Stats) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group border border-gray-100">
                                <div className="absolute -right-4 -top-4 text-indigo-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                    <TrendingUp size={120} />
                                </div>
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3 relative z-10">
                                    <TrendingUp size={24} />
                                </div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 relative z-10">CA (Mois)</p>
                                <p className="text-3xl font-black text-[#29303d] relative z-10">{Number(kpis.ca_mensuel).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm text-gray-400 font-bold">DH</span></p>
                            </div>

                            <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group border border-gray-100">
                                <div className="absolute -right-4 -top-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                    <Wallet size={120} />
                                </div>
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 relative z-10">
                                    <Wallet size={24} />
                                </div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 relative z-10">Encaissements (Mois)</p>
                                <p className="text-3xl font-black text-emerald-600 relative z-10">{Number(kpis.encaissements_mensuels).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm text-gray-400 font-bold">DH</span></p>
                            </div>

                            <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group border border-rose-200">
                                <div className="absolute -right-4 -top-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                    <AlertTriangle size={120} />
                                </div>
                                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-3 relative z-10">
                                    <AlertTriangle size={24} />
                                </div>
                                <p className="text-xs font-bold text-rose-800 uppercase tracking-widest mb-1 relative z-10">Total Créances</p>
                                <p className="text-3xl font-black text-rose-600 relative z-10">{Number(kpis.total_creances).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm opacity-50 font-bold">DH</span></p>
                            </div>

                            <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group border border-amber-200">
                                <div className="absolute -right-4 -top-4 text-amber-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                    <Clock size={120} />
                                </div>
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3 relative z-10">
                                    <Clock size={24} />
                                </div>
                                <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1 relative z-10">Échéances (7J)</p>
                                <p className="text-3xl font-black text-amber-600 relative z-10">{Number(kpis.cheques_en_attente_total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm opacity-50 font-bold">DH</span></p>
                                <p className="text-xs font-bold text-amber-600/70 mt-1 relative z-10">({kpis.cheques_en_attente_count} éléments)</p>
                            </div>
                        </div>

                        {/* Îlot 2 : Graphiques */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            
                            {/* BarChart: CA vs Encaissements */}
                            <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#29303d]">Ventes vs Encaissements (6 derniers mois)</h3>
                                </div>
                                <div className="flex-1 h-80 w-full min-h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={evolutionAnnuelle} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} tickFormatter={(value) => `${value / 1000}k`} dx={-10} />
                                            <RechartsTooltip 
                                                formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} DH`, '']}
                                                cursor={{fill: '#f9fafb'}}
                                                contentStyle={{borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontWeight: 'bold'}}
                                            />
                                            <Legend wrapperStyle={{paddingTop: '30px'}} iconType="circle" />
                                            <Bar dataKey="Ventes" fill="#29303d" radius={[8, 8, 0, 0]} maxBarSize={40} />
                                            <Bar dataKey="Encaissements" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* PieChart: Top Produits (Tonnage) */}
                            <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Box size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#29303d]">Top 5 Produits (Ce mois)</h3>
                                </div>
                                <div className="flex-1 min-h-[300px] w-full flex justify-center items-center">
                                    {repartitionProduits.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={repartitionProduits}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="Tonnage"
                                                    stroke="none"
                                                >
                                                    {repartitionProduits.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip 
                                                    formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} Tonnes`, 'Volume']} 
                                                    contentStyle={{borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold'}}
                                                />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <AlertTriangle size={48} className="mb-4 opacity-30" />
                                            <p className="text-lg font-medium text-gray-600">Aucune vente ce mois-ci.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Îlot 3: Alertes et Échéances */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            
                            {/* Top 5 Clients Endettés */}
                            <div className="bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                                <div className="p-6 lg:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#29303d]">Créances Actives (Top 5)</h3>
                                    </div>
                                    <Link href={route('clients.index')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-4 py-2 rounded-full transition-colors">
                                        <span>Voir tout</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                                
                                <div className="overflow-x-auto flex-1">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-white">
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Dette</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {topClientsEndettes.length > 0 ? (
                                                topClientsEndettes.map((client: any) => (
                                                    <tr key={client.id} className="hover:bg-rose-50/30 transition-colors">
                                                        <td className="px-6 py-5 whitespace-nowrap text-[15px] font-bold text-[#29303d]">
                                                            {client.code_client} - {client.nom}
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-[15px] font-black text-rose-600 text-right">
                                                            {Number(client.solde).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <Link href={route('encaissements.create', { client_id: client.id })} className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold hover:bg-emerald-200 transition-colors">
                                                                Encaisser
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-12 text-center text-sm font-medium text-gray-500">Aucune dette active.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Échéances Proches (7 jours) */}
                            <div className="bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                                <div className="p-6 lg:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                                            <Clock size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#29303d]">Échéances (7J)</h3>
                                    </div>
                                    <Link 
                                        href={route('encaissements.index', { 
                                            statut: 'en_attente', 
                                            echeance_debut: new Date().toISOString().split('T')[0], 
                                            echeance_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
                                        })} 
                                        className="text-sm font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-4 py-2 rounded-full transition-colors"
                                    >
                                        <span>Voir tout</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                                
                                <div className="overflow-x-auto flex-1">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-white">
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date d'échéance</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client & Réf</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Montant</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {listeEcheances.length > 0 ? (
                                                listeEcheances.map((enc: any) => (
                                                    <tr key={enc.id} className="hover:bg-amber-50/30 transition-colors">
                                                        <td className="px-6 py-5 whitespace-nowrap text-[15px] font-bold text-[#29303d]">
                                                            {new Date(enc.date_echeance).toLocaleDateString('fr-FR')}
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="font-bold text-[#29303d] text-[14px]">{enc.client}</div>
                                                            <div className="text-xs font-medium text-gray-500 mt-0.5">{enc.mode_paiement.toUpperCase()} : {enc.reference || '-'}</div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-[15px] font-black text-amber-600 text-right">
                                                            {Number(enc.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-12 text-center text-sm font-medium text-gray-500">Aucune échéance dans les 7 prochains jours.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div> {/* Fin Super Card */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
