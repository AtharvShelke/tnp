'use client'

import { motion } from "framer-motion";

export const CompanyLogoCloud = () => {
  const companies = [
    { name: "Adobe", logo: "/companies/adobe.png" },
    { name: "Infosys", logo: "/companies/infosys.png" },
    { name: "Capgemini", logo: "/companies/capgemini.png" },
    { name: "Tata-Tech", logo: "/companies/tata.png" },
    { name: "Endress-Hausser", logo: "/companies/eh.png" },
    { name: "Wipro", logo: "/companies/wipro.png" },
    { name: "Dhoot Transimission", logo: "/companies/dhoot.png" },
    { name: "Bosch", logo: "/companies/bosch.png" },
    { name: "Amdocs", logo: "/companies/amdocs.png" },
    { name: "Afour", logo: "/companies/afour.png" },
    { name: "NRB", logo: "/companies/nrb.png" },
    { name: "Digvijay Industries", logo: "/companies/digvijay.png" },
    { name: "Demand Farm", logo: "/companies/demandfarm.png" }, 
    { name: "Datamatics", logo: "/companies/datamatics.png" },         
    { name: "Byjus", logo: "/companies/byjus.png" },         
    { name: "Reliance-Jio", logo: "/companies/jio.png" },
    { name: "Vodafone", logo: "/companies/Vodafone.png" },
    { name: "Amazon", logo: "/companies/amazon.png" },
    { name: "Samsung", logo: "/companies/samsung.png" },
    { name: "Pfizer", logo: "/companies/pfizer.png" },
  ];

  return (
    <div className="py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {companies.map((company, idx) => (
          <motion.div
            key={idx}
            className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={company.name} 
                className="h-20 object-contain transition-all duration-300"
              />
            ) : (
              <span className="text-lg font-medium text-blue-700">{company.name}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};