import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "./Button";
import { HamburgerMenu } from "./design/Header";
import MenuSvg from "../assets/svg/MenuSvg";
import { auth } from "../Firebase";
import defaultProfile from "../assets/my/avataaars (1).svg";
import { earth } from "../assets";
import { navigation } from "../constants";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const signupSuccess = location.state?.signupSuccess;
    const hasShownPopup = localStorage.getItem("hasShownSignupPopup");

    if (signupSuccess && !hasShownPopup) {
      setShowPopup(true);
      window.history.replaceState({}, document.title, "/");
      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
        setShowPopup(false);
        localStorage.setItem("hasShownSignupPopup", "true");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home page
      window.location.reload(); // Refresh the page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem("hasShownSignupPopup", "true");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="grid grid-cols-[auto,1fr,auto] items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-2 relative">
        {/* Logo - Left column */}
        <a className="block w-[8rem] xl:mr-6" href="/">
          <img src={earth} width={190} height={40} alt="Climate" className="flex" />
        </a>

        {/* Navigation - Center column */}
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === location.hash ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>
          <HamburgerMenu />
        </nav>

        {/* Right column - User section or signin/signup */}
        <div className="flex items-center justify-end">
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-n-6 mr-2 animate-pulse" />
              <div className="w-20 h-6 bg-n-6 rounded hidden lg:block animate-pulse" />
            </div>
          ) : user ? (
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <img
                  src={user.photoURL || defaultProfile}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-n-1 font-semibold hidden lg:block">
                  {user.displayName || "User"}
                </span>
              </div>
              <Button className="lg:flex" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <a
                href="/Signup"
                className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
              >
                New Account
              </a>
              <Button className="hidden lg:flex" href="/login">
                Sign In
              </Button>
            </>
          )}
          <Button className="ml-4 lg:hidden" px="px-3" onClick={toggleNavigation}>
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>

        {/* Signup Success Popup */}
        {showPopup && (
          <div className="absolute bottom-[-4rem] right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center z-20">
            <span className="mr-2 text-sm">Signup successful! Please verify your email.</span>
            <button
              onClick={closePopup}
              className="text-white font-bold text-lg focus:outline-none"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;