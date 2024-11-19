import SectionSvg from '../assets/svg/SectionSvg'; // SVG component for additional decorative elements.

const Section = ({
    className,
    id,
    crosses,
    crossesOffset,
    customPaddings,
    children,
  }) => {
    return (
      <div
        id={id} // Set the section's ID for navigation or reference.
        className={`relative ${
          customPaddings || 
          `py-10 lg:py-16 xl:py-20 ${crosses ? 'lg:py-32 xl:py-40' : ''} ${className || ''}`
        }`} // Apply custom paddings or default responsive paddings, including extra padding if `crosses` is enabled.
      >
        {children} {/* Render the content passed as children. */}
  
        {/* Left vertical line (visible on medium and larger screens). */}
        <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:left-7.5 xl:left-10" />
  
        {/* Right vertical line (visible on medium and larger screens). */}
        <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:right-7.5 xl:right-10" />
  
        {crosses && (
          <>
            {/* Top horizontal line with optional offset styling (visible on large and larger screens). */}
            <div
              className={`hidden absolute top-0 left-7.5 right-7.5 h-0.25 bg-stroke-1 ${
                crossesOffset && crossesOffset
              } pointer-events-none lg:block xl:left-10 right-10`}
            />
            <SectionSvg crossesOffset={crossesOffset} /> {/* Render SVG with crosses if enabled. */}
          </>
        )}
      </div>
    );
  };
  
  export default Section;