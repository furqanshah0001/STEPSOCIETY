import { Download, LibrarySquare, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShoeStore } from '../store/useShoeStore';
import { toast } from 'sonner';

export default function Profile() {
  const shoes = useShoeStore(state => state.shoes);

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

      <div className="glass-card p-6 md:p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center border border-white/10 shrink-0 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(204,255,0,0.2)_0%,_transparent_70%)]" />
             <Zap className="w-8 h-8 text-neon" />
          </div>
          <div>
            <h3 className="text-xl font-bold">SNKR_HEAD_99</h3>
            <p className="text-xs text-white/50 tracking-widest uppercase font-bold mt-1">Status: Active Connector</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">Data Management</h4>
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
      </div>
    </motion.div>
  );
}
