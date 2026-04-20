import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, QrCode, Plus, Share, Zap, Edit2, Check, X as CloseIcon } from 'lucide-react';
import { useShoeStore } from '../store/useShoeStore';
import { QRCard } from '../components/QRCard';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function ShoeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shoes, incrementWear, deleteShoe, updateShoe } = useShoeStore();
  const [showQR, setShowQR] = useState(false);

  // Edit Log States
  const [isEditingLog, setIsEditingLog] = useState(false);
  const shoe = shoes.find(s => s.id === id);
  const [editCondition, setEditCondition] = useState(shoe?.condition ?? 100);
  const [editNotes, setEditNotes] = useState(shoe?.cleaningNotes ?? '');

  if (!shoe) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-sm">
        Artifact Not Found
      </div>
    );
  }

  const handleDelete = () => {
    toast('Delete Artifact?', {
      action: {
        label: 'Confirm',
        onClick: () => {
          deleteShoe(shoe.id);
          navigate('/');
          toast.success("Artifact purged");
        }
      },
      cancel: { label: 'Cancel', onClick: () => {} }
    });
  };

  const handleIncrement = () => {
    incrementWear(shoe.id);
    toast.success("+1 Wear Count tracking");
  };

  if (showQR) {
    return <QRCard shoe={shoe} onClose={() => setShowQR(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32 min-h-screen"
    >
      {/* Hero Image Section */}
      <div className="relative aspect-square md:aspect-[21/9] w-full bg-black overflow-hidden border-b border-[#1A1A1A]">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors hover-neon-glow"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        {shoe.verified && (
          <div className="absolute top-6 right-6 z-20 px-4 py-2 bg-neon/10 backdrop-blur-xl rounded-full border border-neon/50 shadow-[0_0_20px_rgba(204,255,0,0.4)] flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon" fill="currentColor" />
            <span className="text-xs font-black text-neon uppercase tracking-widest text-[#CCFF00] drop-shadow-[0_0_5px_rgba(204,255,0,0.8)]">SteppedIn Verified</span>
          </div>
        )}
        
        <img 
          src={shoe.image} 
          alt={shoe.name} 
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 space-y-12">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-4 py-2 bg-[#1A1A1A] backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-neon shadow-[0_0_15px_rgba(204,255,0,0.1)]">
              {shoe.brand}
            </span>
            <div className="px-4 py-2 bg-surface border border-white/5 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-300">
              Acquired: {format(new Date(shoe.purchaseDate), 'MMM yyyy')}
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white drop-shadow-2xl flex items-center gap-4 flex-wrap">
            {shoe.name}
            {shoe.verified && (
              <span className="w-8 h-8 rounded-full bg-neon flex flex-shrink-0 items-center justify-center -translate-y-2">
                <Zap className="w-4 h-4 text-black" fill="currentColor" />
              </span>
            )}
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6 border-l-2 border-l-neon flex items-center justify-between group cursor-pointer hover-neon-glow" onClick={handleIncrement}>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Wear Count</p>
              <p className="text-4xl font-black">{shoe.wearCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-neon/10 flex items-center justify-center text-neon group-hover:bg-neon group-hover:text-black transition-colors">
              <Plus className="w-6 h-6" />
            </div>
          </div>
          <div className="glass-card p-6 border-l-2 border-l-white/20">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Value</p>
            <p className="text-4xl font-black italic">£{shoe.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Maintenance Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Maintenance Log</h3>
            {!isEditingLog && (
              <button 
                onClick={() => {
                  setEditCondition(shoe.condition ?? 100);
                  setEditNotes(shoe.cleaningNotes ?? '');
                  setIsEditingLog(true);
                }}
                className="text-[10px] flex items-center gap-1 text-neon font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                <Edit2 className="w-3 h-3" /> Edit Log
              </button>
            )}
          </div>
          <div className="p-6 glass-card rounded-2xl border border-white/5 space-y-6">
            {!isEditingLog ? (
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-white/70 uppercase">Condition Level</span>
                  <span className="text-sm font-black text-neon">{shoe.condition ?? 100}%</span>
                </div>
                <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden">
                  <div className="bg-neon h-full transition-all duration-500" style={{ width: `${shoe.condition ?? 100}%` }}></div>
                </div>
                
                {shoe.cleaningNotes ? (
                  <p className="mt-4 text-xs text-white/70 bg-[#1A1A1A] p-4 rounded-lg border border-white/5 leading-relaxed">
                    {shoe.cleaningNotes}
                  </p>
                ) : (
                  <p className="mt-4 text-xs font-mono text-white/50 bg-[#1A1A1A] p-3 rounded-lg border border-white/5">
                    {(shoe.condition ?? 100) < 50 ? `Time to clean those ${shoe.name}! They're looking worn.` : `Looking sharp. Keep those ${shoe.name} fresh.`}
                  </p>
                )}
                {shoe.lastCleaned && (
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-4">
                    Last Cleaned: {format(new Date(shoe.lastCleaned), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-xs font-bold text-white/70 uppercase">Edit Condition Level</span>
                    <span className="text-sm font-black text-neon">{editCondition}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={editCondition}
                    onChange={(e) => setEditCondition(Number(e.target.value))}
                    className="w-full accent-neon"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/70 uppercase flex mb-2">Maintenance Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="E.g., Used crep protect, scrubbed the soles..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all placeholder:text-zinc-700 min-h-[100px]"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      updateShoe(shoe.id, {
                        condition: editCondition,
                        cleaningNotes: editNotes,
                        lastCleaned: new Date().toISOString()
                      });
                      setIsEditingLog(false);
                      toast.success("Log updated successfully");
                    }}
                    className="flex-1 h-12 bg-neon text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-[#b3ff00] transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Save
                  </button>
                  <button 
                    onClick={() => {
                      updateShoe(shoe.id, { condition: 100, cleaningNotes: '', lastCleaned: undefined });
                      setIsEditingLog(false);
                      toast('Maintenance log cleared');
                    }}
                    className="flex-1 h-12 bg-red-500/10 text-red-500 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2 border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Log
                  </button>
                  <button 
                    onClick={() => setIsEditingLog(false)}
                    className="w-12 h-12 bg-surface text-white border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Aesthetic Signatures</h3>
          <div className="flex flex-wrap gap-2">
            {shoe.tags.map(tag => (
              <span key={tag} className="px-5 py-3 glass-card rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-300 border-white/10 hover-neon-glow hover:text-neon">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-[#1A1A1A]">
          <button 
            onClick={() => setShowQR(true)}
            className="h-16 flex items-center justify-center gap-3 bg-neon text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(204,255,0,0.15)] hover-neon-glow"
          >
            <QrCode className="w-5 h-5" />
            FLEX ON 'EM
          </button>
          
          <button 
            onClick={handleDelete}
            className="h-16 flex items-center justify-center gap-3 bg-red-500/10 text-red-500 font-bold uppercase tracking-[0.2em] rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <Trash2 className="w-5 h-5" />
            Purge Artifact
          </button>
        </div>
      </div>
    </motion.div>
  );
}
