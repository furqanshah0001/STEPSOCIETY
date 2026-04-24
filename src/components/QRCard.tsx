import { useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import { X, Download, Share, Instagram } from 'lucide-react';
import { Shoe } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export function QRCard({ shoe, onClose }: { shoe: Shoe, onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const shareUrl = `${window.location.origin}/shoe/${shoe.id}`;

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ['#CCFF00', '#ffffff', '#1A1A1A'],
      disableForReducedMotion: true
    });
    toast.success('Stepped Code ready to flex!');
  }, []);

  const handleDownload = useCallback((ref: React.RefObject<HTMLDivElement>, prefix: string) => {
    if (ref.current === null) return;

    toast('Generating image...', { icon: '⏳' });
    toPng(ref.current, { cacheBust: true, pixelRatio: 3 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${prefix}-${shoe.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Image saved to device!");
      })
      .catch((err) => {
        console.error('Failed to generate image', err);
        toast.error("Failed to generate image");
      });
  }, [shoe.name]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `StepSociety: ${shoe.name}`,
          text: `Check out my ${shoe.name}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col pt-6 md:pt-12 px-6 pattern-bg"
    >
      <div className="flex justify-between items-center max-w-md mx-auto w-full mb-8 shrink-0">
        <button onClick={onClose} className="p-3 bg-foreground/10 rounded-full hover:bg-white/20 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neon">Stepped Code</span>
        <div className="w-12" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-y-auto pb-32 flex flex-col items-center">
        {/* The Card for Export */}
        <div 
          ref={cardRef}
          className="relative w-[340px] h-[480px] bg-gradient-to-br from-[#1A1A1A] to-[#000] border border-foreground/10 rounded-[32px] shadow-[0_0_100px_rgba(204,255,0,0.15)] p-8 flex flex-col justify-between overflow-hidden shrink-0"
        >
          {/* Subtle floating background layer */}
          <div className="absolute inset-0 z-0">
             <img src={shoe.image} alt="" className="w-full h-full object-cover opacity-10 grayscale mix-blend-screen blur-md" />
          </div>

          <div className="absolute top-0 right-0 p-6 opacity-[0.03] z-0">
            <span className="text-8xl font-black italic">SC</span>
          </div>
          
          {/* Glossy Overlay Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent opacity-60 z-20 pointer-events-none rounded-[32px] mix-blend-overlay"></div>

          <div className="z-10 relative">
            <p className="text-neon font-mono text-[10px] tracking-[0.3em] uppercase mb-2">Stepped Card // ID-{shoe.id.slice(0,4)}</p>
            <h3 className="text-3xl font-black italic leading-none uppercase tracking-tighter mb-1 line-clamp-2">{shoe.name}</h3>
            <p className="text-white/60 font-bold uppercase text-xs tracking-widest">{shoe.brand}</p>
          </div>

          <div className="flex-1 flex items-center justify-center py-4 relative z-10">
            <div className="relative w-full h-40 bg-[radial-gradient(circle,_rgba(204,255,0,0.2)_0%,_transparent_70%)] flex items-center justify-center">
              
              {/* Product Reflection specific to the generator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-40 z-0 rotate-[-5deg] scale-[1.2]">
                 <img src={shoe.image} className="w-full h-full object-cover rounded-3xl" />
                 <img src={shoe.image} className="w-full h-full object-cover rounded-3xl scale-y-[-1] opacity-30 mt-2 reflection-mask" />
              </div>

              <div className="w-40 h-40 bg-white rounded-[24px] shadow-2xl flex items-center justify-center border border-foreground/50 p-2 rotate-[-8deg] z-10 backdrop-blur-xl bg-white/90">
                <QRCode 
                  value={shareUrl} 
                  size={160}
                  bgColor={"transparent"}
                  fgColor={"#000000"}
                  level={"Q"}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="z-10 relative pt-4">
            <div className="flex flex-wrap gap-2 mb-6">
              {shoe.tags.slice(0, 3).map((tag, i) => (
                <span key={tag} className={cn(
                  "px-3 py-1 text-[9px] font-black uppercase rounded-full tracking-widest",
                   i === 0 ? "bg-neon text-black" : "bg-surface border border-foreground/10 text-foreground"
                )}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-white/40 font-bold uppercase">Acquired Value</p>
                <p className="text-sm font-black italic text-neon">£{shoe.price}</p>
              </div>
              <div className="w-16 h-16 bg-white p-1 rounded-lg">
                <div className="w-full h-full border-2 border-black flex flex-wrap p-0.5">
                  <div className="w-2 h-2 bg-black m-0.5" /><div className="w-2 h-2 bg-black m-0.5" /><div className="w-2 h-2 bg-black m-0.5" />
                  <div className="w-2 h-2 bg-black m-0.5" /><div className="w-2 h-2 bg-white m-0.5" /><div className="w-2 h-2 bg-black m-0.5" />
                  <div className="w-2 h-2 bg-black m-0.5" /><div className="w-2 h-2 bg-black m-0.5" /><div className="w-2 h-2 bg-black m-0.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-neon z-20"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-12 w-full max-w-sm shrink-0 relative z-30">
          <div className="flex gap-4">
            <button 
              onClick={() => handleDownload(cardRef, 'vibecode')}
              className="flex-1 h-14 bg-neon text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform"
            >
              <Download className="w-5 h-5" />
              Save
            </button>
            <button 
              onClick={handleShare}
              className="flex-1 h-14 bg-surface text-foreground font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 border border-foreground/20 hover:bg-[#222] active:scale-95 transition-all"
            >
              <Share className="w-5 h-5" />
              Share
            </button>
          </div>
          <button 
            onClick={() => handleDownload(storyRef, 'ig-story')}
            className="w-full h-14 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-foreground font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            <Instagram className="w-5 h-5" />
            Export as IG Story
          </button>
        </div>

        {/* Hidden IG Story Template Container for Export Only */}
        <div className="fixed overflow-hidden pointer-events-none opacity-0 left-[-9999px]">
          <div 
            ref={storyRef}
            className="w-[1080px] h-[1920px] bg-background relative flex flex-col items-center justify-center p-20 overflow-hidden"
          >
            {/* Background Image Blurred */}
            <div className="absolute inset-0">
               <img src={shoe.image} alt="" className="w-full h-full object-cover opacity-15 grayscale mix-blend-screen blur-[100px]" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#0A0A0A]"></div>
            </div>

            {/* SteppedIn Header */}
            <div className="absolute top-20 left-0 w-full flex justify-center z-10">
               <span className="text-4xl font-black italic tracking-tighter uppercase text-foreground tracking-[0.2em]">STEPSOCIETY</span>
            </div>

            {/* Reused QR Card layout inside story */}
            <div className="scale-[1.8] transform origin-center z-10 relative mt-20">
              <div className="relative w-[340px] h-[480px] bg-gradient-to-br from-[#1A1A1A] to-[#000] border border-foreground/20 rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-8 flex flex-col justify-between overflow-hidden shrink-0">
                <div className="absolute inset-0 z-0">
                  <img src={shoe.image} alt="" className="w-full h-full object-cover opacity-10 grayscale mix-blend-screen blur-md" />
                </div>
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] z-0">
                  <span className="text-8xl font-black italic">VC</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent opacity-60 z-20 pointer-events-none rounded-[32px] mix-blend-overlay"></div>
                
                <div className="z-10 relative">
                  <p className="text-neon font-mono text-[10px] tracking-[0.3em] uppercase mb-2">Vibe Card // ID-{shoe.id.slice(0,4)}</p>
                  <h3 className="text-3xl font-black italic leading-none uppercase tracking-tighter mb-1 line-clamp-2">{shoe.name}</h3>
                  <p className="text-white/60 font-bold uppercase text-xs tracking-widest">{shoe.brand}</p>
                </div>
                
                <div className="flex-1 flex items-center justify-center py-4 relative z-10">
                  <div className="relative w-full h-40 bg-[radial-gradient(circle,_rgba(204,255,0,0.2)_0%,_transparent_70%)] flex items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-40 z-0 rotate-[-5deg] scale-[1.2]">
                      <img src={shoe.image} className="w-full h-full object-cover rounded-3xl" />
                      <img src={shoe.image} className="w-full h-full object-cover rounded-3xl scale-y-[-1] opacity-30 mt-2 filter blur-[2px]" />
                    </div>
                    <div className="w-40 h-40 bg-white rounded-[24px] shadow-2xl flex items-center justify-center border border-foreground/50 p-2 rotate-[-8deg] z-10 backdrop-blur-xl bg-white/90">
                      <QRCode 
                        value={shareUrl} 
                        size={160}
                        bgColor={"transparent"}
                        fgColor={"#000000"}
                        level={"Q"}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="z-10 relative pt-4">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {shoe.tags.slice(0, 3).map((tag, i) => (
                      <span key={tag} className={cn(
                        "px-3 py-1 text-[9px] font-black uppercase rounded-full tracking-widest",
                        i === 0 ? "bg-neon text-black" : "bg-surface border border-foreground/10 text-foreground"
                      )}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-neon z-20"></div>
              </div>
            </div>
            
            <div className="absolute bottom-32 w-full text-center z-10">
               <p className="text-foreground/30 text-2xl font-mono uppercase tracking-[0.4em]">Scan to Collect</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
