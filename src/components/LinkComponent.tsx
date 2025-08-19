// app/components/LinkComponent.tsx
'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LinkComponent({ href, children, ...rest }: any) {
    return <a href={href} {...rest}>{children}</a>
}
