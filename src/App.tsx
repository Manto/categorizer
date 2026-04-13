import { useState, useRef, useEffect } from 'react';
import { suggestOpposite, generateChartItems, ChartItem } from './services/gemini';
import { Loader2, RefreshCw, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [category, setCategory] = useState('');
  
  const [xAxisStart, setXAxisStart] = useState('');
  const [xAxisEnd, setXAxisEnd] = useState('');
  const [isSuggestingX, setIsSuggestingX] = useState(false);
  
  const [yAxisStart, setYAxisStart] = useState('');
  const [yAxisEnd, setYAxisEnd] = useState('');
  const [isSuggestingY, setIsSuggestingY] = useState(false);

  const [items, setItems] = useState<ChartItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<ChartItem | null>(null);

  const handleSuggestX = async () => {
    if (!category || !xAxisStart) return;
    setIsSuggestingX(true);
    const opposite = await suggestOpposite(category, xAxisStart);
    setXAxisEnd(opposite);
    setIsSuggestingX(false);
  };

  const handleSuggestY = async () => {
    if (!category || !yAxisStart) return;
    setIsSuggestingY(true);
    const opposite = await suggestOpposite(category, yAxisStart);
    setYAxisEnd(opposite);
    setIsSuggestingY(false);
  };

  const handleGenerate = async () => {
    if (!category || !xAxisStart || !xAxisEnd || !yAxisStart || !yAxisEnd) return;
    setIsGenerating(true);
    setItems([]);
    setSelectedItem(null);
    const generatedItems = await generateChartItems(
      category,
      { start: xAxisStart, end: xAxisEnd },
      { start: yAxisStart, end: yAxisEnd }
    );
    setItems(generatedItems);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      
      <header className="border-b-4 border-black pb-6 mb-4">
        <h1 className="newspaper-title text-5xl md:text-7xl font-black mb-2">The Categorizer</h1>
        <p className="text-sm md:text-base uppercase tracking-widest font-bold">A scientific instrument for subjective truths</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white brutal-border brutal-shadow p-6">
            <h2 className="newspaper-title text-2xl font-bold mb-6 border-b-2 border-black pb-2">Parameters</h2>
            
            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider">Subject Category</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Movies, Foods, Animals"
                  className="w-full brutal-border p-3 bg-[#f4f4f0] focus:outline-none focus:bg-white transition-colors"
                />
              </div>

              {/* X Axis */}
              <div className="space-y-2 p-4 border-2 border-dashed border-black bg-[#f4f4f0]">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">X-Axis (Horizontal)</label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="text" 
                    value={xAxisStart}
                    onChange={(e) => setXAxisStart(e.target.value)}
                    placeholder="Left side (e.g. Boring)"
                    className="w-full brutal-border p-2 text-sm bg-white focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleSuggestX}
                      disabled={!category || !xAxisStart || isSuggestingX}
                      className="brutal-button bg-black text-white p-2 flex-shrink-0"
                      title="Suggest Opposite"
                    >
                      {isSuggestingX ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                    <input 
                      type="text" 
                      value={xAxisEnd}
                      onChange={(e) => setXAxisEnd(e.target.value)}
                      placeholder="Right side (e.g. Exciting)"
                      className="w-full brutal-border p-2 text-sm bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Y Axis */}
              <div className="space-y-2 p-4 border-2 border-dashed border-black bg-[#f4f4f0]">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Y-Axis (Vertical)</label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="text" 
                    value={yAxisStart}
                    onChange={(e) => setYAxisStart(e.target.value)}
                    placeholder="Bottom side (e.g. Cheap)"
                    className="w-full brutal-border p-2 text-sm bg-white focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleSuggestY}
                      disabled={!category || !yAxisStart || isSuggestingY}
                      className="brutal-button bg-black text-white p-2 flex-shrink-0"
                      title="Suggest Opposite"
                    >
                      {isSuggestingY ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                    <input 
                      type="text" 
                      value={yAxisEnd}
                      onChange={(e) => setYAxisEnd(e.target.value)}
                      placeholder="Top side (e.g. Expensive)"
                      className="w-full brutal-border p-2 text-sm bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !category || !xAxisStart || !xAxisEnd || !yAxisStart || !yAxisEnd}
                className="w-full brutal-button bg-[#FF4444] text-white font-bold text-lg py-4 uppercase tracking-widest mt-4"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                  </span>
                ) : 'Generate Chart'}
              </button>
            </div>
          </div>

          {/* Selected Item Details */}
          <AnimatePresence>
            {selectedItem && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white brutal-border brutal-shadow p-6 relative"
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 brutal-button bg-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mb-4 brutal-border overflow-hidden aspect-video bg-gray-200">
                  <img 
                    src={`https://picsum.photos/seed/${encodeURIComponent(selectedItem.imageSeed)}/400/225?grayscale`} 
                    alt={selectedItem.title}
                    className="w-full h-full object-cover mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="newspaper-title text-2xl font-bold mb-2">{selectedItem.title}</h3>
                <p className="text-sm leading-relaxed">{selectedItem.description}</p>
                
                <div className="mt-4 pt-4 border-t-2 border-black flex flex-col gap-1 text-xs font-bold">
                  <div className="flex justify-between">
                    <span>X: {selectedItem.x}</span>
                    <span className="text-gray-500">({selectedItem.x < 0 ? xAxisStart : xAxisEnd})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Y: {selectedItem.y}</span>
                    <span className="text-gray-500">({selectedItem.y < 0 ? yAxisStart : yAxisEnd})</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white brutal-border brutal-shadow p-4 md:p-8 min-h-[600px] flex flex-col">
          
          {(!xAxisStart || !xAxisEnd || !yAxisStart || !yAxisEnd) ? (
            <div className="flex-1 flex items-center justify-center border-4 border-dashed border-gray-300 text-gray-400 font-bold uppercase tracking-widest text-center p-8">
              Define axes to initialize chart matrix
            </div>
          ) : (
            <div className="relative flex-1 border-4 border-black bg-[#f4f4f0] overflow-hidden">
              {/* Grid Lines */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '10% 10%',
                opacity: 0.05
              }}></div>
              
              {/* Axes Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-black -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black -translate-x-1/2"></div>

              {/* Axis Labels */}
              <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-white brutal-border px-2 py-1 text-xs font-bold z-10 max-w-[120px] text-center break-words">{xAxisStart}</div>
              <div className="absolute top-1/2 right-2 -translate-y-1/2 bg-white brutal-border px-2 py-1 text-xs font-bold z-10 max-w-[120px] text-center break-words">{xAxisEnd}</div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white brutal-border px-2 py-1 text-xs font-bold z-10 max-w-[150px] text-center break-words">{yAxisEnd}</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white brutal-border px-2 py-1 text-xs font-bold z-10 max-w-[150px] text-center break-words">{yAxisStart}</div>

              {/* Items */}
              {items.map((item, idx) => {
                // Map -100..100 to 5%..95% to keep items inside the box
                const left = `${((item.x + 100) / 200) * 90 + 5}%`;
                // Y is inverted in CSS (top is 0)
                const top = `${((100 - item.y) / 200) * 90 + 5}%`;

                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.2, type: 'spring' }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left, top }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className={`
                      relative flex flex-col items-center gap-2
                      ${selectedItem === item ? 'z-30' : 'z-20'}
                    `}>
                      <div className={`
                        w-12 h-12 md:w-16 md:h-16 rounded-full brutal-border overflow-hidden bg-white
                        transition-transform duration-200
                        ${selectedItem === item ? 'scale-125 brutal-shadow' : 'group-hover:scale-110 group-hover:brutal-shadow-sm'}
                      `}>
                        <img 
                          src={`https://picsum.photos/seed/${encodeURIComponent(item.imageSeed)}/100/100?grayscale`}
                          alt={item.title}
                          className="w-full h-full object-cover mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className={`
                        bg-white brutal-border px-2 py-1 text-xs font-bold text-center whitespace-nowrap
                        ${selectedItem === item ? 'brutal-shadow' : 'group-hover:brutal-shadow-sm'}
                      `}>
                        {item.title}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center">
                  <div className="bg-black text-white brutal-border p-6 flex items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="newspaper-title text-xl tracking-widest">Processing Data...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
