import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { NavigationBar } from './navigation-bar';
import { 
  Heart, 
  Brain, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  MessageCircle, 
  Lightbulb, 
  Users, 
  Sparkles, 
  Stars,
  ArrowRight,
  CheckCircle,
  Zap,
  Mail,
  Phone,
  MapPin,
  Award,
  Target,
  Eye,
  Globe,
  Download,
  Play
} from 'lucide-react';

interface SectionedLandingPageProps {
  onStartJourney: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export function SectionedLandingPage({ onStartJourney, onOpenLogin, onOpenSignup }: SectionedLandingPageProps) {
  const [activeSection, setActiveSection] = useState('home');

  // Scroll to section with smooth animation
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "AI-Powered Mood Analysis",
      description: "Advanced sentiment analysis that understands your emotions and provides personalized insights.",
      color: "text-red-500"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Journal Companion",
      description: "Intelligent journaling with real-time mood detection and contextual wellness recommendations.",
      color: "text-purple-500"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Visual Mood Tracking",
      description: "Beautiful charts and insights that help you understand your emotional patterns over time.",
      color: "text-blue-500"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "AI Chatbot Support",
      description: "24/7 companion that adapts to your mood and provides appropriate guidance and support.",
      color: "text-green-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy-First Design",
      description: "Your mental health data stays secure with end-to-end encryption and local processing.",
      color: "text-orange-500"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Youth-Focused Experience",
      description: "Designed specifically for young minds with an intuitive, engaging, and supportive interface.",
      color: "text-cyan-500"
    }
  ];

  const benefits = [
    "Track your emotional journey with AI-powered insights",
    "Get personalized wellness tips based on your mood",
    "Access 24/7 mental health support through our AI companion",
    "Visualize your progress with beautiful, easy-to-understand charts",
    "Connect with professional resources when you need them"
  ];

  const stats = [
    { number: "Multiple", label: "Core Features", icon: <Sparkles className="w-6 h-6" /> },
    { number: "24/7", label: "AI Support", icon: <MessageCircle className="w-6 h-6" /> },
    { number: "100%", label: "Private", icon: <Shield className="w-6 h-6" /> },
    { number: "Advanced", label: "AI Technology", icon: <Brain className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen">
      <NavigationBar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onOpenLogin={onOpenLogin}
        onOpenSignup={onOpenSignup}
      />

      {/* Home Section */}
      <section id="home" className="relative pt-20 pb-20 overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Your Journey to
              <br />
              <motion.span
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  backgroundSize: '200% 200%',
                  background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #4facfe, #43e97b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Mental Wellness
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover a new way to understand your emotions with our AI-powered journaling platform. 
              Get personalized insights, track your progress, and find support whenever you need it.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl px-8 py-4 text-lg"
                  onClick={onOpenSignup}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="glass border-0 shadow-lg px-8 py-4 text-lg"
                  onClick={onStartJourney}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Try Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="md:text-5xl font-bold mb-6 gradient-text leading-tight text-[40px] px-[1px] py-[2px]">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge AI technology with compassionate design 
              to support your mental health journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="glass border-0 shadow-lg hover-lift h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-4 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                About Serenique
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Serenique was born from a simple belief: every young person deserves access to 
                mental health support that understands them.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our AI-powered platform combines the latest advances in natural language processing 
                with evidence-based therapeutic techniques to create a safe, supportive environment 
                where young people can explore their emotions, track their progress, and build 
                resilience for the future.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Mission: Democratizing mental health support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-purple-500" />
                  <span className="font-medium">Vision: A world where mental wellness is accessible to all</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-green-500" />
                  <span className="font-medium">Impact: Supporting young minds globally</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-0 shadow-2xl p-8">
                <div className="text-center">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg 
                      width="40" 
                      height="40" 
                      viewBox="0 0 32 32" 
                      fill="none" 
                      className="text-white"
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
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">Built with Empathy</h3>
                  <p className="text-muted-foreground mb-6">
                    Every feature is designed with deep understanding of the unique challenges 
                    young people face in their mental health journey.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Privacy Protection</span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="w-full bg-green-500 rounded-full h-2"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI Accuracy</span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="w-11/12 bg-blue-500 rounded-full h-2"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Satisfaction</span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="w-5/6 bg-purple-500 rounded-full h-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Why Choose Serenique?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                We've designed every feature with your mental wellness in mind, 
                creating a safe space for growth and self-discovery.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{benefit}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-8"
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-xl"
                  onClick={onOpenSignup}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Join Now
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-0 shadow-2xl p-8">
                <div className="text-center">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Lightbulb className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">Smart Insights</h3>
                  <p className="text-muted-foreground mb-6">
                    Get personalized recommendations and insights that adapt to your unique 
                    emotional patterns and growth journey.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Stars className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">Powered by Advanced AI</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-0 shadow-lg p-8 h-full">
                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                <div className="space-y-4 h-full flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name</label>
                      <Input placeholder="Your first name" className="glass border-0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name</label>
                      <Input placeholder="Your last name" className="glass border-0" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="your.email@example.com" className="glass border-0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input placeholder="What's this about?" className="glass border-0" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea 
                      placeholder="Tell us more about your inquiry..." 
                      rows={4} 
                      className="glass border-0 resize-none min-h-[180px]" 
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-auto">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      size="lg"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <Card className="glass border-0 shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">sohamaxpauli@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">+91 9065349149</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">
                        Vani Vihar<br />
                        Bhubaneswar, Odisha - 751004
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass border-0 shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Get Early Access</h3>
                <p className="text-muted-foreground mb-6">
                  Be among the first to experience Serenique. Join our exclusive beta program and help shape the future of mental wellness.
                </p>
                <div className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      onClick={onOpenSignup}
                    >
                      <Stars className="w-5 h-5 mr-2" />
                      Join Beta Program
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      className="w-full glass border-0"
                      onClick={onStartJourney}
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Preview Demo
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}