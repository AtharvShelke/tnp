"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/landing page/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <motion.div
          className="text-center px-6 max-w-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400 mb-4">
            Welcome to MGM’s T&P Cell
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Bridging the gap between talent and opportunity.
            <br className="hidden sm:block" /> Empowering students for future-ready careers.
          </p>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-8 py-3 rounded-xl font-medium shadow-lg"
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-16 text-blue-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Us?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "100+ Recruiters", desc: "From startups to Fortune 500s" },
              { title: "Live Dashboard", desc: "Track jobs, interviews & offers" },
              { title: "Career Boosters", desc: "Mock interviews, resume reviews" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="p-8 bg-white/50 backdrop-blur-md border border-blue-100 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR RECRUITERS */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold mb-12 text-blue-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Our Recruiters
          </motion.h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {[
              "TCS", "Infosys", "Capgemini", "Tech Mahindra",
              "Wipro", "Cognizant", "Bosch", "HCL"
            ].map((name, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-xl px-6 py-4 shadow hover:shadow-lg transition-all"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <p className="text-blue-700 font-medium text-lg">{name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold mb-10 text-blue-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <ol className="list-decimal list-inside space-y-4 text-left text-gray-700 text-lg">
            {[
              "Register using your college email ID.",
              "Upload your resume and academic details.",
              "Apply to job openings posted by T&P.",
              "Track interview progress and results."
            ].map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 + i * 0.1 }}
              >
                {step}
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="bg-blue-700 py-20 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Got Questions?
          </motion.h2>
          <p className="mb-6 text-blue-100">
            Reach out to our T&P Cell at <strong>placement@mgmu.ac.in</strong>
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow-md"
            >
              Contact Us
            </motion.button>
          </Link>
        </div>
      </section>
    </>
  );
}
