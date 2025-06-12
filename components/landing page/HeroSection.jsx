'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import { FaRegCheckCircle, FaChartLine, FaArrowRight } from "react-icons/fa";

const HeroSection = () => (
  <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <motion.div 
        className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-40"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>

    <motion.div
      className="text-center px-6 max-w-4xl relative z-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Launch Your Career <br />With <span className="text-blue-600">MGM</span> T&P
        </h1>
      </motion.div>
      
      <motion.p 
        className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        We've placed <span className="font-semibold text-gray-800">1500+ students</span> in top companies with an average package of <span className="font-semibold text-gray-800">₹6.5 LPA</span>
      </motion.p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaRegCheckCircle className="text-xl" />
              Register Now
            </span>
            <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </Link>
        <Link href="#stats">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white hover:bg-gray-50 transition-all duration-300 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg border border-gray-200 shadow-lg flex items-center gap-2 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <span className="flex items-center gap-2">
              <FaChartLine className="text-xl text-blue-600" />
              Our Success
            </span>
            <FaArrowRight className="ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 text-blue-600" />
          </motion.button>
        </Link>
      </div>
    </motion.div>

    <motion.div 
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="flex flex-col items-center">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
        <motion.p 
          className="text-xs text-gray-500 mt-1"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to explore
        </motion.p>
      </div>
    </motion.div>
  </section>
);

export default HeroSection;