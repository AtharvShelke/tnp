'use client';

import { motion } from "framer-motion";
import { FaUserTie, FaGraduationCap, FaArrowRight } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { RiTeamFill } from "react-icons/ri";

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why <span className="text-blue-600">MGM T&P</span> Stands Out
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive career development services tailored for your success
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <FaUserTie className="text-4xl text-blue-600" />,
                title: "Industry-Aligned Training", 
                desc: "Custom workshops with industry experts to bridge skill gaps",
                delay: 0.1
              },
              { 
                icon: <FaGraduationCap className="text-4xl text-blue-600" />,
                title: "Personalized Mentorship", 
                desc: "1:1 guidance from placement officers and alumni",
                delay: 0.2
              },
              { 
                icon: <IoMdTime className="text-4xl text-blue-600" />,
                title: "Real-Time Dashboard", 
                desc: "Track applications, interviews, and offers in one place",
                delay: 0.3
              },
              { 
                icon: <RiTeamFill className="text-4xl text-blue-600" />,
                title: "Alumni Network", 
                desc: "Access to 10,000+ alumni for referrals and guidance",
                delay: 0.4
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="p-8 rounded-2xl bg-white hover:bg-gradient-to-br from-white to-blue-50 transition-all duration-300 border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <div className="mb-5 p-3 bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
                <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Learn more</span>
                  <FaArrowRight className="ml-2 text-xs" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default FeaturesSection;