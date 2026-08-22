import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check, Search, Calculator, AlertCircle, TrendingDown } from 'lucide-react';

export default function RemisesCalculs({ annee, calculsData }: any) {
    const [selectedAnnee, setSelectedAnnee] = useState(annee);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [remiseToValidate, setRemiseToValidate] = useState<{clientId: number, montant: number, nom: string} | null>(null);

    const filteredData = calculsData.filter((calc: any) => 
        calc.client_nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const confirmValidation = (clientId: number, montant: number, nom: string) => {
        setRemiseToValidate({ clientId, montant, nom });
        setShowConfirm(true);
    };

    const validerRemise = () => {
        if (remiseToValidate) {
            router.post(route('remises.valider'), {
                client_id: remiseToValidate.clientId,
                annee: selectedAnnee,
                montant: remiseToValidate.montant
            }, { preserveScroll: true, onFinish: () => setShowConfirm(false) });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Calculs Remises" />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    
                    {/* La "Super Card" */}
                    <div className="bg-[#ecebe8] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50">
                        
                        {/* En-tête interne */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] tracking-tight mb-2">Calculs & Validation</h1>
                                <p className="text-gray-600 text-lg">Application automatique des remises sur les soldes clients</p>
                            </div>
                        </div>

                        {/* Îlot 1 : Toolbar (Filtres & Info) */}
                        <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm mb-8 flex flex-col lg:flex-row justify-between items-center gap-6">
                            <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-1/3 flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exercice</label>
                                    <SelectInput 
                                        className="w-full h-11"
                                        value={selectedAnnee}
                                        onChange={(e: any) => {
                                            setSelectedAnnee(e.target.value);
                                            router.get(route('remises.calculs'), { annee: e.target.value });
                                        }}
                                    >
                                        {[2024, 2025, 2026, 2027, 2028].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </SelectInput>
                                </div>
                                <div className="w-full sm:w-2/3 flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recherche Rapide</label>
                                    <div className="relative">
                                        <TextInput
                                            type="text"
                                            placeholder="Rechercher un client..."
                                            className="w-full pl-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800 flex items-start gap-3">
                                <Calculator size={20} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                                <p className="font-medium">
                                    Les remises sont calculées automatiquement : (Tonnage acheté x Barème). <br/>
                                    <strong>La validation déduit définitivement</strong> le montant du solde du client.
                                </p>
                            </div>
                        </div>

                        {/* Îlot 2 : Tableau des calculs */}
                        <div className="bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100">
                            
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-lg text-[#29303d]">Détails des remises pour {selectedAnnee}</h3>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-5 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-5 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">Détail du calcul (Tonnage x Taux)</th>
                                            <th className="px-6 py-5 border-b border-gray-100 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Montant Total (DH)</th>
                                            <th className="px-6 py-5 border-b border-gray-100 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredData.length > 0 ? (
                                            filteredData.map((calc: any) => (
                                                <tr key={calc.client_id} className={`transition-colors ${calc.est_validee ? 'bg-emerald-50/20' : 'hover:bg-gray-50/50 group'}`}>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${calc.est_validee ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors'}`}>
                                                                {calc.est_validee ? <Check size={20} /> : <TrendingDown size={20} />}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-[#29303d] text-[15px]">{calc.client_nom}</div>
                                                                {calc.est_validee && (
                                                                    <span className="inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">Déjà Validée</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-gray-600">
                                                        <div className="flex flex-col gap-1">
                                                            {calc.details.filter((d:any) => d.taux > 0 && d.tonnage > 0).map((d: any, idx: number) => (
                                                                <div key={idx} className="flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                                    <span className="font-medium text-gray-500">Prod #{d.produit_id} :</span>
                                                                    <span className="font-bold text-gray-700">{Number(d.tonnage).toLocaleString('fr-FR')} T</span>
                                                                    <span className="text-gray-400">×</span>
                                                                    <span className="font-bold text-gray-700">{Number(d.taux).toLocaleString('fr-FR')} DH</span>
                                                                    <span className="text-gray-400">=</span>
                                                                    <span className="font-black text-indigo-600">{Number(d.montant).toLocaleString('fr-FR')} DH</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className={`px-6 py-5 whitespace-nowrap text-right font-black text-lg ${calc.est_validee ? 'text-emerald-600' : 'text-[#29303d]'}`}>
                                                        {Number(calc.total_remise).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                                        {!calc.est_validee ? (
                                                            <PrimaryButton
                                                                type="button"
                                                                onClick={() => confirmValidation(calc.client_id, calc.total_remise, calc.client_nom)}
                                                                className="!bg-indigo-600 hover:!bg-indigo-700 !px-4 !h-10 !rounded-xl gap-2 shadow-md shadow-indigo-500/20"
                                                            >
                                                                <Check size={16} />
                                                                <span>Valider & Déduire</span>
                                                            </PrimaryButton>
                                                        ) : (
                                                            <span className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-bold gap-2">
                                                                <Check size={16} /> Appliquée
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <AlertCircle size={48} className="mb-4 opacity-30" />
                                                        <p className="text-lg font-medium text-gray-600">Aucune remise à calculer pour cette année.</p>
                                                        <p className="text-sm mt-2">Vérifiez que des BL ont été saisis et que les barèmes sont configurés.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div> {/* Fin Super Card */}

                    <ConfirmModal 
                        show={showConfirm}
                        onClose={() => setShowConfirm(false)}
                        onConfirm={validerRemise}
                        title="Validation de la remise annuelle"
                        message={`Êtes-vous sûr de vouloir valider cette remise de ${Number(remiseToValidate?.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH pour ${remiseToValidate?.nom} ? Cette action est irréversible. Une transaction de type "Remise" sera ajoutée à l'historique du client et son solde sera automatiquement mis à jour.`}
                        confirmText="Confirmer et déduire"
                        type="info"
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
