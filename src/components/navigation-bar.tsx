import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Sparkles } from 'lucide-react';

interface NavigationBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export function NavigationBar({ activeSection, onSectionChange, onOpenLogin, onOpenSignup }: NavigationBarProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/10 backdrop-blur-lg"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 32 32" 
                fill="none" 
                className="transition-all duration-300"
              >
                {/* Serenique Logo - Mind Garden: Representing growth, mental wellness, and serenity */}
                
                {/* Main trunk/stem - representing foundation and strength */}
                <path 
                  d="M16 28C16 28 14 24 14 20C14 18 15 16 16 16C17 16 18 18 18 20C18 24 16 28 16 28Z" 
                  fill="rgba(255,255,255,0.9)"
                  strokeWidth="0.5"
                  stroke="rgba(255,255,255,0.6)"
                />
                
                {/* Left branch system - representing neural pathways and growth */}
                <path 
                  d="M16 16C16 16 12 14 10 12C8 10 8 8 10 8C12 8 14 10 16 12" 
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                
                {/* Right branch system - representing balance and harmony */}
                <path 
                  d="M16 16C16 16 20 14 22 12C24 10 24 8 22 8C20 8 18 10 16 12" 
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                
                {/* Central growth point - representing mindfulness and core strength */}
                <circle 
                  cx="16" 
                  cy="16" 
                  r="2" 
                  fill="rgba(255,255,255,0.9)"
                />
                
                {/* Left leaf/mind node - representing thoughts and emotions */}
                <circle 
                  cx="10" 
                  cy="8" 
                  r="1.5" 
                  fill="rgba(255,255,255,0.7)"
                />
                
                {/* Right leaf/mind node - representing balance and wellness */}
                <circle 
                  cx="22" 
                  cy="8" 
                  r="1.5" 
                  fill="rgba(255,255,255,0.7)"
                />
                
                {/* Flowing energy lines - representing serenity and inner peace */}
                <path 
                  d="M8 10C8 10 6 12 6 14C6 16 8 16 10 14" 
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                
                <path 
                  d="M24 10C24 10 26 12 26 14C26 16 24 16 22 14" 
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                
                {/* Top growth elements - representing aspiration and hope */}
                <path 
                  d="M14 6C14 6 15 4 16 4C17 4 18 6 18 6" 
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold gradient-text">Serenique</span>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-600 dark:text-blue-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenLogin}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={onOpenSignup}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {/* Add mobile menu toggle logic */}}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}