export type WaitOpts = {
    timeoutMs?: number
    signal?: AbortSignal
}

function hasReactGlobal() {
    return typeof window !== 'undefined'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        && (window as any).__REACT__
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        && (window as any).__REACT_JSX__
}

// 单例承诺：多次并发等待只挂一次监听
let reactReadyPromise: Promise<void> | null = null

export function waitForReactGlobal(opts: WaitOpts = {}): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve()
    if (hasReactGlobal()) return Promise.resolve()

    if (!reactReadyPromise) {
        reactReadyPromise = new Promise<void>((resolve, reject) => {
            const onReady = () => {
                if (hasReactGlobal()) {
                    cleanup()
                    resolve()
                }
            }
            const onAbort = () => {
                cleanup()
                reject(new Error('[waitForReactGlobal] aborted'))
            }

            const cleanup = () => {
                window.removeEventListener('react-ready', onReady)
                if (rafId != null) cancelAnimationFrame(rafId)
                if (timeoutId != null) clearTimeout(timeoutId)
                if (opts.signal) opts.signal.removeEventListener('abort', onAbort)
                reactReadyPromise = null
            }

            // 1) 事件优先（Bridge 发出的）
            window.addEventListener('react-ready', onReady, { once: true })

            // 2) rAF 轮询兜底（避免事件丢失或脚本顺序微妙）
            let rafId: number | null = null
            const tick = () => {
                if (hasReactGlobal()) { onReady(); return }
                rafId = requestAnimationFrame(tick)
            }
            rafId = requestAnimationFrame(tick)

            // 3) 可选超时
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let timeoutId: any = null
            if (opts.timeoutMs && opts.timeoutMs > 0) {
                timeoutId = setTimeout(() => {
                    cleanup()
                    reject(new Error('[waitForReactGlobal] timeout'))
                }, opts.timeoutMs)
            }

            // 4) 可选 AbortSignal
            if (opts.signal) opts.signal.addEventListener('abort', onAbort, { once: true })
        })
    }
    return reactReadyPromise
}

// function waitForReactGlobal_Simple(): Promise<void> {
//     if (typeof window === 'undefined') return Promise.resolve();
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     if ((window as any).__REACT__ && (window as any).__REACT_JSX__) return Promise.resolve();
//     return new Promise((resolve) => {
//         const t = setInterval(() => {
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             if ((window as any).__REACT__ && (window as any).__REACT_JSX__) {
//                 clearInterval(t);
//                 resolve();
//             }
//         }, 0); // 微任务级轮询即可
//     });
// }