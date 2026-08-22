import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { ChevronLeft, Box, PlusCircle, Settings, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        unite: 'tonne',
        prix_defaut: '',
        actif: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('produits.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nouveau Produit" />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
                    
                    {/* Bouton Retour */}
                    <div className="mb-6">
                        <Link href={route('produits.index')} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#29303d] transition-colors">
                            <ChevronLeft size={16} className="mr-1" />
                            Retour au Catalogue
                        </Link>
                    </div>

                    <form onSubmit={submit}>
                        {/* La "Super Card" */}
                        <div className="bg-[#ecebe8] rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200/50">
                            
                            {/* En-tête interne */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-[#29303d] tracking-tight mb-2">Ajouter un Produit</h1>
                                    <p className="text-gray-600 text-lg">Créer un nouvel article dans le catalogue</p>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <PlusCircle size={32} />
                                </div>
                            </div>

                            {/* Îlot 1 : Infos Générales */}
                            <div className="bg-white rounded-[1.5rem] p-6 lg:p-10 shadow-sm border border-gray-100 mb-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Box size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#29303d]">Informations Principales</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="nom" value="Nom du Produit *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                        <TextInput
                                            id="nom"
                                            className="block w-full h-12 text-lg font-bold text-[#29303d]"
                                            value={data.nom}
                                            onChange={(e) => setData('nom', e.target.value)}
                                            required
                                            isFocused
                                            placeholder="Ex: Plâtre de moulage"
                                        />
                                        <InputError className="mt-2" message={errors.nom} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="unite" value="Unité *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                            <SelectInput
                                                id="unite"
                                                className="block w-full h-12"
                                                value={data.unite}
                                                onChange={(e: any) => setData('unite', e.target.value)}
                                                required
                                            >
                                                <option value="tonne">Tonne</option>
                                                <option value="sac">Sac</option>
                                                <option value="kg">Kg</option>
                                            </SelectInput>
                                            <InputError className="mt-2" message={errors.unite} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="prix_defaut" value="Prix par Défaut (DH) *" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2" />
                                            <TextInput
                                                id="prix_defaut"
                                                type="number"
                                                step="0.01"
                                                className="block w-full h-12 font-black text-emerald-600 focus:ring-emerald-500 focus:border-emerald-500"
                                                value={data.prix_defaut}
                                                onChange={(e) => setData('prix_defaut', e.target.value)}
                                                required
                                                placeholder="0.00"
                                            />
                                            <InputError className="mt-2" message={errors.prix_defaut} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Îlot 2 : Paramètres */}
                            <div className="bg-white rounded-[1.5rem] p-6 lg:p-10 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                                        <Settings size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#29303d]">Paramètres</h3>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <InputLabel value="Disponibilité" className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-3" />
                                    <label className="flex items-center cursor-pointer p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-2/3 md:w-1/2">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={data.actif}
                                                onChange={(e) => setData('actif', e.target.checked)}
                                            />
                                            <div className={`block w-14 h-8 rounded-full transition-colors ${data.actif ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${data.actif ? 'transform translate-x-6' : ''}`}></div>
                                        </div>
                                        <div className="ml-4">
                                            <span className={`font-bold ${data.actif ? 'text-emerald-700' : 'text-gray-500'}`}>
                                                {data.actif ? 'Produit Actif' : 'Produit Inactif'}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-0.5">Visibilité dans les listes de vente.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            {/* Actions du formulaire */}
                            <div className="mt-10 flex flex-col sm:flex-row justify-end items-center gap-4">
                                <Link href={route('produits.index')} className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 font-bold transition-colors text-center">
                                    Annuler
                                </Link>
                                <PrimaryButton disabled={processing} className="w-full sm:w-auto !bg-[#29303d] hover:!bg-black !h-12 !px-8 !rounded-xl gap-2 text-base">
                                    <Save size={18} />
                                    <span>Enregistrer le Produit</span>
                                </PrimaryButton>
                            </div>

                        </div> {/* Fin Super Card */}
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
