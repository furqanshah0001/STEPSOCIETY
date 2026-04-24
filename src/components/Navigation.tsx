import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, User, Zap, Compass } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function Navigation() {
  const location = useLocation();

  const links = [
    { href: '/', label: 'Vault', icon: Home },
    { href: '/discover', label: 'Feed', icon: Compass },
    { href: '/add', label: 'Drop', icon: PlusSquare },
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-background border-b border-surface z-50 hidden md:flex items-center">
        <div className="w-full px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neon rounded-full flex items-center justify-center text-black">
              <Zap className="w-5 h-5" fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-foreground">
              STEPSOCIETY
            </span>
          </Link>
          <div className="flex space-x-12">
            {links.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "font-bold text-sm tracking-widest uppercase transition-all duration-300 relative",
                    isActive ? "text-neon border-b-2 border-neon pb-1" : "text-foreground/50 hover:text-foreground pb-1 border-b-2 border-transparent"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/profile" className={cn(
              "p-2 rounded-lg border transition-all duration-300",
              location.pathname === '/profile' 
                ? "bg-neon/10 border-neon text-neon" 
                : "bg-surface border-foreground/10 text-foreground hover:bg-foreground/10 hover:border-foreground/20"
            )}>
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-foreground/10 z-50 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-neon rounded-full flex items-center justify-center text-black">
            <Zap className="w-3 h-3" fill="currentColor" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic text-foreground">
            STEPSOCIETY
          </span>
        </Link>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-surface border border-foreground/10 rounded-full z-50 shadow-2xl flex items-center justify-around px-2">
        {[...links, { href: '/profile', label: 'Profile', icon: User }].map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300",
                isActive ? "text-neon" : "text-zinc-500 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator-mobile"
                  className="absolute inset-0 bg-neon/10 rounded-full"
                />
              )}
              <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]")} />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
