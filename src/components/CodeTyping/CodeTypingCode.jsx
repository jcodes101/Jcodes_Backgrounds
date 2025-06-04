import { useState, useEffect, useRef } from 'react';

const CodeTypingBackground = ({ 
  children, 
  className = "",
  language = "javascript",
  typingSpeed = 100,
  showErrors = true 
}) => {
  const [codeLines, setCodeLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [errorMode, setErrorMode] = useState(false);
  const containerRef = useRef(null);

  const codeSnippets = {
    javascript: [
      "// Building the future with JavaScript ",
      "const fetchUserData = async (userId) => {",
      "  try {",
      "    const response = await fetch(`/api/users/${userId}`);",
      "    const userData = await response.json();",
      "    return userData;",
      "  } catch (error) {",
      "    console.error('Failed to fetch user:', error);",
      "    throw new Error('User not found');",
      "  }",
      "};",
      "",
      "class AIAssistant {",
      "  constructor(model = 'gpt-4') {",
      "    this.model = model;",
      "    this.memory = new Map();",
      "  }",
      "",
      "  async generateResponse(prompt, context = {}) {",
      "    const enrichedPrompt = this.enrichPrompt(prompt, context);",
      "    const response = await this.callAPI(enrichedPrompt);",
      "    this.memory.set(prompt, response);",
      "    return response;",
      "  }",
      "}"
    ],
    python: [
    "# AI-powered data analysis pipeline",
    "import pandas as pd",
    "import numpy as np",
    "from sklearn.ensemble import RandomForestClassifier",
    "from typing import List, Dict, Optional",
    "",
    "class DataProcessor:",
    "    def __init__(self, config: Dict[str, any]):",
    "        self.config = config",
    "        self.model = None",
    "        self.scaler = StandardScaler()",
    "",
    "    async def process_dataset(self, data: pd.DataFrame) -> pd.DataFrame:",
    '        """Process and clean the dataset""""',
    "        # Remove duplicates and handle missing values",
    "        cleaned_data = data.drop_duplicates()",
    "        cleaned_data = self.handle_missing_values(cleaned_data)",
    "        ",
    "        # Feature engineering",
    "        features = self.extract_features(cleaned_data)",
    "        return self.scale_features(features)",
    "",
    "    def train_model(self, X: np.ndarray, y: np.ndarray):",
    "        self.model = RandomForestClassifier(n_estimators=100)",
    "        self.model.fit(X, y)",
    "        return self.model.score(X, y)"
    ],
    react: [
        "// Modern React component with hooks",
        "import React, { useState, useEffect, useCallback } from 'react';",
        "import { useQuery, useMutation } from '@tanstack/react-query';",
        "",
        "const UserDashboard = ({ userId }) => {",
        "  const [selectedTab, setSelectedTab] = useState('overview');",
        "  const [notifications, setNotifications] = useState([]);",
        "",
        "  // Fetch user data with React Query",
        "  const { data: userData, isLoading, error } = useQuery({",
        "    queryKey: ['user', userId],",
        "    queryFn: () => fetchUserById(userId),",
        "    staleTime: 5 * 60 * 1000, // 5 minutes",
        "  });",
        "",
        "  // Mutation for updating user preferences",
        "  const updatePreferences = useMutation({",
        "    mutationFn: (preferences) => updateUserPrefs(userId, preferences),",
        "    onSuccess: () => {",
        "      queryClient.invalidateQueries(['user', userId]);",
        "      showSuccessToast('Preferences updated!');",
        "    },",
        "  });",
        "",
        "  return (",
        '    <div className="dashboard-container">',
        "      <Header user={userData} />",
        "      <TabNavigation active={selectedTab} onChange={setSelectedTab} />",
        "      <MainContent tab={selectedTab} user={userData} />",
        "    </div>",
        "  );",
        "};"
    ],
    css: [
        "/* Modern CSS with advanced features */",
        "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');",
        "",
        ":root {",
        "  --color-primary: #3b82f6;",
        "  --color-secondary: #8b5cf6;",
        "  --color-accent: #06b6d4;",
        "  --color-background: #0f172a;",
        "  --color-surface: #1e293b;",
        "  --border-radius: 0.75rem;",
        "  --shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.25);",
        "}",
        "",
        ".glass-morphism {",
        "  background: rgba(255, 255, 255, 0.05);",
        "  backdrop-filter: blur(10px);",
        "  border: 1px solid rgba(255, 255, 255, 0.1);",
        "  border-radius: var(--border-radius);",
        "}",
        "",
        ".button-primary {",
        "  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));",
        "  color: white;",
        "  padding: 0.75rem 1.5rem;",
        "  border-radius: var(--border-radius);",
        "  font-weight: 500;",
        "  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);",
        "  box-shadow: var(--shadow-lg);",
        "}",
        "",
        ".button-primary:hover {",
        "  transform: translateY(-2px);",
        "  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.35);",
        "}"
    ]
  };

  const syntaxColors = {
    keyword: '#ff79c6',
    string: '#f1fa8c',
    comment: '#6272a4',
    function: '#50fa7b',
    variable: '#8be9fd',
    number: '#bd93f9',
    operator: '#ff5555',
    default: '#f8f8f2'
  };

  const highlightSyntax = (line) => {
    const tokens = [];
    let currentToken = '';
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      if (char === '"' || char === "'" || char === '`') {
        if (currentToken) {
          tokens.push({ text: currentToken, type: 'default' });
          currentToken = '';
        }
        let stringEnd = i + 1;
        while (stringEnd < line.length && line[stringEnd] !== char) {
          stringEnd++;
        }
        if (stringEnd < line.length) stringEnd++;
        tokens.push({ text: line.slice(i, stringEnd), type: 'string' });
        i = stringEnd;
        continue;
      }
      if (char === '/' && line[i + 1] === '/') {
        if (currentToken) {
          tokens.push({ text: currentToken, type: 'default' });
          currentToken = '';
        }
        tokens.push({ text: line.slice(i), type: 'comment' });
        break;
      }
      if (char === '#' && (i === 0 || line[i - 1] === ' ')) {
        if (currentToken) {
          tokens.push({ text: currentToken, type: 'default' });
          currentToken = '';
        }
        tokens.push({ text: line.slice(i), type: 'comment' });
        break;
      }
      if ('(){}[]<>=+*-/!&|;:,.'.includes(char)) {
        if (currentToken) {
          tokens.push({ text: currentToken, type: getTokenType(currentToken) });
          currentToken = '';
        }
        tokens.push({ text: char, type: 'operator' });
        i++;
        continue;
      }
      if (char === ' ' || char === '\t') {
        if (currentToken) {
          tokens.push({ text: currentToken, type: getTokenType(currentToken) });
          currentToken = '';
        }
        tokens.push({ text: char, type: 'default' });
        i++;
        continue;
      }
      currentToken += char;
      i++;
    }

    if (currentToken) {
      tokens.push({ text: currentToken, type: getTokenType(currentToken) });
    }

    return tokens;
  };

  const getTokenType = (token) => {
    const keywords = ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'do',
      'class', 'extends', 'import', 'export', 'from', 'default', 'try', 'catch', 'throw', 'new',
      'this', 'super', 'static', 'public', 'private', 'protected', 'abstract', 'interface',
      'def', 'self', 'None', 'True', 'False', 'and', 'or', 'not', 'in', 'is', 'lambda',
      'React', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'Component'];
    const functions = ['console', 'fetch', 'map', 'filter', 'reduce', 'forEach', 'find', 'querySelector'];
    if (keywords.includes(token)) return 'keyword';
    if (functions.includes(token)) return 'function';
    if (/^\d+$/.test(token)) return 'number';
    if (token.includes('(') || token.includes('()')) return 'function';
    return 'default';
  };

  useEffect(() => {
    const lines = codeSnippets[language] || codeSnippets.javascript;
    setCodeLines(lines.map(line => ({ original: line, displayed: '', completed: false })));
    setCurrentLine(0);
    setCurrentChar(0);
  }, [language]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (codeLines.length === 0) return;
    const typingInterval = setInterval(() => {
      setCodeLines(prevLines => {
        const newLines = [...prevLines];
        const currentLineObj = newLines[currentLine];
        if (!currentLineObj || currentLineObj.completed) {
          if (currentLine < newLines.length - 1) {
            setCurrentLine(prev => prev + 1);
            setCurrentChar(0);
            setIsDeleting(false);
          } else {
            setTimeout(() => {
              setCodeLines(lines => lines.map(line => ({ ...line, displayed: '', completed: false })));
              setCurrentLine(0);
              setCurrentChar(0);
              setIsDeleting(false);
            }, 2000);
          }
          return newLines;
        }

        if (showErrors && Math.random() < 0.02 && !errorMode) {
          setErrorMode(true);
          setTimeout(() => setErrorMode(false), 200);
        }

        if (!isDeleting) {
          if (currentChar < currentLineObj.original.length) {
            newLines[currentLine].displayed = currentLineObj.original.slice(0, currentChar + 1);
            setCurrentChar(prev => prev + 1);
          } else {
            newLines[currentLine].completed = true;
          }
        }

        return newLines;
      });
    }, typingSpeed + Math.random() * 50);
    return () => clearInterval(typingInterval);
  }, [currentLine, currentChar, isDeleting, typingSpeed, showErrors, errorMode]);

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black ${className}`}
    >
      <div className="absolute inset-0 p-8">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 h-full overflow-hidden">
          <div className="bg-gray-800/90 px-4 py-2 border-b border-gray-700/50 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-4 text-gray-400 text-sm font-mono">
              {language}.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'react' ? 'jsx' : 'css'}
            </div>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-auto h-full">
            {codeLines.map((line, lineIndex) => (
              <div key={lineIndex} className="flex items-start mb-1">
                <span className="text-gray-500 select-none mr-4 text-right w-8">
                  {lineIndex + 1}
                </span>
                <div className="flex-1">
                  {line.displayed ? (
                    <span>
                      {highlightSyntax(line.displayed).map((token, tokenIndex) => (
                        <span
                          key={tokenIndex}
                          style={{ color: syntaxColors[token.type] || syntaxColors.default }}
                          className={errorMode && lineIndex === currentLine ? 'text-red-500' : ''}
                        >
                          {token.text}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-transparent">.</span>
                  )}
                  {lineIndex === currentLine && showCursor && (
                    <span className="bg-white text-black ml-1 animate-pulse">|</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute text-gray-300/20 font-mono text-xs animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['{}', '[]', '()', '<>', '/>', '===', '=>', '&&', '||'][Math.floor(Math.random() * 9)]}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-green-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CodeTypingBackground;