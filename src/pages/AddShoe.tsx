import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';
import { useShoeStore } from '../store/useShoeStore';
import { VibeTag } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const AVAILABLE_TAGS: VibeTag[] = [
  'Street Flex', 'Chill Walk', 'Performance Grind', 'Rare Flex',
  'Daily Driver', 'Hype Beast', 'Retro Vibe', 'Tech Runner'
];

const BRANDS = ['Nike', 'Jordan', 'Adidas', 'New Balance', 'ASICS', 'Salomon', 'On', 'Other'];

export function AddShoe() {
  const navigate = useNavigate();
  const addShoe = useShoeStore((state) => state.addShoe);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Nike');
  const [price, setPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTags, setSelectedTags] = useState<VibeTag[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  
  // SteppedIn Society
  const [societyOrderNumber, setSocietyOrderNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleTag = (tag: VibeTag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 4) return prev; // Max 4 tags
      return [...prev, tag];
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!image && !brand)) return; // basic validation

    addShoe({
      name,
      brand,
      price: Number(price) || 0,
      purchaseDate: new Date(purchaseDate).toISOString(),
      tags: selectedTags,
      image: image || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80', // Fallback image if none
      verified,
      societyOrderNumber: verified ? societyOrderNumber : undefined,
      condition: 100, // new shoes start at 100%
      lastCleaned: new Date().toISOString(),
      is_public: isPublic
    });

    toast.success('Artifact saved to Vault');
    navigate('/');
  };

  const verifyOrder = () => {
    if (!societyOrderNumber) return;
    setIsVerifying(true);
    // Mock network request
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      toast.success('SteppedIn Verified Badge Unlocked!');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-24 md:pt-32 px-6 max-w-2xl mx-auto space-y-12"
    >
      <div className="flex flex-col gap-2">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface transition-colors -ml-2 mb-4 md:hidden">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon block">Vault Entry</span>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">Archive New<br />Artifact</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Photo Upload Container */}
        <div 
          className="relative group cursor-pointer aspect-square sm:aspect-video w-full rounded-2xl overflow-hidden border border-foreground/10 bg-surface flex flex-col items-center justify-center transition-all hover:bg-foreground/5"
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
          )}

          <div className="relative z-10 flex flex-col items-center gap-4 p-6 bg-foreground/5 backdrop-blur-sm rounded-xl border border-foreground/5">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center shadow-2xl border border-foreground/10 group-hover:scale-110 group-hover:bg-neon group-hover:text-black transition-all">
                <Camera className="w-6 h-6" />
              </div>
            </div>
            <p className="font-bold uppercase tracking-widest text-[10px] text-foreground/80">
              {image ? 'Change Visual Asset' : 'Upload Visual Assets'}
            </p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageCapture}
          />
        </div>

        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 ml-1">Artifact Designation</label>
            <input 
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan 1 Retro High OG"
              className="w-full bg-surface border border-foreground/5 rounded-xl h-16 px-6 text-xl font-bold focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/30 transition-all placeholder:text-foreground/30"
            />
          </div>

          {/* Brand Grid */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 ml-1">Manufacturer</label>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrand(b)}
                  className={cn(
                    "px-5 py-3 rounded-xl text-sm font-bold border transition-all duration-300 uppercase tracking-widest",
                    brand === b 
                      ? "bg-neon text-black border-neon neon-shadow" 
                      : "bg-surface text-foreground/60 border-foreground/5 hover:border-foreground/20"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 ml-1">Acquisition Price</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neon font-bold">£</span>
                <input 
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-surface border border-foreground/5 rounded-xl h-16 pl-12 pr-6 text-lg font-bold focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/30 transition-all placeholder:text-foreground/30 appearance-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 ml-1">Vault Entry Date</label>
              <input 
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-surface border border-foreground/5 rounded-xl h-16 px-6 text-sm font-bold focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/30 transition-all text-foreground [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          {/* Vibe Tags */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Aesthetic Signatures</label>
              <span className="text-[10px] text-foreground/40 font-bold uppercase">{selectedTags.length}/4 Max</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-tighter transition-all",
                      isSelected 
                        ? "bg-foreground text-background border-foreground shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105" 
                        : "bg-surface border-foreground/5 text-foreground/60 hover:bg-foreground/5 hover:border-foreground/20"
                    )}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-4">
            <div className="glass-card p-4 rounded-2xl flex items-center justify-between border-foreground/5 hover-neon-glow transition-all">
              <div>
                <p className="font-bold text-sm uppercase tracking-widest">Make Public</p>
                <p className="text-[10px] text-foreground/50 uppercase tracking-widest mt-1">Show in Community Collection</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={cn(
                  "w-14 h-8 rounded-full p-1 transition-colors duration-300 relative",
                  isPublic ? "bg-neon" : "bg-foreground/10"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-background transition-transform duration-300 shadow-md",
                  isPublic ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 pb-12">
          <button 
            type="submit"
            className="w-full h-16 bg-neon text-black rounded-2xl font-black text-lg uppercase tracking-[0.2em] shadow-[0_10px_40px_var(--color-neon-dim)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Save className="w-6 h-6" />
            Save to Collection
          </button>
        </div>
      </form>
    </motion.div>
  );
}
