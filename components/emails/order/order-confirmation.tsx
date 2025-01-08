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
        items: any[];
        total: number;
        customer: {
            name: string;
            email: string;
            address: string;
            postcode: string;
            city: string;
            message?: string;
        };
        delivery_method: string;
        payment_method: string;
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
                            src="https://nachosantwerp.be/img/logo-sm.png"
                            width="100"
                            height="auto"
                            alt="logo"
                            style={logo}
                        />

                        <Heading style={heading}>
                            Bedankt voor je bestelling!
                        </Heading>

                        <Text style={subText}>
                            {order.customer.email}
                        </Text>

                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Bestelling</Heading>
                            {order.items.map((item, index) => (
                                <div key={index}>
                                    <Row style={orderItemRow}>
                                        <Column>
                                            <Text style={itemTitle}>{item.title}</Text>
                                            {renderVariations(item)}
                                            <Text style={itemQuantity}>Aantal: {item.quantity}</Text>
                                        </Column>
                                        <Column align="right">
                                            <Text style={itemPrice}>€{(item.price * item.quantity).toFixed(2)}</Text>
                                        </Column>
                                    </Row>
                                    {index < order.items.length - 1 && <Hr style={itemDivider} />}
                                </div>
                            ))}
                            <Hr style={divider} />
                            <Row style={totalRow}>
                                <Column>
                                    <Text style={totalLabel}>Totaal</Text>
                                </Column>
                                <Column align="right">
                                    <Text style={totalAmount}>€{(order.total * 0.9).toFixed(2)}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Bezorggegevens</Heading>
                            <Text style={infoText}>
                                {order.customer.name}<br />
                                {order.customer.address}<br />
                                {order.customer.postcode} {order.customer.city}
                            </Text>
                            {order.customer.message && (
                                <>
                                    <Hr style={divider} />
                                    <Text style={messageText}>
                                        {order.customer.message}
                                    </Text>
                                </>
                            )}
                        </Section>

                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Bezorging & Betaling</Heading>
                            <Text style={infoText}>
                                Bezorgmethode: {order.delivery_method}<br />
                                Betaalmethode: {order.payment_method}
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
    margin: '0',
};

const itemDivider = {
    borderTop: 'dashed 1px rgba(26, 47, 51, 0.1)',
    margin: '12px 0',
};

const totalRow = {
    margin: '0',
};

const totalLabel = {
    fontSize: '18px',
    color: '#1a2f33',
    fontWeight: '700',
    margin: '0',
};

const totalAmount = {
    fontSize: '18px',
    color: '#1a2f33',
    fontWeight: '700',
    margin: '0',
};