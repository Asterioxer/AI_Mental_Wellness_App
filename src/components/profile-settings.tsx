import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Brain, 
  Heart, 
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Camera,
  Save,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Star,
  Award,
  Target,
  TrendingUp,
  LogOut
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  journalEntries: number;
  currentStreak: number;
  longestStreak: number;
}

interface NotificationSettings {
  dailyReminders: boolean;
  weeklyInsights: boolean;
  moodAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  anonymousAnalytics: boolean;
  locationTracking: boolean;
  aiPersonalization: boolean;
}

interface ProfileSettingsProps {
  userInfo?: { name: string; email: string };
  onLogout?: () => void;
}

export function ProfileSettings({ userInfo, onLogout }: ProfileSettingsProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: userInfo?.name || 'Demo User',
    email: userInfo?.email || 'demo@serenique.com',
    avatar: '',
    joinDate: 'Today',
    journalEntries: 15,
    currentStreak: 1,
    longestStreak: 1
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    dailyReminders: true,
    weeklyInsights: true,
    moodAlerts: false,
    emailNotifications: true,
    pushNotifications: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    dataSharing: false,
    anonymousAnalytics: true,
    locationTracking: false,
    aiPersonalization: true
  });

  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    timezone: 'America/New_York',
    reminderTime: '19:00',
    weeklyGoal: 5
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'data', label: 'Data & Export', icon: Download },
    { id: 'account', label: 'Account', icon: LogOut }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the data to your backend
  };

  // Update profile when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setProfile(prev => ({
        ...prev,
        name: userInfo.name,
        email: userInfo.email
      }));
    }
  }, [userInfo]);

  const achievements = [
    { title: 'First Entry', description: 'Created your first journal entry', earned: true, icon: Star },
    { title: 'Week Warrior', description: 'Journaled for 7 consecutive days', earned: true, icon: Award },
    { title: 'Mood Master', description: 'Tracked 50 different moods', earned: false, icon: Heart },
    { title: 'Reflection Pro', description: 'Written 100 journal entries', earned: false, icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <motion.div 
                  className="absolute -bottom-2 -right-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button size="sm" className="rounded-full w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600">
                    <Camera className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold gradient-text">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
                <p className="text-sm text-muted-foreground mt-1">Joined {profile.joinDate}</p>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <Badge variant="secondary" className="glass border-0">
                    <Calendar className="w-3 h-3 mr-1" />
                    {profile.journalEntries} entries
                  </Badge>
                  <Badge variant="secondary" className="glass border-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {profile.currentStreak} day streak
                  </Badge>
                  <Badge variant="secondary" className="glass border-0">
                    <Award className="w-3 h-3 mr-1" />
                    Best: {profile.longestStreak} days
                  </Badge>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isEditing ? <Save className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Settings Navigation & Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((section) => (
                <motion.div
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeSection === section.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                        : 'glass border-0'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.label}
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      Personal Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          disabled={!isEditing}
                          className="glass border-0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          disabled={!isEditing}
                          className="glass border-0"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="opacity-30" />

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      Achievements
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            achievement.earned 
                              ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20' 
                              : 'glass border-0 opacity-60'
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <achievement.icon className={`w-6 h-6 ${
                              achievement.earned ? 'text-green-500' : 'text-muted-foreground'
                            }`} />
                            <div>
                              <h4 className="font-medium">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    Notification Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 glass rounded-lg border-0">
                        <div>
                          <Label className="text-base capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {key === 'dailyReminders' && 'Get reminded to journal daily'}
                            {key === 'weeklyInsights' && 'Receive weekly mood insights'}
                            {key === 'moodAlerts' && 'Get alerts for concerning mood patterns'}
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'pushNotifications' && 'Get push notifications on your device'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({...prev, [key]: checked}))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Privacy & Security
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 glass rounded-lg border-0">
                        <div>
                          <Label className="text-base capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {key === 'dataSharing' && 'Share anonymized data for research'}
                            {key === 'anonymousAnalytics' && 'Help improve the app with usage analytics'}
                            {key === 'locationTracking' && 'Use location for mood context'}
                            {key === 'aiPersonalization' && 'Allow AI to personalize your experience'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({...prev, [key]: checked}))
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="glass p-4 rounded-lg border border-blue-200/20">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Your Data is Safe
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      All your journal entries are encrypted and stored securely. We never sell your personal data 
                      or share it without your explicit consent. You have full control over your information.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    App Preferences
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select value={preferences.theme} onValueChange={(value) => 
                        setPreferences(prev => ({...prev, theme: value}))
                      }>
                        <SelectTrigger className="glass border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light Mode</SelectItem>
                          <SelectItem value="dark">Dark Mode</SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={preferences.language} onValueChange={(value) => 
                        setPreferences(prev => ({...prev, language: value}))
                      }>
                        <SelectTrigger className="glass border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={preferences.timezone} onValueChange={(value) => 
                        setPreferences(prev => ({...prev, timezone: value}))
                      }>
                        <SelectTrigger className="glass border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Daily Reminder</Label>
                      <Input
                        type="time"
                        value={preferences.reminderTime}
                        onChange={(e) => setPreferences(prev => ({...prev, reminderTime: e.target.value}))}
                        className="glass border-0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Weekly Journaling Goal</Label>
                      <Select value={preferences.weeklyGoal.toString()} onValueChange={(value) => 
                        setPreferences(prev => ({...prev, weeklyGoal: parseInt(value)}))
                      }>
                        <SelectTrigger className="glass border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 entries per week</SelectItem>
                          <SelectItem value="5">5 entries per week</SelectItem>
                          <SelectItem value="7">Daily journaling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Data & Export Section */}
              {activeSection === 'data' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-500" />
                    Data Management
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="glass border-0 p-4">
                      <h4 className="font-medium mb-2">Export Your Data</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download all your journal entries, mood data, and insights in JSON format.
                      </p>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          const data = localStorage.getItem('serenique_journal_entries');
                          if (data) {
                            const blob = new Blob([data], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'serenique-entries.json';
                            a.click();
                            URL.revokeObjectURL(url);
                          }
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </Card>

                    <Card className="glass border-0 p-4">
                      <h4 className="font-medium mb-2">Backup Settings</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create a backup of your preferences and settings.
                      </p>
                      <Button className="w-full" variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        Create Backup
                      </Button>
                    </Card>
                  </div>

                  <Separator className="opacity-30" />

                  <div className="glass p-4 rounded-lg border border-red-200/20">
                    <h4 className="font-medium mb-2 text-red-600 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Danger Zone
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      These actions are permanent and cannot be undone.
                    </p>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete all journal entries? This cannot be undone.')) {
                            localStorage.removeItem('serenique_journal_entries');
                            window.location.reload();
                          }
                        }}
                      >
                        Delete All Journal Entries
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          if (confirm('Are you sure you want to reset all app data? This will clear everything.')) {
                            localStorage.clear();
                            window.location.reload();
                          }
                        }}
                      >
                        Reset All App Data
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Account Section */}
              {activeSection === 'account' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <LogOut className="w-5 h-5 text-orange-500" />
                    Account Management
                  </h3>

                  <div className="space-y-4">
                    <Card className="glass border-0 p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} alt={profile.name} />
                          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-lg">{profile.name}</h4>
                          <p className="text-muted-foreground">{profile.email}</p>
                          <p className="text-sm text-muted-foreground">Joined {profile.joinDate}</p>
                        </div>
                      </div>
                      
                      <Separator className="opacity-30 mb-4" />
                      
                      <div className="space-y-3">
                        <h5 className="font-medium">Session Information</h5>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <p>• Current session: Demo mode</p>
                          <p>• Data storage: Local browser storage</p>
                          <p>• Last activity: {new Date().toLocaleString()}</p>
                        </div>
                      </div>
                    </Card>

                    <div className="glass p-4 rounded-lg border border-orange-200/20">
                      <h4 className="font-medium mb-2 text-orange-600 flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        End your current session and return to the landing page. Your local data will be preserved.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        onClick={() => {
                          if (confirm('Are you sure you want to sign out?')) {
                            onLogout?.();
                          }
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Save Button */}
              {activeSection !== 'profile' && (
                <motion.div
                  className="pt-6 border-t border-border/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleSave}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}