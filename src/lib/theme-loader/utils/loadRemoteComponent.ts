export async function loadRemoteComponent(url: string, exportName: string) {
    // 用 new Function 动态构建 import 调用，避免被打包器提前解析
    const dynamicImport = new Function(
        'url',
        'return import(/* webpackIgnore: true */ /* @vite-ignore */ url)'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as (u: string) => Promise<Record<string, any>>;

    const Comp = await dynamicImport(url);
    return Comp[exportName];
}
