import { useState, useEffect, useRef } from 'react';

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
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  const renderShape = (shape) => {
    const s = shape.currentSize || shape.size;
    switch (shape.type) {
      case 'triangle':
        return (
          <polygon
            points={[[0, -s/2], [-s/2, s/2], [s/2, s/2]].map(p => p.join(',')).join(' ')}
            fill={`url(#gradient-${shape.id})`}
            opacity={shape.opacity}
            transform={`rotate(${shape.rotation})`}
          />
        );
      case 'diamond':
        return (
          <polygon
            points={[[0, -s/2], [s/2, 0], [0, s/2], [-s/2, 0]].map(p => p.join(',')).join(' ')}
            fill={`url(#gradient-${shape.id})`}
            opacity={shape.opacity}
            transform={`rotate(${shape.rotation})`}
          />
        );
      case 'hexagon':
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          pts.push(`${Math.cos(angle) * s/2},${Math.sin(angle) * s/2}`);
        }
        return (
          <polygon
            points={pts.join(' ')}
            fill={`url(#gradient-${shape.id})`}
            opacity={shape.opacity}
            transform={`rotate(${shape.rotation})`}
          />
        );
      default:
        return (
          <circle
            r={s/2}
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
        {waves.map(wave => (
          <path
            key={wave.id}
            d={generateWavePath(wave)}
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            opacity={wave.opacity}
            style={{ filter: `drop-shadow(0 0 8px ${currentScheme.glow})` }}
          />
        ))}
        {shapes.map(shape => {
          const el = renderShape(shape);
          return (
            <g
              key={shape.id}
              transform={`translate(${(shape.x * window.innerWidth) / 100}, ${(shape.y * window.innerHeight) / 100})`}
              style={{ filter: `drop-shadow(0 0 ${(shape.currentSize || shape.size)/2}px ${currentScheme.glow})` }}
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
            background: `
              radial-gradient(circle at 20% 80%, ${currentScheme.primary}15 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${currentScheme.secondary}15 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, ${currentScheme.tertiary}10 0%, transparent 50%)`
          }}
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GeometricWavesBackground;