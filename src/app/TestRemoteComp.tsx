// 'use client';

// import { loadRemoteComponent } from '@/lib/theme-loader/utils/loadRemoteComponent';
// import { useEffect, useState } from 'react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export default function TestRemoteComp({ headerProps, url, exportName }: { headerProps: any, url: string, exportName?: string }) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const [Comp, setComp] = useState<React.ComponentType<any> | null>(null);

//     useEffect(() => {
//         (async () => {
//             const Comp = await loadRemoteComponent(url, {
//                 exportName: exportName ?? 'default'
//             });
//             setComp(() => Comp);           // ✅ 关键：用“惰性赋值”包一层
//             // 或者：setHeader(() => (Comp as React.ComponentType<any>));
//         })();

//     }, [exportName, url]);

//     return (
//         <div>
//             {Comp ? <Comp {...headerProps} /> : <p>Loading...</p>}
//         </div>
//     );
// }
'use client';

import { useEffect, useState } from 'react';
import { loadRemoteComponent } from '@/lib/theme-loader/utils/loadRemoteComponent';
import Ajv from 'ajv';

const ajv = new Ajv();

interface TestRemoteCompProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instanceProps?: any; // TODO: 可以改成更强类型
    url: string;
    exportName?: string;
}

export default function TestRemoteComp({ instanceProps, url, exportName }: TestRemoteCompProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [Comp, setComp] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
        (async () => {
            const mod = await loadRemoteComponent(url, {
                exportName: exportName ?? 'default',
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let component: React.ComponentType<any>;
            let schema: object | undefined;

            if (mod && typeof mod === 'object' && 'component' in mod) {
                component = mod.component;
                schema = mod.schema;
            } else {
                component = mod; // 普通的 React 组件
            }

            // ✅ 如果有 schema，先验证
            if (schema) {
                try {
                    if (!instanceProps) throw new Error('should have instanceProps for validation')
                    const validate = ajv.compile(schema);
                    const valid = validate(instanceProps);
                    if (!valid) {
                        const msg = `[TestRemoteComp] Schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`;
                        if (process.env.NODE_ENV === 'development') {
                            throw new Error(msg); // dev：直接报错
                        } else {
                            console.error(msg);   // prod：打日志，不中断渲染
                        }
                    }
                } catch (e) {
                    console.error('[TestRemoteComp] schema compile error', e);
                }
            }

            setComp(() => component);
        })();
    }, [exportName, url, instanceProps]);

    return Comp;
}
