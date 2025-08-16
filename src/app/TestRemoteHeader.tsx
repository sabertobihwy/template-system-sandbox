'use client';

import { loadRemoteComponent } from '@/lib/theme-loader/utils/loadRemoteComponent';
import { useEffect, useState } from 'react';

const headerProps = {
    modalSearchProps: { brand: {} },
    userDropDownProps: {
        align: 'right' as const,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        linkComponent: ({ href, children, ...rest }: any) => (
            <a href={href} {...rest}>{children}</a>
        ),
        content: {
            companyName: 'Acme Inc.',
            userRole: 'Administrator',
            items: [
                { label: 'Settings', href: '/settings' },
                { label: 'Sign Out', href: '/signout' }
            ]
        },
        brand: { bgColor: 'bg-gray-800' }
    }
};

export default function TestRemoteHeader() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [Header, setHeader] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
        (async () => {
            const Comp = await loadRemoteComponent('https://theme-system.pages.dev/v1/cool/cool-shop-header.D_f2BT0k.js', {
                exportName: 'default'
            });
            setHeader(() => Comp);           // ✅ 关键：用“惰性赋值”包一层
            // 或者：setHeader(() => (Comp as React.ComponentType<any>));
        })();

    }, []);

    return (
        <div>
            <h2>Testing Remote CoolHeader</h2>
            {Header ? <Header {...headerProps} /> : <p>Loading...</p>}
        </div>
    );
}
