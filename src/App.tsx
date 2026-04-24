import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { useShoeStore } from './store/useShoeStore';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { Home } from './pages/Home';
import { AddShoe } from './pages/AddShoe';
import { ShoeDetail } from './pages/ShoeDetail';
import { Community } from './pages/Community';
import Profile from './pages/Profile';
import { Auth } from './pages/Auth';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/add" element={<AddShoe />} />
        <Route path="/shoe/:id" element={<ShoeDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const hasSeenOnboarding = useShoeStore(state => state.hasSeenOnboarding);
  const fetchShoes = useShoeStore(state => state.fetchShoes);
  const clearShoes = useShoeStore(state => state.clearShoes);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchShoes(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchShoes(session.user.id);
      } else {
        clearShoes();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchShoes, clearShoes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon/20 border-t-neon rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card p-8 rounded-3xl border border-red-500/30 max-w-lg">
          <h1 className="text-red-500 font-bold text-xl uppercase tracking-widest mb-4">Environment Setup Required</h1>
          <p className="text-foreground/70 mb-6 text-sm leading-relaxed">
            It looks like you've deployed this app to Vercel, but are missing your Supabase environment variables.
            <br/><br/>
            Go to your Vercel Dashboard {'>'} Settings {'>'} Environment Variables, and add:
          </p>
          <div className="text-left bg-black p-4 rounded-xl font-mono text-xs text-foreground/50 mb-6 space-y-2 select-all overflow-x-auto">
            <div>VITE_SUPABASE_URL</div>
            <div>VITE_SUPABASE_ANON_KEY</div>
          </div>
          <p className="text-foreground/50 text-[10px] uppercase tracking-widest">
            Then <span className="text-neon">redeploy</span> your project.
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Toaster 
          theme="dark" 
          toastOptions={{
            style: { background: 'var(--surface)', borderColor: 'var(--color-neon)', color: 'var(--foreground)', borderRadius: '1rem' },
            className: 'font-sans font-bold uppercase tracking-widest text-xs'
          }} 
        />
        <Auth />
      </>
    );
  }

  return (
    <Router>
      <Toaster 
        theme="dark" 
        toastOptions={{
          style: { background: 'var(--surface)', borderColor: 'var(--color-neon)', color: 'var(--foreground)', borderRadius: '1rem' },
          className: 'font-sans font-bold uppercase tracking-widest text-xs'
        }} 
      />
      
      {!hasSeenOnboarding && <Onboarding />}
      
      <Navigation />
      <AnimatedRoutes />
      
      <footer className="fixed bottom-0 w-full p-4 border-t border-surface flex justify-between text-[10px] font-mono text-foreground/30 uppercase tracking-[0.2em] bg-background/80 backdrop-blur-md z-40 hidden md:flex">
        <div>v1.0.4 - STREET_READY</div>
        <div><a href="#" className="hover:text-neon transition-colors">MADE FOR STEPPEDIN FANS</a></div>
        <div>CLOUD_SYNC_ACTIVE [OK]</div>
      </footer>
    </Router>
  );
}

