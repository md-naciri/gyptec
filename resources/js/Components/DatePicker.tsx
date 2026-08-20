import React from 'react';
import Datepicker from "react-tailwindcss-datepicker";

interface DatePickerProps {
    id?: string;
    selected?: Date | null;
    onChange?: (date: Date | null) => void;
    // Range props
    isRange?: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
    onRangeChange?: (range: { startDate: Date | null, endDate: Date | null }) => void;
    
    placeholderText?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    isClearable?: boolean;
}

export default function DatePicker({
    id,
    selected,
    onChange,
    isRange = false,
    startDate,
    endDate,
    onRangeChange,
    placeholderText = "Sélectionnez une date",
    required = false,
    className = "",
    disabled = false,
    minDate,
    maxDate,
}: DatePickerProps) {
    
    const handleValueChange = (newValue: any) => {
        if (!newValue) {
            if (isRange && onRangeChange) onRangeChange({ startDate: null, endDate: null });
            else if (onChange) onChange(null);
            return;
        }

        const parseDateString = (dateStr: string) => {
            if (!dateStr) return null;
            const [year, month, day] = dateStr.split('-');
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        };

        if (isRange && onRangeChange) {
            onRangeChange({
                startDate: parseDateString(newValue.startDate),
                endDate: parseDateString(newValue.endDate)
            });
        } else if (onChange) {
            onChange(parseDateString(newValue.startDate));
        }
    };

    const formatDateString = (dateObj: Date | string | null | undefined): string | null => {
        if (!dateObj) return null;
        if (typeof dateObj === 'string') return dateObj;
        const d = new Date(dateObj);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    };

    const dateValue = isRange ? {
        startDate: formatDateString(startDate),
        endDate: formatDateString(endDate)
    } : {
        startDate: formatDateString(selected),
        endDate: formatDateString(selected)
    };

    return (
        <Datepicker
            inputId={id}
            i18n="fr"
            asSingle={!isRange}
            useRange={isRange}
            separator=" à "
            // @ts-ignore - react-tailwindcss-datepicker typing expects Date but crashes if not string
            value={dateValue}
            onChange={handleValueChange}
            placeholder={placeholderText}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            displayFormat="DD/MM/YYYY"
            inputClassName={`w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2 ${className}`}
            toggleClassName="absolute bg-transparent rounded-r-md text-gray-400 right-0 h-full px-3 focus:outline-none"
        />
    );
}
