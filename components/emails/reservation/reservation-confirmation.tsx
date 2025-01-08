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

interface ReservationConfirmationEmailProps {
    reservation: {
        first_name: string
        last_name: string
        email: string
        phone: string
        date: string
        time: string
        guests: number
        message?: string
    }
}

export const ReservationConfirmationEmail = ({ reservation }: ReservationConfirmationEmailProps) => {
    const previewText = `Bedankt voor je reservering, ${reservation.first_name}!`

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
                            Bedankt voor je reservatie, {reservation.first_name}!
                        </Heading>

                        <Text style={subText}>
                            Bedankt voor je reservering bij Nacho's Antwerp. We kijken ernaar uit je te ontvangen!
                        </Text>

                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Reserveringsdetails</Heading>
                            <Text style={infoText}>
                                Datum: {new Date(reservation.date).toLocaleDateString('nl-BE')}<br />
                                Tijd: {reservation.time}<br />
                                Aantal personen: {reservation.guests}
                            </Text>
                            {reservation.message && (
                                <>
                                    <Hr style={divider} />
                                    <Text style={messageText}>
                                        {reservation.message}
                                    </Text>
                                </>
                            )}
                        </Section>

                        <Section style={detailsCard}>
                            <Heading as="h2" style={subheading}>Belangrijk</Heading>
                            <Text style={infoText}>
                                Als je je reservering wilt wijzigen of annuleren, neem dan contact met ons op via telefoon of email.
                            </Text>
                        </Section>

                        <Hr style={divider} />

                        <Section style={footerSection}>
                            <Text style={footerText}>
                                Nacho's Antwerp
                            </Text>
                            <Text style={footerContact}>
                                Diksmuidelaan 170, 2600 Berchem<br />
                                <a href="tel:+32467071874" style={footerLink}>+32 467 07 18 74</a><br />
                                <a href="mailto:info@nachosantwerp.be" style={footerLink}>info@nachosantwerp.be</a>
                            </Text>
                            <Text style={footerSocial}>
                                <a href="https://www.instagram.com/nachosantwerp" style={socialLink}>Instagram</a>
                                {' • '}
                                <a href="https://www.facebook.com/profile.php?id=61550605400792" style={socialLink}>Facebook</a>
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

export default ReservationConfirmationEmail

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