import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { useShoeStore } from './store/useShoeStore';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { Home } from './pages/Home';
import { AddShoe } from './pages/AddShoe';
import { ShoeDetail } from './pages/ShoeDetail';
import Profile from './pages/Profile';
import { Discover } from './pages/Discover';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home key="/" />} />
        <Route path="/discover" element={<Discover key="/discover" />} />
        <Route path="/add" element={<AddShoe key="/add" />} />
        <Route path="/shoe/:id" element={<ShoeDetail key={location.pathname} />} />
        <Route path="/profile" element={<Profile key="/profile" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const hasSeenOnboarding = useShoeStore(state => state.hasSeenOnboarding);

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
        <div>LOCAL_PERSIST_ACTIVE [OK]</div>
      </footer>
    </Router>
  );
}

