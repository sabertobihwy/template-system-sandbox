
// Build an import map using vendor manifest (cdn) + local proxies for react/jsx-runtime
import { VendorManifestV2, Versions, CdnFn, getLocalReactVersions } from './getManifest';

export type ImportMap = { imports: Record<string, string> };

function isProd() {
    return process.env.NODE_ENV === 'production';
}

function equal(a?: string, b?: string) {
    return (a ?? '').trim() === (b ?? '').trim();
}

/** Throws in dev; logs error in prod */
function assertReactVersionsMatch(vendor: Versions, local: Versions) {
    const mismatches: string[] = [];
    const checks: Array<[string, string | undefined, string | undefined]> = [
        ['react', vendor['react'], local['react']],
        ['react-dom', vendor['react-dom'], local['react-dom']],
        ['react/jsx-runtime', vendor['react/jsx-runtime'], local['react/jsx-runtime']],
    ];
    for (const [k, v, l] of checks) {
        if (!equal(v, l)) {
            mismatches.push(`${k}: vendor=${v ?? 'N/A'} local=${l ?? 'N/A'}`);
        }
    }
    if (mismatches.length) {
        const message = `[importmap] React family version mismatch:\n  ${mismatches.join('\n  ')}`;
        if (isProd()) {
            console.error(message);
        } else {
            throw new Error(message);
        }
    }
}

/**
 * Build the import map:
 * - 'react' and 'react/jsx-runtime' => local proxy files (host app)
 * - 'react-dom' and 'react-dom/client' => CDN files from vendor manifest
 */
export function buildImportMap(vendor: VendorManifestV2, cdnUrl: CdnFn, opts?: {
    reactProxyPath?: string;
    jsxRuntimeProxyPath?: string;
}): ImportMap {
    const reactProxy = opts?.reactProxyPath ?? '/react-bridge/react-proxy.js';
    const jsxProxy = opts?.jsxRuntimeProxyPath ?? '/react-bridge/react-jsx-runtime-proxy.js';

    // 1) Version check
    const local = getLocalReactVersions();
    assertReactVersionsMatch(vendor.versions ?? {}, local);

    // 2) Required specifiers
    const needCdn = ['react-dom', 'react-dom/client'] as const;
    const imports: Record<string, string> = {
        'react': reactProxy,
        'react/jsx-runtime': jsxProxy,
    };

    for (const spec of needCdn) {
        const fileRel = vendor.files[spec];
        if (!fileRel) {
            throw new Error(`vendor manifest missing file for: ${spec}`);
        }
        imports[spec] = cdnUrl(fileRel);
    }

    // Optionally pass through scheduler
    if (vendor.files['scheduler']) {
        imports['scheduler'] = cdnUrl(vendor.files['scheduler']);
    }

    return { imports };
}
