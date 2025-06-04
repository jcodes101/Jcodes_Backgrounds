import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Check, ClipboardCopy } from 'lucide-react';

/**
 * Jcodes Backgrounds Homepage Component
 * 
 * A modern, interactive homepage showcasing different background components.
 * Features a grid layout with preview cards, search functionality, and categories.
 */
const JcodesHomepage = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for category filtering
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Using useNavigate hook from react-router-dom for navigation
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm install jcodes-styles');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  };

  /**
   * Background components data
   * Each object represents a background you can create/navigate to
   * 
   * Properties:
   * - id: unique identifier for routing
   * - title: display name
   * - description: what the background does
   * - category: for filtering
   * - color: theme color for the card
   * - gradient: CSS gradient for preview
   * - icon: emoji icon
   * - status: development status
   * - features: array of key features
   */
  const backgrounds = [
    {
      link: 'firefly-magic-bg',

      id: 'fireflies',
      title: 'Firefly Magic',
      description: 'Glowing fireflies floating organically with trailing effects and multiple color schemes',
      category: 'Particles',
      color: 'purple',
      gradient: 'from-purple-900 via-indigo-900 to-black',
      icon: '🦋',
      status: 'Complete',
      features: ['7 Color Schemes', 'Organic Movement', 'Glowing Trails', 'Customizable Count']
    },
    {
      link: 'matrix-rain-bg',

      id: 'matrix-rain',
      title: 'Matrix Rain',
      description: 'Classic falling code effect like the Matrix movies with customizable characters and colors',
      category: 'Code',
      color: 'green',
      gradient: 'from-green-900 via-black to-green-800',
      icon: '🈯',
      status: 'Complete',
      features: ['Custom Characters', 'Variable Speed', 'Color Options', 'Density Control']
    },
    {
      link: 'floating-bubbles-bg',

      id: 'floating-bubbles',
      title: 'Floating Bubbles',
      description: 'Realistic soap bubbles floating up with physics-based movement and popping effects',
      category: 'Particles',
      color: 'cyan',
      gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      icon: '🫧',
      status: 'Complete',
      features: ['Realistic Physics', 'Pop Animation', 'Size Variation', 'Transparency Effects']
    },
    {
      link: 'geometric-waves-bg',

      id: 'geometric-waves',
      title: 'Geometric Waves',
      description: 'Abstract geometric shapes flowing in wave patterns with smooth color transitions',
      category: 'Abstract',
      color: 'pink',
      gradient: 'from-pink-500 via-purple-500 to-indigo-500',
      icon: '🔶',
      status: 'Complete',
      features: ['Wave Animation', 'Shape Morphing', 'Color Transitions', 'Speed Control']
    },
    {
      link: 'starfield-journey-bg',

      id: 'starfield',
      title: 'Starfield Journey',
      description: 'Travel through space with moving stars, parallax effect, and warp speed modes',
      category: 'Space',
      color: 'blue',
      gradient: 'from-black via-blue-900 to-purple-900',
      icon: '⭐',
      status: 'Complete',
      features: ['Parallax Stars', 'Warp Speed', 'Constellation Mode', 'Color Variants']
    },
    {
      link: 'neural-network-bg',

      id: 'neural-network',
      title: 'Neural Network',
      description: 'Animated neural network with connecting nodes and pulsing data transmission',
      category: 'Tech',
      color: 'orange',
      gradient: 'from-orange-600 via-red-500 to-pink-500',
      icon: '🧠',
      status: 'Complete',
      features: ['Node Connections', 'Data Flow', 'Interactive Nodes', 'Multiple Layouts']
    },
    {
      link: 'aurora-waves-bg',

      id: 'aurora-waves',
      title: 'Aurora Waves',
      description: 'Northern lights effect with flowing, colorful waves across a dark sky',
      category: 'Nature',
      color: 'teal',
      gradient: 'from-teal-400 via-green-400 to-blue-500',
      icon: '🌌',
      status: 'Complete',
      features: ['Flowing Waves', 'Color Blending', 'Realistic Motion', 'Intensity Control']
    },
    {
      link: 'code-typing-bg',

      id: 'code-typing',
      title: 'Code Typing',
      description: 'Simulated code typing effect with syntax highlighting and cursor blinking',
      category: 'Code',
      color: 'gray',
      gradient: 'from-gray-800 via-gray-900 to-black',
      icon: '⌨️',
      status: 'Complete',
      features: ['Syntax Highlighting', 'Multiple Languages', 'Typing Speed', 'Error Effects']
    }
  ];

  // Get unique categories for filtering
  const categories = ['All', ...new Set(backgrounds.map(bg => bg.category))];

  // Filter backgrounds based on search and category
  const filteredBackgrounds = backgrounds.filter(bg => {
    const matchesSearch = bg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || bg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * Handle background card click
   * In a real app, this would navigate to the background page
   * For now, it just logs - you can replace with your routing logic
   */
  const handleBackgroundClick = (background) => {
    const BGlink = background.link || background.id; // Use link if available, otherwise fallback to id
    navigate(`/${BGlink}`);
    console.log(`Navigate to background: ${BGlink}`);
    // Example: navigate(`/backgrounds/${backgroundId}`);
    // Example: router.push(`/backgrounds/${backgroundId}`);
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header Section */}
      <header className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center">
            {/* Main logo/title */}
            <h1 className="text-8xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Jcodes
              </span>
              <span className="text-white/90"> Backgrounds</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-2xl text-white/70 mb-8 max-w-3xl mx-auto">
              A curated collection of stunning, interactive React background components 
              ready to elevate your projects
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{backgrounds.length}</div>
                <div className="text-white/60 text-sm">Total Backgrounds</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {backgrounds.filter(bg => bg.status === 'Complete').length}
                </div>
                <div className="text-white/60 text-sm">Ready to Use</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{categories.length - 1}</div>
                <div className="text-white/60 text-sm">Categories</div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-10 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 max-w-2xs mx-auto">
              <h1 className='text-white font-mono'>npm install jcodes-styles</h1>

              <button
                onClick={copyToClipboard}
                className="text-white hover:text-green-400 transition"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <section className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white/40">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search backgrounds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl 
                         text-white placeholder-white/50 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent backdrop-blur-sm
                         transition-all duration-300"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-white/60 mb-6">
          Showing {filteredBackgrounds.length} of {backgrounds.length} backgrounds
        </div>
      </section>

      {/* Backgrounds Grid */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBackgrounds.map((background, index) => (
            <div
              key={background.id}
              className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
              onClick={() => handleBackgroundClick(background)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Card */}
              <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm 
                              border border-white/10 hover:border-white/30 transition-all duration-300
                              hover:shadow-2xl hover:shadow-purple-500/10">
                
                {/* Preview Background */}
                <div className={`h-48 bg-gradient-to-br ${background.gradient} relative overflow-hidden`}>
                  {/* Animated overlay for preview effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      background.status === 'Complete' 
                        ? 'bg-green-500/80 text-white' 
                        : 'bg-yellow-500/80 text-black'
                    }`}>
                      {background.status}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="absolute bottom-4 left-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {background.icon}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {background.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    {background.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {background.features.slice(0, 2).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        <span className="text-white/60 text-xs">{feature}</span>
                      </div>
                    ))}
                    {background.features.length > 2 && (
                      <div className="text-white/40 text-xs">
                        +{background.features.length - 2} more features
                      </div>
                    )}
                  </div>

                  {/* Category tag */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-lg">
                      {background.category}
                    </span>
                    
                    {/* Arrow indicator */}
                    <div className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredBackgrounds.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No backgrounds found</h3>
            <p className="text-white/60">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-white/60 mb-4">
              Built with ❤️ for developers who love beautiful backgrounds
            </p>
            <div className="text-white/40 text-sm">
              Click any background to explore and customize • More backgrounds coming soon!
            </div>
            <div className="text-white/40 text-sm font-thin mt-4">
              For any help & support reach out to thejcodes101@gmail.com
            </div>
          </div>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grid > div {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default JcodesHomepage;