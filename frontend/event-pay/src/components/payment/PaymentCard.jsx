import React from 'react';
import { motion } from 'framer-motion';

export default function PaymentCard({ children, icon, title, subtitle, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 backdrop-blur-xl rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(var(--bg-card), 0.8), rgba(var(--bg-card), 0.4))' }} />
      <div className="absolute inset-0 rounded-3xl" style={{ border: '1px solid rgb(var(--border))' }} />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl" style={{ background: 'var(--gradient-from)' }} />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl" style={{ background: 'var(--gradient-to)' }} />
      
      <div className="relative p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>{title}</h2>
            {subtitle && <p className="text-sm mt-0.5" style={{ color: 'rgb(var(--text-secondary))' }}>{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}