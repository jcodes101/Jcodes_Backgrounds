import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FireflyBackground Component
 * 
 * A React component that creates an animated background with glowing fireflies
 * floating organically around the screen with trailing effects.
 * 
 * @param {ReactNode} children - Content to render on top of the firefly background
 * @param {number} fireflyCount - Number of fireflies to render (default: 30)
 * @param {string} className - Additional CSS classes to apply
 * @param {string} colorScheme - Color scheme for fireflies (purple, rainbow, red, cyan, blue, green, pink)
 */
const FireflyBackground = ({ 
  children, 
  fireflyCount = 30,
  className = "",
  colorScheme = "purple" 
}) => {
  // State to hold all firefly objects with their properties
  const [fireflies, setFireflies] = useState([]);
  
  // Reference to the container DOM element (useful for calculations)
  const containerRef = useRef(null);

  /**
   * Color schemes configuration object
   * Each scheme contains:
   * - name: Display name for UI
   * - colors: Array of hex colors for fireflies to randomly pick from
   * - glow: Tailwind class for glow effects (not used in current implementation)
   */
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

  // Get the current color scheme object, fallback to purple if invalid
  const currentScheme = colorSchemes[colorScheme] || colorSchemes.purple;

  /**
   * Effect: Initialize fireflies when component mounts or props change
   * 
   * This runs when:
   * - Component first mounts
   * - fireflyCount changes
   * - colorScheme changes
   */
  useEffect(() => {
    // Create an array of firefly objects
    const newFireflies = Array.from({ length: fireflyCount }, (_, i) => ({
      id: i, // Unique identifier for React key
      x: Math.random() * 100, // X position as percentage (0-100)
      y: Math.random() * 100, // Y position as percentage (0-100)
      vx: (Math.random() - 0.5) * 0.3, // X velocity (-0.15 to 0.15)
      vy: (Math.random() - 0.5) * 0.3, // Y velocity (-0.15 to 0.15)
      size: Math.random() * 6 + 3, // Size in pixels (3-9px)
      color: currentScheme.colors[Math.floor(Math.random() * currentScheme.colors.length)], // Random color from scheme
      opacity: Math.random() * 0.5 + 0.5, // Base opacity (0.5-1.0)
      pulseSpeed: Math.random() * 2 + 1, // Speed of pulsing animation (1-3)
      trail: [] // Array to store previous positions for trail effect
    }));
    
    // Update the fireflies state
    setFireflies(newFireflies);
  }, [fireflyCount, colorScheme]); // Dependencies: re-run when these change

  /**
   * Effect: Animate fireflies with organic movement
   * 
   * This creates a continuous animation loop that updates firefly positions
   * every 50 milliseconds (20 FPS) for smooth movement.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      // Update all fireflies using the previous state
      setFireflies(prev => prev.map(firefly => {
        // Add random movement for organic, non-linear motion
        // This makes fireflies "flutter" instead of moving in straight lines
        const newVx = firefly.vx + (Math.random() - 0.5) * 0.02;
        const newVy = firefly.vy + (Math.random() - 0.5) * 0.02;
        
        // Constrain velocity to prevent fireflies from moving too fast
        // Math.max/min ensures velocity stays within -0.4 to 0.4 range
        const constrainedVx = Math.max(-0.4, Math.min(0.4, newVx));
        const constrainedVy = Math.max(-0.4, Math.min(0.4, newVy));
        
        // Update position with wrapping
        // Adding 100 before modulo ensures negative numbers wrap correctly
        // Result: fireflies that exit one side appear on the opposite side
        const newX = (firefly.x + constrainedVx + 100) % 100;
        const newY = (firefly.y + constrainedVy + 100) % 100;
        
        // Update trail: add current position, keep only last 8 positions
        // This creates the glowing trail effect behind each firefly
        const newTrail = [...firefly.trail, { x: newX, y: newY }].slice(-8);
        
        // Return updated firefly object
        return {
          ...firefly, // Keep all existing properties
          x: newX,
          y: newY,
          vx: constrainedVx,
          vy: constrainedVy,
          trail: newTrail,
          // Create pulsing opacity using sine wave
          // Date.now() provides current timestamp for animation
          // Sin wave oscillates between -1 and 1, we adjust to 0.3-0.7 range
          opacity: 0.3 + Math.sin(Date.now() * 0.001 * firefly.pulseSpeed) * 0.4
        };
      }));
    }, 50); // Run every 50ms (20 FPS)

    // Cleanup: clear interval when component unmounts or effect re-runs
    return () => clearInterval(interval);
  }, []); // Empty dependency array: run once on mount, cleanup on unmount

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden bg-black ${className}`}
    >
      {/* Fireflies Container */}
      <div className="absolute inset-0">
        {fireflies.map((firefly) => (
          <div key={firefly.id}>
            {/* Trail Effect: Render previous positions as fading dots */}
            {firefly.trail.map((point, index) => (
              <div
                key={index}
                className="absolute rounded-full"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  // Trail gets smaller towards the back (older positions)
                  width: `${firefly.size * (index / firefly.trail.length)}px`,
                  height: `${firefly.size * (index / firefly.trail.length)}px`,
                  backgroundColor: firefly.color,
                  // Trail gets more transparent towards the back
                  opacity: firefly.opacity * (index / firefly.trail.length) * 0.3,
                  filter: 'blur(1px)', // Slight blur for softer appearance
                  transform: 'translate(-50%, -50%)' // Center the element on its position
                }}
              />
            ))}
            
            {/* Main Firefly: The bright, main glowing dot */}
            <div
              className="absolute rounded-full transition-all duration-100"
              style={{
                left: `${firefly.x}%`,
                top: `${firefly.y}%`,
                width: `${firefly.size}px`,
                height: `${firefly.size}px`,
                backgroundColor: firefly.color,
                opacity: firefly.opacity,
                // CSS box-shadow creates the glowing effect
                // Multiple shadows: inner glow, medium glow, outer glow
                boxShadow: `0 0 20px ${firefly.color}, 0 0 40px ${firefly.color}80, 0 0 60px ${firefly.color}40`,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(0.5px)' // Very slight blur for softer glow
              }}
            />
            
            {/* Extra Glow Layer: Large, very transparent glow for ambience */}
            <div
              className="absolute rounded-full"
              style={{
                left: `${firefly.x}%`,
                top: `${firefly.y}%`,
                width: `${firefly.size * 3}px`, // 3x larger than main firefly
                height: `${firefly.size * 3}px`,
                backgroundColor: firefly.color,
                opacity: firefly.opacity * 0.1, // Very transparent
                filter: 'blur(8px)', // Heavy blur for soft ambient glow
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Ambient Lighting Effect: Subtle background gradients for atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            // Multiple radial gradients create subtle color washes across the background
            // Using template literals to inject current color scheme
            background: `radial-gradient(circle at 30% 20%, ${currentScheme.colors[0]}10 0%, transparent 50%), 
                        radial-gradient(circle at 70% 80%, ${currentScheme.colors[1]}10 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, ${currentScheme.colors[2]}05 0%, transparent 70%)`
          }}
        />
      </div>
      
      {/* Content Layer: Where children components are rendered */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * CollapsibleControls Component
 * 
 * A collapsible panel that contains controls for the firefly background.
 * Can be opened/closed with smooth animations.
 * 
 * @param {string} colorScheme - Current color scheme
 * @param {function} setColorScheme - Function to update color scheme
 * @param {number} fireflyCount - Current firefly count
 * @param {function} setFireflyCount - Function to update firefly count
 */
const CollapsibleControls = ({ 
  colorScheme, 
  setColorScheme, 
  fireflyCount, 
  setFireflyCount 
}) => {
  // State to track if controls panel is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Color schemes configuration (same as in FireflyBackground)
  const colorSchemes = {
    purple: { name: "Purple Magic", icon: "🔮" },
    rainbow: { name: "Rainbow", icon: "🌈" },
    red: { name: "Fire", icon: "🔥" },
    cyan: { name: "Ocean", icon: "🌊" },
    blue: { name: "Sky", icon: "☁️" },
    green: { name: "Forest", icon: "🌲" },
    pink: { name: "Blossom", icon: "🌸" }
  };

  return (
    <div className="fixed top-6 left-6 z-20">
      {/* Toggle Button: Always visible button to open/close controls */}
      <button
        onClick={() => setIsOpen(!isOpen)} // Toggle the isOpen state
        className="bg-black/40 backdrop-blur-md rounded-full p-4 border border-white/20 
                   text-white hover:bg-black/60 transition-all duration-300 
                   shadow-lg hover:shadow-xl mb-4"
        aria-label={isOpen ? "Close controls" : "Open controls"} // Accessibility
      >
        {/* Icon rotates when panel opens/closes */}
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          ⚙️
        </div>
      </button>

      {/* Controls Panel: Only visible when isOpen is true */}
      <div className={`
        bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 
        overflow-hidden transition-all duration-500 ease-in-out
        ${isOpen 
          ? 'opacity-100 transform translate-y-0 max-h-96' // Open state: visible, normal position, full height
          : 'opacity-0 transform -translate-y-4 max-h-0'   // Closed state: invisible, slightly up, no height
        }
      `}>
        {/* Panel Content: Only render when open to improve performance */}
        {isOpen && (
          <div className="p-6">
            {/* Panel Title */}
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🦋</span> Firefly Controls
            </h3>
            
            {/* Color Scheme Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(colorSchemes).map(([key, scheme]) => (
                <button
                  key={key}
                  onClick={() => setColorScheme(key)} // Update color scheme
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    colorScheme === key 
                      ? 'bg-white text-black shadow-lg transform scale-105' // Active state: white background, larger
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:scale-105' // Inactive state
                  }`}
                >
                  {scheme.icon} {scheme.name}
                </button>
              ))}
            </div>
            
            {/* Firefly Count Slider */}
            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">
                Fireflies: <span className="font-bold">{fireflyCount}</span>
              </label>
              <input
                type="range"
                min="10"      // Minimum fireflies
                max="80"      // Maximum fireflies
                value={fireflyCount}
                onChange={(e) => setFireflyCount(parseInt(e.target.value))} // Update count, convert to number
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              {/* Helper text */}
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>Subtle</span>
                <span>Magical</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/70 text-xs mb-2">Quick Presets:</p>
              <div className="flex gap-2">
                {/* Preset buttons for common configurations */}
                <button
                  onClick={() => setFireflyCount(15)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Minimal
                </button>
                <button
                  onClick={() => setFireflyCount(30)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Default
                </button>
                <button
                  onClick={() => setFireflyCount(60)}
                  className="text-xs px-3 py-1 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Dense
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
 * FireflyBackgroundDemo Component
 * 
 * Main demo component that combines FireflyBackground with CollapsibleControls.
 * This is what you'll see when the component renders - it's the complete example.
 */
const FireflyBackgroundDemo = () => {
  // State for controlling the firefly background
  const [colorScheme, setColorScheme] = useState('purple'); // Current color scheme
  const [fireflyCount, setFireflyCount] = useState(30);     // Current firefly count

  // React Router hook for navigation (not used in this component, but included for potential future use)
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    // Main firefly background wrapper
    <FireflyBackground colorScheme={colorScheme} fireflyCount={fireflyCount}>
      {/* Collapsible controls panel */}
      <CollapsibleControls 
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
        fireflyCount={fireflyCount}
        setFireflyCount={setFireflyCount}
      />

      {/* Demo content */}
      <div className="container mx-auto px-6 py-12">
        {/* Main content area */}
        <div className="text-center pt-20">
          {/* Hero section */}
          <h1 className="text-7xl font-bold text-white mb-6">
            ✨ Firefly Magic 🦋
          </h1>
          <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
            Your personal firefly background component with glowing particles 
            floating organically around your content. Click the gear icon to customize!
          </p>
          
          {/* Feature showcase cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
            {[
              { 
                title: "Organic Movement", 
                desc: "Fireflies move with realistic physics and random flutter behavior for natural motion",
                icon: "🦋"
              },
              { 
                title: "Glowing Trails", 
                desc: "Beautiful trailing effects follow each firefly with fading opacity",
                icon: "✨"
              },
              { 
                title: "7 Color Schemes", 
                desc: "Purple Magic, Rainbow, Fire, Ocean, Sky, Forest, and Blossom themes",
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
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-white/90">
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
                onClick={() => navigate('/firefly-magic-sc')}
                className='bg-purple-600 font-bold text-white px-6 py-3 rounded-lg hover:bg-purple-300 transition-colors duration-300'
                >Use This Background
                </button>
              </div>
            </div>

          {/* Performance note */}
          <div className="mt-12 bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
            <h4 className="text-blue-300 font-semibold mb-2">💡 Performance Tip</h4>
            <p className="text-blue-100/80 text-sm">
              For best performance, keep firefly count between 20-40. Higher counts look amazing 
              but may impact performance on slower devices. The animation runs at 20 FPS for 
              smooth movement while being battery-friendly.
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for slider styling */}
      <style jsx>{`
        /* Webkit browsers (Chrome, Safari, Edge) */
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
        
        /* Firefox */
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
    </FireflyBackground>
  );
};

// Export the demo component as default
export default FireflyBackgroundDemo;
