"use client"

import { Briefcase, Building2, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function Stats() {
  const [counts, setCounts] = useState({
    total_projects: 0,
    total_companies: 0,
    total_colleges: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`${API_URL}/projects/count/total`);
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{counts.total_projects}+</h3>
              <p className="text-gray-600">Active Internships</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{counts.total_companies}+</h3>
              <p className="text-gray-600">Partner Companies</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{counts.total_colleges}+</h3>
              <p className="text-gray-600">Partner Colleges</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 