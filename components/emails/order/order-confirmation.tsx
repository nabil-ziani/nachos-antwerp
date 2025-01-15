import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Row,
    Column
} from '@react-email/components';
import { Font } from '../custom-font';

interface OrderConfirmationEmailProps {
    order: {
        orderId: string;
        amount: number;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        customerCompany: string | null;
        customerVatNumber: string | null;
        deliveryMethod: 'pickup' | 'delivery';
        orderItems: {
            title: string;
            price: number;
            quantity: number;
            selectedVariations?: {
                [groupTitle: string]: {
                    name: string;
                    price: number;
                    quantity: number;
                }[];
            };
        }[];
        paymentMethod: 'cash' | 'payconiq';
        paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
        notes: string | null;
        deliveryAddress: {
            street: string;
            city: string;
            postcode: string;
        } | null;
        restaurantId: string;
    };
}

const renderVariations = (item: any) => {
    if (!item.selectedVariations) return null;

    return Object.entries(item.selectedVariations).map(([groupTitle, variations]: [string, any]) => (
        variations.map((variation: any) => (
            <Text key={`${groupTitle}-${variation.name}`} style={variationStyle}>
                {variation.name}
                {variation.price > 0 && ` (+€${variation.price.toFixed(2)})`}
                {variation.quantity > 1 && ` x${variation.quantity}`}
            </Text>
        ))
    ));
};

export const OrderConfirmationEmail = ({ order }: OrderConfirmationEmailProps) => {
    const previewText = `Bedankt voor je bestelling bij Nacho's Antwerp`

    return (
        <Html>
            <Head>
                <Font />
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={notificationCard}>
                        <img
                            src="https://tacosanto.be/img/logo/logo-dark.png"
                            width="200"
                            height="auto"
                            alt="Taco Santo"
                            style={logo}
                        />
                        <Heading as="h1" style={heading}>
                            Bedankt voor je bestelling!
                        </Heading>
                        <Text style={subText}>
                            We hebben je bestelling #{order.orderId} goed ontvangen.
                        </Text>

                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Bestelling</Heading>
                            {order.orderItems.map((item, index) => (
                                <div key={index}>
                                    <Row style={orderItemRow}>
                                        <Column>
                                            <Text style={itemTitle}>{item.title}</Text>
                                            {item.selectedVariations && renderVariations(item)}
                                            <Text style={itemQuantity}>Aantal: {item.quantity}</Text>
                                        </Column>
                                        <Column align="right">
                                            <Text style={itemPrice}>€{(item.price * item.quantity).toFixed(2)}</Text>
                                        </Column>
                                    </Row>
                                    {index < order.orderItems.length - 1 && <Hr style={itemDivider} />}
                                </div>
                            ))}

                            <Hr style={divider} />

                            <Row style={totalRow}>
                                <Column>
                                    <Text style={totalLabel}>Totaal</Text>
                                </Column>
                                <Column align="right">
                                    <Text style={totalAmount}>€{order.amount.toFixed(2)}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Bezorggegevens</Heading>
                            <Text style={infoText}>
                                {order.customerName}<br />
                                {order.customerPhone}<br />
                                {order.customerEmail}
                            </Text>
                            {order.deliveryAddress && (
                                <Text style={infoText}>
                                    {order.deliveryAddress.street}<br />
                                    {order.deliveryAddress.postcode} {order.deliveryAddress.city}
                                </Text>
                            )}
                            {order.notes && (
                                <>
                                    <Hr style={divider} />
                                    <Text style={messageText}>
                                        {order.notes}
                                    </Text>
                                </>
                            )}
                        </Section>

                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Bezorging & Betaling</Heading>
                            <Text style={infoText}>
                                Bezorgmethode: {order.deliveryMethod === 'delivery' ? 'Levering' : 'Afhalen'}<br />
                                Betaalmethode: {order.paymentMethod === 'cash' ? 'Cash' : 'Payconiq'}
                            </Text>
                        </Section>

                        <Hr style={divider} />

                        <Section style={footerSection}>
                            <Text style={footerText}>
                                Vragen over je bestelling?
                            </Text>
                            <Text style={footerContact}>
                                Bel of WhatsApp ons op{' '}
                                <a href="tel:+32468198849" style={footerLink}>
                                    +32 468 19 88 49
                                </a>
                                <br />
                                Of mail naar{' '}
                                <a href="mailto:info@tacosanto.be" style={footerLink}>
                                    info@tacosanto.be
                                </a>
                            </Text>
                            <Text style={footerSocial}>
                                Volg ons op{' '}
                                <a href="https://www.instagram.com/tacosanto.be" style={socialLink}>
                                    Instagram
                                </a>
                                {' '}en{' '}
                                <a href="https://www.facebook.com/tacosanto.be" style={socialLink}>
                                    Facebook
                                </a>
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

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

const notificationCard = {
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

const divider = {
    borderTop: 'dotted 4px rgba(26, 47, 51, 0.2)',
    margin: '30px 0',
};

const subText = {
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

const infoText = {
    fontSize: '16px',
    color: '#1a2f33',
    lineHeight: '1.5',
    margin: '0 0 12px',
};

const messageText = {
    fontSize: '16px',
    color: '#64748b',
    fontStyle: 'italic',
    margin: '0',
};

const orderItemRow = {
    margin: '0 0 12px',
};

const itemTitle = {
    fontSize: '16px',
    color: '#1a2f33',
    fontWeight: '600',
    margin: '0 0 4px',
};

const variationStyle = {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 2px 12px',
    fontStyle: 'italic',
};

const itemQuantity = {
    fontSize: '14px',
    color: '#64748b',
    margin: '4px 0 0',
};

const itemPrice = {
    fontSize: '16px',
    color: '#1a2f33',
    fontWeight: '600',
};

const itemDivider = {
    borderTop: 'solid 1px #e2e8f0',
    margin: '12px 0',
};

const totalRow = {
    marginTop: '12px',
};

const totalLabel = {
    fontSize: '18px',
    color: '#1a2f33',
    fontWeight: '600',
};

const totalAmount = {
    fontSize: '18px',
    color: '#1a2f33',
    fontWeight: '600',
};

const footerSection = {
    textAlign: 'center' as const,
    marginTop: '20px',
};

const footerText = {
    color: '#1a2f33',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 10px',
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const footerContact = {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 15px',
};

const footerLink = {
    color: '#64748b',
    textDecoration: 'none',
};

const footerSocial = {
    color: '#64748b',
    fontSize: '14px',
    margin: '0',
};

const socialLink = {
    color: '#1a2f33',
    textDecoration: 'none',
    fontWeight: '600',
};
