import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DatePicker from '@/Components/DatePicker';
import ClientSelect from '@/Components/ClientSelect';
import SelectInput from '@/Components/SelectInput';
import { getTodayDateCasablanca } from '@/utils/date';
import { useEffect } from 'react';

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
            <PageHeader 
                title="Saisie d'un Encaissement" 
                subtitle="Enregistrer un nouveau paiement reçu"
            />

            <div className="py-4">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                
                                <div>
                                    <InputLabel htmlFor="client_id" value="Client *" />
                                    <ClientSelect
                                        id="client_id"
                                        clients={clients}
                                        value={data.client_id}
                                        onChange={(val: any) => setData('client_id', val)}
                                        required
                                    />
                                    <InputError message={errors.client_id} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="date" value="Date *" />
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
                                        <InputLabel htmlFor="montant" value="Montant (DH) *" />
                                        <TextInput
                                            id="montant"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            className="mt-1 block w-full font-bold text-indigo-700"
                                            value={data.montant}
                                            onChange={e => setData('montant', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.montant} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="mode_paiement" value="Mode de paiement *" />
                                        <SelectInput
                                            id="mode_paiement"
                                            className="w-full"
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
                                        <InputLabel htmlFor="reference" value={`Référence ${isChequeOuEffet ? '*' : '(Optionnel)'}`} />
                                        <TextInput
                                            id="reference"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.reference}
                                            onChange={e => setData('reference', e.target.value)}
                                            placeholder={isChequeOuEffet ? "Obligatoire pour les chèques/effets" : "Optionnel"}
                                            required={isChequeOuEffet}
                                        />
                                        <InputError message={errors.reference} className="mt-2" />
                                    </div>
                                </div>

                                {isChequeOuEffet && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="date_echeance" value="Date d'échéance *" />
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
                                    </div>
                                )}

                                {['cheque', 'effet'].includes(data.mode_paiement) && (
                                    <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                                        <span className="font-bold">Information :</span> Le statut de cet encaissement sera défini sur "En attente" par défaut.
                                    </div>
                                )}
                                {['espece', 'versement', 'virement'].includes(data.mode_paiement) && (
                                    <div className="p-3 bg-green-50 text-green-800 rounded-md text-sm">
                                        <span className="font-bold">Information :</span> Le statut de cet encaissement sera défini sur "Encaissé" par défaut.
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="notes" value="Notes / Observations" />
                                    <textarea
                                        id="notes"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    ></textarea>
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Link href={route('encaissements.index')} className="text-gray-600 hover:text-gray-900 mr-4">
                                        Annuler
                                    </Link>
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Enregistrer
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
