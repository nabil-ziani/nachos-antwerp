import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Section,
    Row,
    Column,
    Link,
    Img,
    Hr,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface OrderItem {
    title: string;
    quantity: number;
    price: number;
    currency: string;
}

interface OrderConfirmationEmailProps {
    order: {
        id: string;
        items: OrderItem[];
        total: number;
        deliveryMethod: string;
    };
    customer: {
        name: string;
        email: string;
    };
}

export function OrderConfirmationEmail({ order, customer }: OrderConfirmationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Bedankt voor je bestelling bij Nacho's Antwerp</Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="max-w-2xl mx-auto p-8">
                        {/* Header */}
                        <Section className="text-center mb-8">
                            <Img
                                src="https://nachosantwerp.be/img/logo-sm.png"
                                alt="Nacho's Antwerp"
                                width="200"
                                height="50"
                                className="mx-auto mb-4"
                            />
                        </Section>

                        {/* Main Content */}
                        <Section className="bg-[#f8f8f8] rounded-lg p-8 mb-8">
                            <Heading className="text-2xl font-bold text-[#1a2f33] mb-4">
                                Hallo {customer.name}!
                            </Heading>
                            <Text className="text-[#64748b] mb-6">
                                Bedankt voor je bestelling bij Nacho's Antwerp. Hieronder vind je een overzicht van je bestelling.
                            </Text>

                            {/* Order Details */}
                            <Section className="bg-white rounded-lg p-6 mb-6">
                                <Heading className="text-lg font-bold text-[#1a2f33] mb-4">
                                    Bestelling #{order.id}
                                </Heading>

                                {order.items.map((item, index) => (
                                    <Row key={index} className="py-2">
                                        <Column className="text-[#64748b]">
                                            <Text className="m-0">
                                                {item.quantity}x {item.title}
                                            </Text>
                                        </Column>
                                        <Column className="text-right text-[#64748b]">
                                            <Text className="m-0">
                                                {item.currency} {(item.price * item.quantity).toFixed(2)}
                                            </Text>
                                        </Column>
                                    </Row>
                                ))}

                                <Hr className="border-t border-gray-200 my-4" />

                                <Row className="font-bold">
                                    <Column>
                                        <Text className="text-[#1a2f33] m-0">Totaal:</Text>
                                    </Column>
                                    <Column className="text-right">
                                        <Text className="text-[#1a2f33] m-0">
                                            € {order.total.toFixed(2)}
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>

                            {/* Delivery Method */}
                            <Section className="bg-white rounded-lg p-6 mb-6">
                                <Heading className="text-lg font-bold text-[#1a2f33] mb-2">
                                    Bezorggegevens
                                </Heading>
                                <Text className="text-[#64748b] m-0">
                                    Bezorgmethode: {order.deliveryMethod === 'leveren' ? 'Bezorgen' : 'Afhalen'}
                                </Text>
                            </Section>
                        </Section>

                        {/* Footer */}
                        <Section className="text-center text-[#64748b]">
                            <Text className="mb-4">
                                Heb je vragen over je bestelling? Neem dan contact met ons op via{' '}
                                <Link
                                    href="mailto:info@nachosantwerp.be"
                                    className="text-[#e4b55b] underline"
                                >
                                    info@nachosantwerp.be
                                </Link>
                            </Text>
                            <Text className="text-sm">
                                © 2024 Nacho's Antwerp. Alle rechten voorbehouden.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
} 