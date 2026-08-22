import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';
import SelectInput from '@/Components/SelectInput';
import { ChevronLeft, Wallet, FileText, CheckCircle2, Clock, Save } from 'lucide-react';

export default function Edit({ clients, encaissement }: { clients: any[], encaissement: any }) {
    const { data, setData, put, processing, errors } = useForm({
        client_id: encaissement.client_id || '',
        date: encaissement.date || new Date().toISOString().split('T')[0],
        date_echeance: encaissement.date_echeance || '',
        montant: encaissement.montant || '',
        mode_paiement: encaissement.mode_paiement || 'espece',
        reference: encaissement.reference || '',
        notes: encaissement.notes || ''
    });

    const isChequeOuEffet = data.mode_paiement === 'cheque' || data.mode_paiement === 'effet';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('encaissements.update', encaissement.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Modifier l'Encaissement" />

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
                        <div className="bg-[#ecebe8] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50">
                            
                            {/* En-tête interne */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] tracking-tight mb-2">Modifier l'Encaissement</h1>
                                    <p className="text-gray-600 text-lg">Mise à jour des informations de paiement</p>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <Wallet size={32} />
                                </div>
                            </div>

                            {/* Îlot Principal du formulaire */}
                            <div className="bg-white rounded-[1.5rem] p-6 lg:p-10 shadow-sm border border-gray-100">
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
                                                className="block w-full h-12 text-xl font-black text-emerald-600 focus:ring-emerald-500 focus:border-emerald-500"
                                                value={data.montant}
                                                onChange={e => setData('montant', e.target.value)}
                                                placeholder="0.00"
                                                required
                                            />
                                            <InputError message={errors.montant} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gray-100 my-4"></div>

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
                                                className="block w-full h-12"
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
                                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                                                <Clock size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-amber-800 text-sm">Mode à échéance sélectionné</h4>
                                                    <p className="text-amber-700 text-sm mt-1">S'il est déjà encaissé, vous devrez valider son statut depuis la liste après modification.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                                                <CheckCircle2 size={20} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-indigo-800 text-sm">Mode direct sélectionné</h4>
                                                    <p className="text-indigo-700 text-sm mt-1">L'encaissement restera validé (ou deviendra validé s'il était en attente).</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full h-px bg-gray-100 my-4"></div>

                                    {/* Section 3 : Notes */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText size={16} className="text-gray-400" />
                                            <InputLabel htmlFor="notes" value="Notes / Observations" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-0" />
                                        </div>
                                        <textarea
                                            id="notes"
                                            className="block w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm text-[15px]"
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
                                <Link href={route('encaissements.index')} className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 font-bold transition-colors text-center">
                                    Annuler
                                </Link>
                                <PrimaryButton disabled={processing} className="w-full sm:w-auto !bg-[#29303d] hover:!bg-black !h-12 !px-8 !rounded-xl gap-2 text-base">
                                    <Save size={18} />
                                    <span>Enregistrer les modifications</span>
                                </PrimaryButton>
                            </div>

                        </div> {/* Fin Super Card */}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
