import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { HelpCircle, Mic, MicOff, Phone, Mail, FileText, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const HelpVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setVoiceQuery('Listening... Speak your query in Hindi or English (e.g., "Karnal mandi me wheat procurement ka time kya hai?")');
      setTimeout(() => {
        setVoiceQuery('Query Captured: "When is my wheat procurement token scheduled?" -> Answer: Your active token TOK-KNL-001 is scheduled for 08:00 AM today at Karnal Mandi.');
        setIsListening(false);
      }, 3000);
    } else {
      setIsListening(false);
      setVoiceQuery('');
    }
  };

  const faqs = [
    {
      q: 'How do I book a grain procurement slot at my nearest centre?',
      a: 'Log into your AgriQueue account, navigate to "Find Center" or click "Book Slot", select your nearest mandi, pick a date, crop type, estimated yield, and select an available 2-hour time window.'
    },
    {
      q: 'What documents do I need to carry to the procurement centre?',
      a: 'Bring your Aadhaar card, registered mobile phone with your token SMS/app pass, PM-KISAN registered land record copy, and your bank passbook details.'
    },
    {
      q: 'How long after crop weighment is the DBT payment credited?',
      a: 'Once your crop quality and weighment entry are recorded by Centre Staff and approved by the Centre Manager, payment is processed directly to your bank account via PFMS within 48 to 72 hours.'
    },
    {
      q: 'What if I am running late for my scheduled slot window?',
      a: 'If you miss your assigned slot, your token will remain valid until the end of the operating day, but you will be placed in the secondary waiting line after scheduled farmers.'
    }
  ];

  return (
    <DashboardLayout
      title="Help & AI Voice Assistant"
      subtitle="Multilingual helpline support and voice query assistance for procurement procedures"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Voice Assistance Widget Card */}
        <Card accent="red" hover={false} className="bg-white hero-container-shadow space-y-4 text-center border-2 border-gov-red">
          <div className="flex items-center justify-center space-x-2 text-gov-red font-bold font-heading text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>KisanSetu Voice Query Helper</span>
          </div>

          <h2 className="text-xl font-bold font-heading text-gov-text">
            Speak Your Query in Your Regional Language
          </h2>
          <p className="text-xs text-gov-muted max-w-md mx-auto">
            Tap the microphone button below and ask about your token status, nearest centre timings, or MSP rates.
          </p>

          {/* Large Voice Button */}
          <div className="py-4">
            <button
              onClick={toggleListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all shadow-md ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-100 scale-105'
                  : 'btn-primary-red hover:scale-105'
              }`}
            >
              {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>
            <div className="text-xs font-bold font-heading text-gov-red mt-3">
              {isListening ? '🔴 Recording Voice... Speak Now' : 'Tap to speak your query'}
            </div>
          </div>

          {voiceQuery && (
            <div className="p-4 bg-gov-gray rounded-xl border border-gov-border text-xs text-gov-text font-medium animate-fade-in-up text-left">
              {voiceQuery}
            </div>
          )}
        </Card>

        {/* FAQs Accordion */}
        <Card accent="red" hover={false} className="space-y-4">
          <h3 className="text-base font-bold font-heading text-gov-text border-b border-gov-border pb-3 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-gov-red" />
            <span>Frequently Asked Questions (FAQ)</span>
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={faq.q} className="border border-gov-border rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full text-left p-4 font-bold font-heading text-xs text-gov-text flex justify-between items-center hover:bg-gov-gray transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-gov-red" /> : <ChevronDown className="w-4 h-4 text-gov-muted" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-gov-gray border-t border-gov-border text-xs text-gov-muted font-body leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Toll Free Helpline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card accent="red" hover={false} className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gov-red text-white flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-gov-muted uppercase font-bold">Toll-Free Helpline</div>
              <div className="text-sm font-bold font-heading text-gov-text">1800-180-1551</div>
            </div>
          </Card>

          <Card accent="green" hover={false} className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gov-green text-white flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-gov-muted uppercase font-bold">Official Email Support</div>
              <div className="text-xs font-bold font-heading text-gov-text">procurement-support@dca.gov.in</div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpVoice;
