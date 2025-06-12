'use client';

import { motion } from "framer-motion";
import { FaChartLine, FaGraduationCap, FaBriefcase, FaRegCheckCircle } from "react-icons/fa";

const TimeLineSection = () => {
  return (
    <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your <span className="text-blue-600">Placement Journey</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From registration to offer letter - we guide you at every step
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200"></div>
            
            <div className="space-y-12">
              {[
                { 
                  step: "1", 
                  title: "Registration & Profile Creation", 
                  desc: "Complete your profile with academic details, skills, and resume",
                  icon: <FaRegCheckCircle className="text-xl text-blue-600" />,
                  delay: 0.1
                },
                { 
                  step: "2", 
                  title: "Skill Assessment", 
                  desc: "Take our evaluation tests to identify strengths and areas for improvement",
                  icon: <FaChartLine className="text-xl text-blue-600" />,
                  delay: 0.2
                },
                { 
                  step: "3", 
                  title: "Training Sessions", 
                  desc: "Attend technical and soft skills workshops tailored to your needs",
                  icon: <FaGraduationCap className="text-xl text-blue-600" />,
                  delay: 0.3
                },
                { 
                  step: "4", 
                  title: "Company Placements", 
                  desc: "Apply to openings, attend interviews, and receive offers",
                  icon: <FaBriefcase className="text-xl text-blue-600" />,
                  delay: 0.4
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`relative flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  viewport={{ once: true }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold z-10 shadow-md">
                    {item.step}
                  </div>
                  
                  <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'mr-auto pr-4 md:pr-8' : 'ml-auto pl-4 md:pl-8'}`}>
                    <motion.div
                      className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-200 group transition-all"
                      whileHover={{ y: -3 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          {item.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{item.desc}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
  )
}

export default TimeLineSection;