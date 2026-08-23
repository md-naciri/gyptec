import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { Transition } from '@headlessui/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function Index({ auth, users }: PageProps<{ users: User[] }>) {
    const { delete: destroy } = useForm();
    const { flash } = usePage<PageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Gestion des Utilisateurs</h2>}
        >
            <Head title="Utilisateurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <Transition
                        show={!!flash.success}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {flash.success}
                        </div>
                    </Transition>
                    
                    <Transition
                        show={!!flash.error}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {flash.error}
                        </div>
                    </Transition>

                    <div className="bg-white dark:bg-[#181c25] overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">Liste des comptes</h3>
                                <Link href={route('users.create')}>
                                    <PrimaryButton>Créer un compte</PrimaryButton>
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#202532] dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3">Nom</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Rôle</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="bg-white border-b dark:bg-[#181c25] dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#202532]">
                                                <td className="px-6 py-4 font-medium">{user.name}</td>
                                                <td className="px-6 py-4">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded dark:bg-blue-900 dark:text-blue-300">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {user.role !== 'superadmin' && user.id !== auth.user.id && (
                                                        <DangerButton onClick={() => handleDelete(user.id)}>
                                                            Supprimer
                                                        </DangerButton>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
