
import PolicyLayout from '../components/PolicyLayout';

export const metadata = {
    title: 'Warranty Policy | Dwara Jewels',
    description: 'Learn about the 6-month limited warranty for Dwara Jewels jewellery.',
};

const sections = [
    {
        title: '1. Warranty Coverage',
        items: [
            'Dwara Jewels offers a 6-Month Limited Warranty on its products from the date of delivery. The warranty covers eligible structural manufacturing defects and anti-tarnish plating issues under normal wearing conditions.',
            'Manufacturing Defects: Defective clasp mechanisms, manufacturing-related solder point fractures, or faulty stone settings present upon delivery.',
            'Prong & Setting Repairs: Repairing, tightening, or realigning loose prongs or settings that develop due to crafting defects under normal, careful wear.',
            'Plating Protection: Premature or unusual fading or tarnishing of rhodium, gold, or anti-tarnish plating, provided jewellery care instructions have been followed.',
            '925 Silver Guarantee: Products are represented as containing 92.5% pure silver and stamped with the 925 mark.',
        ],
    },
    {
        title: '2. Gemstone Policy & Exclusions',
        items: [
            '925 sterling silver is a relatively soft precious metal. Settings and prongs may bend or open following pressure, accidental impact, or snagging.',
            'Lost Gemstones: The cost of replacing gemstones lost due to accidental impact, pressure, snagging, or everyday wear is the responsibility of the customer.',
            'Complimentary Setting Labour: When a replacement gemstone is purchased through Dwara Jewels for a piece within its 6-month warranty period, we will reset the stone and inspect or tighten nearby prongs without crafting labour charges. Shipping charges apply.',
            'Stone Availability: Exact gemstone replacements are subject to market availability. Where an exact match is unavailable, we may offer a similar colour or shade.',
            'Not Covered: Missing gemstones, impact-related chipped or cracked stones, bent bands, broken chains caused by force, chemical damage, normal scratches, and gradual surface wear.',
            'Third-Party Repairs: Alterations, resizing, polishing, or resetting performed by another jeweller void the Dwara Jewels limited warranty.',
        ],
    },
    {
        title: '3. Complimentary Prong Inspection & Tightening',
        items: [
            'Dwara Jewels offers complimentary prong inspection and stone-tightening services within the 6-month warranty period.',
            'Customers are responsible for nominal two-way shipping charges for this preventive service.',
        ],
    },
    {
        title: '4. How to Claim Warranty Service',
        items: [
            'Submit Your Request: Email dwarajewels.official@gmail.com with your Order ID, purchase invoice, and clear photographs or videos showing the issue.',
            'Evaluation: Our quality inspection team aims to evaluate requests within 24–48 hours and confirm warranty eligibility or any gemstone replacement charges.',
            'Repair & Resetting: Following approval and applicable payment, our team will coordinate reverse pickup, eligible repairs, stone resetting, or plating work and return the item.',
        ],
    },
    {
        title: '5. Shipping Costs for Warranty Claims',
        items: [
            'Within 30 Days of Delivery: For a verified manufacturing defect or loose setting reported within 30 days of delivery, Dwara Jewels covers the round-trip pickup and delivery charges.',
            'For claims after the first 30 days, please contact our support team for confirmation of applicable shipping charges before sending the item.',
        ],
    },
];

export default function WarrantyPolicyPage() {
    return (
        <PolicyLayout
            title="Warranty Policy"
            intro="We stand behind the craftsmanship of our 925 sterling silver jewellery. Please review the coverage, exclusions, and claim process for our limited warranty."
            sections={sections}
        />
    );
}
