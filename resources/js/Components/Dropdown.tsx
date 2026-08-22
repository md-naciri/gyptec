import { Menu, Transition } from '@headlessui/react';
import { InertiaLinkProps, Link } from '@inertiajs/react';
import { Fragment, PropsWithChildren } from 'react';

const Dropdown = ({ children }: PropsWithChildren) => {
    return (
        <Menu as="div" className="relative inline-block text-left w-full h-full">
            {children}
        </Menu>
    );
};

const Trigger = ({ children }: PropsWithChildren) => {
    return (
        <Menu.Button as="div" className="h-full flex items-center cursor-pointer">
            {children}
        </Menu.Button>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1 bg-white',
    children,
}: PropsWithChildren<{
    align?: 'left' | 'right';
    width?: '48';
    contentClasses?: string;
}>) => {
    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    return (
        <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <Menu.Items
                className={`absolute z-50 mt-3 rounded-2xl shadow-xl border border-gray-100 outline-none ${alignmentClasses} ${widthClasses}`}
            >
                <div className={`rounded-2xl p-2 ${contentClasses}`}>
                    {children}
                </div>
            </Menu.Items>
        </Transition>
    );
};

const DropdownLink = ({
    className = '',
    children,
    ...props
}: InertiaLinkProps) => {
    return (
        <Menu.Item>
            {({ active }) => (
                <Link
                    {...props}
                    className={
                        `block w-full px-4 py-2.5 rounded-xl text-start text-sm font-semibold transition duration-150 ease-in-out focus:outline-none ${
                            active ? 'bg-gray-50 text-[#29303d]' : 'text-gray-500 hover:text-[#29303d]'
                        } ${className}`
                    }
                >
                    {children}
                </Link>
            )}
        </Menu.Item>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
