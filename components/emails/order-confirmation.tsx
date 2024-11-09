import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import { Font } from './custom-font';
interface OrderConfirmationEmailProps {
    order: {
        id: string;
        type: 'delivery' | 'pickup';
        status: string;
        items: Array<{
            name: string;
            quantity: number;
            price: number;
            options?: string;
        }>;
        total: number;
        paymentMethod: string;
        paymentStatus: string;
    };
    customer: {
        name?: string;
        address?: string;
    };
    restaurant: {
        name: string;
        address: string;
    };
}

export function OrderConfirmationEmail({ order, customer, restaurant }: OrderConfirmationEmailProps) {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Josefin Sans"
                    fontWeight={400}
                    fallbackFontFamily={['Arial', 'Helvetica', 'sans-serif']}
                />
            </Head>
            <Preview>Bedankt voor je bestelling bij {restaurant.name} #{order.id}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Order Confirmation Card */}
                    <Section style={confirmationCard}>
                        {/* Logo */}
                        <img
                            src="https://nachosantwerp.be/img/logo-sm.png"
                            width="100"
                            height="auto"
                            alt={restaurant.name}
                            style={logo}
                        />

                        {/* Greeting */}
                        <Heading style={heading}>
                            Bedankt voor je bestelling!
                        </Heading>

                        <Text style={orderIdText}>
                            Bestelling #{order.id}
                        </Text>

                        {/* Order Details Card */}
                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Overzicht bestelling</Heading>
                            {order.items.map((item, index) => (
                                <div key={index} style={orderItem}>
                                    <Text style={itemText}>
                                        {item.quantity}x {item.name}
                                        <span style={itemPrice}>€{item.price.toFixed(2)}</span>
                                    </Text>
                                    {item.options && (
                                        <Text style={itemOptions}>{item.options}</Text>
                                    )}
                                </div>
                            ))}
                            <Hr style={divider} />
                            <Text style={totalPrice}>
                                Totaal: €{order.total.toFixed(2)}
                            </Text>
                        </Section>

                        {/* Delivery/Pickup Info Card */}
                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>
                                {order.type === 'delivery' ? 'Leveringsadres' : 'Afhaaladres'}
                            </Heading>
                            <Text style={infoText}>
                                {order.type === 'delivery' ? customer.address : restaurant.address}
                            </Text>
                            <Text style={estimatedTime}>
                                Geschatte {order.type === 'delivery' ? 'levertijd' : 'afhaaltijd'}:{' '}
                                {order.type === 'delivery' ? 'ongeveer 60 minuten' : '30-45 minuten'}
                            </Text>
                        </Section>

                        {/* Payment Info Card */}
                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Betaling</Heading>
                            <Text style={paymentStatus}>
                                Status: {order.paymentStatus === 'completed' ? 'Betaald' : 'In afwachting'}
                            </Text>
                            <Text style={infoText}>
                                Methode: {order.paymentMethod === 'payconiq' ? 'Payconiq' : 'Contant'}
                            </Text>
                        </Section>

                        {/* Contact Info */}
                        <Text style={footerText}>
                            Vragen over je bestelling?
                            <br />
                            Contacteer ons via{' '}
                            <Link href="mailto:info@nachosantwerp.be" style={link}>
                                info@nachosantwerp.be
                            </Link>
                            {' '}of{' '}
                            <Link href="tel:+32467071874" style={link}>
                                +32 467 07 18 74
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Updated styles
const main = {
    backgroundColor: '#242424',
    fontFamily: '"Josefin Sans", Arial, sans-serif',
    margin: '0',
    padding: '40px 20px',
};

const container = {
    margin: '0 auto',
    maxWidth: '600px',
};

const confirmationCard = {
    backgroundColor: '#f8fafc',
    padding: '40px 30px',
    borderRadius: '12px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const logo = {
    margin: '0 auto 30px',
};

const heading = {
    color: '#1a2f33',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 10px',
    fontFamily: '"Josefin Sans", Arial, sans-serif',
};

const orderIdText = {
    color: '#64748b',
    fontSize: '16px',
    margin: '0 0 30px',
};

const detailsCard = {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
};

const subheading = {
    color: '#1a2f33',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 16px',
};

const orderItem = {
    marginBottom: '12px',
};

const itemText = {
    fontSize: '16px',
    color: '#1a2f33',
    margin: '0',
    display: 'flex',
    justifyContent: 'space-between',
};

const itemPrice = {
    fontWeight: '600',
};

const itemOptions = {
    fontSize: '14px',
    color: '#64748b',
    margin: '4px 0 0',
};

const divider = {
    borderTop: '1px solid #e2e8f0',
    margin: '20px 0',
};

const totalPrice = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a2f33',
    textAlign: 'right' as const,
    margin: '0',
};

const infoText = {
    fontSize: '16px',
    color: '#1a2f33',
    lineHeight: '1.5',
    margin: '0 0 12px',
};

const estimatedTime = {
    fontSize: '16px',
    color: '#1a2f33',
    margin: '12px 0 0',
    padding: '12px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
};

const paymentStatus = {
    fontSize: '16px',
    color: '#0369a1',
    margin: '0 0 12px',
    padding: '12px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
    fontWeight: '500',
};

const footerText = {
    fontSize: '14px',
    color: '#64748b',
    margin: '30px 0 0',
};

const link = {
    color: '#f39c12',
    textDecoration: 'none',
};