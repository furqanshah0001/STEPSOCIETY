import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Zap, Mail, Lock, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Successfully logged in!");
      } else {
        if (!username.trim()) {
           throw new Error("Username is required");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim()
            }
          }
        });
        if (error) throw error;
        toast.success("Check your email for the login link or verify to continue!");
      }
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        toast.error("Network error: Please check if your ad-blocker is disabling Supabase, or if your internet connection is stable. Also verify your Supabase URL in environment variables.");
      } else {
        toast.error(error.message || "An error occurred during authentication");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-neon rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(204,255,0,0.3)]">
            <Zap className="w-8 h-8 text-black" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">STEPSOCIETY</h1>
          <p className="text-white/50 text-sm tracking-widest uppercase font-bold mt-2">Vault Access</p>
        </div>

        <form onSubmit={handleAuth} className="glass-card p-8 rounded-[32px] space-y-6 border border-white/10 relative overflow-hidden">
          <div className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 mb-2">Username</label>
                <div className="relative">
                  <User className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={!isLogin}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-neon text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#b3ff00] transition-colors flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? 'Log In' : 'Sign Up')}
          </button>

          <div className="text-center pt-2">
             <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-white/50 hover:text-white transition-colors"
             >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
