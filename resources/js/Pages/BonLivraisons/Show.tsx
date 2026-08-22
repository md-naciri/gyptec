import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatDateFr } from '@/utils/date';
import { FileText, MapPin, Truck, User, Calendar, Map, ChevronLeft, Printer, Box } from 'lucide-react';

export default function Show({ bon }: { bon: any }) {
    const total = bon.lignes.reduce((sum: number, l: any) => sum + parseFloat(l.montant), 0);

    return (
        <AuthenticatedLayout>
            <Head title={`Détails BL ${bon.numero_bl ? `#${bon.numero_bl}` : ''}`} />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* Actions de retour et impression */}
                    <div className="flex justify-between items-center mb-6">
                        <Link href={route('bon-livraisons.index')} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#29303d] transition-colors">
                            <ChevronLeft size={16} className="mr-1" />
                            Retour à la liste des Ventes
                        </Link>
                        <button className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors">
                            <Printer size={16} />
                            Imprimer ce document
                        </button>
                    </div>

                    {/* La "Super Card" */}
                    <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5">
                        
                        {/* En-tête interne */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 dark:bg-indigo-900/30 text-white dark:text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] dark:text-white tracking-tight mb-2">
                                        Bon de Livraison
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-white dark:bg-[#1f2430] px-3 py-1 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                                            N° {bon.numero_bl || 'N/A'}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            Créé le {formatDateFr(bon.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-indigo-50 dark:bg-[#1f2430] px-6 py-4 rounded-2xl border border-indigo-100 dark:border-white/5 flex flex-col items-end">
                                <span className="text-sm font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider mb-1">Montant Total</span>
                                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-lg">DH</span></span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                            
                            {/* Informations de Logistique & Traçabilité */}
                            <div className="xl:col-span-1 space-y-6">
                                <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-white/5 h-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#181c25] text-gray-500 dark:text-gray-400 flex items-center justify-center">
                                            <Truck size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#29303d] dark:text-white">Logistique & Infos</h3>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <MapPin size={20} className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Destination</p>
                                                <p className="font-bold text-[#29303d] dark:text-white">{bon.destination || 'Non spécifiée'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <Map size={20} className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Zone Géographique</p>
                                                <p className="font-bold text-[#29303d] dark:text-white">{bon.zone || 'Non spécifiée'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <Truck size={20} className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Matricule Camion</p>
                                                <p className="font-bold text-[#29303d] dark:text-white">{bon.matricule_camion || 'Non spécifié'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                                            <User size={20} className="text-indigo-400 dark:text-indigo-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider mb-1">Créé par</p>
                                                <p className="font-bold text-indigo-900 dark:text-indigo-300">{bon.user?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lignes du BL */}
                            <div className="xl:col-span-2">
                                <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5 h-full flex flex-col overflow-hidden">
                                    <div className="p-6 lg:p-8 border-b border-gray-100 dark:border-white/5 flex items-center gap-3 bg-gray-50/50 dark:bg-[#181c25]/50">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                            <Box size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#29303d] dark:text-white">Détail des expéditions</h3>
                                    </div>
                                    
                                    <div className="overflow-x-auto flex-1">
                                        <table className="min-w-full">
                                            <thead className="bg-white dark:bg-[#1f2430]">
                                                <tr className="border-b border-gray-100 dark:border-white/5">
                                                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                                                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produit</th>
                                                    <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qté</th>
                                                    <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix U.</th>
                                                    <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Montant</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#1f2430]">
                                                {bon.lignes.map((ligne: any) => (
                                                    <tr key={ligne.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="font-bold text-[#29303d] dark:text-white text-[15px]">{ligne.client?.nom}</div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="font-bold text-gray-700 dark:text-gray-300 text-[14px]">{ligne.produit?.nom}</div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            {ligne.type === 'echantillon' ? (
                                                                <span className="inline-flex px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-md">Échantillon</span>
                                                            ) : (
                                                                <span className="inline-flex px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-md">Vente</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right font-black text-gray-700 dark:text-gray-300">
                                                            {ligne.quantite} <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{ligne.produit?.unite}</span>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right font-medium text-gray-500 dark:text-gray-400">
                                                            {Number(ligne.prix_unitaire).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right font-black text-[#29303d] dark:text-white text-[15px]">
                                                            {Number(ligne.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50/80 dark:bg-[#181c25]/80">
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-6 text-right text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TOTAL GÉNÉRAL</td>
                                                    <td className="px-6 py-6 text-right text-2xl font-black text-indigo-700 dark:text-indigo-400">{total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div> {/* Fin Super Card */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
