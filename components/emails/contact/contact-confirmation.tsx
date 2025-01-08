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
} from '@react-email/components'
import { Font } from '../custom-font';

interface ContactConfirmationEmailProps {
    contact: {
        first_name: string
        last_name: string
        email: string
        phone: string
        message: string
    }
}

export const ContactConfirmationEmail = ({ contact }: ContactConfirmationEmailProps) => {
    const previewText = `Bedankt voor je bericht, ${contact.first_name}!`

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
                            Bedankt voor je bericht, {contact.first_name}!
                        </Heading>

                        <Text style={subText}>
                            We hebben je bericht goed ontvangen. We zullen zo snel mogelijk contact met je opnemen.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

export default ContactConfirmationEmail

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

const subText = {
    color: '#64748b',
    fontSize: '16px',
    margin: '0 0 30px',
    fontFamily: '"Century Gothic", "Futura", "Trebuchet MS", Arial, sans-serif',
};
