import React, { useEffect } from 'react';
import PaymentCard from './PaymentCard';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function CardPayment() {
  useEffect(() => {
    // Load Fienta script
    if (!document.querySelector('script[src="https://fienta.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://fienta.com/embed.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Set Fienta settings
    window.fientaSettings = {
      background: 'rgba(0,0,0,0.7)',
      descriptionEnabled: true
    };
  }, []);

  return (
    <PaymentCard icon="💳" title="Оплата картой" delay={0}>
      <p className="text-slate-600 mb-6 leading-relaxed">
        Быстрая и безопасная оплата банковской картой через систему Fienta
      </p>
      
      <a
        href="https://fienta.com/oplatit-kartoy"
        className="fienta-checkout block"
      >
        <Button 
          className="w-full h-14 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
        >
          <ExternalLink className="mr-2 h-5 w-5" />
          Оплатить картой
        </Button>
      </a>
      
      <p className="text-xs text-slate-400 mt-4 text-center">
        Поддерживаются Visa, Mastercard, МИР
      </p>
    </PaymentCard>
  );
}