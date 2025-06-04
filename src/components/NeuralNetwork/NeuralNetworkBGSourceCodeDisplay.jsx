import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

const NeuralNetworkBGSourceCodeDisplay = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  
  const sourceCode = `import { useState, useEffect, useRef } from 'react';

const NeuralNetworkBackground = ({ 
  children, 
  nodeCount = 25,
  className = "",
  colorScheme = "blue" 
}) => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const containerRef = useRef(null);

  const colorSchemes = {
    blue: {
      name: "Neural Blue",
      nodeColor: '#3B82F6',
      lineColor: '#60A5FA',
      glowColor: '#93C5FD',
      accent: '#1D4ED8'
    },
    purple: {
      name: "Purple Mind",
      nodeColor: '#8B5CF6',
      lineColor: '#A855F7',
      glowColor: '#C084FC',
      accent: '#7C3AED'
    },
    green: {
      name: "Matrix Code",
      nodeColor: '#10B981',
      lineColor: '#34D399',
      glowColor: '#6EE7B7',
      accent: '#059669'
    },
    red: {
      name: "Fire Network",
      nodeColor: '#EF4444',
      lineColor: '#F87171',
      glowColor: '#FCA5A5',
      accent: '#DC2626'
    },
    cyan: {
      name: "Cyber Ocean",
      nodeColor: '#06B6D4',
      lineColor: '#22D3EE',
      glowColor: '#67E8F9',
      accent: '#0891B2'
    }
  };

  const currentScheme = colorSchemes[colorScheme] || colorSchemes.blue;

  useEffect(() => {
    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 4 + 2,
      pulseSpeed: Math.random() * 2 + 1,
      activity: Math.random()
    }));
    setNodes(newNodes);
  }, [nodeCount, colorScheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        const newVx = node.vx + (Math.random() - 0.5) * 0.01;
        const newVy = node.vy + (Math.random() - 0.5) * 0.01;
        const constrainedVx = Math.max(-0.3, Math.min(0.3, newVx));
        const constrainedVy = Math.max(-0.3, Math.min(0.3, newVy));
        const newX = (node.x + constrainedVx + 100) % 100;
        const newY = (node.y + constrainedVy + 100) % 100;

        return {
          ...node,
          x: newX,
          y: newY,
          vx: constrainedVx,
          vy: constrainedVy,
          activity: 0.3 + Math.sin(Date.now() * 0.002 * node.pulseSpeed) * 0.7
        };
      }));
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newConnections = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 25) {
          const opacity = Math.max(0, 1 - distance / 25);
          newConnections.push({
            from: nodes[i],
            to: nodes[j],
            opacity: opacity * 0.6,
            pulse: Math.sin(Date.now() * 0.003 + i + j) * 0.3 + 0.7
          });
        }
      }
    }
    setConnections(newConnections);
  }, [nodes]);

  return (
    <div 
      ref={containerRef}
      className={\`relative min-h-screen w-full overflow-hidden bg-black \${className}\`}
    >
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection, index) => (
          <line
            key={index}
            x1={\`\${connection.from.x}%\`}
            y1={\`\${connection.from.y}%\`}
            x2={\`\${connection.to.x}%\`}
            y2={\`\${connection.to.y}%\`}
            stroke={currentScheme.lineColor}
            strokeWidth="1"
            opacity={connection.opacity * connection.pulse}
            style={{
              filter: \`drop-shadow(0 0 3px \${currentScheme.glowColor})\`
            }}
          />
        ))}
      </svg>

      <div className="absolute inset-0">
        {nodes.map((node) => (
          <div key={node.id}>
            <div
              className="absolute rounded-full transition-all duration-100"
              style={{
                left: \`\${node.x}%\`,
                top: \`\${node.y}%\`,
                width: \`\${node.size}px\`,
                height: \`\${node.size}px\`,
                backgroundColor: currentScheme.nodeColor,
                opacity: node.activity,
                boxShadow: \`0 0 \${node.size * 4}px \${currentScheme.nodeColor}, 0 0 \${node.size * 8}px \${currentScheme.glowColor}40\`,
                transform: 'translate(-50%, -50%)',
                animation: \`pulse-\${node.id} \${3 + node.pulseSpeed}s infinite ease-in-out\`
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                left: \`\${node.x}%\`,
                top: \`\${node.y}%\`,
                width: \`\${node.size * 3}px\`,
                height: \`\${node.size * 3}px\`,
                backgroundColor: currentScheme.glowColor,
                opacity: node.activity * 0.15,
                filter: 'blur(4px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                left: \`\${node.x}%\`,
                top: \`\${node.y}%\`,
                width: \`\${node.size * 6}px\`,
                height: \`\${node.size * 6}px\`,
                backgroundColor: currentScheme.accent,
                opacity: node.activity * 0.05,
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
            background: \`radial-gradient(circle at 25% 25%, \${currentScheme.nodeColor}08 0%, transparent 50%), 
                        radial-gradient(circle at 75% 75%, \${currentScheme.accent}08 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, \${currentScheme.glowColor}03 0%, transparent 70%)\`
          }}
        />
      </div>

      <div className="relative z-10">
        {children}
      </div>

      <style jsx>{\`
        \${nodes.map(node => \`
          @keyframes pulse-\${node.id} {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: \${node.activity};
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.2);
              opacity: \${Math.min(1, node.activity * 1.3)};
            }
          }
        \`).join('')}
      \`}</style>
    </div>
  );
};

export default NeuralNetworkBackground;`;

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
            🧠 Neural Network Background Component 🧠
          </h1>
          <p className="text-slate-300 text-lg">
            Copy-paste ready React component with animated neural networks
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
              Simply wrap your content with <code className="px-2 py-1 bg-slate-700 rounded text-blue-300">&lt;NeuralNetworkBG&gt;</code>
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
                  NeuralNetworkBackground.jsx
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
      <code>{`import NeuralNetworkBackground from './components/NeuralNetworkBackground';

function App() {
  return (
    <NeuralNetworkBackground 
      nodeCount={25} 
      colorScheme="cyan"
    >
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">
          Your Content Here
        </h1>
      </div>
    </NeuralNetworkBackground>
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
                  <td className="py-2">Content to render over neural networks</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">nodeCount</td>
                  <td className="py-2">number</td>
                  <td className="py-2">30</td>
                  <td className="py-2">Number of neurals to render</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-2 font-mono text-blue-300">colorScheme</td>
                  <td className="py-2">string</td>
                  <td className="py-2">"cyan"</td>
                  <td className="py-2">Color theme: cyan, red, blue, green, purple</td>
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

export default NeuralNetworkBGSourceCodeDisplay;