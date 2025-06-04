import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Initialize nodes
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

  // Animation loop
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

  // Calculate connections between nearby nodes
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
      className={`relative min-h-screen w-full overflow-hidden bg-black ${className}`}
    >
      {/* Animated Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection, index) => (
          <line
            key={index}
            x1={`${connection.from.x}%`}
            y1={`${connection.from.y}%`}
            x2={`${connection.to.x}%`}
            y2={`${connection.to.y}%`}
            stroke={currentScheme.lineColor}
            strokeWidth="1"
            opacity={connection.opacity * connection.pulse}
            style={{
              filter: `drop-shadow(0 0 3px ${currentScheme.glowColor})`
            }}
          />
        ))}
      </svg>

      {/* Neural Nodes */}
      <div className="absolute inset-0">
        {nodes.map((node) => (
          <div key={node.id}>
            {/* Main Node */}
            <div
              className="absolute rounded-full transition-all duration-100"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.size}px`,
                height: `${node.size}px`,
                backgroundColor: currentScheme.nodeColor,
                opacity: node.activity,
                boxShadow: `0 0 ${node.size * 4}px ${currentScheme.nodeColor}, 0 0 ${node.size * 8}px ${currentScheme.glowColor}40`,
                transform: 'translate(-50%, -50%)',
                animation: `pulse-${node.id} ${3 + node.pulseSpeed}s infinite ease-in-out`
              }}
            />
            
            {/* Outer Glow Ring */}
            <div
              className="absolute rounded-full"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.size * 3}px`,
                height: `${node.size * 3}px`,
                backgroundColor: currentScheme.glowColor,
                opacity: node.activity * 0.15,
                filter: 'blur(4px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
            
            {/* Activity Pulse */}
            <div
              className="absolute rounded-full"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.size * 6}px`,
                height: `${node.size * 6}px`,
                backgroundColor: currentScheme.accent,
                opacity: node.activity * 0.05,
                filter: 'blur(8px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        ))}
      </div>

      {/* Ambient Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 25% 25%, ${currentScheme.nodeColor}08 0%, transparent 50%), 
                        radial-gradient(circle at 75% 75%, ${currentScheme.accent}08 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, ${currentScheme.glowColor}03 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Dynamic CSS for node animations */}
      <style jsx>{`
        ${nodes.map(node => `
          @keyframes pulse-${node.id} {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: ${node.activity};
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.2);
              opacity: ${Math.min(1, node.activity * 1.3)};
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

const NeuralNetworkDemo = () => {
  const [colorScheme, setColorScheme] = useState('blue');
  const [nodeCount, setNodeCount] = useState(25);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const colorSchemes = {
    blue: { name: "Neural Blue", icon: "🧠" },
    purple: { name: "Purple Mind", icon: "🔮" },
    green: { name: "Matrix Code", icon: "💚" },
    red: { name: "Fire Network", icon: "🔥" },
    cyan: { name: "Cyber Ocean", icon: "🌊" }
  };

  return (
    <NeuralNetworkBackground colorScheme={colorScheme} nodeCount={nodeCount}>
      {/* Controls */}
      <div className="fixed top-6 left-6 z-20">
        <button
          onClick={() => setIsControlsOpen(!isControlsOpen)}
          className="bg-black/40 backdrop-blur-md rounded-full p-4 border border-white/20 
                     text-white hover:bg-black/60 transition-all duration-300 
                     shadow-lg hover:shadow-xl mb-4"
        >
          <div className={`transform transition-transform duration-300 ${isControlsOpen ? 'rotate-45' : ''}`}>
            ⚙️
          </div>
        </button>

        <div className={`
          bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 
          overflow-hidden transition-all duration-500 ease-in-out
          ${isControlsOpen 
            ? 'opacity-100 transform translate-y-0 max-h-96' 
            : 'opacity-0 transform -translate-y-4 max-h-0'
          }
        `}>
          {isControlsOpen && (
            <div className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span>🧠</span> Neural Controls
              </h3>
              
              <div className="grid grid-cols-1 gap-2 mb-4">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <button
                    key={key}
                    onClick={() => setColorScheme(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      colorScheme === key 
                        ? 'bg-white text-black shadow-lg transform scale-105' 
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:scale-105'
                    }`}
                  >
                    {scheme.icon} {scheme.name}
                  </button>
                ))}
              </div>
              
              <div className="mb-4">
                <label className="text-white text-sm mb-2 block">
                  Neural Nodes: <span className="font-bold">{nodeCount}</span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="40"
                  value={nodeCount}
                  onChange={(e) => setNodeCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setNodeCount(15)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Minimal
                </button>
                <button
                  onClick={() => setNodeCount(25)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Default
                </button>
                <button
                  onClick={() => setNodeCount(35)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Dense
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Demo Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center pt-20">
          <h1 className="text-7xl font-bold text-white mb-6">
            🧠 Neural Network 🧠
          </h1>
          <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
            Dynamic neural network visualization with animated nodes and connections. 
            Watch as the network pulses with artificial intelligence!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
            {[
              { 
                title: "Dynamic Connections", 
                desc: "Nodes automatically connect to nearby neighbors with animated lines that pulse with data flow",
                icon: "🔗"
              },
              { 
                title: "Neural Activity", 
                desc: "Each node pulses with its own rhythm, simulating neural firing patterns and brain activity",
                icon: "⚡"
              },
              { 
                title: "5 AI Themes", 
                desc: "Neural Blue, Purple Mind, Matrix Code, Fire Network, and Cyber Ocean color schemes",
                icon: "🎨"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 
                           hover:bg-white/10 transition-all duration-500 group cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Implementation */}
            <div className="container mx-auto px-6 py-12">
              <div className="mt-20 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto">
                <button
                onClick={() => navigate('/neural-network-sc')}
                className='bg-pink-600 font-bold text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors duration-300'
                >Use This Background
                </button>
              </div>
            </div>
        </div>
      </div>

      
    </NeuralNetworkBackground>
  );
};

export default NeuralNetworkDemo;