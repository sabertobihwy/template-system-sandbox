// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
    // 防止在开发环境下热重载时创建多个实例
    var prisma: PrismaClient | undefined
}

export const prisma =
    global.prisma ??
    new PrismaClient({
        log: ['query'], // 可选：打印所有 SQL 查询，方便调试
    })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
