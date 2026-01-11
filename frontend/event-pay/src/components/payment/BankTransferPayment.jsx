import React, { useState } from 'react';
import PaymentCard from './PaymentCard';
import CopyButton from './CopyButton';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CheckCircle, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { submitBankTransfer } from '@/api/client';

export default function BankTransferPayment() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Пожалуйста, загрузите скриншот оплаты");
      return;
    }

    setLoading(true);

    try {
      const result = await submitBankTransfer(file);
      toast.success("✅ Скриншот отправлен!");
      setSubmitted(true);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
        <PaymentCard icon="🏦" title="Банковский перевод" subtitle="С карт грузинских банков на BOG" delay={0.1}>
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
      <PaymentCard icon="🏦" title="Банковский перевод" subtitle="С карт грузинских банков на BOG" delay={0.1}>
        <div className="space-y-4">
          <CopyButton label="IBAN" text="GE33BG0000000538740156" />
          <CopyButton label="Получатель" text="Ilia Denisov" />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label className="text-sm mb-2 block" style={{ color: 'rgb(var(--text-secondary))' }}>
              Скриншот оплаты *
            </Label>
            <div className="relative">
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
              />
              <label
                  htmlFor="screenshot-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer hover:border-indigo-400 transition-all duration-300"
                  style={{ borderColor: 'rgb(var(--border))' }}
              >
                {preview ? (
                    <div className="relative w-full h-full p-2">
                      <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                    </div>
                ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500">Нажмите для загрузки</span>
                    </>
                )}
              </label>
            </div>
          </div>

          <Button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="w-full h-14 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Отправка...
                </>
            ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Отправить подтверждение
                </>
            )}
          </Button>
        </div>
      </PaymentCard>
  );
}