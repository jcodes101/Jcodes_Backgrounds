import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

const FireFlyBGSourceCodeDisplay = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  
  const sourceCode = `import { useState, useEffect, useRef } from 'react';

const FireflyBackground = ({ 
  children, 
  fireflyCount = 30,
  className = "",
  colorScheme = "purple" 
}) => {
  const [fireflies, setFireflies] = useState([]);
  const containerRef = useRef(null);

  const colorSchemes = {
    purple: {
      name: "Purple Magic",
      colors: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF'],
      glow: 'shadow-purple-500/50'
    },
    rainbow: {
      name: "Rainbow",
      colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'],
      glow: 'shadow-pink-500/50'
    },
    red: {
      name: "Fire",
      colors: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
      glow: 'shadow-red-500/50'
    },
    cyan: {
      name: "Ocean",
      colors: ['#0891B2', '#06B6D4', '#22D3EE', '#67E8F9', '#A5F3FC'],
      glow: 'shadow-cyan-500/50'
    },
    blue: {
      name: "Sky",
      colors: ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'],
      glow: 'shadow-blue-500/50'
    },
    green: {
      name: "Forest",
      colors: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
      glow: 'shadow-green-500/50'
    },
    pink: {
      name: "Blossom",
      colors: ['#BE185D', '#DB2777', '#EC4899', '#F472B6', '#F9A8D4'],
      glow: 'shadow-pink-500/50'
    }
  };

  const currentScheme = colorSchemes[colorScheme] || colorSchemes.purple;

  useEffect(() => {
    const newFireflies = Array.from({ length: fireflyCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 6 + 3,
      color: currentScheme.colors[Math.floor(Math.random() * currentScheme.colors.length)],
      opacity: Math.random() * 0.5 + 0.5,
      pulseSpeed: Math.random() * 2 + 1,
      trail: []
    }));
    
    setFireflies(newFireflies);
  }, [fireflyCount, colorScheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFireflies(prev => prev.map(firefly => {
        const newVx = firefly.vx + (Math.random() - 0.5) * 0.02;
        const newVy = firefly.vy + (Math.random() - 0.5) * 0.02;
        
        const constrainedVx = Math.max(-0.4, Math.min(0.4, newVx));
        const constrainedVy = Math.max(-0.4, Math.min(0.4, newVy));
        
        const newX = (firefly.x + constrainedVx + 100) % 100;
        const newY = (firefly.y + constrainedVy + 100) % 100;
        
        const newTrail = [...firefly.trail, { x: newX, y: newY }].slice(-8);
        
        return {
          ...firefly,
          x: newX,
          y: newY,
          vx: constrainedVx,
          vy: constrainedVy,
          trail: newTrail,
          opacity: 0.3 + Math.sin(Date.now() * 0.001 * firefly.pulseSpeed) * 0.4
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={\`relative min-h-screen w-full overflow-hidden bg-black \${className}\`}
    >
      <div className="absolute inset-0">
        {fireflies.map((firefly) => (
          <div key={firefly.id}>
            {firefly.trail.map((point, index) => (
              <div
                key={index}
                className="absolute rounded-full"
                style={{
                  left: \`\${point.x}%\`,
                  top: \`\${point.y}%\`,
                  width: \`\${firefly.size * (index / firefly.trail.length)}px\`,
                  height: \`\${firefly.size * (index / firefly.trail.length)}px\`,
                  backgroundColor: firefly.color,
                  opacity: firefly.opacity * (index / firefly.trail.length) * 0.3,
                  filter: 'blur(1px)',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
            
            <div
              className="absolute rounded-full transition-all duration-100"
              style={{
                left: \`\${firefly.x}%\`,
                top: \`\${firefly.y}%\`,
                width: \`\${firefly.size}px\`,
                height: \`\${firefly.size}px\`,
                backgroundColor: firefly.color,
                opacity: firefly.opacity,
                boxShadow: \`0 0 20px \${firefly.color}, 0 0 40px \${firefly.color}80, 0 0 60px \${firefly.color}40\`,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(0.5px)'
              }}
            />
            
            <div
              className="absolute rounded-full"
              style={{
                left: \`\${firefly.x}%\`,
                top: \`\${firefly.y}%\`,
                width: \`\${firefly.size * 3}px\`,
                height: \`\${firefly.size * 3}px\`,
                backgroundColor: firefly.color,
                opacity: firefly.opacity * 0.1,
                filter: 'blur(8px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: \`radial-gradient(circle at 30% 20%, \${currentScheme.colors[0]}10 0%, transparent 50%), 
                        radial-gradient(circle at 70% 80%, \${currentScheme.colors[1]}10 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, \${currentScheme.colors[2]}05 0%, transparent 70%)\`
          }}
        />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default FireflyBackground;`;

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
            ✨ Firefly Magic Background Component 🦋
          </h1>
          <p className="text-slate-300 text-lg">
            Copy-paste ready React component with animated fireflies
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
              Simply wrap your content with <code className="px-2 py-1 bg-slate-700 rounded text-blue-300">&lt;FireflyMagicBG&gt;</code>
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
                  FireflyMagicBackground.jsx
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
              <code>{`import FireflyBackground from './components/FireflyBackground';

            function App() {
              return (
                <FireflyBackground 
                  fireflyCount={30} 
                  colorScheme="purple"
                >
                  <div className="min-h-screen flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white">
                      Your Content Here
                    </h1>
                  </div>
                </FireflyBackground>
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
                  <td className="py-2 font-mono text-blue-300">fireflyCount</td>
                  <td className="py-2">number</td>
                  <td className="py-2">30</td>
                  <td className="py-2">Number of fireflies to render</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">colorScheme</td>
                  <td className="py-2">string</td>
                  <td className="py-2">"purple"</td>
                  <td className="py-2">Color theme: purple, rainbow, red, cyan, blue, green, pink</td>
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

export default FireFlyBGSourceCodeDisplay;