import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Heart, MessageCircle } from 'lucide-react';

const INSTAGRAM_MOCKS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80', likes: 1240, comments: 45 },
  { id: 2, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80', likes: 892, comments: 23 },
  { id: 3, image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&q=80', likes: 2341, comments: 102 },
  { id: 4, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80', likes: 1530, comments: 88 },
  { id: 5, image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80', likes: 4521, comments: 210 },
  { id: 6, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80', likes: 789, comments: 12 },
  { id: 7, image: 'https://images.unsplash.com/photo-1584735174965-48c48d7028a9?auto=format&fit=crop&q=80', likes: 3210, comments: 156 },
  { id: 8, image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80', likes: 1102, comments: 44 },
  { id: 9, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80', likes: 654, comments: 8 },
  { id: 10, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80', likes: 1980, comments: 76 }
];

export function Discover() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-24 md:pt-32 px-6 max-w-4xl mx-auto space-y-12"
    >
      <div className="flex flex-col gap-2 relative z-10 items-center justify-center text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon flex items-center justify-center gap-2">
          <Instagram className="w-4 h-4" /> Official feed
        </span>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase text-foreground">@stepped.in</h2>
        <p className="text-foreground/50 text-xs uppercase tracking-widest mt-2 max-w-sm">
          Live API access requires authentication. Showing community placeholders.
        </p>
      </div>

      <div className="relative z-10 w-full">
        {/* Instagram Grid (10 Posts) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-16">
          {INSTAGRAM_MOCKS.map((post, index) => (
            <motion.a
              href="https://www.instagram.com/stepped.in/"
              target="_blank"
              rel="noopener noreferrer"
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group aspect-square relative overflow-hidden bg-surface rounded-xl cursor-pointer"
            >
              <img 
                src={post.image} 
                alt="Instagram post placeholder" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Instagram Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Heart className="w-6 h-6 fill-white" />
                  <span>{post.likes > 999 ? (post.likes/1000).toFixed(1) + 'k' : post.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <MessageCircle className="w-6 h-6 fill-white text-foreground" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Large Open Instagram Button */}
        <motion.a 
          href="https://www.instagram.com/stepped.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-3 w-full h-20 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-foreground font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_10px_40px_-10px_rgba(253,29,29,0.5)] text-lg md:text-xl"
        >
          <Instagram className="w-6 h-6 md:w-8 md:h-8" />
          OPEN INSTAGRAM
          <ExternalLink className="w-5 h-5 md:w-6 md:h-6 opacity-50" />
        </motion.a>
      </div>
    </motion.div>
  );
}
