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
    Text
} from '@react-email/components';
import { Font } from './custom-font';
interface OrderConfirmationEmailProps {
    order: {
        id: string;
        type: 'delivery' | 'pickup';
        status: string;
        items: Array<{
            title: string;
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
                <Font />
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
                            Bestelling #{order.id.toUpperCase()}
                        </Text>

                        {/* Order Details Card */}
                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Overzicht bestelling</Heading>
                            {order.items.map((item, index) => (
                                <div key={index} style={orderItem}>
                                    <Text style={itemText}>
                                        <span>
                                            <span style={itemQuantity}>{item.quantity}x</span>
                                            {item.title}
                                        </span>
                                        <span style={itemPrice}>
                                            <span style={currencySymbol}>€</span>
                                            {item.price.toFixed(2)}
                                        </span>
                                    </Text>
                                    {item.options && (
                                        <Text style={itemOptions}>{item.options}</Text>
                                    )}
                                </div>
                            ))}
                            <Hr style={divider} />
                            <Text style={totalPrice}>
                                <span>Totaal:</span>
                                <span>€{order.total.toFixed(2)}</span>
                            </Text>
                        </Section>

                        {/* Delivery/Pickup Info Card */}
                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>
                                {order.type === 'delivery' ? 'Leveringsadres' : 'Afhaaladres'}
                            </Heading>
                            <Text style={infoText}>
                                {order.type === 'delivery' && customer.address
                                    ? customer.address
                                    : restaurant.address}
                            </Text>
                            <Text style={estimatedTimeBox}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    style={clockIcon}
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                                <span style={estimatedTimeText}>
                                    Geschatte {order.type === 'delivery' ? 'levertijd' : 'afhaaltijd'}:{' '}
                                    {order.type === 'delivery' ? '45-60 minuten' : '30-45 minuten'}
                                </span>
                            </Text>
                        </Section>

                        {/* Contact Info */}
                        <Text style={footerText}>
                            Vragen over je bestelling? Contacteer ons via
                            <br />
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
    fontFamily: '"Century Gothic", "Futura", "Trebuchet MS", Arial, sans-serif',
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
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const orderIdText = {
    color: '#64748b',
    fontSize: '16px',
    margin: '0 0 30px',
    fontFamily: '"Century Gothic", "Futura", "Trebuchet MS", Arial, sans-serif',
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
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const orderItem = {
    marginBottom: '12px',
    color: '#64748b',
};

const itemText = {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: '"Century Gothic", "Futura", "Trebuchet MS", Arial, sans-serif',
};

const itemQuantity = {
    marginRight: '8px',
};

const itemOptions = {
    fontSize: '12px',
    margin: '4px 0 0',
    paddingLeft: '24px',
};

const itemPrice = {
    fontSize: '14px',
};

const currencySymbol = {
    marginRight: '2px',
    fontSize: '12px',
};

const divider = {
    borderTop: 'dotted 4px rgba(26, 47, 51, 0.2)',
    margin: '30px 0',
};

const totalPrice = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 12px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a2f33',
    textAlign: 'right' as const,
    margin: '0',
    fontFamily: '"Century Gothic", "Futura", "Trebuchet MS", Arial, sans-serif',
};

const infoText = {
    fontSize: '16px',
    color: '#1a2f33',
    lineHeight: '1.5',
    margin: '0 0 12px',
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

const estimatedTimeBox = {
    fontSize: '16px',
    color: '#ffffff',
    margin: '12px 0 0',
    backgroundColor: '#f39c12',
    borderRadius: '5px',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    position: 'relative' as const,
    fontWeight: '800',
    letterSpacing: '1px',
    fontFamily: '"Century Gothic", "Futura", "Trebuchet MS", Arial, sans-serif',
    cursor: 'default'
};

const estimatedTimeText = {
    fontFamily: '"Century Gothic", "Futura", "Trebuchet MS", Arial, sans-serif',
    color: '#ffffff',
    fontWeight: '500',
    position: 'relative' as const,
    top: '1px'
};

const clockIcon = {
    marginRight: '10px',
    width: '20px',
    height: '20px'
};