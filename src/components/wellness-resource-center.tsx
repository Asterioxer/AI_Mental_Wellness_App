import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BookOpen, Search, Video, Music, Users, MapPin, Calendar, 
  Clock, Phone, Star, Heart, Bookmark, Share2, Play, Pause,
  Volume2, VolumeX, Filter, Download, ExternalLink, User,
  CheckCircle, AlertCircle, Info, Smile, Frown, Meh, Sun,
  Moon, CloudRain, Coffee, Leaf, Wind, Headphones, PenTool,
  Camera, Mic, FileText, Image as ImageIcon, Link, Globe
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WellnessResourceCenterProps {
  currentMood?: string;
  userLocation?: string;
}

// Mock data for articles
const wellnessArticles = [
  {
    id: 1,
    title: "Understanding Anxiety: A Youth's Guide to Managing Overwhelming Feelings",
    author: "Dr. Sarah Chen",
    category: "Mental Health",
    readTime: "5 min read",
    tags: ["anxiety", "coping", "youth"],
    excerpt: "Learn practical techniques to identify, understand, and manage anxiety in healthy ways that work for teenagers and young adults.",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=200&fit=crop",
    difficulty: "Beginner",
    rating: 4.8,
    reads: 1234,
    bookmarked: false,
    publishedAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Building Resilience Through Daily Mindfulness Practices",
    author: "Maya Rodriguez, LCSW",
    category: "Mindfulness",
    readTime: "7 min read",
    tags: ["mindfulness", "resilience", "daily-practice"],
    excerpt: "Discover simple mindfulness exercises that can be integrated into your daily routine to build emotional strength and stability.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    difficulty: "Intermediate",
    rating: 4.9,
    reads: 892,
    bookmarked: false,
    publishedAt: "2024-01-12"
  },
  {
    id: 3,
    title: "Social Media and Mental Health: Finding Balance in the Digital Age",
    author: "Alex Thompson, PhD",
    category: "Digital Wellness",
    readTime: "6 min read",
    tags: ["social-media", "digital-detox", "balance"],
    excerpt: "Navigate the complex relationship between social media use and mental health with evidence-based strategies for healthy digital habits.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
    difficulty: "Beginner",
    rating: 4.7,
    reads: 2156,
    bookmarked: false,
    publishedAt: "2024-01-10"
  }
];

// Mock data for local resources
const localResources = [
  {
    id: 1,
    name: "Youth Mental Health Support Group",
    type: "Support Group",
    address: "123 Community Center Dr, Your City",
    phone: "(555) 123-4567",
    website: "https://youth-support.org",
    hours: "Tuesdays 6:00 PM - 7:30 PM",
    description: "Peer support group for ages 16-25 focusing on anxiety, depression, and life transitions.",
    distance: "0.8 miles",
    rating: 4.6,
    verified: true,
    cost: "Free"
  },
  {
    id: 2,
    name: "Mindful Moments Meditation Center",
    type: "Wellness Center",
    address: "456 Peaceful Way, Your City",
    phone: "(555) 234-5678",
    website: "https://mindfulmoments.com",
    hours: "Mon-Fri 9:00 AM - 8:00 PM",
    description: "Guided meditation sessions, mindfulness workshops, and stress reduction programs for all ages.",
    distance: "1.2 miles",
    rating: 4.8,
    verified: true,
    cost: "$15-30 per session"
  },
  {
    id: 3,
    name: "Crisis Text Line",
    type: "Crisis Support",
    address: "Available 24/7 nationwide",
    phone: "Text HOME to 741741",
    website: "https://crisistextline.org",
    hours: "24/7",
    description: "Free, confidential crisis support via text message for anyone experiencing a mental health crisis.",
    distance: "Virtual",
    rating: 4.9,
    verified: true,
    cost: "Free"
  }
];

// Mock data for guided meditations
const guidedMeditations = [
  {
    id: 1,
    title: "5-Minute Morning Calm",
    instructor: "Rachel Green",
    duration: "5:00",
    category: "Morning",
    difficulty: "Beginner",
    description: "Start your day with intention and peace through this gentle morning meditation.",
    audioUrl: "#",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    rating: 4.7,
    plays: 8945
  },
  {
    id: 2,
    title: "Anxiety Relief Breathing",
    instructor: "Dr. Mark Wilson",
    duration: "10:00",
    category: "Anxiety",
    difficulty: "Beginner",
    description: "Learn breathing techniques designed to reduce anxiety and promote relaxation.",
    audioUrl: "#",
    image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=300&h=200&fit=crop",
    rating: 4.9,
    plays: 12567
  },
  {
    id: 3,
    title: "Sleep Stories: Ocean Waves",
    instructor: "Luna Davis",
    duration: "20:00",
    category: "Sleep",
    difficulty: "Beginner",
    description: "Drift off to peaceful sleep with calming ocean sounds and gentle narration.",
    audioUrl: "#",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=200&fit=crop",
    rating: 4.8,
    plays: 15432
  }
];

