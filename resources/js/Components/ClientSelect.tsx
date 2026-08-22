import React from 'react';
import Select, { components } from 'react-select';

interface Client {
    id: number;
    nom: string;
    code_client?: string;
    complement_ident?: string;
    nom_affichage?: string;
}

interface ClientSelectProps {
    id?: string;
    clients: Client[];
    value: string | number | null;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

const CustomInput = (props: any) => {
    // Add border-0, ring-0, focus:ring-0 to override @tailwindcss/forms default input styles
    return <components.Input {...props} autoComplete="new-password" className="border-0 ring-0 focus:ring-0 outline-none shadow-none bg-transparent" />;
};

export default function ClientSelect({
    id,
    clients,
    value,
    onChange,
    placeholder = "Rechercher un client...",
    required = false,
    className = ""
}: ClientSelectProps) {
    
    // Formater les options pour react-select
    const options = clients.map(client => ({
        value: client.id,
        label: client.nom_affichage || `${client.code_client ? client.code_client + ' - ' : ''}${client.nom}${client.complement_ident ? ' (' + client.complement_ident + ')' : ''}`
    }));

    // Trouver l'option sélectionnée actuelle
    const selectedOption = options.find(opt => opt.value.toString() === value?.toString()) || null;

    return (
        <Select
            inputId={id}
            value={selectedOption}
            onChange={(option) => onChange(option ? option.value : '')}
            options={options}
            placeholder={placeholder}
            isClearable
            isSearchable
            className={className}
            classNamePrefix="react-select"
            noOptionsMessage={() => "Aucun client trouvé"}
            components={{ Input: CustomInput }}
            styles={{
                control: (base, state) => ({
                    ...base,
                    borderColor: state.isFocused ? '#3661A0' : '#E5E7EB', // primary-500 on focus, else gray-200
                    borderRadius: '0.75rem', // rounded-xl
                    minHeight: '44px', // h-11
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(54, 97, 160, 0.2)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
                    backgroundColor: state.isFocused ? '#ffffff' : '#f9fafb', // gray-50/50
                    '&:hover': {
                        borderColor: state.isFocused ? '#3661A0' : '#D1D5DB'
                    }
                }),
                valueContainer: (base) => ({
                    ...base,
                    padding: '0 12px',
                    minHeight: '44px',
                    height: '44px',
                }),
                indicatorsContainer: (base) => ({
                    ...base,
                    height: '44px',
                }),
                input: (base) => ({
                    ...base,
                    margin: '0',
                    padding: '0',
                })
            }}
        />
    );
}
