import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Create a new shape
  const createShape = () => {
    const shapeTypes = ['triangle', 'diamond', 'hexagon', 'circle'];
    // Start shapes from off-screen positions
    const startSide = Math.floor(Math.random() * 4); // 0=left, 1=top, 2=right, 3=bottom
    let startX, startY, velocityX, velocityY;
    
    switch (startSide) {
      case 0: // Left side
        startX = -10;
        startY = Math.random() * 100;
        velocityX = Math.random() * 0.3 + 0.1; // Move right
        velocityY = (Math.random() - 0.5) * 0.2; // Slight vertical drift
        break;
      case 1: // Top
        startX = Math.random() * 100;
        startY = -10;
        velocityX = (Math.random() - 0.5) * 0.2; // Slight horizontal drift
        velocityY = Math.random() * 0.3 + 0.1; // Move down
        break;
      case 2: // Right side
        startX = 110;
        startY = Math.random() * 100;
        velocityX = -(Math.random() * 0.3 + 0.1); // Move left
        velocityY = (Math.random() - 0.5) * 0.2; // Slight vertical drift
        break;
      case 3: // Bottom
        startX = Math.random() * 100;
        startY = 110;
        velocityX = (Math.random() - 0.5) * 0.2; // Slight horizontal drift
        velocityY = -(Math.random() * 0.3 + 0.1); // Move up
        break;
    }
    
    return {
      id: nextShapeId.current++,
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      x: startX,
      y: startY,
      velocityX,
      velocityY,
      size: Math.random() * 35 + 15, // Bigger shapes: 15-50px
      maxSize: Math.random() * 35 + 15,
      currentSize: Math.random() * 35 + 15, // Start at full size
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      waveOffset: Math.random() * Math.PI * 2,
      waveAmplitude: Math.random() * 15 + 5,
      waveFreq: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.4 + 0.3, // More visible
      morphSpeed: Math.random() * 0.005 + 0.002,
      birthTime: Date.now()
    };
  };

  // Initialize geometric shapes
  useEffect(() => {
    const newShapes = Array.from({ length: shapeCount }, () => createShape());
    setShapes(newShapes);

    // Initialize wave lines
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

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() * 0.001;
      const currentTime = Date.now();
      
      setShapes(prev => {
        // Update existing shapes
        let updatedShapes = prev.map(shape => {
          const newX = shape.x + shape.velocityX + Math.sin(time * shape.waveFreq + shape.waveOffset) * 0.1;
          const newY = shape.y + shape.velocityY + Math.cos(time * shape.waveFreq + shape.waveOffset) * 0.05;
          
          return {
            ...shape,
            rotation: shape.rotation + shape.rotationSpeed,
            x: newX,
            y: newY,
            opacity: shape.opacity + Math.sin(time * 0.003 + shape.id) * 0.03
          };
        }).filter(shape => {
          // Remove shapes that have moved off-screen (with buffer)
          return shape.x > -15 && shape.x < 115 && shape.y > -15 && shape.y < 115;
        });

        // Add new shapes to maintain the target count
        const shapesToAdd = shapeCount - updatedShapes.length;
        for (let i = 0; i < shapesToAdd; i++) {
          updatedShapes.push(createShape());
        }

        return updatedShapes;
      });

      setWaves(prev => prev.map(wave => ({
        ...wave,
        phase: wave.phase + wave.speed
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [shapeCount]);

  const generateWavePath = (wave) => {
    const points = [];
    
    for (let x = 0; x <= 100; x += 2) {
      const y = wave.y + Math.sin((x * 0.05 + wave.phase) * wave.frequency) * wave.amplitude;
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(' L ')}`;
  };

  const renderShape = (shape) => {
    const shapeSize = shape.currentSize || shape.size;
    
    switch (shape.type) {
      case 'triangle':
        const trianglePoints = [
          [0, -shapeSize/2],
          [-shapeSize/2, shapeSize/2],
          [shapeSize/2, shapeSize/2]
        ].map(([x, y]) => `${x},${y}`).join(' ');
        
        return (
          <polygon
            points={trianglePoints}
            fill={`url(#gradient-${shape.id})`}
            opacity={shape.opacity}
            transform={`rotate(${shape.rotation})`}
          />
        );
        
      case 'diamond':
        const diamondPoints = [
          [0, -shapeSize/2],
          [shapeSize/2, 0],
          [0, shapeSize/2],
          [-shapeSize/2, 0]
        ].map(([x, y]) => `${x},${y}`).join(' ');
        
        return (
          <polygon
            points={diamondPoints}
            fill={`url(#gradient-${shape.id})`}
            opacity={shape.opacity}
            transform={`rotate(${shape.rotation})`}
          />
        );
        
      case 'hexagon':
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * shapeSize/2;
          const y = Math.sin(angle) * shapeSize/2;
          hexPoints.push(`${x},${y}`);
        }
        
        return (
          <polygon
            points={hexPoints.join(' ')}
            fill={`url(#gradient-${shape.id})`}
            opacity={shape.opacity}
            transform={`rotate(${shape.rotation})`}
          />
        );
        
      case 'circle':
      default:
        return (
          <circle
            r={shapeSize/2}
            fill={`url(#gradient-${shape.id})`}
            opacity={shape.opacity}
          />
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden bg-gray-900 ${className}`}
    >
      {/* SVG Layer for shapes and waves */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {shapes.map((shape) => (
            <linearGradient key={shape.id} id={`gradient-${shape.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
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

        {/* Animated Wave Lines */}
        {waves.map((wave) => (
          <path
            key={wave.id}
            d={generateWavePath(wave)}
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            opacity={wave.opacity}
            style={{
              filter: `drop-shadow(0 0 8px ${currentScheme.glow})`
            }}
          />
        ))}

        {/* Geometric Shapes */}
        {shapes.map((shape) => {
          const renderedShape = renderShape(shape);
          if (!renderedShape) return null;
          
          return (
            <g
              key={shape.id}
              transform={`translate(${(shape.x * (typeof window !== 'undefined' ? window.innerWidth : 1000)) / 100}, ${(shape.y * (typeof window !== 'undefined' ? window.innerHeight : 800)) / 100})`}
              style={{
                filter: `drop-shadow(0 0 ${(shape.currentSize || shape.size)/2}px ${currentScheme.glow})`
              }}
            >
              {renderedShape}
            </g>
          );
        })}
      </svg>

      {/* Flowing Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, ${currentScheme.primary}15 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${currentScheme.secondary}15 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, ${currentScheme.tertiary}10 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const GeometricWavesDemo = () => {
  const [colorScheme, setColorScheme] = useState('pink');
  const [shapeCount, setShapeCount] = useState(12);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const naviagte = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const colorSchemes = {
    pink: { name: "Pink Waves", icon: "🌸" },
    purple: { name: "Purple Flow", icon: "🔮" },
    ocean: { name: "Ocean Depths", icon: "🌊" },
    sunset: { name: "Sunset Vibes", icon: "🌅" },
    aurora: { name: "Aurora Lights", icon: "✨" }
  };

  return (
    <GeometricWavesBackground colorScheme={colorScheme} shapeCount={shapeCount}>
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
                <span>🔶</span> Wave Controls
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
                  Geometric Shapes: <span className="font-bold">{shapeCount}</span>
                </label>
                <input
                  type="range"
                  min="6"
                  max="20"
                  value={shapeCount}
                  onChange={(e) => setShapeCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShapeCount(6)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Minimal
                </button>
                <button
                  onClick={() => setShapeCount(12)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Default
                </button>
                <button
                  onClick={() => setShapeCount(18)}
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
            🔶 Geometric Waves 🔶
          </h1>
          <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
            Abstract geometric shapes flowing in wave patterns with smooth color transitions. 
            Watch as shapes morph and dance through flowing wave animations!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
            {[
              { 
                title: "Wave Animation", 
                desc: "Smooth flowing wave lines that create dynamic patterns across the background with organic movement",
                icon: "🌊"
              },
              { 
                title: "Shape Morphing", 
                desc: "Geometric shapes that rotate, scale, and transform - triangles, diamonds, hexagons, and circles",
                icon: "🔷"
              },
              { 
                title: "Color Transitions", 
                desc: "Pink Waves, Purple Flow, Ocean Depths, Sunset Vibes, and Aurora Lights gradient schemes",
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

          <div className="mt-20 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto">
            <button
              onClick={() => naviagte('/geometric-waves-sc')}
              className='bg-orange-500 font-bold text-white px-6 py-3 rounded-lg hover:bg-orange-300 transition-colors duration-300'
            >
              Use This Background
            </button>
          </div>
        </div>
      </div>
    </GeometricWavesBackground>
  );
};

export default GeometricWavesDemo;