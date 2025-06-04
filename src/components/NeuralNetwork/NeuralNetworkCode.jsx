import { useState, useEffect, useRef } from 'react';

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
      className={`relative min-h-screen w-full overflow-hidden bg-black ${className}`}
    >
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

      <div className="absolute inset-0">
        {nodes.map((node) => (
          <div key={node.id}>
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

      <div className="relative z-10">
        {children}
      </div>

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

export default NeuralNetworkBackground;