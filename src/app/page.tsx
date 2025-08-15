export const dynamic = 'force-dynamic';

// import { prisma } from '@/lib/prisma'
//import TestReactDOM from "./TestReactDOM";
import TestRemoteHeader from "./TestRemoteHeader";

export default async function Home() {
    // const productsWithVariants = await prisma.products.findMany({
    //     include: {
    //         variants: true
    //     }
    // })
    //console.log(productsWithVariants)
    return (
        <TestRemoteHeader />
    );
}
