// Importing the SectionSvg component from the assets folder

import SectionSvg from "../assets/svg/SectionSvg";
import { earth_wall4, } from "../assets";

const Section = ({
  className,       // Additional custom CSS classes for styling
  id,             // Unique ID for the section, useful for navigation and accessibility
  crosses,        // Boolean to determine if cross elements should be displayed
  crossesOffset,  // Custom offset for the cross elements
  customPaddings, // Optional custom padding for the section
  children,       // Content to be rendered inside the section
  backgroundImage // New prop to pass the image URL/path
}) => {
  return (

    <div
      id={id}
      className={`
      relative 
      ${customPaddings ||
        `py-10 lg:py-16 xl:py-20 ${crosses ? "lg:py-32 xl:py-40" : ""}`
        } 
      ${className || ""}`}
      style={{
        backgroundImage: `url(${earth_wall4})`,  // Set background image
        backgroundPosition: 'center', // Center the image
        backgroundSize: 'cover', // Cover the entire section area
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        // height: '130vh', // Prevent image repetition
      }}
    >
      {/* Render child components/content inside the section */}
      {children}

      {/* Vertical lines on the left and right (hidden on small screens) */}
      <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:left-7.5 xl:left-10" />
      <div className="hidden absolute top-0 right-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:right-7.5 xl:right-10" />

      {/* Optional cross elements */}
      {crosses && (
        <>
          <div
            className={`hidden absolute top-0 left-7.5 right-7.5 h-0.25 bg-stroke-1 ${crossesOffset && crossesOffset} pointer-events-none lg:block xl:left-10 right-10 `}
          />
          <SectionSvg crossesOffset={crossesOffset} />
        </>
      )}
    </div>
  );
};

export default Section;

