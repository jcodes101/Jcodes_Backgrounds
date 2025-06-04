import { useState, useEffect, useRef } from 'react';

const AuroraWavesBackground = ({ 
  children, 
  waveCount = 8,
  className = "",
  colorScheme = "classic" 
}) => {
  const [waves, setWaves] = useState([]);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);
  const nextParticleId = useRef(0);

  const colorSchemes = {
    classic: {
      name: "Classic Aurora",
      primary: '#00FF88',
      secondary: '#0066FF',
      tertiary: '#AA44FF',
      accent: '#00DDFF',
      highlight: '#FFAA00',
      glow: '#6EE7B7'
    },
    intense: {
      name: "Intense Lights",
      primary: '#FF2244',
      secondary: '#FF8800',
      tertiary: '#00FF66',
      accent: '#DD44FF',
      highlight: '#FF4499',
      glow: '#FCD34D'
    },
    cool: {
      name: "Cool Spectrum",
      primary: '#00EEFF',
      secondary: '#2244FF',
      tertiary: '#9955FF',
      accent: '#44FFAA',
      highlight: '#FF66CC',
      glow: '#67E8F9'
    },
    warm: {
      name: "Warm Glow",
      primary: '#FFCC00',
      secondary: '#FF4400',
      tertiary: '#FF6699',
      accent: '#FF7722',
      highlight: '#66FF44',
      glow: '#FDE68A'
    },
    mystical: {
      name: "Mystical Aurora",
      primary: '#AA33FF',
      secondary: '#FF3388',
      tertiary: '#33AAFF',
      accent: '#88FF33',
      highlight: '#FFAA33',
      glow: '#C084FC'
    }
  };

  const currentScheme = colorSchemes[colorScheme] || colorSchemes.classic;

  const createParticle = () => ({
    id: nextParticleId.current++,
    x: Math.random() * 100,
    y: Math.random() * 100,
    velocityX: (Math.random() - 0.5) * 0.1,
    velocityY: (Math.random() - 0.5) * 0.05,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
    twinkleSpeed: Math.random() * 0.02 + 0.01,
    birthTime: Date.now()
  });

  useEffect(() => {
    const newWaves = Array.from({ length: waveCount }, (_, i) => ({
      id: i,
      baseY: 80 - (i * 6),
      amplitude: Math.random() * 8 + 4,
      frequency: Math.random() * 0.02 + 0.01,
      speed: Math.random() * 0.02 + 0.008,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.35 + 0.25,
      width: Math.random() * 4 + 2,
      colorIndex: i % 5,
      flowDirection: Math.random() > 0.5 ? 1 : -1,
      verticalFlow: -(Math.random() * 0.008 + 0.002),
      horizontalShift: Math.random() * 0.01 + 0.005,
      floatSpeed: Math.random() * 0.05 + 0.02
    }));
    setWaves(newWaves);
    setParticles(Array.from({ length: 80 }, () => createParticle()));
  }, [waveCount, colorScheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() * 0.001;

      setWaves(prev => prev.map(wave => {
        let newBaseY = wave.baseY + wave.verticalFlow;
        if (newBaseY < -wave.amplitude * 2) {
          newBaseY = 100 + wave.amplitude;
        }
        return {
          ...wave,
          phase: wave.phase + wave.speed * wave.flowDirection,
          baseY: newBaseY + Math.sin(time * Math.abs(wave.verticalFlow) + wave.id) * 1.5
        };
      }));

      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.velocityX,
        y: p.y + p.velocityY,
        opacity: p.opacity + Math.sin(time * p.twinkleSpeed + p.id) * 0.1
      })).filter(p => 
        p.x > -5 && p.x < 105 && p.y > -5 && p.y < 105
      ).concat(
        Array.from({ length: Math.max(0, 80 - prev.length) }, () => createParticle())
      ));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getWaveColor = (wave) => {
    const colors = [
      currentScheme.primary,
      currentScheme.secondary,
      currentScheme.tertiary,
      currentScheme.accent,
      currentScheme.highlight
    ];
    return colors[wave.colorIndex];
  };

  const generateAuroraPath = (wave) => {
    const points = [], bottomPoints = [];
    for (let x = 0; x <= 100; x += 0.25) {
      const mainWave = Math.sin((x * 0.03 + wave.phase) * wave.frequency) * wave.amplitude;
      const secondaryWave = Math.sin((x * 0.05 + wave.phase * 1.3) * wave.frequency * 0.6) * wave.amplitude * 0.4;
      const tertiaryWave = Math.cos((x * 0.02 + wave.phase * 0.8) * wave.frequency * 1.2) * wave.amplitude * 0.2;
      const topY = wave.baseY + mainWave + secondaryWave + tertiaryWave;
      const bottomY = topY + wave.amplitude * 1.8 + Math.sin((x * 0.04 + wave.phase * 0.7) * wave.frequency) * wave.amplitude * 0.4;
      points.push(`${x},${Math.max(0, Math.min(100, topY))}`);
      bottomPoints.unshift(`${x},${Math.max(0, Math.min(100, bottomY))}`);
    }
    return `M 0,${points[0].split(',')[1]} L ${points.join(' L ')} L 100,${bottomPoints[0].split(',')[1]} L ${bottomPoints.join(' L ')} L 0,${bottomPoints[bottomPoints.length - 1].split(',')[1]} Z`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden bg-gray-900 ${className}`}
      style={{
        background: `
          linear-gradient(to bottom, 
            #0f172a 0%, 
            #1e293b 30%, 
            #334155 60%, 
            #475569 100%
          )
        `
      }}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {waves.map((wave) => (
            <linearGradient key={wave.id} id={`aurora-gradient-${wave.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={getWaveColor(wave)} stopOpacity="0.7" />
              <stop offset="50%" stopColor={getWaveColor(wave)} stopOpacity="0.45" />
              <stop offset="100%" stopColor={getWaveColor(wave)} stopOpacity="0.15" />
            </linearGradient>
          ))}
          <filter id="aurora-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="star-twinkle">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {particles.map(p => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.size * 0.3}
            fill="white"
            opacity={Math.max(0.1, Math.min(0.9, p.opacity))}
            filter="url(#star-twinkle)"
          />
        ))}

        {waves.map((wave) => (
          <path
            key={wave.id}
            d={generateAuroraPath(wave)}
            fill={`url(#aurora-gradient-${wave.id})`}
            opacity={wave.opacity}
            filter="url(#aurora-glow)"
            style={{ mixBlendMode: 'screen' }}
          />
        ))}

        {waves.slice(0, Math.ceil(waveCount * 0.6)).map((wave) => (
          <g key={`flow-${wave.id}`}>
            <path
              d={`M 0,${wave.baseY + Math.sin(wave.phase) * wave.amplitude * 0.8} 
                L 10,${wave.baseY + Math.sin(wave.phase + 0.2) * wave.amplitude * 0.85}
                L 20,${wave.baseY + Math.sin(wave.phase + 0.5) * wave.amplitude * 0.9}
                L 30,${wave.baseY + Math.sin(wave.phase + 0.8) * wave.amplitude * 0.95}
                L 40,${wave.baseY + Math.sin(wave.phase + 1.0) * wave.amplitude}
                L 50,${wave.baseY + Math.sin(wave.phase + 1.3) * wave.amplitude * 1.05}
                L 60,${wave.baseY + Math.sin(wave.phase + 1.5) * wave.amplitude * 1.1}
                L 70,${wave.baseY + Math.sin(wave.phase + 1.8) * wave.amplitude * 1.05}
                L 80,${wave.baseY + Math.sin(wave.phase + 2.0) * wave.amplitude * 0.9}
                L 90,${wave.baseY + Math.sin(wave.phase + 2.3) * wave.amplitude * 0.85}
                L 100,${wave.baseY + Math.sin(wave.phase + 2.5) * wave.amplitude * 0.8}`}
              stroke={getWaveColor(wave)}
              strokeWidth={wave.width * 0.8}
              fill="none"
              opacity={wave.opacity * 0.8}
              filter="url(#aurora-glow)"
              style={{ mixBlendMode: 'screen' }}
            />
            <path
              d={`M 0,${wave.baseY + wave.amplitude * 0.8 + Math.sin(wave.phase * 0.8) * wave.amplitude * 0.6}
                L 15,${wave.baseY + wave.amplitude * 0.85 + Math.sin(wave.phase * 0.8 + 0.3) * wave.amplitude * 0.65}
                L 30,${wave.baseY + wave.amplitude * 0.9 + Math.sin(wave.phase * 0.8 + 0.8) * wave.amplitude * 0.7}
                L 45,${wave.baseY + wave.amplitude * 0.95 + Math.sin(wave.phase * 0.8 + 1.1) * wave.amplitude * 0.75}
                L 60,${wave.baseY + wave.amplitude * 1.0 + Math.sin(wave.phase * 0.8 + 1.2) * wave.amplitude * 0.8}
                L 75,${wave.baseY + wave.amplitude * 0.9 + Math.sin(wave.phase * 0.8 + 1.8) * wave.amplitude * 0.6}
                L 90,${wave.baseY + wave.amplitude * 0.8 + Math.sin(wave.phase * 0.8 + 2.1) * wave.amplitude * 0.55}
                L 100,${wave.baseY + wave.amplitude * 0.7 + Math.sin(wave.phase * 0.8 + 2.2) * wave.amplitude * 0.5}`}
              stroke={getWaveColor(wave)}
              strokeWidth={wave.width * 0.4}
              fill="none"
              opacity={wave.opacity * 0.5}
              filter="url(#aurora-glow)"
              style={{ mixBlendMode: 'screen' }}
            />
          </g>
        ))}
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, ${currentScheme.primary}15 0%, transparent 60%),
              radial-gradient(ellipse at 80% 30%, ${currentScheme.secondary}10 0%, transparent 60%),
              radial-gradient(ellipse at 50% 40%, ${currentScheme.tertiary}08 0%, transparent 50%),
              radial-gradient(ellipse at 30% 60%, ${currentScheme.accent}10 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent opacity-80" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuroraWavesBackground;