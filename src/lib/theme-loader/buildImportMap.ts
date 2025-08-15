import { CdnFn, VendorManifest } from "./getManifest";

export function buildImportMap(vendor: VendorManifest, cdnUrl: CdnFn): { imports: Record<string, string> } {
    const need = ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'] as const;
    const imports: Record<string, string> = {};
    for (const k of need) {
        const rel = vendor[k];
        if (!rel) throw new Error(`vendor manifest missing: ${k}`);
        imports[k] = cdnUrl(rel); // https://cdn/.../${rel}
    }
    return { imports };
}



