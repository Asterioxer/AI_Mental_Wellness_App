import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onStartJourney: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export function LandingPage({ onStartJourney, onOpenLogin, onOpenSignup }: LandingPageProps) {
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-0 shadow-lg mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm">AI-Powered Mental Wellness Platform</span>
              <Badge variant="secondary" className="glass border-0">Beta</Badge>
            </motion.div>

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
                  <Brain className="w-5 h-5 mr-2" />
                  Try Demo
                </Button>
              </motion.div>
            </motion.div>


          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
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

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text text-[40px] py-[2px] py-[9px] px-[1px]">
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
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">Your Personal AI Companion</h3>
                  <p className="text-muted-foreground mb-6">
                    Get personalized support and insights tailored to your unique emotional journey.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Stars className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">Trusted by users worldwide</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass border-0 shadow-2xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Ready to Transform Your Mental Wellness?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Be among the first to experience a new approach to mental wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl px-8 py-4 text-lg"
                    onClick={onOpenSignup}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Free Today
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="glass border-0 shadow-lg px-8 py-4 text-lg"
                    onClick={onOpenLogin}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}