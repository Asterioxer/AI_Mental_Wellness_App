import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionedLandingPage } from './components/sectioned-landing-page';
import { Dashboard } from './components/dashboard';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Heart, Moon, Sun, Sparkles, Stars, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { LoginModal } from './components/login-modal';
import { SignupModal } from './components/signup-modal';

type Page = 'landing' | 'dashboard';
type AuthModal = 'login' | 'signup' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentModal, setCurrentModal] = useState<AuthModal>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [loginType, setLoginType] = useState<'demo' | 'login'>('demo');
  const [activeTab, setActiveTab] = useState<string>('journal');

  // Apply dark theme on initial load
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const handleStartJourney = () => {
    // Demo access from landing page
    setIsAuthenticated(true);
    setUserInfo({
      name: 'Demo User',
      email: 'demo@serenique.com'
    });
    setLoginType('demo');
    setCurrentPage('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
  };

  const handleOpenAuthModal = (modal: AuthModal) => {
    setCurrentModal(modal);
  };

  const handleCloseAuthModal = () => {
    setCurrentModal(null);
  };

  const handleDemoAuth = (userData: { name?: string; email: string }, type: 'demo' | 'login' = 'demo') => {
    // Demo authentication - accept any credentials
    setIsAuthenticated(true);
    setUserInfo({
      name: userData.name || userData.email.split('@')[0],
      email: userData.email
    });
    setLoginType(type);
    setCurrentModal(null);
    setCurrentPage('dashboard');
  };

  const handleModalLogin = (userData: { name?: string; email: string }) => {
    // For actual login via modal - set as login type
    handleDemoAuth(userData, 'login');
  };

  const handleModalSignup = (userData: { name?: string; email: string }) => {
    // For actual signup via modal - set as login type  
    handleDemoAuth(userData, 'login');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo({ name: '', email: '' });
    setLoginType('demo');
    setActiveTab('journal');
    setCurrentPage('landing');
  };

  const handleProfileClick = () => {
    setActiveTab('settings');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: 'var(--background)' }}>
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -120, 0],
              y: [0, 80, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
            animate={{
              x: [-50, 50, -50],
              y: [-30, 30, -30],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>



      {/* Main Content */}
      <main className={currentPage === 'dashboard' ? 'container mx-auto px-4 py-8 pt-8' : ''}>
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SectionedLandingPage 
                onStartJourney={handleStartJourney} 
                onOpenLogin={() => handleOpenAuthModal('login')}
                onOpenSignup={() => handleOpenAuthModal('signup')}
              />
            </motion.div>
          )}

          {currentPage === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard 
                onBackToHome={handleBackToHome} 
                userInfo={isAuthenticated ? userInfo : undefined}
                onLogout={handleLogout}
                loginType={loginType}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onProfileClick={handleProfileClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - Only show on landing page */}
      {currentPage === 'landing' && (
        <footer className="glass border-t mt-16">

              <div className="container mx-auto px-4 py-12">
                {/* Professional Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 pb-8 border-b border-border/50">
                  <div className="mb-6 lg:mb-0">
                    <div className="flex items-center gap-3 mb-4 cursor-pointer group transition-all duration-300 hover:transform hover:scale-105">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25 group-hover:rotate-6">
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 32 32" 
                          fill="none" 
                          className="transition-all duration-300 group-hover:scale-110"
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
                      <h3 className="text-xl font-semibold gradient-text transition-all duration-300 group-hover:transform group-hover:translate-x-1">Serenique</h3>
                    </div>
                    <p className="text-muted-foreground max-w-md leading-relaxed transition-all duration-300 hover:text-foreground cursor-default">
                      AI-powered mental wellness platform empowering youth to thrive emotionally through personalized support and guidance.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-green-400/10 cursor-pointer group">
                      <div className="w-2 h-2 bg-green-400 rounded-full transition-all duration-300 group-hover:animate-pulse group-hover:shadow-md group-hover:shadow-green-400/50"></div>
                      <span className="text-sm text-muted-foreground transition-all duration-300 group-hover:text-green-400">24/7 Support Available</span>
                    </div>
                  </div>
                </div>

                {/* Streamlined Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                  {/* App Section */}
                  <div className="space-y-4 group">
                    <h4 className="font-medium text-foreground transition-all duration-300 group-hover:text-primary-solid group-hover:transform group-hover:translate-x-2">App</h4>
                    <div className="space-y-3">
                      {['Features', 'How it Works', 'About Us'].map((link) => (
                        <a
                          key={link}
                          href="#"
                          className="block text-sm text-muted-foreground hover:text-primary-solid transition-all duration-300 hover:transform hover:translate-x-3 hover:scale-105 relative overflow-hidden group/link"
                        >
                          <span className="relative z-10 transition-all duration-300">{link}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-solid/5 to-transparent scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left rounded"></div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Legal Section */}
                  <div className="space-y-4 group">
                    <h4 className="font-medium text-foreground transition-all duration-300 group-hover:text-primary-solid group-hover:transform group-hover:translate-x-2">Legal</h4>
                    <div className="space-y-3">
                      {['Privacy Policy', 'Terms of Service'].map((link) => (
                        <a
                          key={link}
                          href="#"
                          className="block text-sm text-muted-foreground hover:text-primary-solid transition-all duration-300 hover:transform hover:translate-x-3 hover:scale-105 relative overflow-hidden group/link"
                        >
                          <span className="relative z-10 transition-all duration-300">{link}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-solid/5 to-transparent scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left rounded"></div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Support Section */}
                  <div className="space-y-4 group">
                    <h4 className="font-medium text-foreground transition-all duration-300 group-hover:text-primary-solid group-hover:transform group-hover:translate-x-2">Support</h4>
                    <div className="space-y-3">
                      {['Help Center', 'Crisis Resources', 'Contact Us'].map((link) => (
                        <a
                          key={link}
                          href="#"
                          className="block text-sm text-muted-foreground hover:text-primary-solid transition-all duration-300 hover:transform hover:translate-x-3 hover:scale-105 relative overflow-hidden group/link"
                        >
                          <span className="relative z-10 transition-all duration-300">{link}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-solid/5 to-transparent scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left rounded"></div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground cursor-default">© 2024 Serenique. All rights reserved.</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground mr-2 transition-all duration-300 hover:text-foreground cursor-default">Follow us:</span>
                    {[
                      { 
                        name: 'Instagram', 
                        icon: <Instagram className="w-4 h-4" />,
                        color: 'hover:text-pink-500',
                        shadowColor: 'hover:shadow-pink-500/25'
                      },
                      { 
                        name: 'X', 
                        icon: <Twitter className="w-4 h-4" />,
                        color: 'hover:text-slate-300',
                        shadowColor: 'hover:shadow-slate-300/25'
                      },
                      { 
                        name: 'Facebook', 
                        icon: <Facebook className="w-4 h-4" />,
                        color: 'hover:text-blue-500',
                        shadowColor: 'hover:shadow-blue-500/25'
                      },
                      { 
                        name: 'Discord', 
                        icon: <MessageCircle className="w-4 h-4" />,
                        color: 'hover:text-indigo-500',
                        shadowColor: 'hover:shadow-indigo-500/25'
                      }
                    ].map((social) => (
                      <a
                        key={social.name}
                        href="#"
                        className={`w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground ${social.color} ${social.shadowColor} transition-all duration-300 hover:transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg active:scale-95 active:translate-y-0`}
                        title={social.name}
                      >
                        <span className="transition-all duration-300 hover:scale-110">
                          {social.icon}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
        </footer>
      )}



      {/* Auth Modals */}
      <LoginModal 
        isOpen={currentModal === 'login'}
        onClose={handleCloseAuthModal}
        onLogin={handleModalLogin}
        onSwitchToSignup={() => setCurrentModal('signup')}
      />
      
      <SignupModal 
        isOpen={currentModal === 'signup'}
        onClose={handleCloseAuthModal}
        onSignup={handleModalSignup}
        onSwitchToLogin={() => setCurrentModal('login')}
      />
    </div>
  );
}