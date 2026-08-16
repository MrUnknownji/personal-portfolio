import ContactInfo from "./ContactSectionComponents/ContactInfo";
import ContactInteraction from "./ContactSectionComponents/ContactInteraction";
import Title from "./ui/Title";

const ContactForm = () => {
  return (
    <section
      id="contact"
      className="deferred-section relative scroll-mt-24 py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal="up">
          <Title
            title="Get in Touch"
            subtitle='"Information flow is what the Internet is about. Information sharing is power." - Vint Cerf'
            showGlowBar={true}
            className="mb-16 md:mb-20 text-center"
          />
        </div>

        <div
          className="relative rounded-[2rem] overflow-hidden bg-[#0a0a0a]
                     border border-white/10 z-10"
          style={{ contain: "paint" }}
          data-reveal="scale"
        >
          {/* Subtle top sweeping accent */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-12 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
              <ContactInfo />
              <ContactInteraction />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
