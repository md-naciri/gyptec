import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard({ kpis, evolutionAnnuelle, repartitionProduits, topClientsEndettes, listeEcheances = [] }: any) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <PageHeader 
                title="Tableau de Bord Analytique" 
                subtitle="Aperçu global des performances et des alertes" 
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Ligne 1: Cartes KPI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Chiffre d'Affaires (Mois)</p>
                                <p className="text-3xl font-black text-indigo-700">{Number(kpis.ca_mensuel).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Encaissements (Mois)</p>
                                <p className="text-3xl font-black text-green-600">{Number(kpis.encaissements_mensuels).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200 bg-red-50 hover:shadow-md transition">
                            <div>
                                <p className="text-sm font-medium text-red-800 uppercase tracking-wider mb-1">Total Créances Clients</p>
                                <p className="text-3xl font-black text-red-700">{Number(kpis.total_creances).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</p>
                                <p className="text-xs text-red-600 mt-2 font-medium">Somme des dettes actives</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200 bg-yellow-50 hover:shadow-md transition">
                            <div>
                                <p className="text-sm font-medium text-yellow-800 uppercase tracking-wider mb-1">Échéances à 7 jours</p>
                                <p className="text-3xl font-black text-yellow-700">{Number(kpis.cheques_en_attente_total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</p>
                                <p className="text-xs text-yellow-700 mt-2 font-medium">({kpis.cheques_en_attente_count} chèques/effets)</p>
                            </div>
                        </div>
                    </div>

                    {/* Ligne 2: Graphiques */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* BarChart: CA vs Encaissements */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Évolution Ventes vs Encaissements (6 derniers mois)</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={evolutionAnnuelle} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `${value / 1000}k`} />
                                        <RechartsTooltip 
                                            formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} DH`, '']}
                                            cursor={{fill: '#f3f4f6'}}
                                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                        />
                                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                                        <Bar dataKey="Ventes" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                        <Bar dataKey="Encaissements" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* PieChart: Top Produits (Tonnage) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Top 5 Produits vendus ce mois (Tonnes)</h3>
                            <div className="flex-1 min-h-[250px] w-full flex justify-center items-center">
                                {repartitionProduits.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={repartitionProduits}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="Tonnage"
                                            >
                                                {repartitionProduits.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value: any) => [`${Number(value)} Tonnes`, 'Volume']} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-gray-500 text-sm">Aucune vente ce mois-ci.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ligne 3: Alertes et Échéances */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Top 5 Clients Endettés */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Top 5 - Créances Actives</h3>
                                <Link href={route('clients.index')} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">Voir tout &rarr;</Link>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Dette</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {topClientsEndettes.length > 0 ? (
                                            topClientsEndettes.map((client: any) => (
                                                <tr key={client.id} className="hover:bg-red-50 transition">
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                        {client.code_client} - {client.nom}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-black text-red-600 text-right">
                                                        {Number(client.solde).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link href={route('encaissements.create', { client_id: client.id })} className="text-green-600 hover:text-green-900 font-bold bg-green-100 px-3 py-1 rounded-full">Encaisser</Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">Aucune dette active.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Échéances Proches (7 jours) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Échéances (7 prochains jours)</h3>
                                <Link href={route('encaissements.index')} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">Voir tout &rarr;</Link>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date d'échéance</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client & Réf</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {listeEcheances.length > 0 ? (
                                            listeEcheances.map((enc: any) => (
                                                <tr key={enc.id} className="hover:bg-yellow-50 transition">
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                        {new Date(enc.date_echeance).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="font-medium text-gray-900">{enc.client}</div>
                                                        <div className="text-xs">{enc.mode_paiement.toUpperCase()} : {enc.reference || '-'}</div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-black text-yellow-600 text-right">
                                                        {Number(enc.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">Aucune échéance dans les 7 prochains jours.</td>
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
