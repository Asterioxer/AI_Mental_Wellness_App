import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Sparkles,
  Shield,
  CheckCircle,
  Zap,
  X
} from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (userData: { name: string; email: string }) => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ isOpen, onClose, onSignup, onSwitchToLogin }: SignupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo: Accept any credentials
    setTimeout(() => {
      onSignup({ 
        name: formData.name || 'Demo User', 
        email: formData.email || 'demo@serenique.com' 
      });
      setIsLoading(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    }, 1000);
  };

  const handleDemoSignup = () => {
    setFormData({
      name: 'Demo User',
      email: 'demo@serenique.com',
      password: 'demo123',
      confirmPassword: 'demo123'
    });
    setAgreedToTerms(true);
    setTimeout(() => {
      onSignup({ name: 'Demo User', email: 'demo@serenique.com' });
    }, 500);
  };

  const passwordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'text-red-500' };
    if (password.length < 10) return { strength: 'medium', color: 'text-yellow-500' };
    return { strength: 'strong', color: 'text-green-500' };
  };

  const passwordMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md p-0 bg-transparent border-0 shadow-none max-h-[90vh] overflow-y-auto [&>button]:hidden">
            <DialogTitle className="sr-only">Create Account</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new account to start your mental wellness journey with Serenique
            </DialogDescription>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass border-0 shadow-2xl w-full max-w-md mx-auto max-h-[90vh] flex flex-col relative">
                <CardHeader className="text-center pb-2 flex-shrink-0 relative">
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 p-0 glass border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <motion.div
                    className="flex justify-center mb-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Heart className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>
                  
                  <CardTitle className="text-2xl gradient-text">Join Serenique</CardTitle>
                  <p className="text-muted-foreground">
                    Start your path to better mental wellness
                  </p>
                  
                  <motion.div
                    className="flex items-center justify-center gap-2 px-3 py-1 rounded-full glass border-0 shadow-sm mt-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span className="text-xs">Free Demo</span>
                    <Badge variant="secondary" className="glass border-0 text-xs">Beta</Badge>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-6 overflow-y-auto flex-1 min-h-0">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="pl-10 glass border-0 shadow-inner focus:shadow-lg transition-all duration-300"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 glass border-0 shadow-inner focus:shadow-lg transition-all duration-300"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 pr-10 glass border-0 shadow-inner focus:shadow-lg transition-all duration-300"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {formData.password && (
                        <motion.div
                          className="flex items-center gap-2 text-xs"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`w-2 h-2 rounded-full ${passwordStrength(formData.password).color.replace('text-', 'bg-')}`} />
                          <span className={passwordStrength(formData.password).color}>
                            Password strength: {passwordStrength(formData.password).strength}
                          </span>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-10 pr-10 glass border-0 shadow-inner focus:shadow-lg transition-all duration-300"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {formData.confirmPassword && (
                        <motion.div
                          className="flex items-center gap-2 text-xs"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className={`w-3 h-3 ${passwordMatch ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={passwordMatch ? 'text-green-500' : 'text-red-500'}>
                            {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
                          </span>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      className="flex items-start space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="rounded mt-1" 
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{' '}
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Terms of Service
                        </Button>
                        {' '}and{' '}
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Privacy Policy
                        </Button>
                      </label>
                    </motion.div>

                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                          disabled={isLoading || !agreedToTerms}
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                            </motion.div>
                          ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                          )}
                          {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      </motion.div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Quick Demo</span>
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDemoSignup}
                          className="w-full glass border-0 shadow-sm"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Create Demo Account
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>

                  <motion.div
                    className="text-center space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <p className="text-xs text-muted-foreground">
                      Already have an account?{' '}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-semibold gradient-text"
                        onClick={onSwitchToLogin}
                      >
                        Sign in
                      </Button>
                    </p>
                  </motion.div>

                  <motion.div
                    className="text-xs text-muted-foreground text-center glass p-3 rounded-lg border border-blue-200/20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    <Shield className="w-4 h-4 inline mr-1" />
                    Demo mode: Any information will work to create an account
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}