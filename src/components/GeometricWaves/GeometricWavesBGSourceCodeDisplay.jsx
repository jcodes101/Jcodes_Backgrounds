import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

const GeometricWavesBGSourceCodeDisplay = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  
  const sourceCode = `import { useState, useEffect, useRef } from 'react';

const GeometricWavesBackground = ({ 
  children, 
  shapeCount = 12,
  className = "",
  colorScheme = "pink" 
}) => {
  const [shapes, setShapes] = useState([]);
  const [waves, setWaves] = useState([]);
  const containerRef = useRef(null);
  const nextShapeId = useRef(0);

  const colorSchemes = {
    pink: {
      name: "Pink Waves",
      primary: '#EC4899',
      secondary: '#F472B6',
      tertiary: '#FBBF24',
      accent: '#A855F7',
      glow: '#FDE68A'
    },
    purple: {
      name: "Purple Flow",
      primary: '#8B5CF6',
      secondary: '#A855F7',
      tertiary: '#3B82F6',
      accent: '#EC4899',
      glow: '#C084FC'
    },
    ocean: {
      name: "Ocean Depths",
      primary: '#06B6D4',
      secondary: '#0891B2',
      tertiary: '#3B82F6',
      accent: '#10B981',
      glow: '#67E8F9'
    },
    sunset: {
      name: "Sunset Vibes",
      primary: '#F97316',
      secondary: '#EF4444',
      tertiary: '#FBBF24',
      accent: '#EC4899',
      glow: '#FCD34D'
    },
    aurora: {
      name: "Aurora Lights",
      primary: '#10B981',
      secondary: '#06B6D4',
      tertiary: '#8B5CF6',
      accent: '#EC4899',
      glow: '#6EE7B7'
    }
  };

  const currentScheme = colorSchemes[colorScheme] || colorSchemes.pink;

  const createShape = () => {
    const shapeTypes = ['triangle', 'diamond', 'hexagon', 'circle'];
    const startSide = Math.floor(Math.random() * 4);
    let startX, startY, velocityX, velocityY;

    switch (startSide) {
      case 0:
        startX = -10;
        startY = Math.random() * 100;
        velocityX = Math.random() * 0.3 + 0.1;
        velocityY = (Math.random() - 0.5) * 0.2;
        break;
      case 1:
        startX = Math.random() * 100;
        startY = -10;
        velocityX = (Math.random() - 0.5) * 0.2;
        velocityY = Math.random() * 0.3 + 0.1;
        break;
      case 2:
        startX = 110;
        startY = Math.random() * 100;
        velocityX = -(Math.random() * 0.3 + 0.1);
        velocityY = (Math.random() - 0.5) * 0.2;
        break;
      case 3:
        startX = Math.random() * 100;
        startY = 110;
        velocityX = (Math.random() - 0.5) * 0.2;
        velocityY = -(Math.random() * 0.3 + 0.1);
        break;
    }

    return {
      id: nextShapeId.current++,
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      x: startX,
      y: startY,
      velocityX,
      velocityY,
      size: Math.random() * 35 + 15,
      maxSize: Math.random() * 35 + 15,
      currentSize: Math.random() * 35 + 15,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      waveOffset: Math.random() * Math.PI * 2,
      waveAmplitude: Math.random() * 15 + 5,
      waveFreq: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.4 + 0.3,
      morphSpeed: Math.random() * 0.005 + 0.002,
      birthTime: Date.now()
    };
  };

  useEffect(() => {
    const newShapes = Array.from({ length: shapeCount }, () => createShape());
    setShapes(newShapes);

    const newWaves = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      y: (i + 1) * (100 / 7),
      amplitude: Math.random() * 8 + 4,
      frequency: Math.random() * 0.02 + 0.01,
      speed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.4 + 0.2
    }));

    setWaves(newWaves);
  }, [shapeCount, colorScheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() * 0.001;
      setShapes(prev => {
        let updated = prev.map(shape => {
          const newX = shape.x + shape.velocityX + Math.sin(time * shape.waveFreq + shape.waveOffset) * 0.1;
          const newY = shape.y + shape.velocityY + Math.cos(time * shape.waveFreq + shape.waveOffset) * 0.05;
          return {
            ...shape,
            rotation: shape.rotation + shape.rotationSpeed,
            x: newX,
            y: newY,
            opacity: shape.opacity + Math.sin(time * 0.003 + shape.id) * 0.03
          };
        }).filter(shape => shape.x > -15 && shape.x < 115 && shape.y > -15 && shape.y < 115);

        while (updated.length < shapeCount) {
          updated.push(createShape());
        }

        return updated;
      });

      setWaves(prev => prev.map(w => ({ ...w, phase: w.phase + w.speed })));
    }, 50);

    return () => clearInterval(interval);
  }, [shapeCount]);

  const generateWavePath = (wave) => {
    const points = [];
    for (let x = 0; x <= 100; x += 2) {
      const y = wave.y + Math.sin((x * 0.05 + wave.phase) * wave.frequency) * wave.amplitude;
      points.push(\`\${x},\${y}\`);
    }
    return \`M \${points.join(' L ')}\`;
  };

  const renderShape = (shape) => {
    const s = shape.currentSize || shape.size;
    switch (shape.type) {
      case 'triangle':
        return (
          <polygon
            points={[[0, -s/2], [-s/2, s/2], [s/2, s/2]].map(p => p.join(',')).join(' ')}
            fill={\`url(#gradient-\${shape.id})\`}
            opacity={shape.opacity}
            transform={\`rotate(\${shape.rotation})\`}
          />
        );
      case 'diamond':
        return (
          <polygon
            points={[[0, -s/2], [s/2, 0], [0, s/2], [-s/2, 0]].map(p => p.join(',')).join(' ')}
            fill={\`url(#gradient-\${shape.id})\`}
            opacity={shape.opacity}
            transform={\`rotate(\${shape.rotation})\`}
          />
        );
      case 'hexagon':
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          pts.push(\`\${Math.cos(angle) * s/2},\${Math.sin(angle) * s/2}\`);
        }
        return (
          <polygon
            points={pts.join(' ')}
            fill={\`url(#gradient-\${shape.id})\`}
            opacity={shape.opacity}
            transform={\`rotate(\${shape.rotation})\`}
          />
        );
      default:
        return (
          <circle
            r={s/2}
            fill={\`url(#gradient-\${shape.id})\`}
            opacity={shape.opacity}
          />
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className={\`relative min-h-screen w-full overflow-hidden bg-gray-900 \${className}\`}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {shapes.map((shape) => (
            <linearGradient key={shape.id} id={\`gradient-\${shape.id}\`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={currentScheme.primary} />
              <stop offset="50%" stopColor={currentScheme.secondary} />
              <stop offset="100%" stopColor={currentScheme.tertiary} />
            </linearGradient>
          ))}
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentScheme.accent} stopOpacity="0" />
            <stop offset="50%" stopColor={currentScheme.primary} stopOpacity="0.6" />
            <stop offset="100%" stopColor={currentScheme.secondary} stopOpacity="0" />
          </linearGradient>
        </defs>
        {waves.map(wave => (
          <path
            key={wave.id}
            d={generateWavePath(wave)}
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            opacity={wave.opacity}
            style={{ filter: \`drop-shadow(0 0 8px \${currentScheme.glow})\` }}
          />
        ))}
        {shapes.map(shape => {
          const el = renderShape(shape);
          return (
            <g
              key={shape.id}
              transform={\`translate(\${(shape.x * window.innerWidth) / 100}, \${(shape.y * window.innerHeight) / 100})\`}
              style={{ filter: \`drop-shadow(0 0 \${(shape.currentSize || shape.size)/2}px \${currentScheme.glow})\` }}
            >
              {el}
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: \`
              radial-gradient(circle at 20% 80%, \${currentScheme.primary}15 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, \${currentScheme.secondary}15 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, \${currentScheme.tertiary}10 0%, transparent 50%)\`
          }}
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GeometricWavesBackground;`;

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
            🔶 Geometric Waves Background Component 🔶
          </h1>
          <p className="text-slate-300 text-lg">
            Copy-paste ready React component with animated geometric shapes
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
              Simply wrap your content with <code className="px-2 py-1 bg-slate-700 rounded text-blue-300">&lt;GeometricWavesBG&gt;</code>
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
                  GeometricWavesBackground.jsx
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
    🌊 Usage Example
  </h3>
  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
    <pre className="text-sm text-slate-300">
      <code>{`import GeometricWavesBackground from './components/GeometricWavesBackground';

function App() {
  return (
    <GeometricWavesBackground 
      shapeCount={20}
      colorScheme="aurora"
      className="custom-animation-layer"
    >
      <div className="min-h-screen flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Wave 🌌</h1>
        <p className="text-lg text-slate-300 max-w-xl">
          Dive into immersive visuals with animated shapes and flowing gradients. Powered by React and creativity.
        </p>
      </div>
    </GeometricWavesBackground>
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
                  <td className="py-2 font-mono text-blue-300">shapeCount</td>
                  <td className="py-2">number</td>
                  <td className="py-2">12</td>
                  <td className="py-2">Number of shapes to render</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">colorScheme</td>
                  <td className="py-2">string</td>
                  <td className="py-2">"pink"</td>
                  <td className="py-2">Color theme: purple, ocean, pink, sunset, aurora</td>
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

export default GeometricWavesBGSourceCodeDisplay;