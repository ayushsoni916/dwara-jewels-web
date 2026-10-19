
import PolicyLayout from '../components/PolicyLayout';

export const metadata = {
    title: 'Gemstone Policy | Dwara Jewels',
    description: 'Learn about natural and lab-grown gemstones, stone care, and replacement terms.',
};

const sections = [
    {
        title: '1. Types of Stones We Use',
        items: [
            'Natural & Semi-Precious Gemstones: Naturally occurring stones such as sapphires, emeralds, amethysts, and pearls may display inclusions, colour zoning, and subtle differences in shade. Such natural characteristics do not necessarily indicate a manufacturing defect.',
            'Lab-Grown Precious Stones: Lab-grown diamonds, sapphires, emeralds, and rubies are produced in controlled environments and have corresponding chemical, crystal, and optical properties associated with their natural counterparts.',
            'Disclosure: Products containing lab-grown precious stones are identified in the relevant product descriptions and authenticity documentation.',
        ],
    },
    {
        title: '2. Silver Metal & Stone Setting Dynamics',
        items: [
            '925 sterling silver is relatively soft compared with certain other precious metals.',
            'Everyday wear, accidental pressure, dropping, or snagging against clothing may cause prongs or settings to shift, which can loosen a gemstone.',
        ],
    },
    {
        title: '3. Stone Loss, Damage & Replacement Terms',
        items: [
            'Stones lost, chipped, or cracked due to impact, accidental damage, pressure, or improper handling are not eligible for complimentary gemstone replacement under the limited warranty.',
            'Replacement gemstones can be purchased through Dwara Jewels, subject to availability and current pricing.',
            'For jewellery within the 6-month warranty period, when a replacement gemstone is purchased through Dwara Jewels, stone resetting and inspection or tightening of nearby prongs are provided without additional crafting labour charges. Two-way shipping charges apply.',
            'Natural stone colours and lab-grown stone cuts are subject to availability. If an exact replacement cannot be sourced, the closest available alternative may be offered.',
        ],
    },
    {
        title: '4. Care & Maintenance Guidelines',
        items: [
            'Avoid Harsh Chemicals: Remove gemstone jewellery before swimming, bathing, cleaning, or applying perfume, sanitizers, hairspray, and similar products.',
            'Gentle Cleaning: Use a soft-bristled brush, warm water, and mild soap where suitable for the specific stone. Avoid abrasive cleaners and harsh chemical dips.',
            'Safe Storage: Store pieces separately in a protective pouch or padded compartment to reduce scratching and contact damage.',
            'Certain gemstones and treatments require specialized care. Contact support before cleaning a stone if you are unsure about its suitability for water or soap.',
        ],
    },
    {
        title: '5. Complimentary Setting Inspection',
        items: [
            'Dwara Jewels offers complimentary prong inspection and stone tightening within the 6-month warranty period.',
            'Email dwarajewels.official@gmail.com to arrange an inspection. Applicable shipping charges will be confirmed before collection.',
        ],
    },
];

export default function GemstonePolicyPage() {
    return (
        <PolicyLayout
            title="Gemstone Policy"
            intro="Our jewellery features natural and lab-grown gemstones. This policy explains gemstone characteristics, setting care, loss or damage, and replacement arrangements."
            sections={sections}
        />
    );
}
