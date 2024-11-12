import Head from "next/head";

export const Font = () => {
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href={`https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap&subset=latin`}
                />
            </Head>
            <style>
                {`
                    h1, h2, h3, h4, h5, h6 {
                        font-family: 'Playfair Display', Georgia, 'Times New Roman', serif !important;
                        font-weight: 700;
                    }
                    body, p, div, span {
                        font-family: 'Century Gothic', 'Futura', 'Trebuchet MS', Arial, sans-serif !important;
                        font-weight: 400;
                    }
                `}
            </style>
        </>
    );
};