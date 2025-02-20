import React, { useEffect, useState } from "react";
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
  LogOut,
  User,
  KeyRound,
} from "lucide-react";
import { useTheme } from "../../theme/DarkMode";
import SignUp from "../auth/SignUp";
import Login from "../auth/Login";
// import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";

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
      <button
        onClick={() => onThemeChange(getNextTheme())}
        className="relative p-2.5 rounded-full bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark_hover shadow-lg text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl focus:ring-3 focus:ring-primary-200 dark:focus:ring-primary-800 group"
        title={`${
          currentThemeData.name.charAt(0).toUpperCase() +
          currentThemeData.name.slice(1)
        } mode`}
      >
        <currentThemeData.icon className="w-6 h-6" />
      </button>
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
      <div className="flex items-center space-x-1 cursor-pointer py-2 hover:text-primary dark:hover:text-primary-400">
        <span className="text-text-secondary dark:text-text-dark_secondary group-hover:text-primary dark:group-hover:text-primary-400 transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-text-muted group-hover:text-primary dark:group-hover:text-primary-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`absolute left-0 w-48 bg-surface dark:bg-surface-dark rounded-lg shadow-lg py-2 border border-border dark:border-border-dark z-50 transition-all duration-200 ease-in-out ${
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
            className={`block px-4 py-2 text-text-secondary dark:text-text-dark_secondary hover:bg-primary-50 dark:hover:bg-surface-dark hover:text-primary dark:hover:text-primary-400
              transition-all duration-200 ease-in-out
              ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
};

// import { User, ChevronDown, KeyRound, LogOut, LogIn } from "lucide-react";

const UserDropdown = ({ onLogout, onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center space-x-2 cursor-pointer">
        <div className="flex items-center justify-center h-10 w-10 overflow-hidden border rounded-full border-text-secondary dark:border-text-dark_secondary">
          <User className="text-text-secondary dark:text-text-dark_secondary" />
        </div>
        <ChevronDown
          className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`absolute mt-2 right-0 w-48 bg-surface dark:bg-surface-dark rounded-lg shadow-lg py-2 border border-border dark:border-border-dark z-50 transition-all duration-200 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="absolute h-2 w-full -top-2 bg-transparent" />

        {localStorage.getItem("token") ? (
          <>
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-text-secondary dark:text-text-dark_secondary hover:bg-primary-50 dark:hover:bg-surface-dark hover:text-primary dark:hover:text-primary-400 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>

            <Link
              to="/change-password"
              className="flex items-center space-x-2 px-4 py-2 text-text-secondary dark:text-text-dark_secondary hover:bg-primary-50 dark:hover:bg-surface-dark hover:text-primary dark:hover:text-primary-400 transition-colors"
            >
              <KeyRound className="h-4 w-4" />
              <span>Change Password</span>
            </Link>

            <div className="border-t border-border dark:border-border-dark my-1" />

            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-text-secondary dark:text-text-dark_secondary hover:bg-primary-50 dark:hover:bg-surface-dark hover:text-primary dark:hover:text-primary-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/forgot-password"
              className="flex items-center space-x-2 px-4 py-2 text-text-secondary dark:text-text-dark_secondary hover:bg-primary-50 dark:hover:bg-surface-dark hover:text-primary dark:hover:text-primary-400 transition-colors"
            >
              <KeyRound className="h-4 w-4" />
              <span>Forgot Password</span>
            </Link>

            <button
              onClick={onLogin}
              className="w-full flex items-center space-x-2 px-4 py-2 text-text-secondary dark:text-text-dark_secondary hover:bg-primary-50 dark:hover:bg-surface-dark hover:text-primary dark:hover:text-primary-400 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isSignUpMenuOpen, setIsSignUpMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navItems = [
    // {
    //   title: "Home",
    //   items: [
    //     { label: "Homepage 1", href: "#" },
    //     { label: "Homepage 2", href: "#" },
    //     { label: "Homepage 3", href: "#" },
    //   ],
    // },
    {
      title: "Find Jobs",
      items: [
        { label: "Job Listing", href: "#" },
        { label: "Job Details", href: "#" },
        { label: "Apply Now", href: "#" },
      ],
    },
    // {
    //   title: "Employers",
    //   items: [
    //     { label: "All Employers", href: "#" },
    //     { label: "Employer Details", href: "#" },
    //     { label: "Post a Job", href: "#" },
    //   ],
    // },
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const openLogin = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
    setIsLoginMenuOpen(!isLoginMenuOpen);
    setIsSignUpMenuOpen(false);
  };

  const openSignUp = () => {
    setIsSignUpMenuOpen(!isSignUpMenuOpen);
    setIsLoginMenuOpen(false);
  };

  const Logout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      // Call logout API using Axios
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/userlogin/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      enqueueSnackbar("Logged out successfully", {
        variant: "success",
        autoHideDuration: 3000,
      });

      // Clean up local storage
      const thm = localStorage.getItem("theme");
      localStorage.clear();
      localStorage.setItem("theme", thm);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);

      // Handle error appropriately
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized. Clearing token.");
        localStorage.removeItem("token");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toHome = () => {
    navigate("/");
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

      <nav className="fixed top-0 left-0 right-0 bg-surface-overlay dark:bg-surface-dark_overlay border-b border-border dark:border-border-dark backdrop-filter backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => toHome()}
            >
              <div className="bg-primary p-2 rounded-lg transform transition-transform hover:scale-110">
                <BriefcaseBusiness className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
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
            <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-6">
              <button className="hidden md:flex items-center space-x-2 text-primary dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                <Upload className="h-4 w-4" />
                <span>Upload CV</span>
              </button>
              {!localStorage.getItem("token") && (
                <button
                  onClick={() => openLogin()}
                  className="hidden md:flex items-center space-x-2 text-text-secondary dark:text-text-dark_secondary hover:text-text-primary dark:hover:text-text-dark_primary transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
              <button className="hidden md:flex items-center space-x-2 bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-hover dark:hover:bg-primary-dark_hover transition-all duration-200 hover:shadow-lg">
                <UserPlus className="h-4 w-4" />
                <span>Post Job</span>
              </button>

              <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />

              <div>
                <UserDropdown onLogout={Logout} onLogin={openLogin} />
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-hover dark:hover:bg-hover-dark transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-text-secondary dark:text-text-dark_secondary" />
                ) : (
                  <Menu className="h-6 w-6 text-text-secondary dark:text-text-dark_secondary" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-border dark:border-border-dark max-h-screen flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {navItems.map((item, index) => (
                  <div key={index} className="py-2">
                    <div className="px-4 py-2 font-medium text-text-primary dark:text-text-dark_primary">
                      {item.title}
                    </div>
                    {item.items.map((subItem, subIndex) => (
                      <a
                        key={subIndex}
                        href={subItem.href}
                        className="block px-4 py-2 text-text-secondary dark:text-text-dark_secondary hover:bg-hover dark:hover:bg-hover-dark"
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-4 px-4 space-y-1 mb-12 border-t border-border dark:border-border-dark py-4">
                <button className="w-full flex items-center justify-center space-x-2 text-primary dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors py-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload CV</span>
                </button>
                {!localStorage.getItem("token") && (
                  <button
                    onClick={() => openLogin()}
                    className="w-full flex items-center justify-center space-x-2 text-text-secondary dark:text-text-dark_secondary hover:text-text-primary dark:hover:text-text-dark_primary transition-colors py-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                )}
                <button className="w-full flex items-center justify-center space-x-2 bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-hover dark:hover:bg-primary-dark_hover transition-colors">
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
