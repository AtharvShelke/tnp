'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserGraduate, FaBars, FaTimes, FaHome, FaChartLine, FaBriefcase, FaQuestionCircle, FaPhoneAlt } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Dashboard", href: "/dashboard", icon: <FaChartLine /> },
    { name: "Placements", href: "/placements", icon: <FaBriefcase /> },
    { name: "FAQs", href: "/faqs", icon: <FaQuestionCircle /> },
    { name: "Contact", href: "/contact", icon: <FaPhoneAlt /> },
  ];

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Image
                src="/logo.jpg"
                alt="MGM Logo"
                className="h-auto w-auto"
                width={120}
                height={60}
                priority
              />
              {/* <span className="hidden md:block text-xl font-bold text-gray-800 ml-2">
                T&P Cell
              </span> */}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className="relative"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center font-medium transition-colors duration-200 group px-3 py-2 rounded-lg ${hoveredLink === link.name ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <span className="mr-2 opacity-80 group-hover:opacity-100">
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
                {hoveredLink === link.name && (
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                    layoutId="navUnderline"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
            ))}
            <Link
              href="/login"
              className="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
            >
              <FaUserGraduate className="mr-2" />
              Student Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3 text-blue-600">{link.icon}</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="pt-2 px-2"
              >
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium text-center hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserGraduate className="mr-2" />
                  Student Login
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}