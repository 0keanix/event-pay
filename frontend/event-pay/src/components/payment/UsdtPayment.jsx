import React, { useState } from 'react';
import PaymentCard from './PaymentCard';
import CopyButton from './CopyButton';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { submitUsdt } from '@/api/client';

export default function UsdtPayment() {
  const [transactionLink, setTransactionLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!transactionLink) {
      toast.error("Пожалуйста, введите ссылку на транзакцию");
      return;
    }

    setLoading(true);

    try {
      const result = await submitUsdt(transactionLink);
      toast.success("✅ Платёж отправлен!");
      setSubmitted(true);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
        <PaymentCard icon="💰" title="Оплата в USDT" subtitle="Если любите крипту" delay={0.2}>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>Ваш платёж принят!</h3>
            <p style={{ color: 'rgb(var(--text-secondary))' }}>Спасибо за перевод!</p>
          </div>
        </PaymentCard>
    );
  }

  return (
      <PaymentCard icon="💰" title="Оплата в USDT" subtitle="Если любите крипту" delay={0.2}>
        <div className="space-y-4">
          <CopyButton label="Сеть" text="TRC-20" />
          <CopyButton label="Адрес кошелька" text="TEhBCc5WKX9t7ujrZ8mFcQSbD6rcb8LfnC" />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label className="text-sm mb-2 block" style={{ color: 'rgb(var(--text-secondary))' }}>
              Ссылка на транзакцию *
            </Label>
            <Input
                type="url"
                placeholder="https://tronscan.org/#/transaction/..."
                value={transactionLink}
                onChange={(e) => setTransactionLink(e.target.value)}
                className="h-12 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
            />
          </div>

          <Button
              onClick={handleSubmit}
              disabled={loading || !transactionLink}
              className="w-full h-14 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Отправка...
                </>
            ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Отправить подтверждение
                </>
            )}
          </Button>
        </div>

        <p className="text-xs mt-4 text-center" style={{ color: 'rgb(var(--text-muted))' }}>
          Используйте только сеть TRC-20 для перевода USDT
        </p>
      </PaymentCard>
  );
}