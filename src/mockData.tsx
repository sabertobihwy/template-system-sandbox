import { ButtonContent, ShopCardContent, ShopSidebarContentProps } from './lib/type'

export const defaultSidebarContent: ShopSidebarContentProps = {
    discoverItems: [
        'View All',
        'Apps / Software',
        'Design / Tech Products',
        'Books & Writing',
        'Education',
        'Drawing / Painting',
    ],
    priceRanges: [
        'Not limited',
        'Less than $20',
        '$20 - $40',
        '$40 - $80',
        'More than $80',
    ],
    multiSelectItems: [
        'Apps / Software',
        'Education',
        'Books & Writing',
        'Drawing / Painting',
    ]
}

const img21 = '/images/applications-image-21.jpg'
const img22 = '/images/applications-image-22.jpg'
const img23 = '/images/applications-image-23.jpg'

export const defaultBlackCardItems: ShopCardContent[] = [
    {
        image: img21,
        title: 'Form Builder CP',
        description: 'Build beautiful forms fast.',
        slogan: '🌟 Sleek audio, powerful sound.',
        price: '$39.00',
        offerLabel: '',
    },
    {
        image: img23,
        title: 'Invoice Manager',
        description: 'Track and send invoices easily.',
        slogan: '🌟 Designed to impress.',
        price: '$59.00',
    },
    {
        image: img21,
        title: 'Task Master',
        description: 'Organize your team efficiently.',
        slogan: '✨ Editors Choice',
        price: '$29.00',
        offerLabel: 'Limited Deal',
    },
    {
        image: img23,
        title: 'Form Builder CP',
        description: 'Build beautiful forms fast.',
        slogan: '⭐ Well Loved',
        price: '$39.00',
        offerLabel: 'Special Offer',
    },
    {
        image: img21,
        title: 'Invoice Manager',
        description: 'Track and send invoices easily.',
        slogan: '',
        price: '$59.00',
    },
    {
        image: img22,
        title: 'Task Master',
        description: 'Organize your team efficiently.',
        slogan: '',
        price: '$29.00',
    },
    {
        image: img21,
        title: 'Form Builder CP',
        description: 'Build beautiful forms fast.',
        slogan: '4.7',
        price: '$39.00',
        offerLabel: 'Special Offer',
    },
    {
        image: img22,
        title: 'Invoice Manager',
        description: 'Track and send invoices easily.',
        slogan: '4.9',
        price: '$59.00',
    },
    {
        image: img23,
        title: 'Task Master',
        description: 'Organize your team efficiently.',
        slogan: ' 4.5',
        price: '$29.00',
        offerLabel: 'Limited Deal',
    },
    {
        image: img21,
        title: 'Invoice Manager',
        description: 'Track and send invoices easily.',
        slogan: '4.9',
        price: '$59.00',
    },
    {
        image: img21,
        title: 'Task Master',
        description: 'Organize your team efficiently.',
        slogan: '4.5',
        price: '$29.00',
        offerLabel: 'Limited Deal',
    }
]

export const defaultSortTagContent: ButtonContent[] = [
    { label: 'View All', isActive: true },
    { label: 'Featured' },
    { label: 'Newest' },
    { label: 'Price - Low To High' },
    { label: 'Price - High to Low' },
]