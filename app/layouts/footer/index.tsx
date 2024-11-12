import FooterLayoutDefault from "./layout-default";

const Footer = ({ layout }: any) => {
    switch (layout) {
        case 1:
            return;
        case 2:
            return;
        default:
            return <FooterLayoutDefault />;
    }
};
export default Footer;