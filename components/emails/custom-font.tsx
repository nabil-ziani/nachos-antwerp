import Head from "next/head";

export const Font = ({
    fontFamily,
    fontStyle = 'normal',
    fontWeight = 400,
    fallbackFontFamily = ['Arial', 'Helvetica', 'sans-serif'],
}: {
    fontFamily: string;
    fontStyle?: string;
    fontWeight?: number;
    fallbackFontFamily?: string[];
}) => {
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href={`https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600;700&display=swap&subset=latin`}
                />
            </Head>
            <style>
                {`
                    * {
                        font-family: '${fontFamily}', ${fallbackFontFamily.join(', ')} !important;
                        font-style: ${fontStyle};
                        font-weight: ${fontWeight};
                    }
                `}
            </style>
        </>
    );
};