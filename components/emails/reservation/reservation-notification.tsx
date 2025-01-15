import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text
} from '@react-email/components';
import { Font } from '../custom-font';

interface ReservationNotificationEmailProps {
    reservation: {
        customerName: string;
        customerEmail: string;
        phoneNumber: string;
        date: string;
        time: string;
        numberOfPeople: string;
        message: string;
    };
}

export const ReservationNotificationEmail = ({ reservation }: ReservationNotificationEmailProps) => {
    return (
        <Html>
            <Head>
                <Font />
            </Head>
            <Preview>Nieuwe reservering bij Nacho's Antwerp</Preview>
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
                            Nieuwe reservering!
                        </Heading>

                        <Text style={subText}>
                            {reservation.customerEmail}
                        </Text>

                        <Text style={subText}>
                            {reservation.phoneNumber}
                        </Text>

                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Details</Heading>
                            <Text style={infoText}>
                                {reservation.customerName} heeft een reservering gemaakt voor {reservation.date} om {reservation.time} voor {reservation.numberOfPeople} personen.
                            </Text>

                            <Hr style={divider} />

                            <Text style={subText}>
                                {reservation.message}
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