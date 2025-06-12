'use client';

import { motion } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";
import { CompanyLogoCloud } from "@/components/landing page/CompanyCloud";

const RecruiterSection = () => {
  return (
   <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted By <span className="text-blue-600">Top Employers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our students have been placed in leading organizations across industries
            </p>
          </motion.div>

          {/* Company Logo Cloud */}
          <CompanyLogoCloud/>
          
          {/* Testimonial */}
          <motion.div 
            className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                <FaBriefcase className="text-3xl text-blue-600" />
              </div>
              <div>
                <blockquote className="text-lg text-gray-700 mb-4">
                  "MGM students consistently demonstrate strong technical skills and professional attitude. 
                  We've hired over 200 graduates in the last 3 years who have become valuable assets to our organization."
                </blockquote>
                <div className="font-semibold text-blue-700">
                  - HR Director, Tech Solutions Inc.
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Fortune 500 Technology Company
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
  )
}

export default RecruiterSection;