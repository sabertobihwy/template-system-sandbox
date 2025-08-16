// 惰性取宿主 React，只有“真正用到”时才访问全局（更抗竞态）
const getR = () => {
    const R = self.__REACT__;
    if (!R) throw new Error('[react-proxy] Host React not ready.');
    return R;
};

// Hooks
export const useState = (...a) => getR().useState(...a);
export const useEffect = (...a) => getR().useEffect(...a);
export const useContext = (...a) => getR().useContext(...a);
export const useRef = (...a) => getR().useRef(...a);
export const useMemo = (...a) => getR().useMemo(...a);
export const useCallback = (...a) => getR().useCallback(...a);
export const useReducer = (...a) => getR().useReducer(...a);
export const useLayoutEffect = (...a) => getR().useLayoutEffect(...a);
export const useInsertionEffect = (...a) => getR().useInsertionEffect(...a);
export const useTransition = (...a) => getR().useTransition(...a);
export const useDeferredValue = (...a) => getR().useDeferredValue(...a);
export const useId = (...a) => getR().useId(...a);
export const useImperativeHandle = (...a) => getR().useImperativeHandle(...a);
export const useSyncExternalStore = (...a) => getR().useSyncExternalStore(...a);

// React 19 hooks
export const useOptimistic = (...a) => getR().useOptimistic(...a);
export const useActionState = (...a) => getR().useActionState(...a);
export const useFormStatus = (...a) => getR().useFormStatus(...a);

// Elements
export const createElement = (...a) => getR().createElement(...a);
export const cloneElement = (...a) => getR().cloneElement(...a);
export const isValidElement = (...a) => getR().isValidElement(...a);
export const createFactory = (...a) => getR().createFactory(...a);

// Components / wrappers
export const Fragment = getR().Fragment;
export const Suspense = getR().Suspense;
export const Profiler = getR().Profiler;
export const StrictMode = getR().StrictMode;
export const forwardRef = (...a) => getR().forwardRef(...a);
export const memo = (...a) => getR().memo(...a);
export const lazy = (...a) => getR().lazy(...a);
export const startTransition = (...a) => getR().startTransition(...a);
export const createContext = (...a) => getR().createContext(...a);

// Concurrent cache (experimental/unstable, but stable in 19)
export const cache = getR().cache;

// Info/meta
export const version = getR().version;

// 需要 class/静态属性、Fragment、Suspense 等 => 用 Proxy 兜底
// todo: 研究这个Reflect
// const handler = { get(_t, p) { return getR()[p]; } };
const handler = {
    get(_t, p, r) {
        return Reflect.get(getR(), p, r);
    }
};
const reactProxy = new Proxy({}, handler)
export default reactProxy;
