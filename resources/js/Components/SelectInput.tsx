import React, { SelectHTMLAttributes, forwardRef, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

export default forwardRef(function SelectInput(
    { className = '', children, value, onChange, ...props }: any,
    ref: React.LegacyRef<HTMLDivElement>
) {
    // Extraire les options depuis les enfants <option>
    const options: { value: string | number, label: React.ReactNode }[] = [];
    
    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
            const element = child as React.ReactElement<any>;
            options.push({
                value: element.props.value as string | number,
                label: element.props.children
            });
        }
    });

    // Trouver le label de la valeur sélectionnée (comparaison non stricte pour les ID sous forme de string/number)
    const selectedOption = options.find(opt => opt.value == value) || options.find(opt => opt.value === '') || options[0];

    const handleChange = (newVal: any) => {
        if (onChange) {
            // Créer un faux event pour garder la compatibilité avec l'API native onChange={(e) => ...}
            const event = {
                target: { value: newVal }
            };
            onChange(event as any);
        }
    };

    return (
        <div className="relative w-full" ref={ref}>
            <Listbox value={value} onChange={handleChange}>
                {({ open }) => (
                    <>
                        <Listbox.Button className={`relative w-full cursor-default rounded-xl bg-gray-50/50 h-11 pl-4 pr-10 text-left text-sm shadow-sm border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white hover:border-gray-300 ${className}`}>
                            <span className="block truncate">{selectedOption?.label || 'Sélectionner...'}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Listbox.Options 
                            anchor="bottom start" 
                            transition
                            className="z-50 max-h-60 min-w-[var(--button-width)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition ease-in duration-100 data-[leave]:data-[closed]:opacity-0"
                        >
                            {options.map((option, idx) => (
                                <Listbox.Option
                                    key={idx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-8 pr-3 transition-colors duration-150 ${
                                            active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                                        }`
                                    }
                                    value={option.value}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`block whitespace-nowrap ${selected ? 'font-semibold text-primary-700' : 'font-normal'}`}>
                                                {option.label}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-2 ${
                                                        active ? 'text-primary-700' : 'text-primary-600'
                                                    }`}
                                                >
                                                    <Check className="h-4 w-4" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </>
                )}
            </Listbox>
        </div>
    );
});
