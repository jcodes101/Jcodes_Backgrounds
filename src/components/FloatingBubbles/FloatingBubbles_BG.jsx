import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FloatingBubblesBackground Component
 * 
 * A React component that creates an animated background with realistic soap bubbles
 * floating upward with physics-based movement and interactive popping effects.
 * 
 * @param {ReactNode} children - Content to render on top of the bubbles background
 * @param {number} bubbleCount - Number of bubbles to render (default: 25)
 * @param {string} className - Additional CSS classes to apply
 * @param {string} colorScheme - Color scheme for bubbles (cyan, rainbow, pastel, ocean, sunset, mint, purple)
 */
const FloatingBubblesBackground = ({ 
  children, 
  bubbleCount = 25,
  className = "",
  colorScheme = "cyan" 
}) => {
  // State to hold all bubble objects with their properties
  const [bubbles, setBubbles] = useState([]);
  
  // Reference to the container DOM element
  const containerRef = useRef(null);

  /**
   * Color schemes configuration object
   * Each scheme contains:
   * - name: Display name for UI
   * - colors: Array of bubble colors with transparency
   * - highlights: Highlight colors for bubble shine effects
   */
  const colorSchemes = {
    cyan: {
      name: "Ocean Breeze",
      colors: ['rgba(6, 182, 212, 0.3)', 'rgba(34, 211, 238, 0.25)', 'rgba(103, 232, 249, 0.2)', 'rgba(165, 243, 252, 0.15)'],
      highlights: ['rgba(255, 255, 255, 0.6)', 'rgba(165, 243, 252, 0.4)']
    },
    rainbow: {
      name: "Rainbow Soap",
      colors: ['rgba(239, 68, 68, 0.2)', 'rgba(249, 115, 22, 0.2)', 'rgba(234, 179, 8, 0.2)', 'rgba(34, 197, 94, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(139, 92, 246, 0.2)', 'rgba(236, 72, 153, 0.2)'],
      highlights: ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.3)']
    },
    pastel: {
      name: "Pastel Dreams",
      colors: ['rgba(251, 207, 232, 0.4)', 'rgba(219, 234, 254, 0.4)', 'rgba(220, 252, 231, 0.4)', 'rgba(254, 240, 138, 0.4)'],
      highlights: ['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.5)']
    },
    ocean: {
      name: "Deep Ocean",
      colors: ['rgba(8, 145, 178, 0.3)', 'rgba(14, 116, 144, 0.25)', 'rgba(22, 78, 99, 0.2)', 'rgba(7, 89, 133, 0.15)'],
      highlights: ['rgba(186, 230, 253, 0.6)', 'rgba(125, 211, 252, 0.4)']
    },
    sunset: {
      name: "Sunset Glow",
      colors: ['rgba(251, 146, 60, 0.3)', 'rgba(251, 113, 133, 0.25)', 'rgba(196, 181, 253, 0.2)', 'rgba(252, 165, 165, 0.15)'],
      highlights: ['rgba(255, 255, 255, 0.6)', 'rgba(254, 215, 170, 0.4)']
    },
    mint: {
      name: "Fresh Mint",
      colors: ['rgba(16, 185, 129, 0.3)', 'rgba(52, 211, 153, 0.25)', 'rgba(110, 231, 183, 0.2)', 'rgba(167, 243, 208, 0.15)'],
      highlights: ['rgba(255, 255, 255, 0.6)', 'rgba(209, 250, 229, 0.4)']
    },
    purple: {
      name: "Lavender Field",
      colors: ['rgba(139, 92, 246, 0.3)', 'rgba(168, 85, 247, 0.25)', 'rgba(192, 132, 252, 0.2)', 'rgba(221, 214, 254, 0.15)'],
      highlights: ['rgba(255, 255, 255, 0.6)', 'rgba(221, 214, 254, 0.4)']
    }
  };

  // Get the current color scheme object, fallback to cyan if invalid
  const currentScheme = colorSchemes[colorScheme] || colorSchemes.cyan;

  /**
   * Effect: Initialize bubbles when component mounts or props change
   */
  useEffect(() => {
    const newBubbles = Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // X position as percentage
      y: 110 + Math.random() * 20, // Start below screen
      vx: (Math.random() - 0.5) * 0.2, // Horizontal drift
      vy: -(Math.random() * 0.3 + 0.2), // Upward velocity (negative Y)
      size: Math.random() * 40 + 20, // Size in pixels (20-60px)
      color: currentScheme.colors[Math.floor(Math.random() * currentScheme.colors.length)],
      opacity: Math.random() * 0.4 + 0.3, // Base opacity (0.3-0.7)
      wobbleSpeed: Math.random() * 2 + 1, // Wobble animation speed
      wobbleAmount: Math.random() * 2 + 1, // How much it wobbles
      rotationSpeed: (Math.random() - 0.5) * 2, // Rotation speed
      rotation: 0, // Current rotation
      lifespan: Math.random() * 15000 + 10000, // How long before auto-pop (10-25s)
      birthTime: Date.now(), // When bubble was created
      popping: false, // Is currently popping
      popProgress: 0 // Pop animation progress (0-1)
    }));
    
    setBubbles(newBubbles);
  }, [bubbleCount, colorScheme]);

  /**
   * Effect: Animate bubbles with realistic physics
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev => prev.map(bubble => {
        // Skip animation if bubble is popping
        if (bubble.popping) {
          const newPopProgress = Math.min(bubble.popProgress + 0.1, 1);
          return {
            ...bubble,
            popProgress: newPopProgress
          };
        }

        // Check if bubble should auto-pop due to age
        const age = Date.now() - bubble.birthTime;
        if (age > bubble.lifespan) {
          return {
            ...bubble,
            popping: true,
            popProgress: 0
          };
        }

        // Add wobbling motion for realistic bubble movement
        const wobbleX = Math.sin(Date.now() * 0.001 * bubble.wobbleSpeed) * bubble.wobbleAmount * 0.1;
        const wobbleY = Math.cos(Date.now() * 0.0015 * bubble.wobbleSpeed) * bubble.wobbleAmount * 0.05;

        // Update velocities with air resistance and buoyancy
        const newVx = bubble.vx * 0.995 + wobbleX; // Air resistance
        const newVy = bubble.vy * 0.998; // Slight deceleration

        // Update position
        let newX = bubble.x + newVx;
        let newY = bubble.y + newVy + wobbleY;

        // Handle horizontal boundaries (bounce off walls gently)
        if (newX < -5) {
          newX = -5;
        } else if (newX > 105) {
          newX = 105;
        }

        // Reset bubble when it goes off the top
        if (newY < -10) {
          newY = 110 + Math.random() * 10;
          newX = Math.random() * 100;
        }

        // Update rotation
        const newRotation = bubble.rotation + bubble.rotationSpeed;

        return {
          ...bubble,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: newRotation,
          // Subtle size pulsing for organic feel
          size: bubble.size + Math.sin(Date.now() * 0.002) * 2
        };
      }).filter(bubble => {
        // Remove fully popped bubbles and create new ones
        if (bubble.popping && bubble.popProgress >= 1) {
          return false;
        }
        return true;
      }));

      // Add new bubbles to maintain count
      setBubbles(prev => {
        const activeBubbles = prev.filter(b => !b.popping || b.popProgress < 1);
        const bubblesNeeded = bubbleCount - activeBubbles.length;
        
        if (bubblesNeeded > 0) {
          const newBubbles = Array.from({ length: bubblesNeeded }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 100,
            y: 110 + Math.random() * 20,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -(Math.random() * 0.3 + 0.2),
            size: Math.random() * 40 + 20,
            color: currentScheme.colors[Math.floor(Math.random() * currentScheme.colors.length)],
            opacity: Math.random() * 0.4 + 0.3,
            wobbleSpeed: Math.random() * 2 + 1,
            wobbleAmount: Math.random() * 2 + 1,
            rotationSpeed: (Math.random() - 0.5) * 2,
            rotation: 0,
            lifespan: Math.random() * 15000 + 10000,
            birthTime: Date.now(),
            popping: false,
            popProgress: 0
          }));
          return [...activeBubbles, ...newBubbles];
        }
        return prev;
      });
    }, 50); // 20 FPS

    return () => clearInterval(interval);
  }, [bubbleCount, currentScheme.colors]);

  /**
   * Handle bubble click - trigger pop animation
   */
  const handleBubbleClick = (bubbleId) => {
    setBubbles(prev => prev.map(bubble => 
      bubble.id === bubbleId && !bubble.popping
        ? { ...bubble, popping: true, popProgress: 0 }
        : bubble
    ));
  };

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-200 via-blue-100 to-white ${className}`}
    >
      {/* Bubbles Container */}
      <div className="absolute inset-0">
        {bubbles.map((bubble) => {
          // Calculate pop animation effects
          const popScale = bubble.popping ? 1 + bubble.popProgress * 0.5 : 1;
          const popOpacity = bubble.popping ? (1 - bubble.popProgress) : bubble.opacity;
          
          return (
            <div
              key={bubble.id}
              className="absolute cursor-pointer transition-transform hover:scale-110"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                transform: `translate(-50%, -50%) scale(${popScale}) rotate(${bubble.rotation}deg)`
              }}
              onClick={() => handleBubbleClick(bubble.id)}
            >
              {/* Main Bubble */}
              <div
                className="relative rounded-full border border-white/30"
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  background: `radial-gradient(circle at 30% 30%, ${currentScheme.highlights[0]}, ${bubble.color})`,
                  opacity: popOpacity,
                  boxShadow: `0 0 20px ${bubble.color.replace('0.', '0.1')}, inset 0 0 20px rgba(255,255,255,0.2)`,
                  backdropFilter: 'blur(1px)'
                }}
              >
                {/* Bubble Highlight */}
                <div
                  className="absolute rounded-full"
                  style={{
                    top: '20%',
                    left: '25%',
                    width: '30%',
                    height: '30%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)',
                    transform: 'rotate(-20deg)'
                  }}
                />
                
                {/* Secondary Highlight */}
                <div
                  className="absolute rounded-full"
                  style={{
                    top: '60%',
                    right: '30%',
                    width: '15%',
                    height: '15%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent)'
                  }}
                />

                {/* Pop Effect */}
                {bubble.popping && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          transform: `rotate(${i * 60}deg) translateY(-${bubble.popProgress * 20}px)`,
                          opacity: 1 - bubble.popProgress
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Ambient Lighting Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 80%, ${currentScheme.colors[0]} 0%, transparent 50%), 
                        radial-gradient(circle at 80% 20%, ${currentScheme.colors[1]} 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, ${currentScheme.colors[2]} 0%, transparent 70%)`
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
 * CollapsibleControls Component
 */
const CollapsibleControls = ({ 
  colorScheme, 
  setColorScheme, 
  bubbleCount, 
  setBubbleCount 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorSchemes = {
    cyan: { name: "Ocean Breeze", icon: "🌊" },
    rainbow: { name: "Rainbow Soap", icon: "🌈" },
    pastel: { name: "Pastel Dreams", icon: "🎨" },
    ocean: { name: "Deep Ocean", icon: "🌊" },
    sunset: { name: "Sunset Glow", icon: "🌅" },
    mint: { name: "Fresh Mint", icon: "🌿" },
    purple: { name: "Lavender Field", icon: "💜" }
  };

  return (
    <div className="fixed top-6 left-6 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 
                   text-gray-700 hover:bg-white/30 transition-all duration-300 
                   shadow-lg hover:shadow-xl mb-4"
        aria-label={isOpen ? "Close controls" : "Open controls"}
      >
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          ⚙️
        </div>
      </button>

      <div className={`
        bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 
        overflow-hidden transition-all duration-500 ease-in-out
        ${isOpen 
          ? 'opacity-100 transform translate-y-0 max-h-96' 
          : 'opacity-0 transform -translate-y-4 max-h-0'
        }
      `}>
        {isOpen && (
          <div className="p-6">
            <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
              <span>🫧</span> Bubble Controls
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(colorSchemes).map(([key, scheme]) => (
                <button
                  key={key}
                  onClick={() => setColorScheme(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    colorScheme === key 
                      ? 'bg-white text-gray-700 shadow-lg transform scale-105' 
                      : 'bg-white/10 text-gray-600 hover:bg-white/20 border border-white/20 hover:scale-105'
                  }`}
                >
                  {scheme.icon} {scheme.name}
                </button>
              ))}
            </div>
            
            <div className="mb-4">
              <label className="text-gray-700 text-sm mb-2 block">
                Bubbles: <span className="font-bold">{bubbleCount}</span>
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={bubbleCount}
                onChange={(e) => setBubbleCount(parseInt(e.target.value))}
                className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Gentle</span>
                <span>Bubbly</span>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              <p className="text-gray-600 text-xs mb-2">Quick Presets:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setBubbleCount(15)}
                  className="text-xs px-3 py-1 bg-white/20 text-gray-600 rounded-full hover:bg-white/30 transition-colors"
                >
                  Calm
                </button>
                <button
                  onClick={() => setBubbleCount(25)}
                  className="text-xs px-3 py-1 bg-white/20 text-gray-600 rounded-full hover:bg-white/30 transition-colors"
                >
                  Default
                </button>
                <button
                  onClick={() => setBubbleCount(40)}
                  className="text-xs px-3 py-1 bg-white/20 text-gray-600 rounded-full hover:bg-white/30 transition-colors"
                >
                  Party
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-600 bg-white/10 rounded-lg p-2">
              💡 <strong>Tip:</strong> Click bubbles to pop them!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * FloatingBubblesBackgroundDemo Component
 */
const FloatingBubblesBackgroundDemo = () => {
  const [colorScheme, setColorScheme] = useState('cyan');
  const [bubbleCount, setBubbleCount] = useState(25);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <FloatingBubblesBackground colorScheme={colorScheme} bubbleCount={bubbleCount}>
      <CollapsibleControls 
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
        bubbleCount={bubbleCount}
        setBubbleCount={setBubbleCount}
      />

      <div className="container mx-auto px-6 py-12">
        <div className="text-center pt-20">
          <h1 className="text-7xl font-bold text-gray-800 mb-6">
            🫧 Floating Bubbles 🫧
          </h1>
          <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Interactive soap bubbles with realistic physics, popping effects, and beautiful transparency. 
            Click the gear icon to customize, or click bubbles to pop them!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
            {[
              { 
                title: "Realistic Physics", 
                desc: "Bubbles float upward with natural wobbling motion, air resistance, and buoyancy effects",
                icon: "🌬️"
              },
              { 
                title: "Interactive Popping", 
                desc: "Click any bubble to trigger a satisfying pop animation with particle effects",
                icon: "💥"
              },
              { 
                title: "7 Color Themes", 
                desc: "Ocean Breeze, Rainbow Soap, Pastel Dreams, Deep Ocean, Sunset Glow, Fresh Mint, and Lavender Field",
                icon: "🎨"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 
                           hover:bg-white/30 transition-all duration-500 group cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-gray-700">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="container mx-auto px-6 py-12">
            <div className="mt-20 bg-white/30 backdrop-blur-sm rounded-2xl p-8 border border-white/30 max-w-2xl mx-auto">
              <button

                onClick={() => navigate('/floating-bubbles-sc')}
                className='bg-cyan-500 font-bold text-white px-6 py-3 rounded-lg hover:bg-cyan-400 transition-colors duration-300'
              >
                Use This Background
              </button>
            </div>
          </div>

          <div className="mt-12 bg-blue-100/60 border border-blue-300/50 rounded-2xl p-6 max-w-2xl mx-auto">
            <h4 className="text-blue-700 font-semibold mb-2">🫧 Interaction Guide</h4>
            <p className="text-blue-800 text-sm">
              Bubbles naturally pop after 10-25 seconds, or click them for instant satisfaction! 
              New bubbles continuously spawn from the bottom to maintain the magical atmosphere. 
              Perfect for relaxing backgrounds or interactive experiences.
            </p>
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
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
      `}</style>
    </FloatingBubblesBackground>
  );
};

export default FloatingBubblesBackgroundDemo;