import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';
import SelectInput from '@/Components/SelectInput';
import { getTodayDateCasablanca } from '@/utils/date';
import { ChevronLeft, Wallet, Info, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function Create({ clients, preselectedClientId }: { clients: any[], preselectedClientId: string | null }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: preselectedClientId || '',
        date: getTodayDateCasablanca(),
        date_echeance: '',
        montant: '',
        mode_paiement: 'espece',
        reference: '',
        notes: ''
    });

    const isChequeOuEffet = data.mode_paiement === 'cheque' || data.mode_paiement === 'effet';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('encaissements.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nouvel Encaissement" />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
                    
                    {/* Bouton Retour */}
                    <div className="mb-6">
                        <Link href={route('encaissements.index')} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#29303d] transition-colors">
                            <ChevronLeft size={16} className="mr-1" />
                            Retour à la liste des Encaissements
                        </Link>
                    </div>

                    <form onSubmit={submit}>
                        {/* La "Super Card" */}
                        <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5">
                            
                            {/* En-tête interne */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] dark:text-white tracking-tight mb-2">Nouvel Encaissement</h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">Enregistrer un nouveau paiement reçu</p>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                                    <Wallet size={32} />
                                </div>
                            </div>

                            {/* Îlot Principal du formulaire */}
                            <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-white/5">
                                <div className="space-y-8">
                                    
                                    {/* Section 1 : Client & Montant */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="client_id" value="Client *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                            <ClientSelect
                                                id="client_id"
                                                clients={clients}
                                                value={data.client_id}
                                                onChange={(val: any) => setData('client_id', val)}
                                                required
                                            />
                                            <InputError message={errors.client_id} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="date" value="Date d'encaissement *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                            <DatePicker
                                                id="date"
                                                selected={data.date ? new Date(data.date) : null}
                                                onChange={(d) => {
                                                    if (d) {
                                                        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                                                        setData('date', d.toISOString().split('T')[0]);
                                                    } else {
                                                        setData('date', '');
                                                    }
                                                }}
                                                required
                                            />
                                            <InputError message={errors.date} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="montant" value="Montant (DH) *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                            <TextInput
                                                id="montant"
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                className="block w-full h-12 text-xl font-black text-emerald-600 dark:text-emerald-400 dark:bg-[#181c25] dark:border-white/10 focus:ring-emerald-500 focus:border-emerald-500"
                                                value={data.montant}
                                                onChange={e => setData('montant', e.target.value)}
                                                placeholder="0.00"
                                                required
                                            />
                                            <InputError message={errors.montant} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-4"></div>

                                    {/* Section 2 : Mode de paiement & Réf */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <InputLabel htmlFor="mode_paiement" value="Mode de paiement *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                            <SelectInput
                                                id="mode_paiement"
                                                className="w-full h-12"
                                                value={data.mode_paiement}
                                                onChange={(e: any) => setData('mode_paiement', e.target.value)}
                                                required
                                            >
                                                <option value="espece">Espèce</option>
                                                <option value="versement">Versement</option>
                                                <option value="virement">Virement</option>
                                                <option value="cheque">Chèque</option>
                                                <option value="effet">Effet</option>
                                            </SelectInput>
                                            <InputError message={errors.mode_paiement} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="reference" value={`Référence ${isChequeOuEffet ? '*' : '(Optionnel)'}`} className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                            <TextInput
                                                id="reference"
                                                type="text"
                                                className="block w-full h-12 dark:bg-[#181c25] dark:border-white/10 dark:text-white"
                                                value={data.reference}
                                                onChange={e => setData('reference', e.target.value)}
                                                placeholder={isChequeOuEffet ? "N° chèque / effet obligatoire" : "Optionnel"}
                                                required={isChequeOuEffet}
                                            />
                                            <InputError message={errors.reference} className="mt-2" />
                                        </div>

                                        {isChequeOuEffet && (
                                            <div>
                                                <InputLabel htmlFor="date_echeance" value="Date d'échéance *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                                <DatePicker
                                                    id="date_echeance"
                                                    selected={data.date_echeance ? new Date(data.date_echeance) : null}
                                                    onChange={(d) => {
                                                        if (d) {
                                                            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                                                            setData('date_echeance', d.toISOString().split('T')[0]);
                                                        } else {
                                                            setData('date_echeance', '');
                                                        }
                                                    }}
                                                    required={isChequeOuEffet}
                                                />
                                                <InputError message={errors.date_echeance} className="mt-2" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Alertes de statut automatiques */}
                                    <div className="mt-4">
                                        {isChequeOuEffet ? (
                                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl flex items-start gap-3">
                                                <Clock size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm">Statut automatique : En attente</h4>
                                                    <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">Cet encaissement sera créé avec le statut "En attente" jusqu'à sa validation manuelle.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl flex items-start gap-3">
                                                <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">Statut automatique : Encaissé</h4>
                                                    <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-1">Cet encaissement sera considéré comme directement valide et déduit du solde client immédiatement.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-4"></div>

                                    {/* Section 3 : Notes */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText size={16} className="text-gray-400" />
                                            <InputLabel htmlFor="notes" value="Notes / Observations" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-0" />
                                        </div>
                                        <textarea
                                            id="notes"
                                            className="block w-full border-gray-200 dark:border-white/10 dark:bg-[#181c25] dark:text-white focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm text-[15px]"
                                            rows={3}
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            placeholder="Informations complémentaires..."
                                        ></textarea>
                                        <InputError message={errors.notes} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions du formulaire */}
                            <div className="mt-10 flex flex-col sm:flex-row justify-end items-center gap-4">
                                <Link href={route('encaissements.index')} className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-[#1f2430] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white font-bold transition-colors text-center">
                                    Annuler
                                </Link>
                                <PrimaryButton disabled={processing} className="w-full sm:w-auto !bg-[#29303d] hover:!bg-black !h-12 !px-8 !rounded-xl gap-2 text-base">
                                    <Wallet size={18} />
                                    <span>Enregistrer l'Encaissement</span>
                                </PrimaryButton>
                            </div>

                        </div> {/* Fin Super Card */}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
