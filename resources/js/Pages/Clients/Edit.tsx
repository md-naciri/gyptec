import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import ConfirmModal from '@/Components/ConfirmModal';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';

export default function Edit({ client, users, existingNames = [] }: { client: any, users: any[], existingNames: string[] }) {
    const [showAlert, setShowAlert] = useState(false);
    const { data, setData, patch, processing, errors } = useForm({
        nom: client.nom || '',
        complement_ident: client.complement_ident || '',
        telephone: client.telephone || '',
        adresse: client.adresse || '',
        agent_referent_id: client.agent_referent_id || '',
        notes: client.notes || '',
        actif: client.actif,
        solde_initial: client.solde_initial || 0,
    });

    const isDoublon = existingNames.filter(n => n.toLowerCase() !== client.nom.toLowerCase()).map(n => n.toLowerCase()).includes(data.nom.trim().toLowerCase());

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isDoublon && !data.complement_ident.trim()) {
            setShowAlert(true);
            return;
        }
        patch(route('clients.update', client.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Modifier ${client.nom}`} />
            <PageHeader 
                title={`Modifier Client : ${client.nom}`} 
                subtitle="Mise à jour des informations du client"
            />

            <div className="py-4">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-8 text-gray-900">
                            <form onSubmit={submit} className="space-y-8">
                                
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Informations Générales</h3>
                                    
                                    {isDoublon && (
                                        <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-md text-sm">
                                            ⚠️ Un autre client nommé <strong>{data.nom}</strong> existe déjà en base de données. Pour valider, vous devez obligatoirement remplir le champ <strong>Complément d'identification</strong> afin de pouvoir les distinguer.
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="nom" value="Nom du client *" />
                                            <TextInput
                                                id="nom"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.nom}
                                                onChange={e => setData('nom', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.nom} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="complement_ident" value={`Complément d'identification ${isDoublon ? '*' : '(Optionnel)'}`} />
                                            <TextInput
                                                id="complement_ident"
                                                type="text"
                                                className={`mt-1 block w-full ${isDoublon ? 'border-orange-300 focus:border-orange-500 focus:ring-orange-500' : ''}`}
                                                placeholder="ex: Quartier, Ville, Raison sociale..."
                                                value={data.complement_ident}
                                                onChange={e => setData('complement_ident', e.target.value)}
                                                required={isDoublon}
                                            />
                                            <InputError message={errors.complement_ident} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="telephone" value="Téléphone" />
                                            <TextInput
                                                id="telephone"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.telephone}
                                                onChange={e => setData('telephone', e.target.value)}
                                            />
                                            <InputError message={errors.telephone} className="mt-2" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="adresse" value="Adresse" />
                                            <TextInput
                                                id="adresse"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.adresse}
                                                onChange={e => setData('adresse', e.target.value)}
                                            />
                                            <InputError message={errors.adresse} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Paramètres du Compte</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="agent_referent_id" value="Agent Référent" />
                                            <SelectInput
                                                id="agent_referent_id"
                                                className="w-full"
                                                value={data.agent_referent_id}
                                                onChange={(e: any) => setData('agent_referent_id', e.target.value)}
                                            >
                                                <option value="">-- Aucun --</option>
                                                {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </SelectInput>
                                            <InputError message={errors.agent_referent_id} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="solde_initial" value="Solde Initial (DH)" />
                                            <TextInput
                                                id="solde_initial"
                                                type="number"
                                                step="0.01"
                                                className="mt-1 block w-full"
                                                value={data.solde_initial}
                                                onChange={(e) => setData('solde_initial', e.target.value as any)}
                                            />
                                            <InputError className="mt-2" message={errors.solde_initial} />
                                            <p className="text-xs text-gray-500 mt-1 italic">
                                                Montant positif = le client nous doit de l'argent. <br/>
                                                Montant négatif (-) = le client est en crédit (avance).
                                            </p>
                                        </div>
                                    </div>
                                </div>

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

                                <div className="flex items-center">
                                    <input
                                        id="actif"
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        checked={data.actif}
                                        onChange={e => setData('actif', e.target.checked)}
                                    />
                                    <label htmlFor="actif" className="ml-2 text-sm text-gray-700 font-medium">
                                        Client actif
                                    </label>
                                </div>

                                <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                                    <Link href={route('clients.index')} className="text-gray-600 hover:text-gray-900 mr-4 font-medium transition">
                                        Annuler
                                    </Link>
                                    <PrimaryButton className="ml-4 px-6 py-3" disabled={processing}>
                                        Mettre à jour
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    <ConfirmModal 
                        show={showAlert}
                        onClose={() => setShowAlert(false)}
                        onConfirm={() => setShowAlert(false)}
                        title="Attention : Doublon détecté"
                        message="Un client avec ce nom existe déjà. Veuillez renseigner le complément d'identification pour pouvoir les distinguer."
                        confirmText="Compris"
                        type="warning"
                        hideCancel
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
