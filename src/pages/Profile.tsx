import { Download, LibrarySquare, Zap, LogOut, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShoeStore } from '../store/useShoeStore';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

export default function Profile() {
  const shoes = useShoeStore(state => state.shoes);
  const [session, setSession] = useState<Session | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingAuth, setUpdatingAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
         setNewEmail(session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       setSession(session);
       if (session?.user?.email) {
          setNewEmail(session.user.email);
       }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleExport = () => {
    const dataStr = JSON.stringify(shoes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vibecode-archive-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Collection Exported to JSON');
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Successfully Signed Out');
    }
  };

  const handleUpdateAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    
    setUpdatingAuth(true);
    let updated = false;

    try {
      if (newEmail && newEmail !== session.user.email) {
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        if (error) throw error;
        updated = true;
      }
      
      if (newPassword) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        updated = true;
        setNewPassword(''); // clear password field
      }

      if (updated) {
        toast.success("Profile credentials updated successfully. Please check your email if you changed it.");
      } else {
        toast("No changes detected.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdatingAuth(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-24 md:pt-32 px-6 max-w-7xl mx-auto space-y-12"
    >
      <div>
         <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">Sys_Profile</h2>
         <p className="text-white/40 font-medium text-sm mt-2 max-w-sm">Manage your configuration and export vault data.</p>
      </div>

      <div className="glass-card p-6 md:p-8 max-w-2xl space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center border border-white/10 shrink-0 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(204,255,0,0.2)_0%,_transparent_70%)]" />
             <Zap className="w-8 h-8 text-neon" />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xl font-bold truncate">@{session?.user?.user_metadata?.username || 'STEPSOCIETY'}</h3>
            <p className="text-xs text-neon tracking-widest uppercase font-bold mt-1 max-w-[200px] md:max-w-none truncate">Level 1 Artifact Collector</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Account Credentials</h4>
          <form onSubmit={handleUpdateAuth} className="space-y-4">
             <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 mb-2">Email Address</label>
                <input
                   type="email"
                   value={newEmail}
                   onChange={(e) => setNewEmail(e.target.value)}
                   className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                   placeholder="Enter new email"
                />
             </div>
             <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 mb-2">New Password (leave blank to keep current)</label>
                <input
                   type="password"
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                   placeholder="Enter new password"
                />
             </div>
             <button 
                type="submit"
                disabled={updatingAuth || (!newPassword && newEmail === session?.user?.email)}
                className="h-12 px-6 bg-surface text-white border border-white/10 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
             >
                {updatingAuth ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
             </button>
          </form>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Data Management</h4>
          <button 
            onClick={handleExport}
            disabled={shoes.length === 0}
            className="w-full flex items-center justify-between p-4 glass-card hover-neon-glow group disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="flex items-center gap-3">
              <LibrarySquare className="w-5 h-5 text-white/50 group-hover:text-neon transition-colors" />
              <div className="text-left">
                <p className="font-bold">Export JSON Archive</p>
                <p className="text-xs text-white/40">{shoes.length} artifacts encoded</p>
              </div>
            </div>
            <Download className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80">Account Action</h4>
          <button 
            onClick={handleSignOut}
            className="w-full h-14 bg-red-500/10 text-red-500 font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
}
