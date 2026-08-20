import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';

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
            <PageHeader 
                title="Ajouter un Produit" 
                subtitle="Créer un nouvel article dans le catalogue"
            />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6 max-w-2xl">
                                <div>
                                    <InputLabel htmlFor="nom" value="Nom du Produit *" />
                                    <TextInput
                                        id="nom"
                                        className="mt-1 block w-full"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        required
                                        isFocused
                                    />
                                    <InputError className="mt-2" message={errors.nom} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="unite" value="Unité *" />
                                    <SelectInput
                                        id="unite"
                                        className="mt-1 block w-full"
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
                                    <InputLabel htmlFor="prix_defaut" value="Prix par Défaut (DH) *" />
                                    <TextInput
                                        id="prix_defaut"
                                        type="number"
                                        step="0.01"
                                        className="mt-1 block w-full"
                                        value={data.prix_defaut}
                                        onChange={(e) => setData('prix_defaut', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.prix_defaut} />
                                </div>

                                <div className="flex items-center mt-6">
                                    <input
                                        id="actif"
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        checked={data.actif}
                                        onChange={(e) => setData('actif', e.target.checked)}
                                    />
                                    <label htmlFor="actif" className="ml-2 text-sm text-gray-600">Produit Actif</label>
                                </div>

                                <div className="flex items-center gap-4 mt-6">
                                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>
                                    <Link href={route('produits.index')} className="text-gray-600 hover:text-gray-900 transition">Annuler</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
