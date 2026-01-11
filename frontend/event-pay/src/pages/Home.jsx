import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import BankTransferPayment from '@/components/payment/BankTransferPayment';
import UsdtPayment from '@/components/payment/UsdtPayment';
import { Shield, Clock, CreditCard } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    // Configure Fienta settings
    window.fientaSettings = {
      background: 'rgba(0,0,0,0.7)',
      border_radius: '12px',
      descriptionEnabled: true,
      utm_source: 'payment-app'
    };

    // Load Fienta embed script
    if (!document.querySelector('script[src="https://fienta.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://fienta.com/embed.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'rgb(var(--bg-primary))' }}>
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--gradient-from)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--gradient-to)' }} />
      <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: 'var(--gradient-from)' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">

          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-500/30 mb-6">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'rgb(var(--text-primary))' }}>Оплата по карте

          </h1>
          <p className="text-lg max-w-md mx-auto" style={{ color: 'rgb(var(--text-secondary))' }}>Выберите удобный способ оплаты за вход на мероприятие

          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mb-12">

          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            <Shield className="w-4 h-4 text-green-600" />
            <span>Безопасная оплата</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            <Clock className="w-4 h-4" style={{ color: 'rgb(var(--accent-from))' }} />
            <span>Быстрая обработка</span>
          </div>
        </motion.div>

        {/* Payment Cards */}
        <div className="space-y-6">
          <BankTransferPayment />
          <UsdtPayment />
        </div>

        {/* Fienta Payment Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12">

          <div className="relative overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-xl rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(var(--bg-card), 0.8), rgba(var(--bg-card), 0.4))' }} />
            <div className="absolute inset-0 rounded-3xl" style={{ border: '1px solid rgb(var(--border))' }} />
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl" style={{ background: 'var(--gradient-from)' }} />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl" style={{ background: 'var(--gradient-to)' }} />
            
            <div className="relative p-8 md:p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/25 mb-6">
                💳
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'rgb(var(--text-primary))' }}>
                                Оплата банковской картой
                              </h2>
                              <p className="text-sm mb-4" style={{ color: 'rgb(var(--text-secondary))' }}>Нужно будет ввести данные карты</p>
                              <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: 'rgb(var(--text-muted))' }}>Быстрая и безопасная оплата через Fienta. Принимаем: 
              Visa, Mastercard, UnionPay, AmericanExpress, JCB
                              </p>
              
              <a
                href="https://fienta.com/oplatit-kartoy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 active:translate-y-0">Оплатить картой




              </a>
              
              <div className="mt-6 flex items-center justify-center gap-4 text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>SSL защита</span>
                </div>
                <span>•</span>
                <span>PCI DSS сертификация</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>);

}