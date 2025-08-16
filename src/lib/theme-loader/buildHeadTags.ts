import { buildImportMap } from "./buildImportMap";
import { CdnFn, ThemeManifest, VendorManifestV2 } from "./getManifest";

/** 结构化的 head 标签描述，便于在 React/Next 中直接渲染为 <link> / <meta> 等 */
export type LinkTag =
    | { tag: 'link'; rel: 'modulepreload'; href: string; crossOrigin?: 'anonymous' | 'use-credentials'; fetchPriority?: 'high' | 'low' | 'auto'; as?: 'script' }
    | { tag: 'link'; rel: 'prefetch'; href: string; crossOrigin?: 'anonymous' | 'use-credentials'; as?: 'script' }
    | { tag: 'link'; rel: 'stylesheet'; href: string; fetchPriority?: 'high' | 'low' | 'auto' }
    | { tag: 'link'; rel: 'preconnect'; href: string; crossOrigin?: 'anonymous' }
    | { tag: 'meta'; name: string; content: string };

export function buildHeadTags(opts: {
    cdnBase: string,
    cdnUrl: CdnFn;
    themeName: string;               // e.g. "cool"
    vendor: VendorManifestV2;
    theme: ThemeManifest;
    scenes: string[];                // e.g. ["shop","product"]
    currentScene?: string;           // 当前页面/路由对应的场景
    cssFetchPriority?: 'high' | 'auto' | 'low';
    strategy?: 'conservative' | 'aggressive'; // 其他场景预取强度
}): { importMapJson: string; links: LinkTag[] } {
    const {
        cdnBase, cdnUrl, vendor, theme, scenes,
        themeName, currentScene,
        cssFetchPriority = 'high',
        strategy = 'conservative'
    } = opts;

    // 1) importmap（先注入到 <head>）
    const importMap = buildImportMap(vendor, cdnUrl);
    // 防止 </script> 截断与 XSS：转义 '<'
    const importMapJson = JSON.stringify(importMap).replace(/</g, '\\u003c');

    const links: LinkTag[] = [];

    // 2) vendor 预抓（“钥匙带大门”）
    const v = (name: 'react-dom' | 'react-dom/client') => cdnUrl(vendor.files[name]);

    // 必 preload：小入口 client（会带上 react / react-dom），以及 jsx-runtime
    links.push(
        { tag: 'link', rel: 'preconnect', href: cdnBase, crossOrigin: 'anonymous' },
        { tag: 'link', rel: 'modulepreload', href: v('react-dom/client'), crossOrigin: 'anonymous' },
    );
    // 一般不需要显式 preload react：由 client 的依赖链并行拉下
    // 如果你确知本页不做 hydration 但会立刻用到 react，可按需追加 prefetch 或低优先级 modulepreload

    // 3) 主题 CSS：首屏直接生效（不重复 preload）
    const cssKey = Object.keys(theme).find(k => k.endsWith('style') || k.endsWith('-style'));
    if (cssKey) {
        links.push({ tag: 'link', rel: 'stylesheet', href: cdnUrl(theme[cssKey]), fetchPriority: cssFetchPriority });
    }

    // 4) 场景入口
    const entriesFor = (scene: string): string[] => {
        const keys = [`${themeName}-${scene}-header`, `${themeName}-${scene}-main`];
        return keys.map(k => theme[k]).filter(Boolean).map(cdnUrl);
    };

    // 当前场景：modulepreload（解析依赖图，立刻可用）
    if (currentScene) {
        for (const href of entriesFor(currentScene)) {
            links.push({ tag: 'link', rel: 'modulepreload', href, crossOrigin: 'anonymous' });
        }
    }

    // 非当前场景：默认 prefetch（低优先级，不解析依赖图）；激进策略则用低优先级 modulepreload
    for (const s of scenes) {
        if (s === currentScene) continue;
        for (const href of entriesFor(s)) {
            if (strategy === 'aggressive') {
                links.push({ tag: 'link', rel: 'modulepreload', href, crossOrigin: 'anonymous', fetchPriority: 'low' });
            } else {
                links.push({ tag: 'link', rel: 'prefetch', href, crossOrigin: 'anonymous', as: 'script' });
            }
        }
    }

    // 5) 字体与外链（按需）
    links.push(
        { tag: 'link', rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { tag: 'link', rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { tag: 'link', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
    );

    return { importMapJson, links };
}
