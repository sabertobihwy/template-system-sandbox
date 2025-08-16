import { waitForReactGlobal, WaitOpts } from "./waitForReactGlobal";
type LoadOpts = WaitOpts & {
    exportName?: string  // 默认 'default'
}

export async function loadRemoteComponent(url: string, opts: LoadOpts = {}) {
    await waitForReactGlobal({ timeoutMs: opts.timeoutMs ?? 10000, signal: opts.signal });           // ✅ 确保 ReactBridge 已经把全局塞好了
    // 用 new Function 动态构建 import 调用，避免被打包器提前解析
    // const dynamicImport = new Function(
    //     'url',
    //     'return import(/* webpackIgnore: true */ /* @vite-ignore */ url)'
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // ) as (u: string) => Promise<Record<string, any>>;

    // 直接用原生 dynamic import；避免 new Function 触发 CSP: unsafe-eval
    const Comp = await import(
        /* webpackIgnore: true */
        /* @vite-ignore */
        url);
    const exportName = (opts.exportName ?? 'default') as string
    const picked = Comp?.[exportName]

    if (picked == null) {
        const exported = Object.keys(Comp ?? {})
        throw new Error(
            `[loadRemoteComponent] Export "${exportName}" not found from ${url}. ` +
            `Available exports: ${exported.length ? exported.join(', ') : '(none)'}`
        )
    }
    return picked;
}
