import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../theme/DarkMode";

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
        </button>
      </>
    )
  );
};

const Navbar = () => {
  const [theme, setTheme] = useTheme();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0">
        <div className="flex items-center justify-between h-16">
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Switcher */}
            <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
