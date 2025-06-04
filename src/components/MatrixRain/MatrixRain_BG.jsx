import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * MatrixRainBackground Component
 * 
 * A React component that creates an animated Matrix-style falling code effect
 * with customizable characters, colors, and physics-based animations.
 * 
 * @param {ReactNode} children - Content to render on top of the matrix background
 * @param {number} columnCount - Number of columns to render (default: 50)
 * @param {string} className - Additional CSS classes to apply
 * @param {string} colorScheme - Color scheme for the matrix (classic, neon, cyber, retro, ice, fire, purple)
 * @param {number} speed - Animation speed multiplier (default: 1)
 */
const MatrixRainBackground = ({ 
  children, 
  columnCount = 50,
  className = "",
  colorScheme = "classic",
  speed = 1,
  characterSet = "matrix"
}) => {
  // State to hold all matrix column objects with their properties
  const [columns, setColumns] = useState([]);
  
  // Reference to the container DOM element
  const containerRef = useRef(null);
  
  // Enhanced character sets with names and better organization
  const characterSets = {
    katakana: {
      name: "Japanese Katakana",
      chars: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    },
    binary: {
      name: "Binary Code",
      chars: "01"
    },
    symbols: {
      name: "Tech Symbols",
      chars: "!@#$%^&*()_+-=[]{}|;:,.<>?~`"
    },
    numbers: {
      name: "Numbers & Letters",
      chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    },
    matrix: {
      name: "Matrix Mix",
      chars: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }
  };

  /**
   * Color schemes configuration object
   * Each scheme contains:
   * - name: Display name for UI
   * - primary: Main character color
   * - highlight: Leading character color (brightest)
   * - fade: Trailing character colors (array from bright to dim)
   * - glow: Glow effect color
   */
  const colorSchemes = {
    classic: {
      name: "Classic Green",
      primary: '#00ff41',
      highlight: '#ffffff',
      fade: ['#00ff41', '#00cc33', '#009925', '#006617', '#003309', '#001a05', '#000d02'],
      glow: 'rgba(0, 255, 65, 0.8)',
      background: 'from-black via-gray-950 to-black'
    },
    neon: {
      name: "Neon Cyan",
      primary: '#00ffff',
      highlight: '#ffffff',
      fade: ['#00ffff', '#00cccc', '#009999', '#006666', '#003333', '#001a1a', '#000d0d'],
      glow: 'rgba(0, 255, 255, 0.8)',
      background: 'from-black via-slate-950 to-black'
    },
    cyber: {
      name: "Cyber Purple",
      primary: '#ff00ff',
      highlight: '#ffffff',
      fade: ['#ff00ff', '#cc00cc', '#990099', '#660066', '#330033', '#1a001a', '#0d000d'],
      glow: 'rgba(255, 0, 255, 0.8)',
      background: 'from-black via-purple-950 to-black'
    },
    retro: {
      name: "Retro Amber",
      primary: '#ffaa00',
      highlight: '#ffffff',
      fade: ['#ffaa00', '#cc8800', '#996600', '#664400', '#332200', '#1a1100', '#0d0800'],
      glow: 'rgba(255, 170, 0, 0.8)',
      background: 'from-black via-amber-950 to-black'
    },
    ice: {
      name: "Ice Blue",
      primary: '#00aaff',
      highlight: '#ffffff',
      fade: ['#00aaff', '#0088cc', '#006699', '#004466', '#002233', '#00111a', '#00080d'],
      glow: 'rgba(0, 170, 255, 0.8)',
      background: 'from-black via-blue-950 to-black'
    },
    fire: {
      name: "Fire Red",
      primary: '#ff4400',
      highlight: '#ffffff',
      fade: ['#ff4400', '#cc3300', '#992600', '#661a00', '#330d00', '#1a0600', '#0d0300'],
      glow: 'rgba(255, 68, 0, 0.8)',
      background: 'from-black via-red-950 to-black'
    },
    purple: {
      name: "Deep Purple",
      primary: '#aa00ff',
      highlight: '#ffffff',
      fade: ['#aa00ff', '#8800cc', '#660099', '#440066', '#220033', '#11001a', '#08000d'],
      glow: 'rgba(170, 0, 255, 0.8)',
      background: 'from-black via-violet-950 to-black'
    }
  };

  // Get the current color scheme object, fallback to classic if invalid
  const currentScheme = colorSchemes[colorScheme] || colorSchemes.classic;

  /**
   * Effect: Initialize matrix columns when component mounts or props change
   */
  useEffect(() => {
    const newColumns = Array.from({ length: columnCount }, (_, i) => ({
      id: i,
      x: (i / columnCount) * 100, // X position as percentage
      characters: [], // Array of character objects in this column
      speed: (Math.random() * 0.5 + 0.3) * speed, // Fall speed
      lastUpdate: Date.now(),
      spawnDelay: Math.random() * 3000, // Delay before first character spawns
      characterSet: characterSet // Use the selected character set
    }));
    
    setColumns(newColumns);
  }, [columnCount, speed, characterSet]);

  /**
   * Effect: Animate matrix rain with realistic falling physics
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setColumns(prev => prev.map(column => {
        const now = Date.now();
        const deltaTime = now - column.lastUpdate;
        
        // Spawn new characters at the top occasionally
        let newCharacters = [...column.characters];
        
        // Spawn logic - create trails of characters
        if (Math.random() < 0.015 * speed && (newCharacters.length === 0 || newCharacters[0].y > 8)) {
          const chars = characterSets[column.characterSet].chars;
          const trailLength = Math.random() * 12 + 6; // 6-18 characters in trail
          
          // Create the leading character
          newCharacters.unshift({
            id: now,
            char: chars[Math.floor(Math.random() * chars.length)],
            y: -2,
            opacity: 1,
            isLeading: true,
            trailIndex: 0,
            totalTrailLength: trailLength,
            glitchChance: Math.random() * 0.15
          });
          
          // Create trailing characters
          for (let i = 1; i <= trailLength; i++) {
            newCharacters.unshift({
              id: now + i,
              char: chars[Math.floor(Math.random() * chars.length)],
              y: -2 - (i * 2), // Space them out vertically
              opacity: Math.max(0.1, 1 - (i / trailLength)),
              isLeading: false,
              trailIndex: i,
              totalTrailLength: trailLength,
              glitchChance: Math.random() * 0.08
            });
          }
        }

        // Update existing characters
        newCharacters = newCharacters.map((char, index) => {
          const newY = char.y + column.speed;
          
          // Calculate opacity based on trail position
          let opacity;
          if (char.isLeading) {
            opacity = 1; // Leading character is always brightest
          } else {
            // Fade based on position in trail
            const fadeRatio = char.trailIndex / char.totalTrailLength;
            opacity = Math.max(0.05, 1 - (fadeRatio * 0.9));
          }
          
          // Random character changes for glitch effect
          let newChar = char.char;
          if (Math.random() < char.glitchChance) {
            const chars = characterSets[column.characterSet].chars;
            newChar = chars[Math.floor(Math.random() * chars.length)];
          }

          return {
            ...char,
            char: newChar,
            y: newY,
            opacity: opacity
          };
        }).filter(char => char.y < 115); // Remove characters that fall off screen

        return {
          ...column,
          characters: newCharacters,
          lastUpdate: now
        };
      }));
    }, 50); // 20 FPS

    return () => clearInterval(interval);
  }, [speed, colorScheme]);

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-b ${currentScheme.background} ${className}`}
    >
      {/* Matrix Rain Container */}
      <div className="absolute inset-0 font-mono">
        {columns.map((column) => (
          <div
            key={column.id}
            className="absolute top-0 h-full"
            style={{
              left: `${column.x}%`,
              width: `${100 / columnCount}%`
            }}
          >
            {column.characters.map((char, index) => {
              // Calculate color based on trail position
              let color;
              if (char.isLeading) {
                color = currentScheme.highlight; // Leading character is white/bright
              } else {
                // Use fade colors based on trail position
                const fadeIndex = Math.min(
                  Math.floor((char.trailIndex / char.totalTrailLength) * currentScheme.fade.length),
                  currentScheme.fade.length - 1
                );
                color = currentScheme.fade[fadeIndex];
              }
              
              return (
                <div
                  key={char.id}
                  className="absolute text-center transition-all duration-75"
                  style={{
                    top: `${char.y}%`,
                    width: '100%',
                    color: color,
                    opacity: char.opacity,
                    textShadow: char.isLeading 
                      ? `0 0 8px ${currentScheme.glow}, 0 0 16px ${currentScheme.glow}, 0 0 24px ${currentScheme.glow}, 0 0 32px ${currentScheme.glow}`
                      : `0 0 4px ${color}, 0 0 8px ${color}`,
                    fontSize: char.isLeading ? '20px' : '16px',
                    fontWeight: char.isLeading ? 'bold' : 'normal',
                    transform: `scale(${char.isLeading ? 1.2 : 1})`,
                    filter: char.isLeading ? 'brightness(1.5) saturate(1.2)' : 'none',
                    zIndex: char.isLeading ? 10 : 1
                  }}
                >
                  {char.char}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 25% 25%, ${currentScheme.glow} 0%, transparent 70%), 
                        radial-gradient(circle at 75% 75%, ${currentScheme.glow} 0%, transparent 70%)`
          }}
        />
      </div>
      
      {/* Scanline Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }}
      />
      
      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.8) 100%)'
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * CollapsibleControls Component
 */
const CollapsibleControls = ({ 
  colorScheme, 
  setColorScheme, 
  columnCount, 
  setColumnCount,
  speed,
  setSpeed,
  characterSet,
  setCharacterSet
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorSchemes = {
    classic: { name: "Classic Green", icon: "🟢" },
    neon: { name: "Neon Cyan", icon: "🔵" },
    cyber: { name: "Cyber Purple", icon: "🟣" },
    retro: { name: "Retro Amber", icon: "🟡" },
    ice: { name: "Ice Blue", icon: "❄️" },
    fire: { name: "Fire Red", icon: "🔥" },
    purple: { name: "Deep Purple", icon: "💜" }
  };

  const characterSets = {
    katakana: { name: "Japanese Katakana", icon: "🈯" },
    binary: { name: "Binary Code", icon: "⚡" },
    symbols: { name: "Tech Symbols", icon: "⚙️" },
    numbers: { name: "Numbers & Letters", icon: "🔤" },
    matrix: { name: "Matrix Mix", icon: "🈚" }
  };

  return (
    <div className="fixed top-6 left-6 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/40 backdrop-blur-md rounded-full p-4 border border-green-500/50 
                   text-green-400 hover:bg-black/60 transition-all duration-300 
                   shadow-lg hover:shadow-green-500/20 mb-4"
        style={{ textShadow: '0 0 10px rgba(0, 255, 65, 0.8)' }}
        aria-label={isOpen ? "Close controls" : "Open controls"}
      >
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          🈯
        </div>
      </button>

      <div className={`
        bg-black/40 backdrop-blur-md rounded-2xl border border-green-500/30 
        overflow-hidden transition-all duration-500 ease-in-out
        ${isOpen 
          ? 'opacity-100 transform translate-y-0 max-h-[700px]' 
          : 'opacity-0 transform -translate-y-4 max-h-0'
        }
      `}>
        {isOpen && (
          <div className="p-6">
            <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2"
                style={{ textShadow: '0 0 10px rgba(0, 255, 65, 0.8)' }}>
              <span>🈯</span> Matrix Controls
            </h3>
            
            <div className="mb-6">
              <h4 className="text-green-400 text-sm mb-2 font-semibold">Color Schemes</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <button
                    key={key}
                    onClick={() => setColorScheme(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      colorScheme === key 
                        ? 'bg-green-500/20 text-green-300 shadow-lg transform scale-105 border border-green-500/50' 
                        : 'bg-black/20 text-gray-300 hover:bg-black/40 border border-gray-600/30 hover:scale-105'
                    }`}
                  >
                    {scheme.icon} {scheme.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-green-400 text-sm mb-2 font-semibold">Character Sets</h4>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(characterSets).map(([key, set]) => (
                  <button
                    key={key}
                    onClick={() => setCharacterSet(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      characterSet === key 
                        ? 'bg-green-500/20 text-green-300 shadow-lg transform scale-105 border border-green-500/50' 
                        : 'bg-black/20 text-gray-300 hover:bg-black/40 border border-gray-600/30 hover:scale-105'
                    }`}
                  >
                    {set.icon} {set.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-green-400 text-sm mb-2 block">
                Columns: <span className="font-bold">{columnCount}</span>
              </label>
              <input
                type="range"
                min="20"
                max="80"
                value={columnCount}
                onChange={(e) => setColumnCount(parseInt(e.target.value))}
                className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Sparse</span>
                <span>Dense</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-green-400 text-sm mb-2 block">
                Speed: <span className="font-bold">{speed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Slow</span>
                <span>Lightning</span>
              </div>
            </div>

            <div className="border-t border-green-500/20 pt-4">
              <p className="text-gray-400 text-xs mb-2">Quick Presets:</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setColumnCount(30); setSpeed(0.8); }}
                  className="text-xs px-3 py-1 bg-black/20 text-gray-300 rounded-full hover:bg-black/40 transition-colors border border-gray-600/30"
                >
                  Minimal
                </button>
                <button
                  onClick={() => { setColumnCount(50); setSpeed(1.0); }}
                  className="text-xs px-3 py-1 bg-black/20 text-gray-300 rounded-full hover:bg-black/40 transition-colors border border-gray-600/30"
                >
                  Classic
                </button>
                <button
                  onClick={() => { setColumnCount(70); setSpeed(1.8); }}
                  className="text-xs px-3 py-1 bg-black/20 text-gray-300 rounded-full hover:bg-black/40 transition-colors border border-gray-600/30"
                >
                  Intense
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-400 bg-black/20 rounded-lg p-2 border border-gray-600/20">
              💡 <strong>Tip:</strong> Characters randomly glitch and change as they fall!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * MatrixRainBackgroundDemo Component
 */
const MatrixRainBackgroundDemo = () => {
  const [colorScheme, setColorScheme] = useState('classic');
  const [columnCount, setColumnCount] = useState(50);
  const [speed, setSpeed] = useState(1.0);
  const [characterSet, setCharacterSet] = useState('matrix');

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MatrixRainBackground 
      colorScheme={colorScheme} 
      columnCount={columnCount}
      speed={speed}
      characterSet={characterSet}
    >
      <CollapsibleControls 
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
        columnCount={columnCount}
        setColumnCount={setColumnCount}
        speed={speed}
        setSpeed={setSpeed}
        characterSet={characterSet}
        setCharacterSet={setCharacterSet}
      />

      <div className="container mx-auto px-6 py-12">
        <div className="text-center pt-20">
          <h1 className="text-7xl font-bold text-green-400 mb-6 font-mono"
              style={{ textShadow: '0 0 20px rgba(0, 255, 65, 0.8), 0 0 40px rgba(0, 255, 65, 0.4)' }}>
            🈯 MATRIX RAIN 🈯
          </h1>
          <p className="text-2xl text-green-300 mb-12 max-w-3xl mx-auto font-mono">
            Classic falling code effect with customizable characters, colors, and speed. 
            Experience the digital rain from the Matrix universe!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
            {[
              { 
                title: "5 Character Sets", 
                desc: "Choose from Japanese Katakana, Binary Code, Tech Symbols, Numbers & Letters, or Matrix Mix",
                icon: "🈚"
              },
              { 
                title: "Variable Speed", 
                desc: "Adjustable animation speed from slow meditation mode to lightning-fast digital storm",
                icon: "⚡"
              },
              { 
                title: "7 Color Schemes", 
                desc: "Classic Green, Neon Cyan, Cyber Purple, Retro Amber, Ice Blue, Fire Red, and Deep Purple",
                icon: "🎨"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 
                           hover:bg-black/30 transition-all duration-500 group cursor-pointer
                           hover:shadow-lg hover:shadow-green-500/20"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-green-400 mb-4 group-hover:text-green-300 font-mono"
                    style={{ textShadow: '0 0 10px rgba(0, 255, 65, 0.6)' }}>
                  {feature.title}
                </h3>
                <p className="text-green-200 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="container mx-auto px-6 py-12">
            <div className="mt-20 bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 max-w-2xl mx-auto">
              <button
                onClick={() => navigate('/matrix-rain-sc')}
                className='bg-green-500 font-bold text-black px-6 py-3 rounded-lg hover:bg-green-400 transition-colors duration-300 font-mono'
                style={{ textShadow: 'none' }}
              >
                ENTER THE MATRIX
              </button>
            </div>
          </div>

          <div className="mt-12 bg-green-900/20 border border-green-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
            <h4 className="text-green-400 font-semibold mb-2 font-mono">🈯 Digital Rain Features</h4>
            <p className="text-green-200 text-sm font-mono">
              Characters randomly glitch and change as they fall, creating an authentic Matrix experience. 
              Leading characters glow brighter with dynamic lighting effects. 
              Perfect for cyberpunk themes, coding backgrounds, or sci-fi aesthetics.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #00ff41;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.5), 0 2px 10px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.8), 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #00ff41;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.5), 0 2px 10px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.8), 0 4px 15px rgba(0,0,0,0.3);
        }
      `}</style>
    </MatrixRainBackground>
  );
};

export default MatrixRainBackgroundDemo;