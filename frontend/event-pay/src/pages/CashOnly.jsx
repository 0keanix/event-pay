import React from 'react';
import { motion } from 'framer-motion';
import { Banknote } from 'lucide-react';

export default function CashOnly() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'rgb(var(--bg-primary))' }}>
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--gradient-from)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--gradient-to)' }} />

      <div className="relative z-10 max-w-xl mx-auto px-4 py-16 md:py-24 flex items-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden w-full">

          <div className="absolute inset-0 backdrop-blur-xl rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(var(--bg-card), 0.8), rgba(var(--bg-card), 0.4))' }} />
          <div className="absolute inset-0 rounded-3xl" style={{ border: '1px solid rgb(var(--border))' }} />

          <div className="relative p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-500/30 mb-6">
              <Banknote className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'rgb(var(--text-primary))' }}>
              Оплата картой временно недоступна
            </h1>

            <p className="text-lg mb-6" style={{ color: 'rgb(var(--text-secondary))' }}>
              Приносим извинения за неудобства.
            </p>

            <p className="text-base" style={{ color: 'rgb(var(--text-secondary))' }}>
              Пожалуйста, оплатите наличными.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
