"use client";
import { useRemoteComponent } from "@/hooks/useRemoteComponent";
import { defaultBlackCardItems, defaultSidebarContent } from "@/mockData";

export default function ShopRemoteContainer({ url, validateProps }: {
    url: string,
    validateProps: {
        ctaTitle: string,
        ctaDescription: string,
        ctaButtonText: string,
        ctaPosition?: number
    }
}) {
    const { Comp, loading, error } = useRemoteComponent({
        url,
        validateProps,
    });

    if (error) {
        console.log(error);
        return <div>加载失败</div>;
    }
    if (loading || !Comp) return <div>Loading…</div>;

    console.log(Comp)

    return (
        <Comp
            dbProps={{
                cardItems: defaultBlackCardItems,
                sidebar: defaultSidebarContent,
            }}
            validateProps={validateProps}
        />
    );
}
