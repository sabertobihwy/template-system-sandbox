'use client'
import * as React from 'react'
import * as JSX from 'react/jsx-runtime'

export function ReactBridge() {
    React.useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ; (window as any).__REACT__ = React
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ; (window as any).__REACT_JSX__ = JSX
        window.dispatchEvent(new Event('react-ready'))
    }, [])
    return null
}
