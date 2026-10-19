
import PolicyLayout from '../components/PolicyLayout';

export const metadata = {
    title: 'Return & Exchange Policy | Dwara Jewels',
    description: 'Review Dwara Jewels return, exchange, refund, and shipping policies.',
};

const sections = [
    {
        title: '1. Eligibility for Returns & Exchanges',
        items: [
            'Timeframe: Requests must be raised within 7 days of delivery.',
            'Security Tag: Every piece is fitted with a sealed, untearable security tag band. If the band is cut, torn, broken, removed, or tampered with, the item becomes ineligible for standard returns and exchanges.',
            'Condition: Jewellery must be unworn, unused, undamaged, and in its original condition.',
            'Packaging: Return the item with its original packaging, authenticity certificate, pouches, tags, and invoice.',
        ],
    },
    {
        title: '2. Non-Returnable & Non-Exchangeable Items',
        items: [
            'Items with broken, removed, tampered, or reattached security tags are not eligible for standard returns or exchanges.',
            'Customized or personalized jewellery, including custom sizes, special gemstone selections, and personalized engravings, is generally not eligible.',
            'Clearance, flash-sale, or explicitly marked Final Sale items are generally not eligible.',
            'Items damaged, worn, or altered by the customer are not eligible for standard returns or exchanges.',
            'These restrictions do not override any mandatory consumer rights for defective, incorrect, or misrepresented goods.',
        ],
    },
    {
        title: '3. Damaged, Defective, or Incorrect Items',
        items: [
            'If an item arrives damaged, defective, or incorrect, please contact us within 48 hours of delivery.',
            'Provide your Order ID and clear photographs or an unboxing video demonstrating the issue and showing the security tag where available.',
            'After verification, we will coordinate a complimentary pickup and replacement at no additional cost, as applicable.',
        ],
    },
    {
        title: '4. Return Shipping & Reverse Pickup',
        items: [
            'Reverse Pickup: Available across eligible pincodes. For eligible standard returns, a shipping fee of Rs. 100–150 or the actual courier charge may be deducted from the refund or store credit.',
            'When the return results from our error, such as an incorrect or damaged item, eligible reverse pickup is complimentary.',
            'Self-Shipment: Where reverse pickup is unavailable, customers may use a trackable courier. After receipt and inspection, reasonable self-shipping charges of up to Rs. 100 may be reimbursed according to the policy.',
        ],
    },
    {
        title: '5. Ring Size Selection',
        items: [
            'Please choose your ring size carefully. Jewellery ordered in an incorrect ring size selected by the customer is generally not eligible for standard return or exchange.',
            'We recommend using our Ring Size Guide or contacting support before placing an order.',
        ],
    },
    {
        title: '6. Refunds & Store Credit',
        items: [
            'Returned items undergo quality inspection, including verification of their original condition and security tag.',
            'Prepaid Orders: Eligible refunds are processed to the original payment method within 5–7 business days after successful inspection. Banking timelines may vary.',
            'Cash on Delivery Orders: Where COD is available, eligible refunds may be issued as store credit or gift cards valid for one year, or transferred to a verified bank account or UPI ID upon request.',
            'Original shipping or COD handling charges are generally non-refundable, subject to applicable consumer rights.',
        ],
    },
    {
        title: '7. How to Initiate a Return or Exchange',
        items: [
            'Email dwarajewels.official@gmail.com with your Order ID, product details, reason for return or exchange, and photographs showing the item and security tag.',
            'Our team aims to review requests within 24–48 hours and coordinate the next steps, including reverse pickup where eligible.',
            'Support Hours: Monday to Saturday, 10:00 AM – 7:00 PM IST.',
        ],
    },
];

export default function ReturnExchangePolicyPage() {
    return (
        <PolicyLayout
            title="Return & Exchange Policy"
            intro="At Dwara Jewels, we take pride in our 925 sterling silver jewellery. If your order is not right, our support team is here to help you understand your return or exchange options."
            sections={sections}
        />
    );
}
