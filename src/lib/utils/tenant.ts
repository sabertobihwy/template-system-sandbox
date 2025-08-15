// utils/getSafeTenant.ts
// import { redirect } from 'next/navigation';
// import { getTenantByNameStrict } from '@/db/tenants.dao';
// import { BizError } from '@/types/shared/BizError';

// export async function getSafeTenant(tenantName: string) {
//     try {
//         return await getTenantByNameStrict(tenantName);
//     } catch (error) {
//         if (error instanceof BizError) {
//             throw redirect(`/not-found?code=${error.code}`);
//         }
//         throw redirect('/not-found?code=1000');
//     }
// }

// ✅ 你可以换成从 Redis、数据库缓存中动态生成
export const VALID_TENANTS = ['nike', 'apple', 'adidas', 'shopstack'];

export function isValidTenant(tenant: string): boolean {
    return VALID_TENANTS.includes(tenant);
}

// 可选：从 pathname 提取租户名
export function extractTenantFromPath(pathname: string): string | null {
    const match = pathname.match(/^\/([^\/?#]+)/);
    return match ? match[1] : null;
}