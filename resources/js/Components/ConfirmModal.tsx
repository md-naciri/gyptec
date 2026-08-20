import { Fragment } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    hideCancel?: boolean;
}

export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title = 'Confirmer l\'action',
    message = 'Êtes-vous sûr de vouloir continuer ? Cette action est irréversible.',
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    type = 'danger',
    hideCancel = false
}: ConfirmModalProps) {
    
    const iconColor = type === 'danger' ? 'text-red-600' : type === 'warning' ? 'text-yellow-600' : 'text-blue-600';
    const iconBg = type === 'danger' ? 'bg-red-100' : type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100';
    
    // For primary button we can override classes if it's danger
    const buttonClass = type === 'danger' 
        ? 'bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:ring-red-500' 
        : '';

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="sm:flex sm:items-start">
                    <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${iconBg}`}>
                        <AlertTriangle className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                    {!hideCancel && (
                        <SecondaryButton onClick={onClose}>
                            {cancelText}
                        </SecondaryButton>
                    )}
                    <PrimaryButton onClick={() => { onConfirm(); onClose(); }} className={buttonClass}>
                        {confirmText}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