export function WellnessResourceCenter({ currentMood, userLocation }: WellnessResourceCenterProps) {
  const [activeTab, setActiveTab] = useState('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);
  const [currentAudio, setCurrentAudio] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [filteredArticles, setFilteredArticles] = useState(wellnessArticles);
  const [filteredResources, setFilteredResources] = useState(localResources);
  const [readingHistory, setReadingHistory] = useState<number[]>([]);

  // Filter articles based on search and category
  useEffect(() => {
    let filtered = wellnessArticles;
    
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredArticles(filtered);
  }, [searchQuery, selectedCategory]);

  // Filter resources based on search
  useEffect(() => {
    let filtered = localResources;
    
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredResources(filtered);
  }, [searchQuery]);

  const toggleBookmark = (articleId: number) => {
    setBookmarkedArticles(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handlePlayAudio = (meditationId: number) => {
    if (currentAudio === meditationId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(meditationId);
      setIsPlaying(true);
      setAudioProgress(0);
    }
    
    // Simulate audio progress
    if (isPlaying && currentAudio === meditationId) {
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            setCurrentAudio(null);
            return 0;
          }
          return prev + 1;
        });
      }, 200);
    }
  };

  const markAsRead = (articleId: number) => {
    if (!readingHistory.includes(articleId)) {
      setReadingHistory(prev => [...prev, articleId]);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood?.toLowerCase()) {
      case 'happy':
      case 'excited':
        return <Smile className="w-4 h-4 text-green-500" />;
      case 'sad':
      case 'anxious':
        return <Frown className="w-4 h-4 text-orange-500" />;
      default:
        return <Meh className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with mood-based recommendations */}
      {currentMood && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 rounded-lg border"
        >
          <div className="flex items-center gap-3">
            {getMoodIcon(currentMood)}
            <div>
              <h3 className="font-medium">Personalized for your mood</h3>
              <p className="text-sm text-muted-foreground">
                Feeling {currentMood}? Here are resources that might help you today.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filter Bar */}
      <Card className="glass border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles, resources, or meditations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-0"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] glass border-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="mental health">Mental Health</SelectItem>
                <SelectItem value="mindfulness">Mindfulness</SelectItem>
                <SelectItem value="digital wellness">Digital Wellness</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass border-0 shadow-lg">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Articles</span>
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Local</span>
          </TabsTrigger>
          <TabsTrigger value="meditations" className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Tools</span>
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <div className="grid gap-6">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-0 shadow-lg hover-lift overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{article.category}</Badge>
                              <span>{article.readTime}</span>
                              <span>•</span>
                              <span>{article.author}</span>
                            </div>
                            <h3 className="text-lg font-medium leading-tight">{article.title}</h3>
                            <p className="text-muted-foreground">{article.excerpt}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(article.id)}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                bookmarkedArticles.includes(article.id)
                                  ? 'fill-current text-yellow-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{article.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{article.reads} reads</span>
                            </div>
                            {readingHistory.includes(article.id) && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                <span>Read</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                              onClick={() => markAsRead(article.id)}
                            >
                              Read Article
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Local Resources Tab */}
        <TabsContent value="local" className="space-y-4">
          <div className="grid gap-4">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-0 shadow-lg hover-lift">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{resource.name}</h3>
                            {resource.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            <Badge variant="outline">{resource.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">{resource.cost}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{resource.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{resource.hours}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{resource.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{resource.rating}</span>
                            <span className="text-muted-foreground">• {resource.distance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <MapPin className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Guided Meditations Tab */}
        <TabsContent value="meditations" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidedMeditations.map((meditation, index) => (
              <motion.div
                key={meditation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-0 shadow-lg hover-lift">
                  <div className="relative">
                    <ImageWithFallback
                      src={meditation.image}
                      alt={meditation.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-lg">
                      <Button
                        size="lg"
                        className="rounded-full w-16 h-16 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        onClick={() => handlePlayAudio(meditation.id)}
                      >
                        {currentAudio === meditation.id && isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white" />
                        )}
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/60 text-white">{meditation.duration}</Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">{meditation.title}</h3>
                        <p className="text-sm text-muted-foreground">by {meditation.instructor}</p>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{meditation.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{meditation.category}</Badge>
                          <Badge variant="outline">{meditation.difficulty}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{meditation.rating}</span>
                        </div>
                      </div>
                      
                      {currentAudio === meditation.id && (
                        <div className="space-y-2">
                          <Progress value={audioProgress} className="h-1" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{Math.floor(audioProgress * 0.2)}:{String(Math.floor((audioProgress * 0.2) % 1 * 60)).padStart(2, '0')}</span>
                            <span>{meditation.duration}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Wellness Tools Tab */}
        <TabsContent value="tools" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Crisis Resources */}
            <Card className="glass border-0 shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  Crisis Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you're in crisis or need immediate support, these resources are available 24/7:
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-red-200">
                    <Phone className="w-4 h-4 mr-2" />
                    Crisis Text Line: Text HOME to 741741
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-red-200">
                    <Phone className="w-4 h-4 mr-2" />
                    National Suicide Prevention Lifeline: 988
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-red-200">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Services: 911
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Self-Care Planner */}
            <Card className="glass border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Self-Care Planner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Plan your self-care activities for today:
                </p>
                <div className="space-y-2">
                  <Input placeholder="Morning activity..." className="glass border-0" />
                  <Input placeholder="Afternoon break..." className="glass border-0" />
                  <Input placeholder="Evening wind-down..." className="glass border-0" />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600">
                  Save Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}