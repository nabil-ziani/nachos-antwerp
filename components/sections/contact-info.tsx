import { contactInfoItems } from "@/constants"

const ContactInfoSection = () => {
  return (
    <>
      <div className="row" id="contact">
        <div className="col-lg-12">
          <div className="text-center">
            <div className="tst-suptitle tst-suptitle-center tst-mb-15">
              Heb je vragen?
            </div>
            <h3 className="tst-mb-30">
              Contacteer Ons
            </h3>
            <p className="tst-text tst-mb-60">
              We helpen je graag! Neem contact met ons op voor vragen, reserveringen of meer informatie.
            </p>
          </div>
        </div>

        {contactInfoItems.map((item, key) => (
          <div className="col-lg-4" key={`contact-info-item-${key}`}>
            <div className="tst-icon-box tst-mb-60">
              <img src={item.icon} alt={item.title} className="tst-mb-30" />
              <h5 className="tst-mb-30">{item.title}</h5>
              <div className="tst-text" dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
            {/* icon box end */}
          </div>
        ))}
      </div>
      {/* contact info end */}
    </>
  );
};

export default ContactInfoSection;