import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import ConfirmModal from '@/Components/ConfirmModal';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import { ChevronLeft, UserPlus, FileText, Settings, Save, AlertTriangle, Phone, MapPin } from 'lucide-react';

export default function Create({ users, existingNames = [] }: { users: any[], existingNames: string[] }) {
    const [showAlert, setShowAlert] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        complement_ident: '',
        telephone: '',
        adresse: '',
        notes: '',
        actif: true,
        solde_initial: 0,
    });

    const isDoublon = existingNames.map(n => n.toLowerCase()).includes(data.nom.trim().toLowerCase());

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isDoublon && !data.complement_ident.trim()) {
            setShowAlert(true);
            return;
        }
        post(route('clients.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nouveau Client" />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
                    
                    {/* Bouton Retour */}
                    <div className="mb-6">
                        <Link href={route('clients.index')} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#29303d] transition-colors">
                            <ChevronLeft size={16} className="mr-1" />
                            Retour à la liste des Clients
                        </Link>
                    </div>

                    <form onSubmit={submit}>
                        {/* La "Super Card" */}
                        <div className="bg-[#ecebe8] dark:bg-[#181c25] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50 dark:border-white/5">
                            
                            {/* En-tête interne */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] dark:text-white tracking-tight mb-2">Ajouter un Client</h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">Créer un nouveau profil client</p>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <UserPlus size={32} />
                                </div>
                            </div>

                            {/* Îlot Principal : Infos générales */}
                            <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-white/5 mb-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#29303d] dark:text-white">Informations Générales</h3>
                                </div>
                                
                                {isDoublon && (
                                    <div className="mb-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 p-5 rounded-xl flex items-start gap-4">
                                        <AlertTriangle size={24} className="text-amber-500 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-1">Doublon détecté : "{data.nom}"</h4>
                                            <p className="text-sm">Un client avec ce nom exact existe déjà en base de données. Pour valider la création de ce nouveau client, vous devez obligatoirement remplir le champ <strong className="font-bold">Complément d'identification</strong> afin de pouvoir les distinguer.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="nom" value="Nom *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                        <TextInput
                                            id="nom"
                                            type="text"
                                            className="block w-full h-12 text-lg font-bold text-[#29303d] dark:text-white dark:bg-[#181c25] dark:border-white/10"
                                            value={data.nom}
                                            onChange={e => setData('nom', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.nom} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="complement_ident" value={`Raison Sociale ${isDoublon ? '*' : '(Optionnel)'}`} className={`font-bold uppercase tracking-wider text-xs mb-2 ${isDoublon ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`} />
                                        <TextInput
                                            id="complement_ident"
                                            type="text"
                                            className={`block w-full h-12 dark:text-white ${isDoublon ? 'border-amber-300 dark:border-amber-900/30 focus:border-amber-500 focus:ring-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'dark:bg-[#181c25] dark:border-white/10'}`}
                                            placeholder="ex: SARL..."
                                            value={data.complement_ident}
                                            onChange={e => setData('complement_ident', e.target.value)}
                                            required={isDoublon}
                                        />
                                        <InputError message={errors.complement_ident} className="mt-2" />
                                    </div>


                                    <div>
                                        <InputLabel htmlFor="telephone" value="Téléphone" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                        <div className="relative">
                                            <TextInput
                                                id="telephone"
                                                type="text"
                                                className="block w-full h-12 pl-11 dark:bg-[#181c25] dark:border-white/10 dark:text-white"
                                                value={data.telephone}
                                                onChange={e => setData('telephone', e.target.value)}
                                            />
                                            <Phone size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                        </div>
                                        <InputError message={errors.telephone} className="mt-2" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="adresse" value="Adresse complète" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                        <div className="relative">
                                            <TextInput
                                                id="adresse"
                                                type="text"
                                                className="block w-full h-12 pl-11 dark:bg-[#181c25] dark:border-white/10 dark:text-white"
                                                value={data.adresse}
                                                onChange={e => setData('adresse', e.target.value)}
                                            />
                                            <MapPin size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                        </div>
                                        <InputError message={errors.adresse} className="mt-2" />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="notes" value="Notes / Observations" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                        <textarea
                                            id="notes"
                                            className="block w-full border-gray-200 dark:border-white/10 dark:bg-[#181c25] dark:text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm text-[15px]"
                                            rows={3}
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            placeholder="Informations complémentaires..."
                                        ></textarea>
                                        <InputError message={errors.notes} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Îlot 2 : Paramètres et Solde */}
                            <div className="bg-white dark:bg-[#1f2430] rounded-[1.5rem] p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                                        <Settings size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#29303d] dark:text-white">Paramètres du Compte</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <InputLabel htmlFor="solde_initial" value="Solde Initial (DH)" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                        <TextInput
                                            id="solde_initial"
                                            type="number"
                                            step="0.01"
                                            className="block w-full h-12 font-black text-[#29303d] dark:text-white dark:bg-[#181c25] dark:border-white/10"
                                            value={data.solde_initial}
                                            onChange={(e) => setData('solde_initial', e.target.value as any)}
                                        />
                                        <InputError className="mt-2" message={errors.solde_initial} />
                                        <div className="mt-3 p-4 bg-slate-50 dark:bg-[#181c25] rounded-xl border border-slate-100 dark:border-white/5 text-sm">
                                            <ul className="space-y-2 text-slate-600">
                                                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div>Montant positif = le client nous doit de l'argent.</li>
                                                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Montant négatif (-) = le client est en crédit (avance).</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <InputLabel value="Statut du client" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-3" />
                                        <label className="flex items-center cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={data.actif}
                                                    onChange={e => setData('actif', e.target.checked)}
                                                />
                                                <div className={`block w-14 h-8 rounded-full transition-colors ${data.actif ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${data.actif ? 'transform translate-x-6' : ''}`}></div>
                                            </div>
                                            <div className="ml-4">
                                                <span className={`font-bold ${data.actif ? 'text-emerald-700' : 'text-gray-500'}`}>
                                                    {data.actif ? 'Compte Actif' : 'Compte Inactif'}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-0.5">Les clients inactifs n'apparaissent pas dans les listes de saisie.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions du formulaire */}
                            <div className="mt-10 flex flex-col sm:flex-row justify-end items-center gap-4">
                                <Link href={route('clients.index')} className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-[#1f2430] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white font-bold transition-colors text-center">
                                    Annuler
                                </Link>
                                <PrimaryButton disabled={processing} className="w-full sm:w-auto !bg-[#29303d] hover:!bg-black !h-12 !px-8 !rounded-xl gap-2 text-base">
                                    <Save size={18} />
                                    <span>Enregistrer le Client</span>
                                </PrimaryButton>
                            </div>

                        </div> {/* Fin Super Card */}
                    </form>

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
