// Client component
'use client';

import { useEffect } from 'react';

export default function TestReactDOM() {
    useEffect(() => {
        // 只动态引入 react-dom/client，看浏览器是否会通过 importmap 把 react & react-dom 拉过来
        import('react-dom/client').then(mod => {
            console.log('react-dom/client loaded:', mod);
        });
    }, []);

    return <div>Testing react-dom preload</div>;
}
