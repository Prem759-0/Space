
import { motion, AnimatePresence } from 'motion/react';
import { Star, Info, ZoomIn, ZoomOut, RotateCcw, Box } from 'lucide-react';
import { StarData, FAMOUS_STARS } from '../constants/stars';

interface OverlayProps {
  selectedStar: StarData | null;
  onSelectStar: (star: StarData | null) => void;
  onReset: () => void;
  onWarp: () => void;
  showConstellations: boolean;
  onToggleConstellations: () => void;
  zoom: number;
  isTransitioning: boolean;
}

export function Overlay({ 
  selectedStar, 
  onSelectStar, 
  onReset, 
  onWarp, 
  showConstellations, 
  onToggleConstellations, 
  zoom,
  isTransitioning 
}: OverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-10 font-sans">
      {/* Transition Loader */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-yellow-400 rounded-full animate-spin" />
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/60">Recalculating Trajectory</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Top Left: Logo and Status */}
      <div className="pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-display">100,000 Stars</h1>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Galactic Simulation Active
          </div>
        </motion.div>
      </div>

      {/* Center Top: Info panel if star selected */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-auto"
          >
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-[320px] md:w-[400px] overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
               <h2 className="text-3xl font-light text-white mb-1 font-display">{selectedStar.name}</h2>
               <p className="text-xs text-yellow-400/80 tracking-widest uppercase mb-4 flex items-center gap-2">
                 <Box className="w-3 h-3" />
                 Distance: {selectedStar.distance} LY
               </p>
               <p className="text-sm text-white/70 leading-relaxed mb-6">
                 {selectedStar.description}
               </p>
               <button 
                onClick={() => onSelectStar(null)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest rounded-xl transition-all border border-white/5"
               >
                 Close Data
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Side: Quick Select List */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto hidden lg:flex flex-col gap-2">
         <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2 px-4">Nearby Objects</div>
         {FAMOUS_STARS.map((star) => (
            <button
              key={star.id}
              onClick={() => onSelectStar(star)}
              className={`px-4 py-3 text-left rounded-xl border transition-all duration-300 group ${
                selectedStar?.id === star.id 
                ? 'bg-white/10 border-white/30 text-white' 
                : 'bg-black/20 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <div className="text-xs font-medium">{star.name}</div>
              <div className="text-[9px] text-white/30 uppercase">{star.distance} LY</div>
            </button>
         ))}
      </div>

      {/* Bottom: Controls and Zoom Status */}
      <div className="flex items-end justify-between pointer-events-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={onReset}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full border border-white/5 transition-all group"
              title="Reset Camera"
            >
              <RotateCcw className="w-5 h-5 text-white group-active:rotate-180 transition-transform duration-500" />
            </button>

            <button 
              onClick={onWarp}
              className="px-6 h-11 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-500 rounded-full border border-yellow-400/20 transition-all flex items-center gap-2"
            >
              <Box className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Warp Speed</span>
            </button>

            <button 
              onClick={onToggleConstellations}
              className={`px-6 h-11 rounded-full border transition-all flex items-center gap-2 ${
                showConstellations 
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' 
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {showConstellations ? 'Hide Constellations' : 'Show Constellations'}
              </span>
            </button>

            <div className="h-10 w-[1px] bg-white/10 mx-2" />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Perspective</span>
              <span className="text-sm text-white font-mono">
                {zoom < 20 ? 'Stellar' : zoom < 150 ? 'Local Group' : 'Galactic'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-[9px] text-white/30 uppercase tracking-[0.3em]">Scroll to exploring depth</div>
          <div className="flex items-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className={`h-4 w-1 rounded-full transition-all duration-300 ${
                  i < (zoom / 25) ? 'bg-yellow-400 scale-y-125' : 'bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
