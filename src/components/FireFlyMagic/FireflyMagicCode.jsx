import { useState, useEffect, useRef } from 'react';

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
      className={`relative min-h-screen w-full overflow-hidden bg-black ${className}`}
    >
      <div className="absolute inset-0">
        {fireflies.map((firefly) => (
          <div key={firefly.id}>
            {firefly.trail.map((point, index) => (
              <div
                key={index}
                className="absolute rounded-full"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  width: `${firefly.size * (index / firefly.trail.length)}px`,
                  height: `${firefly.size * (index / firefly.trail.length)}px`,
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
                left: `${firefly.x}%`,
                top: `${firefly.y}%`,
                width: `${firefly.size}px`,
                height: `${firefly.size}px`,
                backgroundColor: firefly.color,
                opacity: firefly.opacity,
                boxShadow: `0 0 20px ${firefly.color}, 0 0 40px ${firefly.color}80, 0 0 60px ${firefly.color}40`,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(0.5px)'
              }}
            />
            
            <div
              className="absolute rounded-full"
              style={{
                left: `${firefly.x}%`,
                top: `${firefly.y}%`,
                width: `${firefly.size * 3}px`,
                height: `${firefly.size * 3}px`,
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
            background: `radial-gradient(circle at 30% 20%, ${currentScheme.colors[0]}10 0%, transparent 50%), 
                        radial-gradient(circle at 70% 80%, ${currentScheme.colors[1]}10 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, ${currentScheme.colors[2]}05 0%, transparent 70%)`
          }}
        />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default FireflyBackground;