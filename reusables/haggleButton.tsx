interface HaggleButtonProps {
  text: string;
  onClick: () => void;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "py-2 text-sm",
  md: "py-3 text-base",
  lg: "py-4 text-lg",
};

const HaggleButton = ({
  text,
  onClick,
  fullWidth = true,
  size = "md",
}: HaggleButtonProps) => {
  return (
    <button
      onClick={onClick}
      type='submit'
      className={`
        bg-primary text-white font-semibold rounded-xl
        transition-all duration-200 ease-in-out
        hover:bg-primary/90 hover:shadow-md
        active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50
        ${sizeClasses[size]} ${fullWidth ? "w-full" : "px-6"} cursor-pointer
      `}
    >
      {text}
    </button>
  );
};

export default HaggleButton;
