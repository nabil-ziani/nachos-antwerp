import HeaderLayoutDefault from "./layout-default";

const Header = ({ layout }: any) => {
    switch (layout) {
        case 1:
            return;

        case 2:
            return;

        default:
            return (
                <HeaderLayoutDefault />
            );
    }
};
export default Header;
