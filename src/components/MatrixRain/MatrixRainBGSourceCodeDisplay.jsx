import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

const MatrixRainBGSourceCodeDisplay = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  
  const sourceCode = `import { useState, useEffect, useRef } from 'react';

const MatrixRainBackground = ({ 
  children, 
  columnCount = 50,
  className = "",
  colorScheme = "classic",
  speed = 1,
  characterSet = "matrix"
}) => {
  const [columns, setColumns] = useState([]);
  const containerRef = useRef(null);

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
      chars: "!@#$%^&*()_+-=[]{}|;:,.<>?~\`"
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

  const currentScheme = colorSchemes[colorScheme] || colorSchemes.classic;

  useEffect(() => {
    const newColumns = Array.from({ length: columnCount }, (_, i) => ({
      id: i,
      x: (i / columnCount) * 100,
      characters: [],
      speed: (Math.random() * 0.5 + 0.3) * speed,
      lastUpdate: Date.now(),
      spawnDelay: Math.random() * 3000,
      characterSet: characterSet
    }));
    setColumns(newColumns);
  }, [columnCount, speed, characterSet]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColumns(prev =>
        prev.map(column => {
          const now = Date.now();
          const deltaTime = now - column.lastUpdate;
          let newCharacters = [...column.characters];

          if (Math.random() < 0.015 * speed && (newCharacters.length === 0 || newCharacters[0].y > 8)) {
            const chars = characterSets[column.characterSet].chars;
            const trailLength = Math.random() * 12 + 6;

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

            for (let i = 1; i <= trailLength; i++) {
              newCharacters.unshift({
                id: now + i,
                char: chars[Math.floor(Math.random() * chars.length)],
                y: -2 - (i * 2),
                opacity: Math.max(0.1, 1 - (i / trailLength)),
                isLeading: false,
                trailIndex: i,
                totalTrailLength: trailLength,
                glitchChance: Math.random() * 0.08
              });
            }
          }

          newCharacters = newCharacters.map(char => {
            const newY = char.y + column.speed;
            let opacity = char.isLeading ? 1 : Math.max(0.05, 1 - (char.trailIndex / char.totalTrailLength * 0.9));
            const chars = characterSets[column.characterSet].chars;
            const newChar = Math.random() < char.glitchChance
              ? chars[Math.floor(Math.random() * chars.length)]
              : char.char;

            return {
              ...char,
              char: newChar,
              y: newY,
              opacity
            };
          }).filter(char => char.y < 115);

          return {
            ...column,
            characters: newCharacters,
            lastUpdate: now
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [speed, colorScheme]);

  return (
    <div 
      ref={containerRef}
      className={\`relative min-h-screen w-full overflow-hidden bg-gradient-to-b \${currentScheme.background} \${className}\`}
    >
      <div className="absolute inset-0 font-mono">
        {columns.map(column => (
          <div
            key={column.id}
            className="absolute top-0 h-full"
            style={{
              left: \`\${column.x}%\`,
              width: \`\${100 / columnCount}%\`
            }}
          >
            {column.characters.map(char => {
              const fadeIndex = Math.min(
                Math.floor((char.trailIndex / char.totalTrailLength) * currentScheme.fade.length),
                currentScheme.fade.length - 1
              );
              const color = char.isLeading ? currentScheme.highlight : currentScheme.fade[fadeIndex];

              return (
                <div
                  key={char.id}
                  className="absolute text-center transition-all duration-75"
                  style={{
                    top: \`\${char.y}%\`,
                    width: '100%',
                    color: color,
                    opacity: char.opacity,
                    textShadow: char.isLeading
                      ? \`0 0 8px \${currentScheme.glow}, 0 0 16px \${currentScheme.glow}, 0 0 24px \${currentScheme.glow}, 0 0 32px \${currentScheme.glow}\`
                      : \`0 0 4px \${color}, 0 0 8px \${color}\`,
                    fontSize: char.isLeading ? '20px' : '16px',
                    fontWeight: char.isLeading ? 'bold' : 'normal',
                    transform: \`scale(\${char.isLeading ? 1.2 : 1})\`,
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

      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: \`radial-gradient(circle at 25% 25%, \${currentScheme.glow} 0%, transparent 70%), 
                        radial-gradient(circle at 75% 75%, \${currentScheme.glow} 0%, transparent 70%)\`
          }}
        />
      </div>

      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }}
      />

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MatrixRainBackground;`;



  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🈯 Matrix Rain Background Component 🈯
          </h1>
          <p className="text-slate-300 text-lg">
            Copy-paste ready React component with animated matrix code
          </p>
        </div>

        {/* Usage Info */}
        <div className="mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            📦 Installation & Usage
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-slate-400">NPM Install:</span>
              <code className="ml-2 px-2 py-1 bg-slate-700 rounded text-blue-300">
                npm install jcodes-styles
              </code>
            </div>
            <div>
              <span className="text-slate-400">Dependencies:</span>
              <code className="ml-2 px-2 py-1 bg-slate-700 rounded text-blue-300">
                tailwindcss
              </code>
            </div>
            <div>
              <span className="text-slate-400">Styling:</span>
              <code className="ml-2 px-2 py-1 bg-slate-700 rounded text-blue-300">
                Tailwind CSS
              </code>
            </div>
            <div className="text-slate-300">
              Simply wrap your content with <code className="px-2 py-1 bg-slate-700 rounded text-blue-300">&lt;MatrixRainBG&gt;</code>
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div className="relative">
          <div className="absolute top-5 right-4 z-10">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 
                         text-white rounded-lg transition-all duration-200 text-sm font-medium
                         border border-slate-600 hover:border-slate-500 mt-6"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-slate-400 text-sm font-mono">
                  MatrixRainBackground.jsx
                </span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                React Component
              </span>
            </div>
            
            <div className="p-6">
              <pre className="text-sm leading-relaxed overflow-x-auto">
                <code className="language-jsx text-slate-100">
                  {sourceCode}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Usage Example */}
