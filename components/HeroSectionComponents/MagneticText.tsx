interface MagneticTextProps {
  children: string;
  className?: string;
  as?: React.ElementType;
}

export const MagneticText = ({
  children,
  className = "",
  as: Component = "span",
}: MagneticTextProps) => {
  return <Component className={`inline-block ${className}`}>{children}</Component>;
};
