// Import the ButtonSvg component
import ButtonSvg from "../assets/svg/ButtonSvg";

// Define a reusable Button component
const Button = ({ className, href, onClick, children, px, white }) => {
  
  // Define dynamic class names for the button
  const classes = `button relative inline-flex items-center justify-center h-11 transition-colors hover:text-color-1 ${px || "px-7"
    } ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
  const spanClasses = "relative z-10";

  // Render the button element when "href" is not provided
  const renderButton = () => (
    <button className={classes} onClick={onClick}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </button>
  );

  // Render the link element when "href" is provided
  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </a>
  );

  // Conditionally render a link or a button based on "href"
  return href ? renderLink() : renderButton();
};

export default Button;
