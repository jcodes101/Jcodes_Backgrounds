import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
      primary: '#00FF88', // Bright Green
      secondary: '#0066FF', // Bright Blue  
      tertiary: '#AA44FF', // Bright Purple
      accent: '#00DDFF', // Bright Cyan
      highlight: '#FFAA00', // Bright Orange
      glow: '#6EE7B7'
    },
    intense: {
      name: "Intense Lights",
      primary: '#FF2244', // Bright Red
      secondary: '#FF8800', // Bright Orange
      tertiary: '#00FF66', // Bright Green
      accent: '#DD44FF', // Bright Magenta
      highlight: '#FF4499', // Hot Pink
      glow: '#FCD34D'
    },
    cool: {
      name: "Cool Spectrum",
      primary: '#00EEFF', // Electric Cyan
      secondary: '#2244FF', // Electric Blue
      tertiary: '#9955FF', // Electric Purple
      accent: '#44FFAA', // Electric Green
      highlight: '#FF66CC', // Electric Pink
      glow: '#67E8F9'
    },
    warm: {
      name: "Warm Glow",
      primary: '#FFCC00', // Bright Yellow
      secondary: '#FF4400', // Bright Red-Orange
      tertiary: '#FF6699', // Bright Pink
      accent: '#FF7722', // Bright Orange
      highlight: '#66FF44', // Bright Lime
      glow: '#FDE68A'
    },
    mystical: {
      name: "Mystical Aurora",
      primary: '#AA33FF', // Deep Purple
      secondary: '#FF3388', // Deep Pink
      tertiary: '#33AAFF', // Deep Cyan
      accent: '#88FF33', // Bright Lime
      highlight: '#FFAA33', // Golden
      glow: '#C084FC'
    }
  };

  const currentScheme = colorSchemes[colorScheme] || colorSchemes.classic;

  // Create a new particle
  const createParticle = () => {
    return {
      id: nextParticleId.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      velocityX: (Math.random() - 0.5) * 0.1,
      velocityY: (Math.random() - 0.5) * 0.05,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      birthTime: Date.now()
    };
  };

  // Initialize aurora waves and particles
  useEffect(() => {
    const newWaves = Array.from({ length: waveCount }, (_, i) => ({
      id: i,
      baseY: 80 - (i * 6), // Start from bottom and stack upward
      amplitude: Math.random() * 8 + 4,
      frequency: Math.random() * 0.02 + 0.01,
      speed: Math.random() * 0.02 + 0.008,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.35 + 0.25, // Increased opacity for more distinct colors (0.25-0.6)
      width: Math.random() * 4 + 2,
      colorIndex: i % 5, // Cycle through 5 colors
      flowDirection: Math.random() > 0.5 ? 1 : -1,
      verticalFlow: -(Math.random() * 0.008 + 0.002), // Negative for upward movement
      horizontalShift: Math.random() * 0.01 + 0.005,
      floatSpeed: Math.random() * 0.05 + 0.02 // Speed of upward floating
    }));

    setWaves(newWaves);

    // Initialize twinkling particles (stars)
    const newParticles = Array.from({ length: 80 }, () => createParticle());
    setParticles(newParticles);
  }, [waveCount, colorScheme]);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() * 0.001;
      
      setWaves(prev => prev.map(wave => {
        let newBaseY = wave.baseY + wave.verticalFlow;
        
        // Reset wave to bottom when it floats off the top
        if (newBaseY < -wave.amplitude * 2) {
          newBaseY = 100 + wave.amplitude;
        }
        
        return {
          ...wave,
          phase: wave.phase + wave.speed * wave.flowDirection,
          baseY: newBaseY + Math.sin(time * Math.abs(wave.verticalFlow) + wave.id) * 1.5
        };
      }));

      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.velocityX,
        y: particle.y + particle.velocityY,
        opacity: particle.opacity + Math.sin(time * particle.twinkleSpeed + particle.id) * 0.1
      })).filter(particle => 
        particle.x > -5 && particle.x < 105 && particle.y > -5 && particle.y < 105
      ).concat(
        // Add new particles to replace those that drift off
        Array.from({ length: Math.max(0, 80 - prev.length) }, () => createParticle())
      ));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const generateAuroraPath = (wave) => {
    const points = [];
    const bottomPoints = [];
    
    // Generate points from 0 to 100 (full width in viewBox coordinates)
    for (let x = 0; x <= 100; x += 0.25) {
      const mainWave = Math.sin((x * 0.03 + wave.phase) * wave.frequency) * wave.amplitude;
      const secondaryWave = Math.sin((x * 0.05 + wave.phase * 1.3) * wave.frequency * 0.6) * wave.amplitude * 0.4;
      const tertiaryWave = Math.cos((x * 0.02 + wave.phase * 0.8) * wave.frequency * 1.2) * wave.amplitude * 0.2;
      
      const topY = wave.baseY + mainWave + secondaryWave + tertiaryWave;
      const bottomY = topY + wave.amplitude * 1.8 + Math.sin((x * 0.04 + wave.phase * 0.7) * wave.frequency) * wave.amplitude * 0.4;
      
      points.push(`${x},${Math.max(0, Math.min(100, topY))}`);
      bottomPoints.unshift(`${x},${Math.max(0, Math.min(100, bottomY))}`);
    }
    
    // Ensure we start and end at the exact edges
    return `M 0,${points[0].split(',')[1]} L ${points.join(' L ')} L 100,${bottomPoints[0].split(',')[1]} L ${bottomPoints.join(' L ')} L 0,${bottomPoints[bottomPoints.length - 1].split(',')[1]} Z`;
  };

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
      {/* SVG Layer for aurora waves and particles */}
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

        {/* Twinkling Stars/Particles */}
        {particles.map((particle) => (
          <circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size * 0.3}
            fill="white"
            opacity={Math.max(0.1, Math.min(0.9, particle.opacity))}
            filter="url(#star-twinkle)"
          />
        ))}

        {/* Aurora Wave Bands */}
        {waves.map((wave) => (
          <path
            key={wave.id}
            d={generateAuroraPath(wave)}
            fill={`url(#aurora-gradient-${wave.id})`}
            opacity={wave.opacity}
            filter="url(#aurora-glow)"
            style={{
              mixBlendMode: 'screen'
            }}
          />
        ))}

        {/* Additional flowing lines for more aurora effect */}
        {waves.slice(0, Math.ceil(waveCount * 0.6)).map((wave) => (
          <g key={`flow-${wave.id}`}>
            {/* Main flowing curtain line */}
            <path
              d={`M 0,${wave.baseY + Math.sin(wave.phase) * wave.amplitude * 0.8} 
                  L 10,${wave.baseY + Math.sin(wave.phase + 0.2) * wave.amplitude * 0.85}
                  L 20,${wave.baseY + Math.sin(wave.phase + 0.5) * wave.amplitude * 0.9} 
                  L 30,${wave.baseY + Math.sin(wave.phase + 0.8) * wave.amplitude * 0.95}
                  L 40,${wave.baseY + Math.sin(wave.phase + 1) * wave.amplitude} 
                  L 50,${wave.baseY + Math.sin(wave.phase + 1.3) * wave.amplitude * 1.05}
                  L 60,${wave.baseY + Math.sin(wave.phase + 1.5) * wave.amplitude * 1.1}
                  L 70,${wave.baseY + Math.sin(wave.phase + 1.8) * wave.amplitude * 1.05}
                  L 80,${wave.baseY + Math.sin(wave.phase + 2) * wave.amplitude * 0.9}
                  L 90,${wave.baseY + Math.sin(wave.phase + 2.3) * wave.amplitude * 0.85}
                  L 100,${wave.baseY + Math.sin(wave.phase + 2.5) * wave.amplitude * 0.8}`}
              stroke={getWaveColor(wave)}
              strokeWidth={wave.width * 0.8}
              fill="none"
              opacity={wave.opacity * 0.8}
              filter="url(#aurora-glow)"
              style={{ mixBlendMode: 'screen' }}
            />
            {/* Secondary curtain line */}
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

      {/* Ambient Light Gradients */}
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

      {/* Ground/Horizon Line */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent opacity-80" />

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const AuroraWavesDemo = () => {
  const [colorScheme, setColorScheme] = useState('classic');
  const [waveCount, setWaveCount] = useState(8);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const colorSchemes = {
    classic: { name: "Classic Aurora", icon: "🌌" },
    intense: { name: "Intense Lights", icon: "🔥" },
    cool: { name: "Cool Spectrum", icon: "❄️" },
    warm: { name: "Warm Glow", icon: "🌅" },
    mystical: { name: "Mystical Aurora", icon: "✨" }
  };

  return (
    <AuroraWavesBackground colorScheme={colorScheme} waveCount={waveCount}>
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
                <span>🌌</span> Aurora Controls
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
                  Wave Intensity: <span className="font-bold">{waveCount}</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="12"
                  value={waveCount}
                  onChange={(e) => setWaveCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setWaveCount(4)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Subtle
                </button>
                <button
                  onClick={() => setWaveCount(8)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Default
                </button>
                <button
                  onClick={() => setWaveCount(12)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Intense
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
            🌌 Floating Aurora Waves 🌌
          </h1>
          <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
            Experience the mystical beauty of floating northern lights with gentle, colorful waves 
            rising through a star-filled night sky. Watch the aurora gracefully ascend!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
            {[
              { 
                title: "Floating Motion", 
                desc: "Gentle aurora bands that float upward through the sky with organic rising movement",
                icon: "⬆️"
              },
              { 
                title: "Subtle Glow", 
                desc: "Low but visible opacity creates a soft, ambient atmosphere without overwhelming the content",
                icon: "🌟"
              },
              { 
                title: "Continuous Flow", 
                desc: "Waves cycle from bottom to top, creating an endless stream of floating aurora lights",
                icon: "🔄"
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
              onClick={() => navigate('/aurora-waves-sc')}
              className='bg-teal-500 font-bold text-white px-6 py-3 rounded-lg hover:bg-teal-300 transition-colors duration-300'
            >
              Use This Background
            </button>
          </div>
        </div>
      </div>
    </AuroraWavesBackground>
  );
};

export default AuroraWavesDemo;