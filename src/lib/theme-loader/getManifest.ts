
// server-only（SSR 可用）
export type VendorManifest = Record<string, string>;
export type ThemeManifest = Record<string, string>;

// server多租户共享
const vendorManifestCache = new Map<string, VendorManifest>();
const themeManifestCache = new Map<string, ThemeManifest>();

export type CdnFn = (path: string) => string

export function generateCdnUrl(cdnBase: string): CdnFn {
    return (path: string) => {
        // 你自己的 CDN 域名拼接器
        return `${cdnBase.replace(/^\/+/, '')}/${path.replace(/^\/+/, '')}`;
    }
}

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url, {
        // 强制条件请求，配合 CDN 的 no-cache + ETag，未变更走 304
        cache: 'no-cache',
        next: { revalidate: 60 }, // 适度复用，减少同一分钟内的多次请求
    });
    if (!res.ok) throw new Error(`Fetch failed: ${url} -> ${res.status}`);
    return res.json();
}

export async function getVendorManifest(version: string, cdnUrl: CdnFn): Promise<VendorManifest> {
    const key = `vendor@${version}`;
    if (vendorManifestCache.has(key)) return vendorManifestCache.get(key)!;
    const url = cdnUrl(`${version}/vendor/manifest.vendor.json`);
    const json = await fetchJSON<VendorManifest>(url);
    vendorManifestCache.set(key, json);
    return json;
}

export async function getThemeManifest(themeName: string, version: string, cdnUrl: CdnFn): Promise<ThemeManifest> {
    const key = `${themeName}@${version}`;
    if (themeManifestCache.has(key)) return themeManifestCache.get(key)!;
    const url = cdnUrl(`${version}/${themeName}/manifest.${themeName}.json`);
    const json = await fetchJSON<ThemeManifest>(url);
    themeManifestCache.set(key, json);
    return json;
}

export async function getManifests(themeName: string, version: string, cdnUrl: CdnFn) {
    const vendor = await getVendorManifest(version, cdnUrl)
    const theme = await getThemeManifest(themeName, version, cdnUrl)
    return { vendor, theme }
}


// 客户端（可选）
//export async function loadTheme(scene: string): Promise<void>; // 触发实际 import()，命中 SSR 铺好的缓存

