export const dynamic = 'force-dynamic';

// import { prisma } from '@/lib/prisma'
//import TestReactDOM from "./TestReactDOM";
import HeaderRemoteContainer from "@/containers/ShopHeaderRemoteContainer";
import ShopRemoteContainer from "@/containers/ShopRemoteContainer";

// const headerProps = {
//     modalSearchProps: { brand: {} },
//     userDropDownProps: {
//         align: 'right' as const,
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         linkComponent: LinkComponent,
//         content: {
//             companyName: 'Acme Inc.',
//             userRole: 'Administrator',
//             items: [
//                 { label: 'Settings', href: '/settings' },
//                 { label: 'Sign Out', href: '/signout' }
//             ]
//         },
//         brand: { bgColor: 'bg-gray-800' }
//     }
// };

export default async function Home() {
    // const productsWithVariants = await prisma.products.findMany({
    //     include: {
    //         variants: true
    //     }
    // })
    //console.log(productsWithVariants)

    const ShopMainProps = {
        url: "https://theme-system.pages.dev/v1/cool/cool-shop-main.CaWuGJX1.js",
        validateProps: {
            ctaTitle: 'Boost your productivity🎁',
            ctaDescription: 'Excepteur sint occaecat cupidatat non proidentsunt in culpa qui officia deserunt mollit!',
            ctaButtonText: 'Redeem now!',
            ctaPosition: 9
        },
    }

    return (<>
        <HeaderRemoteContainer url={"https://theme-system.pages.dev/v1/cool/cool-shop-header.q42bHkB-.js"} />
        <ShopRemoteContainer {...ShopMainProps} />
    </>
    );
}