<div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
    💡  Usage Example
  </h3>
  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
    <pre className="text-sm text-slate-300">
      <code>{`import MatrixRainBackground from './components/MatrixRainBackground';

function App() {
  return (
    <MatrixRainBackground 
      columnCount={60} 
      colorScheme="cyber"
      characterSet="matrix"
      speed={1.2}
      className="custom-matrix-bg"
    >
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-pink-300">
          Enter the Matrix
        </h1>
      </div>
    </MatrixRainBackground>
  );
}`}</code>
    </pre>
  </div>
</div>



        {/* Props Table */}
        <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            ⚙️ Props
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-2 text-slate-300 font-medium">Prop</th>
                  <th className="text-left py-2 text-slate-300 font-medium">Type</th>
                  <th className="text-left py-2 text-slate-300 font-medium">Default</th>
                  <th className="text-left py-2 text-slate-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">children</td>
                  <td className="py-2">ReactNode</td>
                  <td className="py-2">-</td>
                  <td className="py-2">Content to render over geometric shapes</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">columnCount</td>
                  <td className="py-2">number</td>
                  <td className="py-2">60</td>
                  <td className="py-2">Number of falling charcters columns rendered across the screen</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">colorScheme</td>
                  <td className="py-2">string</td>
                  <td className="py-2">"cyber"</td>
                  <td className="py-2">Color theme: classic, neon, cyber, retro, ice, fire, purple</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">charcterSet</td>
                  <td className="py-2">string</td>
                  <td className="py-2">"katakana"</td>
                  <td className="py-2">Color theme: katakana, binary, symbols, numbers, matrix</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-blue-300">className</td>
                  <td className="py-2">string</td>
                  <td className="py-2">""</td>
                  <td className="py-2">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Ready to use • No external dependencies • Fully customizable
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatrixRainBGSourceCodeDisplay;