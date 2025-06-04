import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * StarfieldBackground Component
 * 
 * A React component that creates an animated space background with moving stars,
 * parallax layers, warp speed effects, and constellation modes.
 */
const StarfieldBackground = ({ 
  children, 
  starCount = 200,
  className = "",
  colorScheme = "classic",
  mode = "normal",
  speed = 1
}) => {
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);

  /**
   * Color schemes configuration object
   */
  const colorSchemes = {
    classic: {
      name: "Classic Space",
      stars: ['#FFFFFF', '#F0F8FF', '#E6E6FA', '#B0C4DE', '#87CEEB'],
      accent: ['#FFD700', '#FFA500', '#FF6347'],
      nebula: ['#4169E1', '#9370DB', '#8A2BE2'],
      icon: '⭐'
    },
    nebula: {
      name: "Cosmic Nebula",
      stars: ['#FF69B4', '#DA70D6', '#BA55D3', '#9370DB', '#8A2BE2'],
      accent: ['#FF1493', '#FF69B4', '#FFB6C1'],
      nebula: ['#FF69B4', '#DA70D6', '#9370DB'],
      icon: '🌌'
    },
    aurora: {
      name: "Arctic Aurora",
      stars: ['#00FFFF', '#40E0D0', '#00CED1', '#20B2AA', '#5F9EA0'],
      accent: ['#00FF7F', '#00FA9A', '#7FFFD4'],
      nebula: ['#00FFFF', '#00CED1', '#20B2AA'],
      icon: '🌠'
    },
    galaxy: {
      name: "Spiral Galaxy",
      stars: ['#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FF6347'],
      accent: ['#FFFF00', '#FFD700', '#FFA500'],
      nebula: ['#FF4500', '#FF6347', '#FF7F50'],
      icon: '🌟'
    },
    cosmic: {
      name: "Deep Cosmic",
      stars: ['#8B00FF', '#9932CC', '#BA55D3', '#DA70D6', '#EE82EE'],
      accent: ['#FF00FF', '#FF1493', '#C71585'],
      nebula: ['#8B00FF', '#9932CC', '#BA55D3'],
      icon: '💫'
    },
    ice: {
      name: "Frozen Stars",
      stars: ['#F0FFFF', '#E0FFFF', '#B0E0E6', '#87CEFA', '#87CEEB'],
      accent: ['#00BFFF', '#1E90FF', '#4169E1'],
      nebula: ['#B0E0E6', '#87CEFA', '#87CEEB'],
      icon: '❄️'
    },
    fire: {
      name: "Solar Flare",
      stars: ['#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700'],
      accent: ['#FF0000', '#FF4500', '#FF8C00'],
      nebula: ['#FF4500', '#FF6347', '#FF7F50'],
      icon: '🔥'
    }
  };

  const currentScheme = colorSchemes[colorScheme] || colorSchemes.classic;

  /**
   * Real constellation patterns with accurate relative positions
   */
  const constellations = {
    ursa_major: {
      name: "Ursa Major (Big Dipper)",
      stars: [
        { x: 20, y: 30, name: "Dubhe" },
        { x: 30, y: 25, name: "Merak" },
        { x: 40, y: 20, name: "Phecda" },
        { x: 50, y: 23, name: "Megrez" },
        { x: 60, y: 30, name: "Alioth" },
        { x: 70, y: 35, name: "Mizar" },
        { x: 80, y: 40, name: "Alkaid" }
      ],
      connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
    },
    orion: {
      name: "Orion",
      stars: [
        { x: 45, y: 40, name: "Betelgeuse" },
        { x: 35, y: 50, name: "Bellatrix" },
        { x: 40, y: 60, name: "Alnitak" },
        { x: 45, y: 62, name: "Alnilam" },
        { x: 50, y: 64, name: "Mintaka" },
        { x: 55, y: 80, name: "Rigel" },
        { x: 35, y: 85, name: "Saiph" }
      ],
      connections: [[0,1], [1,4], [4,3], [3,2], [2,6], [6,5], [5,4]]
    },
    cassiopeia: {
      name: "Cassiopeia",
      stars: [
        { x: 10, y: 15, name: "Caph" },
        { x: 20, y: 10, name: "Shedar" },
        { x: 30, y: 8, name: "Gamma Cas" },
        { x: 40, y: 12, name: "Ruchbah" },
        { x: 50, y: 20, name: "Segin" }
      ],
      connections: [[0,1], [1,2], [2,3], [3,4]]
    }
  };

  /**
   * Initialize stars when component mounts or props change
   */
  useEffect(() => {
    let newStars = [];
    let starId = 0;

    // Create constellation stars if in constellation mode
    if (mode === 'constellation') {
      const constellationNames = Object.keys(constellations);
      const selectedConstellation = constellations[constellationNames[0]]; // Use first constellation
      
      selectedConstellation.stars.forEach((star, starIndex) => {
        newStars.push({
          id: starId++,
          x: star.x,
          y: star.y,
          z: 500,
          vx: 0,
          vy: 0,
          vz: 0,
          size: 5,
          layer: 2,
          brightness: 1,
          twinkleSpeed: 1 + starIndex * 0.2,
          color: currentScheme.accent[starIndex % currentScheme.accent.length],
          isAccent: true,
          isConstellation: true,
          constellationName: selectedConstellation.name,
          starName: star.name,
          starIndex: starIndex,
          pulsePhase: starIndex * Math.PI / 4,
          trail: []
        });
      });
    }

    // Create regular background stars
    const remainingCount = starCount - newStars.length;
    for (let i = 0; i < remainingCount; i++) {
      const layer = Math.floor(Math.random() * 4);
      const isAccent = Math.random() < 0.05;
      
      newStars.push({
        id: starId++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: Math.random() * 2 + 0.5,
        size: Math.random() * 3 + 1,
        layer: layer,
        brightness: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 3 + 1,
        color: isAccent ? 
          currentScheme.accent[Math.floor(Math.random() * currentScheme.accent.length)] :
          currentScheme.stars[Math.floor(Math.random() * currentScheme.stars.length)],
        isAccent: isAccent,
        isConstellation: false,
        pulsePhase: Math.random() * Math.PI * 2,
        trail: []
      });
    }
    
    setStars(newStars);
  }, [starCount, colorScheme, mode]);

  /**
   * Animate stars based on current mode
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prev => prev.map(star => {
        let newStar = { ...star };
        const currentSpeed = speed;
        const time = Date.now() * 0.001;

        switch (mode) {
          case 'warp':
            newStar.z -= currentSpeed * 15;
            if (newStar.z <= 0) {
              newStar.z = 1000;
              newStar.x = Math.random() * 100;
              newStar.y = Math.random() * 100;
            }
            newStar.trail = [...(newStar.trail || []), { 
              x: newStar.x, 
              y: newStar.y, 
              z: newStar.z 
            }].slice(-5);
            break;

          case 'pulse':
            newStar.brightness = 0.3 + Math.sin(time * 2 + newStar.pulsePhase) * 0.5;
            newStar.size = star.size * (1 + Math.sin(time * 1.5 + newStar.pulsePhase) * 0.3);
            newStar.x = (newStar.x + newStar.vx * currentSpeed * 0.1 + 100) % 100;
            newStar.y = (newStar.y + newStar.vy * currentSpeed * 0.1 + 100) % 100;
            break;

          case 'constellation':
            newStar.brightness = 0.6 + Math.sin(time * newStar.twinkleSpeed + newStar.id) * 0.4;
            if (newStar.isConstellation) {
              newStar.size = star.size * (1.2 + Math.sin(time * 0.5 + newStar.pulsePhase) * 0.3);
              // Keep constellation stars stationary
            } else {
              newStar.x = (newStar.x + newStar.vx * currentSpeed * 0.05 + 100) % 100;
              newStar.y = (newStar.y + newStar.vy * currentSpeed * 0.05 + 100) % 100;
            }
            break;

          default: // normal mode
            const layerSpeed = (4 - newStar.layer) * 0.1 * currentSpeed;
            newStar.x = (newStar.x + newStar.vx * layerSpeed + 100) % 100;
            newStar.y = (newStar.y + newStar.vy * layerSpeed + 100) % 100;
            newStar.brightness = star.brightness + Math.sin(time * newStar.twinkleSpeed + newStar.id) * 0.3;
            break;
        }

        return newStar;
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [mode, speed]);

  /**
   * Calculate star position and size based on 3D perspective
   */
  const getStarStyle = (star) => {
  const perspective = mode === 'warp' ? 500 : 1000;
  const scale = Math.min(5, Math.max(0.1, perspective / (perspective + star.z))); // Clamp scale
  const x2d = star.x + (star.x - 50) * (1 - scale) * 0.5;
  const y2d = star.y + (star.y - 50) * (1 - scale) * 0.5;
  
  // Clamp final size to reasonable limits
  const finalSize = Math.min(20, star.size * scale); // Max 20px stars
  
    return {
        left: `${x2d}%`,
        top: `${y2d}%`,
        width: `${finalSize}px`,
        height: `${finalSize}px`,
        opacity: Math.max(0, Math.min(1, star.brightness * scale)),
        backgroundColor: star.color,
        transform: 'translate(-50%, -50%)',
        filter: star.isAccent ? 'blur(0.5px)' : 'blur(0.2px)',
        // Clamp box-shadow sizes
        boxShadow: star.isAccent ? 
        `0 0 ${Math.min(15, 20 * scale)}px ${star.color}, 0 0 ${Math.min(30, 40 * scale)}px ${star.color}40` :
        `0 0 ${Math.min(8, 10 * scale)}px ${star.color}80`
    };
    };

  // Get constellation connections for rendering
  const getConstellationConnections = () => {
    if (mode !== 'constellation') return [];
    
    const constellationStars = stars.filter(s => s.isConstellation);
    if (constellationStars.length === 0) return [];
    
    const constellation = constellations.ursa_major;
    return constellation.connections.map(([startIdx, endIdx]) => {
      const startStar = constellationStars[startIdx];
      const endStar = constellationStars[endIdx];
      
      if (!startStar || !endStar) return null;
      
      // Calculate distance in percentage units (not vw)
      const dx = endStar.x - startStar.x;
      const dy = endStar.y - startStar.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      return {
        startStar,
        endStar,
        distance,
        angle,
        key: `${startIdx}-${endIdx}`
      };
    }).filter(Boolean);
  };

  const connections = getConstellationConnections();

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, ${currentScheme.nebula[2]}15 0%, #000000 70%)`
      }}
    >
      {/* Stars Container */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div key={star.id}>
            {/* Warp mode trails */}
            {mode === 'warp' && star.trail && star.trail.map((point, index) => (
              <div
                key={index}
                className="absolute rounded-full"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  width: `${star.size * 0.5}px`,
                  height: `${star.size * 20}px`,
                  backgroundColor: star.color,
                  opacity: 0.3 * (index / star.trail.length),
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  filter: 'blur(1px)'
                }}
              />
            ))}
            
            {/* Main Star */}
            <div
              className="absolute rounded-full"
              style={getStarStyle(star)}
            />
            
            {/* Star name tooltip for constellation stars */}
            {mode === 'constellation' && star.isConstellation && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y - 8}%`,
                  transform: 'translate(-50%, -100%)',
                  opacity: 0.7
                }}
              >
                <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white border border-white/20">
                  {star.starName}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Constellation connections - FIXED */}
        {mode === 'constellation' && connections.map((connection) => {
          const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
          const containerHeight = containerRef.current?.offsetHeight || window.innerHeight;
          
          // Convert percentage positions to pixels
          const startX = (connection.startStar.x / 100) * containerWidth;
          const startY = (connection.startStar.y / 100) * containerHeight;
          const endX = (connection.endStar.x / 100) * containerWidth;
          const endY = (connection.endStar.y / 100) * containerHeight;
          
          // Calculate actual pixel distance
          const dx = endX - startX;
          const dy = endY - startY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          
          return (
            <div
              key={connection.key}
              className="absolute origin-left pointer-events-none"
              style={{
                left: `${connection.startStar.x}%`,
                top: `${connection.startStar.y}%`,
                width: `${distance}px`,
                height: '2px',
                background: `linear-gradient(90deg, ${connection.startStar.color}aa, ${connection.endStar.color}aa)`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                opacity: 0.8,
                transformOrigin: '0 50%',
                boxShadow: `0 0 4px ${connection.startStar.color}66`
              }}
            />
          );
        })}
      </div>
      
      {/* Nebula Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, ${currentScheme.nebula[0]}08 0%, transparent 40%), 
              radial-gradient(circle at 80% 70%, ${currentScheme.nebula[1]}08 0%, transparent 40%),
              radial-gradient(circle at 50% 20%, ${currentScheme.nebula[2]}05 0%, transparent 60%),
              radial-gradient(circle at 30% 80%, ${currentScheme.accent[0]}03 0%, transparent 50%)
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

/**
 * CollapsibleControls Component for Starfield
 */
const CollapsibleControls = ({ 
  colorScheme, 
  setColorScheme, 
  starCount, 
  setStarCount,
  mode,
  setMode,
  speed,
  setSpeed
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorSchemes = {
    classic: { name: "Classic Space", icon: "⭐" },
    nebula: { name: "Cosmic Nebula", icon: "🌌" },
    aurora: { name: "Arctic Aurora", icon: "🌠" },
    galaxy: { name: "Spiral Galaxy", icon: "🌟" },
    cosmic: { name: "Deep Cosmic", icon: "💫" },
    ice: { name: "Frozen Stars", icon: "❄️" },
    fire: { name: "Solar Flare", icon: "🔥" }
  };

  const modes = {
    normal: { name: "Parallax", icon: "✨" },
    warp: { name: "Warp Speed", icon: "🚀" },
    pulse: { name: "Pulse Wave", icon: "💓" },
    constellation: { name: "Constellations", icon: "⭐" }
  };

  return (
    <div className="fixed top-6 left-6 z-20">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/40 backdrop-blur-md rounded-full p-4 border border-white/20 
                   text-white hover:bg-black/60 transition-all duration-300 
                   shadow-lg hover:shadow-xl mb-4"
        aria-label={isOpen ? "Close controls" : "Open controls"}
      >
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          🌌
        </div>
      </button>

      {/* Controls Panel */}
      <div className={`
        bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 
        overflow-hidden transition-all duration-500 ease-in-out
        ${isOpen 
          ? 'opacity-100 transform translate-y-0 max-h-[500px]'
          : 'opacity-0 transform -translate-y-4 max-h-0'
        }
      `}>
        {isOpen && (
          <div className="p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>⭐</span> Starfield Controls
            </h3>
            
            {/* Mode Selection */}
            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">Animation Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(modes).map(([key, modeData]) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      mode === key 
                        ? 'bg-white text-black shadow-lg transform scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:scale-105'
                    }`}
                  >
                    {modeData.icon} {modeData.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Schemes */}
            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">Color Scheme</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <button
                    key={key}
                    onClick={() => setColorScheme(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      colorScheme === key 
                        ? 'bg-white text-black shadow-lg transform scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:scale-105'
                    }`}
                  >
                    {scheme.icon} {scheme.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Star Count */}
            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">
                Stars: <span className="font-bold">{starCount}</span>
              </label>
              <input
                type="range"
                min="50"
                max="400"
                value={starCount}
                onChange={(e) => setStarCount(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Speed Control */}
            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">
                Speed: <span className="font-bold">{speed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Quick Presets */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/70 text-xs mb-2">Quick Presets:</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setMode('normal');
                    setStarCount(150);
                    setSpeed(0.5);
                    setColorScheme('classic');
                  }}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Peaceful
                </button>
                <button
                  onClick={() => {
                    setMode('warp');
                    setStarCount(200);
                    setSpeed(2);
                    setColorScheme('galaxy');
                  }}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Hyperspace
                </button>
                <button
                  onClick={() => {
                    setMode('constellation');
                    setStarCount(100);
                    setSpeed(0.3);
                    setColorScheme('aurora');
                  }}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Mystical
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * StarfieldBackgroundDemo Component
 */
const StarfieldBackgroundDemo = () => {
  const [colorScheme, setColorScheme] = useState('classic');
  const [starCount, setStarCount] = useState(200);
  const [mode, setMode] = useState('normal');
  const [speed, setSpeed] = useState(1);

  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <StarfieldBackground 
      colorScheme={colorScheme} 
      starCount={starCount}
      mode={mode}
      speed={speed}
    >
      <CollapsibleControls 
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
        starCount={starCount}
        setStarCount={setStarCount}
        mode={mode}
        setMode={setMode}
        speed={speed}
        setSpeed={setSpeed}
      />

      <div className="container mx-auto px-6 py-12">
        <div className="text-center pt-20">
          <h1 className="text-7xl font-bold text-white mb-6">
            ⭐ Starfield Journey ⭐
          </h1>
          <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
            Travel through space with parallax stars, warp speed effects, and constellation patterns. 
            Experience the cosmos in 7 different color schemes with 4 unique animation modes!
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-20">
            {[
              { 
                title: "Parallax Layers", 
                desc: "Multi-layered star field with realistic depth and 3D perspective effects",
                icon: "🌌"
              },
              { 
                title: "Warp Speed", 
                desc: "Experience hyperspace with streaming star trails and rapid movement",
                icon: "🚀"
              },
              { 
                title: "Constellation Mode", 
                desc: "Mystical patterns with connecting lines and pulsing celestial bodies",
                icon: "⭐"
              },
              { 
                title: "7 Color Themes", 
                desc: "From classic space white to cosmic nebula and solar flare schemes",
                icon: "🎨"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 
                           hover:bg-white/10 transition-all duration-500 group cursor-pointer"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/starfield-journey-sc')}
                className='bg-blue-600 font-bold text-white px-8 py-4 rounded-lg hover:bg-blue-500 transition-colors duration-300 shadow-lg hover:shadow-blue-500/25'
            >
              Use This Background
            </button>
          </div>

          <div className="mt-12 bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
            <h4 className="text-purple-300 font-semibold mb-2">🌟 Pro Tips</h4>
            <div className="text-purple-100/80 text-sm space-y-2">
              <p>• Use <strong>Warp Speed</strong> for loading screens and transitions</p>
              <p>• <strong>Constellation Mode</strong> is perfect for mystical or magical themes</p>
              <p>• Adjust star count based on device performance (50-400 range)</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(255,255,255,0.8);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
          transition: all 0.2s ease;
          }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(255,255,255,0.8);
        }
      `}</style>
    </StarfieldBackground>
  );
};

export default StarfieldBackgroundDemo;