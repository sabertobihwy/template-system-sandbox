const getJ = () => {
    const J = self.__REACT_JSX__;
    if (!J) throw new Error('[jsx-proxy] Host JSX runtime not ready.');
    return J;
};

// 必须导出的
export const jsx = (...a) => getJ().jsx(...a);
export const jsxs = (...a) => getJ().jsxs(...a);
export const jsxDEV = (...a) => (getJ().jsxDEV ?? getJ().jsx)(...a);
export const Fragment = getJ().Fragment;

// 某些工具链（如 RSC prepass）可能用到这个（React 19 dev only）
export const __DO_NOT_USE__jsxVNode = getJ().__DO_NOT_USE__jsxVNode;

// 所有兜底行为（包括 future exports）代理到原始 jsx-runtime
const handler = {
    get(_t, p, r) {
        return Reflect.get(getJ(), p, r);
    }
};
const jsxProxy = new Proxy({}, handler)
export default jsxProxy;
