import React from 'react';
import Select, { components } from 'react-select';
import { useThemeMode } from '@/Hooks/useThemeMode';

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
    
    const isDarkMode = useThemeMode();

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
            menuPortalTarget={document.body}
            styles={{
                control: (base, state) => ({
                    ...base,
                    borderColor: state.isFocused ? '#3661A0' : (isDarkMode ? '#ffffff0d' : '#E5E7EB'), // primary-500 on focus, else white/5 or gray-200
                    borderRadius: '0.75rem', // rounded-xl
                    minHeight: '44px', // h-11
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(54, 97, 160, 0.2)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
                    backgroundColor: state.isFocused ? (isDarkMode ? '#1f2430' : '#ffffff') : (isDarkMode ? '#1f2430' : '#f9fafb'), 
                    '&:hover': {
                        borderColor: state.isFocused ? '#3661A0' : (isDarkMode ? '#ffffff1a' : '#D1D5DB')
                    }
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: isDarkMode ? '#1f2430' : '#ffffff',
                    border: isDarkMode ? '1px solid #ffffff0d' : '1px solid #E5E7EB',
                }),
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected 
                        ? (isDarkMode ? '#3661A0' : '#3661A0') 
                        : state.isFocused 
                            ? (isDarkMode ? '#ffffff0d' : '#f3f4f6') 
                            : 'transparent',
                    color: state.isSelected ? '#ffffff' : (isDarkMode ? '#D1D5DB' : '#374151'),
                    '&:active': {
                        backgroundColor: isDarkMode ? '#3661A0' : '#3661A0',
                    }
                }),
                singleValue: (base) => ({
                    ...base,
                    color: isDarkMode ? '#ffffff' : '#374151',
                }),
                input: (base) => ({
                    ...base,
                    color: isDarkMode ? '#ffffff' : '#374151',
                    margin: '0',
                    padding: '0',
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
                })
            }}
        />
    );
}
