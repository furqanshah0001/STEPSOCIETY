import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Shoe } from '../types';
import { Globe, Heart, Check, Search, Zap, ArrowDownAZ, SortDesc, CalendarDays, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

type SortOption = 'date' | 'price' | 'name';

export function Community() {
  const [communityShoes, setCommunityShoes] = useState<Shoe[]>([]);
  const [shoeLikes, setShoeLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [needsMigration, setNeedsMigration] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) setCurrentUserId(userId);

      const { data: shoesData, error: shoesError } = await supabase
        .from('shoes')
        .select('*')
        .eq('is_public', true)
        .order('createdAt', { ascending: false });
        
      if (shoesError) {
        console.error('Error fetching community shoes:', shoesError);
        // Postgres error code 42703 (undefined column) or 42P01 (undefined table)
        if (shoesError.code === '42703' || shoesError.code === '42P01') {
           setNeedsMigration(true);
        } else {
           toast.error('Failed to load community feed');
        }
      }

      const { data: likesData, error: likesError } = await supabase
        .from('shoe_likes')
        .select('*');

      if (likesError) {
        console.error('Error fetching likes:', likesError);
        if (likesError.code === '42P01') {
           setNeedsMigration(true);
        }
      }

      if (!shoesError && shoesData) {
        setCommunityShoes(shoesData);
      }

      if (!likesError && likesData) {
        const likesCount: Record<string, number> = {};
        const likedByMe: Record<string, boolean> = {};

        likesData.forEach((like) => {
          likesCount[like.shoe_id] = (likesCount[like.shoe_id] || 0) + 1;
          if (like.user_id === userId) {
            likedByMe[like.shoe_id] = true;
          }
        });

        setShoeLikes(likesCount);
        setUserLikes(likedByMe);
      }
      setLoading(false);
    }
    
    fetchData();
  }, []);

  const handleToggleLike = async (shoeId: string) => {
    if (!currentUserId) {
      toast.error('You must be logged in to like an artifact.');
      return;
    }

    const isLiked = userLikes[shoeId];
    
    // Optimistic UI update
    setUserLikes(prev => ({ ...prev, [shoeId]: !isLiked }));
    setShoeLikes(prev => ({ 
      ...prev, 
      [shoeId]: (prev[shoeId] || 0) + (isLiked ? -1 : 1) 
    }));

    if (isLiked) {
      const { error } = await supabase
        .from('shoe_likes')
        .delete()
        .match({ shoe_id: shoeId, user_id: currentUserId });
      if (error) {
        toast.error('Failed to unlike');
        // Revert UI on failure
        setUserLikes(prev => ({ ...prev, [shoeId]: true }));
        setShoeLikes(prev => ({ ...prev, [shoeId]: (prev[shoeId] || 0) + 1 }));
      }
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      const userName = session?.user?.user_metadata?.username || 'Unknown';
      const { error } = await supabase
        .from('shoe_likes')
        .insert({ shoe_id: shoeId, user_id: currentUserId, user_name: userName });
      if (error) {
        toast.error('Failed to like');
        // Revert UI on failure
        setUserLikes(prev => ({ ...prev, [shoeId]: false }));
        setShoeLikes(prev => ({ ...prev, [shoeId]: Math.max(0, (prev[shoeId] || 0) - 1) }));
      }
    }
  };

  let filteredShoes = communityShoes.filter((shoe) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (shoe.name?.toLowerCase().includes(searchLower)) ||
      (shoe.brand?.toLowerCase().includes(searchLower))
    );
  });

  filteredShoes = filteredShoes.sort((a, b) => {
    if (sortBy === 'price') return Number(b.price) - Number(a.price);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // default to date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-24 md:pt-32 px-6 max-w-6xl mx-auto space-y-12"
    >
      <div className="flex flex-col gap-2 relative z-10 items-center justify-center text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon flex items-center justify-center gap-2">
          <Globe className="w-4 h-4" /> Global Feed
        </span>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase text-foreground">Community<br/>Archive</h2>
        <p className="text-foreground/50 text-xs uppercase tracking-widest mt-2 max-w-sm">
          A showcase of public artifacts curated by the SteppedIn Network.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto space-y-4">
        {needsMigration && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center animate-pulse-slow">
            <Database className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-red-500 font-bold uppercase tracking-widest mb-2">Database Update Required</h3>
            <p className="text-sm text-foreground/70 mb-4">
              To use the Community features, you need to run the updated <code>supabase-setup.sql</code> in your Supabase SQL Editor to create the necessary tables and policies.
            </p>
            <a 
               href="https://supabase.com/dashboard/project/_/sql/new" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-block bg-red-500 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-red-400 transition-colors"
            >
              Open Supabase Dashboard
            </a>
          </div>
        )}
        <div className="relative flex items-center">
          <Search className="absolute left-6 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Search artifacts or brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-surface border border-foreground/10 rounded-full pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all placeholder:text-foreground/30 text-foreground"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSortBy('date')}
            className={cn(
               "flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
               sortBy === 'date' ? "bg-neon text-black" : "bg-surface border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30"
            )}
          >
            <CalendarDays className="w-3 h-3" /> Date
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={cn(
               "flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
               sortBy === 'price' ? "bg-neon text-black" : "bg-surface border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30"
            )}
          >
            <SortDesc className="w-3 h-3" /> Price
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={cn(
               "flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
               sortBy === 'name' ? "bg-neon text-black" : "bg-surface border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30"
            )}
          >
            <ArrowDownAZ className="w-3 h-3" /> Name
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[4/5] bg-surface/50 border border-foreground/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : communityShoes.length === 0 ? (
          <div className="text-center py-16 text-foreground/40 font-mono text-sm uppercase tracking-widest">
            No public artifacts logged yet.<br/>Be the first to share.
          </div>
        ) : filteredShoes.length === 0 ? (
          <div className="text-center py-16 text-foreground/40 font-mono text-sm uppercase tracking-widest">
            No matches found for "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredShoes.map((shoe) => (
                <motion.div
                  key={shoe.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group block relative aspec-[4/5] overflow-hidden bg-surface rounded-2xl border border-foreground/5 hover:border-neon/50 transition-all hover:shadow-[0_0_30px_var(--color-neon-dim)]"
                >
                  <img 
                    src={shoe.image} 
                    alt={shoe.name} 
                    className="w-full h-64 object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2 z-20">
                    <div className="bg-background/60 backdrop-blur-md px-3 py-1 rounded-full border border-foreground/10 text-[10px] font-bold text-foreground/80 flex items-center gap-2 uppercase tracking-widest">
                      <Globe className="w-3 h-3" /> @{shoe.owner_name || 'Anonymous'}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={() => handleToggleLike(shoe.id)}
                      className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-md border border-foreground/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    >
                      <Heart 
                        className={cn(
                          "w-5 h-5 transition-colors", 
                          userLikes[shoe.id] ? "fill-red-500 text-red-500" : "text-foreground/80 hover:text-red-400"
                        )} 
                      />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] uppercase font-black tracking-widest text-foreground/50 border border-foreground/10 px-2 py-1 rounded-md bg-surface/50">{shoe.brand}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold uppercase tracking-tighter leading-none mb-1 text-foreground filter drop-shadow-md flex items-center gap-2">
                        {shoe.name}
                        {shoe.verified && <Zap className="w-4 h-4 text-neon" />}
                      </h3>
                      <div className="flex items-center gap-1.5 text-foreground/80">
                        <Heart className="w-4 h-4 fill-red-500/20 text-red-500" />
                        <span className="font-bold text-sm">{shoeLikes[shoe.id] || 0}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
