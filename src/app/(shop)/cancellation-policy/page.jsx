
import PolicyLayout from '../components/PolicyLayout';

export const metadata = {
    title: 'Cancellation Policy | Dwara Jewels',
    description: 'Understand how to cancel an order and receive eligible refunds.',
};

const sections = [
    {
        title: '1. Order Cancellation Window',
        items: [
            'Standard Orders: You may request cancellation free of charge within 12 hours of placing the order, or before the order has been dispatched.',
            'After Dispatch: Orders already shipped and handed over to the courier cannot ordinarily be cancelled. Customers may request a return after delivery under our Return & Exchange Policy, provided eligibility requirements are met.',
        ],
    },
    {
        title: '2. Customized & Personalized Orders',
        items: [
            'Custom sizes, engraved jewellery, and special gemstone sourcing orders may be cancelled only within 6 hours of placing the order.',
            'Once crafting or engraving has begun, customized orders cannot ordinarily be cancelled, modified, or refunded, subject to applicable legal rights.',
        ],
    },
    {
        title: '3. Refunds for Cancelled Orders',
        items: [
            'Prepaid Orders: For an approved cancellation before dispatch, the full amount will be refunded to the original payment method within 5–7 business days.',
            'Cash on Delivery Orders: Where COD is available, approved cancellations before dispatch do not incur cancellation charges.',
        ],
    },
    {
        title: '4. Cancellations by Dwara Jewels',
        items: [
            'Stock Unavailability: We may cancel an order when products or gemstones become unavailable or fail quality inspection.',
            'Pricing Errors: Orders affected by incorrect pricing or typographical errors may be cancelled.',
            'Address or Verification Issues: Orders with incomplete, undeliverable, or unverified shipping details may be cancelled.',
            'Fraud Prevention: Suspicious, unauthorized, or fraudulent transactions may be cancelled.',
            'If Dwara Jewels cancels an order, the customer will be informed by email or SMS, and any prepaid payment for the cancelled order will be refunded in full.',
        ],
    },
    {
        title: '5. How to Request a Cancellation',
        items: [
            'Contact our customer support team as soon as possible at dwarajewels.official@gmail.com.',
            'Include your Order ID and a brief explanation of your cancellation request.',
            'Support Hours: Monday to Saturday, 10:00 AM – 7:00 PM IST.',
        ],
    },
];

export default function CancellationPolicyPage() {
    return (
        <PolicyLayout
            title="Cancellation Policy"
            intro="We process orders promptly so your jewellery can reach you as quickly as possible. Please review these guidelines if you need to cancel your order."
            sections={sections}
        />
    );
}
