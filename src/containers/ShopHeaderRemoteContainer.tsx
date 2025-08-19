"use client";

import { useRemoteComponent } from "@/hooks/useRemoteComponent";
import { LinkComponent } from "@/components/LinkComponent";

export default function HeaderRemoteContainer({ url }: { url: string }) {
    const { Comp, loading, error } = useRemoteComponent({
        url,
        // Header 这种没有 schemaProps，直接不传 validatedProps 就行
    });

    if (error) return <div>加载失败</div>;
    if (loading || !Comp) return <div>Loading…</div>;

    const dbProps = {
        userDropDownProps: {
            linkComponent: LinkComponent,
            content: {
                companyName: "Acme Inc.",
                userRole: "Administrator",
                items: [
                    { label: "Settings", href: "/settings" },
                    { label: "Sign Out", href: "/signout" },
                ],
            },
        },
    };

    return <Comp dbProps={dbProps} />;
}