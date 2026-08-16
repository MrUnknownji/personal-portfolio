import HireBadge from "./HireBadge";
import ViewProjectsButton from "./ViewProjectsButton";
import SocialLinks from "./SocialLinks";

const HeroContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col justify-center space-y-10 py-8 sm:py-12">
      <div className="space-y-8">
        <div className="hire-badge">
          <HireBadge />
        </div>
        <div className="hero-text">{children}</div>
      </div>

      <div className="actions-section flex flex-col items-center gap-6 sm:flex-row">
        <ViewProjectsButton />
        <div className="relative">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
