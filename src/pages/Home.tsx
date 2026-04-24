import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Layers } from 'lucide-react';
import { useShoeStore } from '../store/useShoeStore';
import { cn } from '../lib/utils';
import { Zap } from 'lucide-react';

const FILTER_TAGS = ['All', 'Street Flex', 'Chill Walk', 'Performance Grind', 'Rare Flex', 'Daily Driver', 'Hype Beast', 'Retro Vibe', 'Tech Runner'];

export function Home() {
  const shoes = useShoeStore((state) => state.shoes);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Simulate luxury short loading feel
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const totalValue = shoes.reduce((acc, shoe) => acc + (shoe.price || 0), 0);
  const totalWear = shoes.reduce((acc, shoe) => acc + (shoe.wearCount || 0), 0);
  const lifetimeSteps = totalWear * 5000;

  const filteredShoes = shoes.filter(shoe => {
    const matchesSearch = shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) || shoe.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || shoe.tags.includes(activeFilter as any);
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-24 md:pt-32 px-6 max-w-7xl mx-auto space-y-12"
    >
      {/* Stats Board */}
      <section className="grid grid-cols-3 gap-3 md:gap-6">
        <div className="glass-card rounded-2xl p-4 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 transition-opacity">
            <Zap className="w-32 h-32 text-neon" />
          </div>
          <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">The Vault</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">{shoes.length}</span>
            <span className="hidden md:inline text-neon text-xs font-black uppercase tracking-widest">Pairs</span>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Net Worth</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-xl md:text-4xl font-black tracking-tighter text-neon">£{totalValue.toLocaleString()}</span>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 md:p-8 flex flex-col justify-between relative overflow-hidden">
          <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Footprint</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-xl md:text-4xl font-black tracking-tighter text-foreground">{(lifetimeSteps / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </section>

      {/* Collection Header & Search */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">The Archive</h2>
          <p className="text-white/40 font-medium text-sm mt-2 max-w-sm">Your curated collection of technical footwear and high-street rarities. Synced and verified.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="SEARCH VAULT..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 h-12 bg-surface border border-foreground/10 rounded-full pl-10 pr-4 text-xs font-mono text-foreground focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all placeholder:text-foreground/30 hover:border-foreground/20"
            />
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      {shoes.length > 0 && (
        <div className="flex overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar gap-2">
          {FILTER_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                activeFilter === tag 
                  ? "bg-neon text-black" 
                  : "bg-surface border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-white/30"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Shoe Grid / Empty State */}
      {shoes.length === 0 ? (
        <div className="text-center py-20 px-6 bg-surface rounded-[32px] border border-foreground/5 relative overflow-hidden">
          <div className="absolute inset-0 pattern-bg opacity-50" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-surface border border-foreground/10 flex items-center justify-center relative shadow-[0_0_50px_rgba(204,255,0,0.1)]">
               <Layers className="w-10 h-10 text-neon" />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Vault is Empty</h3>
            <p className="text-white/40 mb-8 max-w-sm">No artifacts logged in the system. Start building your collection to unlock Vibe Codes and insights.</p>
            <Link to="/add" className="inline-flex items-center gap-2 px-8 py-4 bg-neon text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform hover-neon-glow">
              <Plus className="w-5 h-5 -ml-1" />
              Add First Pair
            </Link>
          </div>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="aspect-[4/5] bg-surface/50 border border-foreground/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredShoes.length === 0 ? (
         <div className="text-center py-16 text-white/40 font-mono text-sm uppercase tracking-widest">
           No matching artifacts found.
         </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredShoes.map((shoe, index) => (
              <motion.div
                key={shoe.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/shoe/${shoe.id}`} className="block group relative glass-card rounded-2xl overflow-hidden transition-all duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden bg-black">
                    <img 
                      src={shoe.image} 
                      alt={shoe.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-foreground/10">
                      <span className="text-[10px] font-black text-neon uppercase tracking-widest">Wears: {shoe.wearCount}</span>
                    </div>
                    {shoe.verified && (
                      <div className="absolute top-4 right-4 bg-neon/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-neon/50 shadow-[0_0_15px_rgba(204,255,0,0.4)] flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-neon" fill="currentColor" />
                        <span className="text-[9px] font-black text-neon uppercase tracking-widest text-[#CCFF00] drop-shadow-[0_0_5px_rgba(204,255,0,0.8)]">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-[10px] font-mono text-foreground/50 uppercase tracking-[0.2em] mb-1">{shoe.brand}</p>
                      <h3 className="text-xl font-black italic tracking-tighter text-foreground line-clamp-1">{shoe.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {shoe.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2.5 py-1 text-[9px] font-black uppercase bg-neon text-black rounded-full tracking-widest">
                          {tag}
                        </span>
                      ))}
                      {shoe.tags.length > 3 && (
                        <span className="px-2.5 py-1 text-[9px] font-black uppercase bg-foreground/10 text-foreground rounded-full tracking-widest">
                          +{shoe.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      )}

      {/* Floating Add Button for Desktop */}
      <Link 
        to="/add" 
        className="hidden md:flex fixed bottom-12 right-12 bg-neon text-black font-black px-6 py-4 rounded-full items-center justify-center space-x-2 neon-shadow hover:scale-105 active:scale-95 transition-transform duration-300 z-50 group hover-neon-glow"
      >
        <Plus className="w-5 h-5 flex-shrink-0" />
        <span className="uppercase tracking-tighter">Add New</span>
      </Link>
    </motion.div>
  );
}
