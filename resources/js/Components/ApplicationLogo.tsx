import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { className, ...rest } = props;
    return (
        <>
            <img src="/img/logo.png" alt="Gyptec Plâtre" className={`dark:hidden ${className || ''}`} {...rest} />
            <img src="/img/logo-dark.png" alt="Gyptec Plâtre" className={`hidden dark:block ${className || ''}`} {...rest} />
        </>
    );
}
