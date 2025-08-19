'use client'
import { useEffect, useState } from 'react'
import Ajv2020 from "ajv/dist/2020.js";
import { loadRemoteComponent } from '@/lib/theme-loader/utils/loadRemoteComponent'

const ajv = new Ajv2020()

type UseRemoteOpts<TValidated = any> = {
    url: string
    exportName?: string
    validateProps?: TValidated        // 只在远程提供 schema 时用于校验；可不传
    strict?: boolean                   // 有 schema 但未传 validatedProps 时，strict=true 在 dev 抛错
}

type UseRemoteResult = {
    Comp: React.ComponentType<any> | null
    loading: boolean
    error: unknown | null
    schema?: any
    validated?: boolean
    validationErrors?: any[]
}

export function useRemoteComponent<TValidated = any>(
    { url, exportName, validateProps, strict = false }: UseRemoteOpts<TValidated>
): UseRemoteResult {
    const [state, setState] = useState<UseRemoteResult>({
        Comp: null, loading: true, error: null
    })

    useEffect(() => {
        let cancelled = false

            ; (async () => {
                try {
                    const mod: any = await loadRemoteComponent(url, { exportName: exportName ?? 'default' })
                    let component: React.ComponentType<any>
                    let schema: any | undefined

                    if (mod && typeof mod === 'object' && 'component' in mod) {
                        component = mod.component
                        schema = mod.schema
                        console.log('=====schema:' + schema)
                    } else {
                        component = mod
                    }

                    let validated = true, errors: any[] | undefined
                    if (schema) {
                        if (validateProps == null) {
                            const msg = `[useRemoteComponent] schema present at ${url} but no validatedProps provided`
                            if ((process.env.NODE_ENV !== 'production' && strict)) throw new Error(msg)
                            console.warn(msg)
                        } else {
                            const validate = ajv.compile(schema)
                            validated = !!validate(validateProps)
                            if (!validated) {
                                errors = validate.errors ?? []
                                const text = `[useRemoteComponent] schema validation failed for ${url}: ${JSON.stringify(errors, null, 2)}`
                                console.error(text)
                                if (process.env.NODE_ENV !== 'production') throw new Error(text)
                            }
                        }
                    }

                    if (!cancelled) {
                        setState({ Comp: component, loading: false, error: null, schema, validated, validationErrors: errors })
                    }
                } catch (e) {
                    if (!cancelled) setState({ Comp: null, loading: false, error: e })
                }
            })()

        return () => { cancelled = true }
        // 依赖里避免大对象抖动，外层如需稳定可传入 memo 后的 validatedProps 或版本号
    }, [url, exportName, validateProps, strict])

    return state
}
