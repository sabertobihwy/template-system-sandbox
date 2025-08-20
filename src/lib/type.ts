export interface ShopCardContent {
    image: string
    title: string
    description: string
    slogan: string
    price: string
    offerLabel?: string
}

export type ShopSidebarContentProps = {
    discoverItems: string[]
    priceRanges: string[]
    multiSelectItems: string[]
    ratingLevels?: number[]
}
export type ButtonContent = {
    label: string
    isActive?: boolean
}
