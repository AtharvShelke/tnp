'use client';

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const StatsSection = () => {
  return (
    <section id="stats" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-600">Impact</span> in Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Quantifying our success through measurable outcomes
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: 1500, label: "Students Placed", suffix: "+" },
              { number: 120, label: "Recruiting Partners", suffix: "+" },
              { number: 6.5, label: "Average Package", prefix: "₹", suffix: " LPA" },
              { number: 22, label: "Highest Package", prefix: "₹", suffix: " LPA" }
            ].map((stat, idx) => {
              const count = useMotionValue(0);
              const [current, setCurrent] = useState(0);

              useEffect(() => {
                const controls = animate(count, stat.number, {
                  duration: 2,
                  delay: idx * 0.2,
                  onUpdate: (latest) => {
                    setCurrent(stat.number < 100 ? latest.toFixed(1) : Math.floor(latest));
                  },
                });
                return () => controls.stop();
              }, []);

              return (
                <motion.div
                  key={idx}
                  className="text-center p-8 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                    {stat.prefix}
                    {current}
                    {stat.suffix}
                  </div>
                  <div className="text-gray-600 text-lg group-hover:text-gray-800 transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
  )
}

export default StatsSection;