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
import Profile from './pages/Profile';
import { Discover } from './pages/Discover';
import { Auth } from './pages/Auth';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
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
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon/20 border-t-neon rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Toaster 
          theme="dark" 
          toastOptions={{
            style: { background: '#1A1A1A', borderColor: '#CCFF00', color: '#fff', borderRadius: '1rem' },
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
          style: { background: '#1A1A1A', borderColor: '#CCFF00', color: '#fff', borderRadius: '1rem' },
          className: 'font-sans font-bold uppercase tracking-widest text-xs'
        }} 
      />
      
      {!hasSeenOnboarding && <Onboarding />}
      
      <Navigation />
      <AnimatedRoutes />
      
      <footer className="fixed bottom-0 w-full p-4 border-t border-[#1A1A1A] flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] bg-background/80 backdrop-blur-md z-40 hidden md:flex">
        <div>v1.0.4 - STREET_READY</div>
        <div><a href="#" className="hover:text-neon transition-colors">MADE FOR STEPPEDIN FANS</a></div>
        <div>CLOUD_SYNC_ACTIVE [OK]</div>
      </footer>
    </Router>
  );
}

