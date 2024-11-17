interface SocialLinkButtonProps {
  Icon: React.ElementType;
  href: string;
  label: string;
  color: string;
}

const SocialLinkButton = ({
  Icon,
  href,
  label,
  color,
}: SocialLinkButtonProps) => (
  <div className="relative group">
    <a
      href={href}
      className="social-link relative block"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="icon-wrapper relative">
        <div className="absolute -inset-[1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              background: `linear-gradient(90deg, ${color}30, ${color}, ${color}30)`,
            }}
          />
          <div className="absolute inset-[1px] rounded-full bg-gray-900/95 backdrop-blur-sm" />
        </div>

        <div
          className="icon-bg absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
          style={{
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 p-3 rounded-full bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm overflow-hidden transition-all duration-300 ease-in-out">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 rotate-45 translate-y-full group-hover:translate-y-[-60%] transition-transform duration-700">
              <div
                className="w-full h-[20%]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                }}
              />
            </div>
          </div>
          <Icon
            className="icon relative z-10 text-white transition-colors duration-300"
            size={20}
            style={{ color: `${color}` }}
          />
        </div>
      </div>
    </a>
  </div>
);

export default SocialLinkButton;
