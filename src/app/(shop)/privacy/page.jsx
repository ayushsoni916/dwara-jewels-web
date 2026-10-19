
import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy | Dwara Jewels',
    description:
        'Learn how Dwara Jewels collects, uses, protects, and manages customer information.',
};

const sections = [
    {
        title: '1. Information We Collect',
        items: [
            'Personal Information: When you create an account, place an order, or contact us, we may collect your name, mobile number, email address, billing and shipping addresses, and order details.',
            'Payment Information: Payments are processed through third-party payment gateways such as Razorpay. Payment-related information is handled by the payment provider according to its security and privacy practices. We may receive payment references, transaction status, and related records for order processing.',
            'Technical Information: We may collect device information, browser type, IP address, and usage information necessary for website operation, security, and performance.',
            'Communication Information: If you contact our customer support team, we may retain your messages and relevant order information to help resolve your request.',
        ],
    },
    {
        title: '2. How We Use Your Information',
        items: [
            'To create and manage your Dwara Jewels account.',
            'To process orders, verify payments, and coordinate shipping and delivery.',
            'To send OTPs, order confirmations, delivery updates, and important service communications.',
            'To respond to cancellation, return, exchange, refund, and warranty requests.',
            'To improve our website, customer experience, and security.',
            'To send promotional communications where you have provided the necessary consent or where otherwise permitted by applicable law.',
        ],
    },
    {
        title: '3. Sharing of Information',
        items: [
            'We may share necessary customer information with payment service providers, delivery and logistics partners, OTP and communication providers, hosting providers, and other service partners involved in operating our business.',
            'We may disclose information where required by applicable law, a valid legal process, or to protect against fraud and unauthorized activity.',
            'We do not sell customer personal information to third parties for their independent marketing purposes.',
        ],
    },
    {
        title: '4. Payment Security',
        items: [
            'Online payments are processed through authorized third-party payment gateway services.',
            'We do not intentionally collect or store complete card numbers, card security codes (CVV), or banking passwords on our website servers.',
            'Customers should never share payment passwords, OTPs, or sensitive banking credentials with anyone, including individuals claiming to represent Dwara Jewels.',
        ],
    },
    {
        title: '5. Cookies & Website Technologies',
        items: [
            'Our website may use cookies or similar technologies for secure login sessions, website functionality, cart management, security, and user preferences.',
            'Where analytics or marketing technologies are used, their purpose and applicable consent choices will be provided as required by law.',
            'You may manage cookies through your browser settings. Disabling essential cookies may affect login and checkout functionality.',
        ],
    },
    {
        title: '6. Data Retention',
        items: [
            'We retain personal information for as long as reasonably necessary to provide our services, manage accounts, fulfill orders, address customer requests, and comply with legal, tax, and accounting obligations.',
            'When information is no longer required, we take reasonable steps to delete, anonymize, or securely retain it where legal obligations apply.',
        ],
    },
    {
        title: '7. Data Protection',
        items: [
            'We use reasonable technical and organizational safeguards intended to protect personal information against unauthorized access, misuse, disclosure, or alteration.',
            'No internet-based service can guarantee absolute security. Customers are encouraged to protect their devices, credentials, and OTPs.',
        ],
    },
    {
        title: '8. Your Privacy Rights',
        items: [
            'Subject to applicable Indian data protection laws, you may request access to information about your personal data, correction of inaccurate information, or deletion of eligible personal information.',
            'You may withdraw consent where processing is based on consent, subject to applicable legal requirements and service limitations.',
            'You may contact us to raise privacy concerns or request assistance with your personal information.',
        ],
    },
    {
        title: '9. Third-Party Services',
        items: [
            'Our website may use external payment gateways, shipping services, and other service providers. Their privacy practices may be governed by their respective policies.',
            'We encourage customers to review the privacy policies of third-party services where applicable.',
        ],
    },
    {
        title: '10. Children’s Privacy',
        items: [
            'Our website and shopping services are not intended for children to use independently where parental or guardian consent is legally required.',
            'If we become aware of personal information processed without required consent, we will take appropriate steps in accordance with applicable law.',
        ],
    },
    {
        title: '11. Changes to This Privacy Policy',
        items: [
            'Dwara Jewels may update this Privacy Policy to reflect changes in our services, business practices, or legal requirements.',
            'Updated versions will be published on this page with a revised effective date. Material changes will be communicated where required by law.',
        ],
    },
    {
        title: '12. Contact Us',
        items: [
            'For questions, privacy concerns, correction requests, or deletion requests, contact Dwara Jewels at dwarajewels.info@gmail.com.',
            'Business Address: 57A, Gayatri Nagar 2nd, Sanganer, Jaipur, Rajasthan – 302029, India.',
            'Support Hours: Monday to Saturday, 10:00 AM – 7:00 PM IST.',
        ],
    },
];

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white">
            <header className="bg-[#FCF6F2] px-5 py-14 md:py-20 text-center">
                <p className="text-[#BF8F5F] text-xs uppercase tracking-[0.3em] mb-4">
                    DWARA JEWELS
                </p>

                <h1 className="font-serif text-3xl md:text-5xl text-[#222222]">
                    Privacy Policy
                </h1>

                <p className="mt-4 text-sm text-gray-500">
                    Last Updated: October 19, 2026
                </p>
            </header>

            <section className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-16">
                <div className="border-l-2 border-[#BF8F5F] pl-5 mb-12">
                    <p className="text-gray-600 text-sm md:text-base leading-8">
                        At Dwara Jewels, we value your privacy.
                        This Privacy Policy explains how we collect,
                        use, share, retain, and protect your personal
                        information when you visit our website,
                        create an account, purchase jewellery, or
                        contact our customer support team.
                    </p>
                </div>

                <div className="space-y-10">
                    {sections.map(section => (
                        <section
                            key={section.title}
                            className="border-b border-[#BF8F5F]/20 pb-8"
                        >
                            <h2 className="font-serif text-xl md:text-2xl text-[#222222] mb-5">
                                {section.title}
                            </h2>

                            <div className="space-y-4">
                                {section.items.map((item, index) => (
                                    <p
                                        key={index}
                                        className="text-gray-600 text-sm md:text-base leading-7"
                                    >
                                        {item}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="bg-[#FCF6F2] p-6 md:p-8 mt-12">
                    <h2 className="font-serif text-xl text-[#222222] mb-3">
                        Need Help With Your Privacy?
                    </h2>

                    <p className="text-sm text-gray-600 mb-4 leading-7">
                        Contact our support team for privacy-related
                        questions or requests concerning your personal data.
                    </p>

                    <a
                        href="mailto:dwarajewels.info@gmail.com?subject=Privacy%20Request"
                        className="text-[#BF8F5F] font-semibold hover:underline break-all"
                    >
                        dwarajewels.info@gmail.com
                    </a>
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="inline-block border border-[#BF8F5F] text-[#BF8F5F] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#BF8F5F] hover:text-white transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </section>
        </main>
    );
}
