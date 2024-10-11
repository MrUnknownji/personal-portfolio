"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    let prevScrollPos = window.scrollY;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="transition-opacity duration-300 hover:opacity-80"
        >
          <Image src="/images/logo.svg" alt="logo" width={40} height={40} />
        </Link>
        <nav className="bg-[#f1f3f4] rounded-full relative">
          {(activeTab === "/" || activeTab === "/work") && (
            <div
              className="absolute bg-white rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: "calc(50% - 8px)",
                height: "calc(100% - 8px)",
                left: activeTab === "/work" ? "calc(50% + 4px)" : "4px",
                top: "4px",
              }}
            />
          )}
          <ul className="flex relative z-10">
            {navItems.map((item) => (
              <li key={item.name} className="w-1/2">
                <Link
                  href={item.path}
                  className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium block text-center ${
                    pathname === item.path
                      ? "text-gray-800"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab(item.path)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/contact-me"
          className="bg-[#f1f3f4] text-gray-800 px-5 py-2 rounded-full transition-all duration-300 hover:bg-gray-200 text-sm font-medium shadow-sm"
        >
          Contact Me
        </Link>
      </div>
    </header>
  );
};

export default Header;
