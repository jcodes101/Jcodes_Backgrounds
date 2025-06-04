import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

const FloatingBubblesBGSourceCodeDisplay = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  
  const sourceCode = `import { useState, useEffect, useRef } from 'react';

const FloatingBubblesBackground = ({ 
  children, 
  bubbleCount = 25,
  className = "",
  colorScheme = "cyan" 
}) => {
  const [bubbles, setBubbles] = useState([]);
  const containerRef = useRef(null);

  const colorSchemes = {
    cyan: {
      name: "Ocean Breeze",
      colors: ['rgba(6, 182, 212, 0.3)', 'rgba(34, 211, 238, 0.25)', 'rgba(103, 232, 249, 0.2)', 'rgba(165, 243, 252, 0.15)'],
      highlights: ['rgba(255, 255, 255, 0.6)', 'rgba(165, 243, 252, 0.4)']
    },
    rainbow: {
      name: "Rainbow Soap",
      colors: ['rgba(239, 68, 68, 0.2)', 'rgba(249, 115, 22, 0.2)', 'rgba(234, 179, 8, 0.2)', 'rgba(34, 197, 94, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(139, 92, 246, 0.2)', 'rgba(236, 72, 153, 0.2)'],
      highlights: ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.3)']
    },
    pastel: {
      name: "Pastel Dreams",
      colors: ['rgba(251, 207, 232, 0.4)', 'rgba(219, 234, 254, 0.4)', 'rgba(220, 252, 231, 0.4)', 'rgba(254, 240, 138, 0.4)'],
      highlights: ['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.5)']
    },
    ocean: {
      name: "Deep Ocean",
      colors: ['rgba(8, 145, 178, 0.3)', 'rgba(14, 116, 144, 0.25)', 'rgba(22, 78, 99, 0.2)', 'rgba(7, 89, 133, 0.15)'],
      highlights: ['rgba(186, 230, 253, 0.6)', 'rgba(125, 211, 252, 0.4)']
    },
    sunset: {
      name: "Sunset Glow",
      colors: ['rgba(251, 146, 60, 0.3)', 'rgba(251, 113, 133, 0.25)', 'rgba(196, 181, 253, 0.2)', 'rgba(252, 165, 165, 0.15)'],
      highlights: ['rgba(255, 255, 255, 0.6)', 'rgba(254, 215, 170, 0.4)']
    },
    mint: {
      name: "Fresh Mint",
      colors: ['rgba(16, 185, 129, 0.3)', 'rgba(52, 211, 153, 0.25)', 'rgba(110, 231, 183, 0.2)', 'rgba(167, 243, 208, 0.15)'],
      highlights: ['rgba(255, 255, 255, 0.6)', 'rgba(209, 250, 229, 0.4)']
    },
    purple: {
      name: "Lavender Field",
      colors: ['rgba(139, 92, 246, 0.3)', 'rgba(168, 85, 247, 0.25)', 'rgba(192, 132, 252, 0.2)', 'rgba(221, 214, 254, 0.15)'],
      highlights: ['rgba(255, 255, 255, 0.6)', 'rgba(221, 214, 254, 0.4)']
    }
  };

  const currentScheme = colorSchemes[colorScheme] || colorSchemes.cyan;

  useEffect(() => {
    const newBubbles = Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 110 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.3 + 0.2),
      size: Math.random() * 40 + 20,
      color: currentScheme.colors[Math.floor(Math.random() * currentScheme.colors.length)],
      opacity: Math.random() * 0.4 + 0.3,
      wobbleSpeed: Math.random() * 2 + 1,
      wobbleAmount: Math.random() * 2 + 1,
      rotationSpeed: (Math.random() - 0.5) * 2,
      rotation: 0,
      lifespan: Math.random() * 15000 + 10000,
      birthTime: Date.now(),
      popping: false,
      popProgress: 0
    }));
    
    setBubbles(newBubbles);
  }, [bubbleCount, colorScheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev => prev.map(bubble => {
        if (bubble.popping) {
          return {
            ...bubble,
            popProgress: Math.min(bubble.popProgress + 0.1, 1)
          };
        }

        const age = Date.now() - bubble.birthTime;
        if (age > bubble.lifespan) {
          return {
            ...bubble,
            popping: true,
            popProgress: 0
          };
        }

        const wobbleX = Math.sin(Date.now() * 0.001 * bubble.wobbleSpeed) * bubble.wobbleAmount * 0.1;
        const wobbleY = Math.cos(Date.now() * 0.0015 * bubble.wobbleSpeed) * bubble.wobbleAmount * 0.05;

        const newVx = bubble.vx * 0.995 + wobbleX;
        const newVy = bubble.vy * 0.998;

        let newX = bubble.x + newVx;
        let newY = bubble.y + newVy + wobbleY;

        if (newX < -5) newX = -5;
        if (newX > 105) newX = 105;
        if (newY < -10) {
          newY = 110 + Math.random() * 10;
          newX = Math.random() * 100;
        }

        return {
          ...bubble,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: bubble.rotation + bubble.rotationSpeed,
          size: bubble.size + Math.sin(Date.now() * 0.002) * 2
        };
      }).filter(bubble => !(bubble.popping && bubble.popProgress >= 1)));

      setBubbles(prev => {
        const active = prev.filter(b => !b.popping || b.popProgress < 1);
        const needed = bubbleCount - active.length;

        if (needed > 0) {
          const newBubbles = Array.from({ length: needed }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 100,
            y: 110 + Math.random() * 20,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -(Math.random() * 0.3 + 0.2),
            size: Math.random() * 40 + 20,
            color: currentScheme.colors[Math.floor(Math.random() * currentScheme.colors.length)],
            opacity: Math.random() * 0.4 + 0.3,
            wobbleSpeed: Math.random() * 2 + 1,
            wobbleAmount: Math.random() * 2 + 1,
            rotationSpeed: (Math.random() - 0.5) * 2,
            rotation: 0,
            lifespan: Math.random() * 15000 + 10000,
            birthTime: Date.now(),
            popping: false,
            popProgress: 0
          }));
          return [...active, ...newBubbles];
        }

        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [bubbleCount, currentScheme.colors]);

  const handleBubbleClick = (id) => {
    setBubbles(prev => prev.map(bubble => 
      bubble.id === id && !bubble.popping
        ? { ...bubble, popping: true, popProgress: 0 }
        : bubble
    ));
  };

  return (
    <div 
      ref={containerRef}
      className={\`relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-200 via-blue-100 to-white \${className}\`}
    >
      <div className="absolute inset-0">
        {bubbles.map((bubble) => {
          const popScale = bubble.popping ? 1 + bubble.popProgress * 0.5 : 1;
          const popOpacity = bubble.popping ? (1 - bubble.popProgress) : bubble.opacity;

          return (
            <div
              key={bubble.id}
              className="absolute cursor-pointer transition-transform hover:scale-110"
              style={{
                left: \`\${bubble.x}%\`,
                top: \`\${bubble.y}%\`,
                transform: \`translate(-50%, -50%) scale(\${popScale}) rotate(\${bubble.rotation}deg)\`
              }}
              onClick={() => handleBubbleClick(bubble.id)}
            >
              <div
                className="relative rounded-full border border-white/30"
                style={{
                  width: \`\${bubble.size}px\`,
                  height: \`\${bubble.size}px\`,
                  background: \`radial-gradient(circle at 30% 30%, \${currentScheme.highlights[0]}, \${bubble.color})\`,
                  opacity: popOpacity,
                  boxShadow: \`0 0 20px \${bubble.color.replace('0.', '0.1')}, inset 0 0 20px rgba(255,255,255,0.2)\`,
                  backdropFilter: 'blur(1px)'
                }}
              >
                <div className="absolute rounded-full" style={{
                  top: '20%', left: '25%', width: '30%', height: '30%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)',
                  transform: 'rotate(-20deg)'
                }} />
                <div className="absolute rounded-full" style={{
                  top: '60%', right: '30%', width: '15%', height: '15%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent)'
                }} />
                {bubble.popping && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="absolute w-1 h-1 bg-white rounded-full" style={{
                        transform: \`rotate(\${i * 60}deg) translateY(-\${bubble.popProgress * 20}px)\`,
                        opacity: 1 - bubble.popProgress
                      }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: \`radial-gradient(circle at 20% 80%, \${currentScheme.colors[0]} 0%, transparent 50%), 
                        radial-gradient(circle at 80% 20%, \${currentScheme.colors[1]} 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, \${currentScheme.colors[2]} 0%, transparent 70%)\`
          }}
        />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default FloatingBubblesBackground;`;


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
            🫧 Floating Bubbles Background Component 🫧
          </h1>
          <p className="text-slate-300 text-lg">
            Copy-paste ready React component with animated bubbles
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
              Simply wrap your content with <code className="px-2 py-1 bg-slate-700 rounded text-blue-300">&lt;FloatingBubblesBG&gt;</code>
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
                  FloatingBubblesBackground.jsx
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
            💡 Usage Example
          </h3>
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <pre className="text-sm text-slate-300">
      <code>{`import FloatingBubblesBackground from './components/FloatingBubblesBackground';

function App() {
  return (
    <FloatingBubblesBackground 
      bubbleCount={30} 
      colorScheme="pastel"
      className="custom-background"
    >
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">
          Your Content Here
        </h1>
      </div>
    </FloatingBubblesBackground>
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
                  <td className="py-2">Content to render over networks</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">bubbleCount</td>
                  <td className="py-2">number</td>
                  <td className="py-2">25</td>
                  <td className="py-2">Number of bubbles to render</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">colorScheme</td>
                  <td className="py-2">string</td>
                  <td className="py-2">"cyan"</td>
                  <td className="py-2">Color theme: cyan, rainbow, pastel, ocean, sunset, mint, purple</td>
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

export default FloatingBubblesBGSourceCodeDisplay;