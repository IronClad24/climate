import { useLocation } from "react-router-dom"; // Hook to access the current URL's pathname.
import { useState } from "react"; // Hook for managing component state.
import { disablePageScroll, enablePageScroll } from "scroll-lock"; // Utility functions to enable/disable scrolling.

import { earth } from "../assets"; // Logo image.
import { navigation } from "../constants"; // Navigation menu items.
import Button from "./Button"; // Reusable button component.
import MenuSvg from "../assets/svg/MenuSvg"; // SVG component for the hamburger menu icon.
import { HamburgerMenu } from "./design/Header"; // Menu component.

const Header = () => {
  const pathname = useLocation(); // Get current path for active link detection.
  const [openNavigation, setopenNavigation] = useState(false); // Track menu open/close state.

  // Toggle navigation menu and scroll-lock.
  const toggleNavigation = () => {
    if (openNavigation) {
      setopenNavigation(false);
      enablePageScroll();
    } else {
      setopenNavigation(true);
      disablePageScroll();
    }
  };

  // Close navigation menu on link click.
  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setopenNavigation(false);
  };

  return (
    <div className={` fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${openNavigation ? 'bg-n-8' : 'bg-n-8/90 backdrop-blur-sm'}`}>
      {/* Header Container */}
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-2 ">
        {/* Logo */}
        <a className="block w-[8rem] xl:mr-6 " href="#hero">
          <img src={earth} width={190} height={40} alt="Climate" className="flex" />
        </a>

        {/* Navigation Links */}
        <nav className={` ${ openNavigation ? 'flex' : 'hidden' } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}>
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a key={item.id} href={item.url} onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${item.onlyMobile ? "lg:hidden" : ""} px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${item.url === pathname.hash ? 'z-2 lg:text-n-1' : 'lg:text-n-1/50'} lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* Hamburger Menu for mobile */}
          <HamburgerMenu />
        </nav>

        {/* Signup and Sign-in Buttons */}
        <a href="#signup" className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block">
          New Account
        </a>
        <Button className="hidden lg:flex" href="#login">
          Sign In
        </Button>

        {/* Hamburger Icon for toggling menu */}
        <Button className="ml-auto lg:hidden" px="px-3" onClick={toggleNavigation}>
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
