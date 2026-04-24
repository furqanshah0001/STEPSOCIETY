import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShoeStore } from '../store/useShoeStore';
import { Zap, Camera, QrCode } from 'lucide-react';

export function Onboarding() {
  const [step, setStep] = useState(0);
  const setHasSeenOnboarding = useShoeStore(state => state.setHasSeenOnboarding);

  const slides = [
    {
      icon: <Zap className="w-16 h-16 text-neon mx-auto mb-6" fill="currentColor" />,
      title: "Welcome to StepSociety",
      desc: "Your premium digital vault for high-street rarities and technical footwear."
    },
    {
      icon: <Camera className="w-16 h-16 text-foreground mx-auto mb-6" />,
      title: "Archive Your Artifacts",
      desc: "Capture, log prices, and categorize your collection with custom aesthetic tags."
    },
    {
      icon: <QrCode className="w-16 h-16 text-foreground mx-auto mb-6" />,
      title: "Generate Flex Codes",
      desc: "Export beautiful, glossy share cards perfectly sized for your next IG Story."
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setHasSeenOnboarding(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-6 pattern-bg">
      <div className="max-w-sm w-full text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-12"
          >
            {slides[step].icon}
            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-4">{slides[step].title}</h1>
            <p className="text-foreground/60 font-medium">{slides[step].desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mb-12">
          {slides.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-neon' : 'w-2 bg-white/20'}`} />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full py-4 bg-neon text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-transform shadow-[0_0_20px_rgba(204,255,0,0.2)]"
        >
          {step === slides.length - 1 ? "Enter Vault" : "Next"}
        </button>
      </div>
    </div>
  );
}
