import React, { useState } from "react";
import {
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  BriefcaseBusiness,
  Menu,
  X,
  UserPlus,
  Upload,
  LogIn,
} from "lucide-react";
import { useTheme } from "../theme/DarkMode";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";

const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const themes = [
    { name: "light", icon: Sun },
    { name: "dark", icon: Moon },
    { name: "system", icon: Monitor },
  ];

  const currentThemeData = themes.find((theme) => theme.name === currentTheme);

  const getNextTheme = () => {
    const currentIndex = themes.findIndex(
      (theme) => theme.name === currentTheme
    );
    return themes[(currentIndex + 1) % themes.length].name;
  };

  return (
    currentThemeData && (
      <>
        <button
          onClick={() => onThemeChange(getNextTheme())}
          className="relative p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-800 group"
          title={`${
            currentThemeData.name.charAt(0).toUpperCase() +
            currentThemeData.name.slice(1)
          } mode`}
        >
          <currentThemeData.icon className="w-6 h-6" />
          {/* <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {currentThemeData.name.charAt(0).toUpperCase() +
              currentThemeData.name.slice(1)}{" "}
            mode
          </span> */}
        </button>
      </>
    )
  );
};

const NavDropdown = ({ title, items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center space-x-1 cursor-pointer py-2 hover:text-blue-600 dark:hover:text-blue-400">
        <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`absolute left-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-100 dark:border-gray-700 z-50 transition-all duration-200 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="absolute h-2 w-full -top-2 bg-transparent" />

        {items.map((item, index) => (
          <a
            key={index}
            href={item.href || "#"}
            className={`block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400
              transition-all duration-200 ease-in-out
              ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }
            `}
            style={{
              transitionDelay: `${index * 50}ms`,
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [theme, setTheme] = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isSignUpMenuOpen, setIsSignUpMenuOpen] = useState(false);

  const navItems = [
    {
      title: "Home",
      items: [
        { label: "Homepage 1", href: "#" },
        { label: "Homepage 2", href: "#" },
        { label: "Homepage 3", href: "#" },
      ],
    },
    {
      title: "Find Jobs",
      items: [
        { label: "Job Listing", href: "#" },
        { label: "Job Details", href: "#" },
        { label: "Apply Now", href: "#" },
      ],
    },
    {
      title: "Employers",
      items: [
        { label: "All Employers", href: "#" },
        { label: "Employer Details", href: "#" },
        { label: "Post a Job", href: "#" },
      ],
    },
    {
      title: "Candidates",
      items: [
        { label: "Browse Candidates", href: "#" },
        { label: "Candidate Profile", href: "#" },
        { label: "Submit Resume", href: "#" },
      ],
    },
    {
      title: "Blog",
      items: [
        { label: "Blog Grid", href: "#" },
        { label: "Blog Details", href: "#" },
      ],
    },
    {
      title: "Pages",
      items: [
        { label: "About Us", href: "#" },
        { label: "Contact", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
  ];

  const openLogin = () => {
    setIsLoginMenuOpen(!isLoginMenuOpen);
    setIsSignUpMenuOpen(false);
  };

  const openSignUp = () => {
    setIsSignUpMenuOpen(!isSignUpMenuOpen);
    setIsLoginMenuOpen(false);
  };

  return (
    <>
      <div>
        {isLoginMenuOpen && (
          <Login
            onLoginClose={openLogin}
            onSignUpClick={() => {
              setIsLoginMenuOpen(false);
              setIsSignUpMenuOpen(true);
            }}
          />
        )}
        {isSignUpMenuOpen && (
          <SignUp
            onClose={openSignUp}
            onLoginClick={() => {
              setIsSignUpMenuOpen(false);
              setIsLoginMenuOpen(true);
            }}
          />
        )}
      </div>

      <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 backdrop-filter backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg transform transition-transform hover:scale-110">
                <BriefcaseBusiness className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                CareerVista
              </span>
            </div>

            {/* Navigation Items - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <NavDropdown
                  key={index}
                  title={item.title}
                  items={item.items}
                />
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                <Upload className="h-4 w-4" />
                <span>Upload CV</span>
              </button>
              <button
                className="hidden md:flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
                onClick={() => openLogin()}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
              <button className="hidden md:flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 hover:shadow-lg">
                <UserPlus className="h-4 w-4" />
                <span>Post Job</span>
              </button>

              {/* Theme Switcher */}
              <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              {navItems.map((item, index) => (
                <div key={index} className="py-2">
                  <div className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </div>
                  {item.items.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.href}
                      className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              ))}
              <div className="mt-4 px-4 space-y-4">
                <button className="w-full flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload CV</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 transition-colors py-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  <UserPlus className="h-4 w-4" />
                  <span>Post Job</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
