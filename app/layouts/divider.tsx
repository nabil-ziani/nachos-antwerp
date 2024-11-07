"use client";

const DividerModule = ({ onlyBottom = true }) => {
    return (
        <>
            {/* divider */}
            <div className={onlyBottom ? "tst-spacer tst-spacer-only-bottom-space" : "tst-spacer"}></div>
            {/* divider end */}
        </>
    );
};

export default DividerModule;