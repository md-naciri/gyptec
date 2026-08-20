import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import FilterCard from '@/Components/FilterCard';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function RemisesCalculs({ annee, calculsData }: any) {
    const [selectedAnnee, setSelectedAnnee] = useState(annee);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [remiseToValidate, setRemiseToValidate] = useState<{clientId: number, montant: number} | null>(null);

    const filteredData = calculsData.filter((calc: any) => 
        calc.client_nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const confirmValidation = (clientId: number, montant: number) => {
        setRemiseToValidate({ clientId, montant });
        setShowConfirm(true);
    };

    const validerRemise = () => {
        if (remiseToValidate) {
            router.post(route('remises.valider'), {
                client_id: remiseToValidate.clientId,
                annee: selectedAnnee,
                montant: remiseToValidate.montant
            }, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Calculs Remises" />
            <PageHeader 
                title="Calculs des Remises Annuelles" 
                subtitle="Validation et application des remises sur les soldes clients"
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <FilterCard className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <label className="font-medium text-gray-700 whitespace-nowrap">Année d'exercice :</label>
                            <SelectInput 
                                className="w-full sm:w-auto"
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
                        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-auto">
                            <TextInput
                                type="text"
                                placeholder="Rechercher un client..."
                                className="w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </FilterCard>

                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden border border-gray-200">
                        <div className="p-4 bg-gray-50 border-b">
                            <h3 className="font-bold text-gray-700">Remises calculées pour {selectedAnnee}</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détail du calcul (Tonnage x Taux)</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Total (DH)</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((calc: any) => (
                                            <tr key={calc.client_id} className={calc.est_validee ? 'bg-green-50/30' : 'hover:bg-gray-50'}>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {calc.client_nom}
                                                    {calc.est_validee && (
                                                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">Validée</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <ul className="list-disc list-inside">
                                                        {calc.details.filter((d:any) => d.taux > 0 && d.tonnage > 0).map((d: any, idx: number) => (
                                                            <li key={idx}>
                                                                Produit #{d.produit_id} : {d.tonnage} Tonnes x {d.taux} DH = <strong>{d.montant} DH</strong>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                                    {Number(calc.total_remise).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center">
                                                    {!calc.est_validee ? (
                                                        <PrimaryButton
                                                            type="button"
                                                            onClick={() => confirmValidation(calc.client_id, calc.total_remise)}
                                                            className="inline-flex items-center gap-1 !px-3 !py-1.5 !text-xs"
                                                        >
                                                            <Check size={14} />
                                                            Valider
                                                        </PrimaryButton>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-xs">Déjà validée</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                Aucune remise à calculer pour cette année (Vérifiez que des BL ont été saisis et que les barèmes sont configurés).
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <ConfirmModal 
                        show={showConfirm}
                        onClose={() => setShowConfirm(false)}
                        onConfirm={validerRemise}
                        title="Validation de remise"
                        message={`Êtes-vous sûr de vouloir valider la remise de ${remiseToValidate?.montant} DH pour ce client ? Cette action est irréversible et déduira le montant du solde du client.`}
                        confirmText="Valider & Déduire"
                        type="warning"
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
