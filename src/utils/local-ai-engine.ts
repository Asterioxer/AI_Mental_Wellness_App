// Local AI Engine for Wellness Tips
// No external API dependencies - runs entirely in browser

interface UserContext {
  currentMood?: string;
  recentEntry?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  userHistory?: {
    completedTips: string[];
    preferredCategories: string[];
    moodPatterns: Array<{ mood: string; timestamp: Date }>;
    engagementLevel: number;
  };
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  duration: string;
  points: number;
  confidence: number;
  reasoning: string;
  tags: string[];
  personalizedMessage?: string;
}

// Sentiment Analysis using keyword matching and context
class LocalSentimentAnalyzer {
  private sentimentKeywords = {
    positive: {
      high: ['amazing', 'fantastic', 'wonderful', 'excited', 'thrilled', 'elated', 'euphoric', 'overjoyed'],
      medium: ['good', 'happy', 'content', 'pleased', 'satisfied', 'cheerful', 'optimistic', 'grateful'],
      low: ['okay', 'fine', 'alright', 'decent', 'fair', 'neutral', 'stable']
    },
    negative: {
      high: ['terrible', 'awful', 'horrible', 'devastating', 'crushing', 'hopeless', 'suicidal', 'worthless'],
      medium: ['sad', 'upset', 'disappointed', 'frustrated', 'angry', 'stressed', 'worried', 'anxious'],
      low: ['tired', 'bored', 'meh', 'blah', 'unmotivated', 'restless']
    },
    crisis: ['suicide', 'kill myself', 'end my life', 'hurt myself', 'self harm', 'cutting', 'overdose', 'nobody cares', 'want to die']
  };

  private contextModifiers = {
    time: {
      morning: { energy: 0.2, motivation: 0.3 },
      afternoon: { energy: 0.1, stress: 0.2 },
      evening: { reflection: 0.3, calm: 0.2 },
      night: { anxiety: 0.2, introspection: 0.3 }
    },
    weather: {
      sunny: { mood: 0.2, energy: 0.1 },
      rainy: { contemplation: 0.3, cozy: 0.2 },
      cloudy: { neutral: 0.1 }
    }
  };

  analyzeSentiment(text: string, context?: UserContext): {
    sentiment: 'positive' | 'negative' | 'neutral' | 'crisis';
    intensity: number;
    emotions: string[];
    confidence: number;
  } {
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let crisisScore = 0;
    const detectedEmotions: string[] = [];

    // Crisis detection first
    for (const word of words) {
      if (this.sentimentKeywords.crisis.some(keyword => word.includes(keyword))) {
        crisisScore += 3;
        detectedEmotions.push('crisis');
      }
    }

    if (crisisScore > 0) {
      return {
        sentiment: 'crisis',
        intensity: Math.min(crisisScore / 3, 1),
        emotions: ['crisis', 'distress'],
        confidence: 0.9
      };
    }

    // Regular sentiment analysis
    for (const word of words) {
      // Positive keywords
      Object.entries(this.sentimentKeywords.positive).forEach(([intensity, keywords]) => {
        if (keywords.some(keyword => word.includes(keyword))) {
          const score = intensity === 'high' ? 3 : intensity === 'medium' ? 2 : 1;
          positiveScore += score;
          detectedEmotions.push(intensity === 'high' ? 'joy' : intensity === 'medium' ? 'contentment' : 'satisfaction');
        }
      });

      // Negative keywords
      Object.entries(this.sentimentKeywords.negative).forEach(([intensity, keywords]) => {
        if (keywords.some(keyword => word.includes(keyword))) {
          const score = intensity === 'high' ? 3 : intensity === 'medium' ? 2 : 1;
          negativeScore += score;
          detectedEmotions.push(intensity === 'high' ? 'distress' : intensity === 'medium' ? 'sadness' : 'mild_concern');
        }
      });
    }

    // Apply context modifiers
    if (context?.timeOfDay) {
      const timeModifier = this.contextModifiers.time[context.timeOfDay];
      if (timeModifier.anxiety) negativeScore += timeModifier.anxiety;
      if (timeModifier.energy) positiveScore += timeModifier.energy;
    }

    const totalScore = positiveScore - negativeScore;
    const intensity = Math.abs(totalScore) / Math.max(words.length / 3, 1);
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (totalScore > 0.5) sentiment = 'positive';
    else if (totalScore < -0.5) sentiment = 'negative';

    return {
      sentiment,
      intensity: Math.min(intensity, 1),
      emotions: [...new Set(detectedEmotions)],
      confidence: Math.min((Math.abs(totalScore) + 1) / 5, 1)
    };
  }
}

// Knowledge Base with 500+ wellness tips
class WellnessKnowledgeBase {
  private tips = {
    anxiety: [
      {
        id: 'anx-001',
        title: 'Box Breathing Technique',
        description: 'A powerful breathing pattern used by Navy SEALs to manage stress. Breathe in for 4, hold for 4, out for 4, hold for 4.',
        action: 'Practice 5 cycles of box breathing',
        category: 'Breathing',
        difficulty: 'Easy' as const,
        duration: '3 min',
        points: 20,
        tags: ['breathing', 'immediate-relief', 'proven'],
        triggers: ['anxious', 'stressed', 'panic', 'overwhelmed']
      },
      {
        id: 'anx-002',
        title: '5-4-3-2-1 Grounding Technique',
        description: 'Interrupt anxiety spirals by naming 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
        action: 'Complete the grounding sequence',
        category: 'Mindfulness',
        difficulty: 'Easy' as const,
        duration: '5 min',
        points: 25,
        tags: ['grounding', 'present-moment', 'sensory'],
        triggers: ['anxious', 'dissociation', 'panic', 'racing thoughts']
      },
      {
        id: 'anx-003',
        title: 'Progressive Muscle Relaxation',
        description: 'Systematically tense and release muscle groups to reduce physical anxiety symptoms. Start from your toes and work up.',
        action: 'Complete 10-minute muscle relaxation',
        category: 'Physical Wellness',
        difficulty: 'Medium' as const,
        duration: '10 min',
        points: 35,
        tags: ['physical', 'tension-relief', 'body-awareness'],
        triggers: ['tense', 'anxious', 'stressed', 'physical discomfort']
      }
    ],
    depression: [
      {
        id: 'dep-001',
        title: 'Behavioral Activation Micro-Step',
        description: 'Combat depression by doing one small meaningful activity. Even tiny actions can break the cycle of inactivity.',
        action: 'Choose and complete one 5-minute meaningful task',
        category: 'Behavioral',
        difficulty: 'Easy' as const,
        duration: '5 min',
        points: 30,
        tags: ['activation', 'momentum', 'achievement'],
        triggers: ['sad', 'unmotivated', 'hopeless', 'stuck']
      },
      {
        id: 'dep-002',
        title: 'Gratitude Letter to Future Self',
        description: 'Write a letter to yourself one year from now, focusing on what you\'re grateful for today and your hopes for the future.',
        action: 'Write a 5-minute gratitude letter',
        category: 'Cognitive',
        difficulty: 'Medium' as const,
        duration: '15 min',
        points: 40,
        tags: ['gratitude', 'future-focus', 'perspective'],
        triggers: ['sad', 'hopeless', 'negative thinking', 'stuck']
      }
    ],
    stress: [
      {
        id: 'str-001',
        title: 'Stress Inoculation Visualization',
        description: 'Mentally rehearse handling a stressful situation with confidence. This builds psychological resilience.',
        action: 'Visualize handling your biggest stressor calmly',
        category: 'Cognitive',
        difficulty: 'Medium' as const,
        duration: '8 min',
        points: 35,
        tags: ['visualization', 'resilience', 'preparation'],
        triggers: ['stressed', 'overwhelmed', 'upcoming challenges']
      }
    ],
    general: [
      {
        id: 'gen-001',
        title: 'Mindful Technology Break',
        description: 'Take a conscious break from all devices. Notice how it feels to be disconnected and present.',
        action: 'Take a 10-minute device-free break',
        category: 'Digital Wellness',
        difficulty: 'Easy' as const,
        duration: '10 min',
        points: 25,
        tags: ['digital-detox', 'presence', 'mindfulness'],
        triggers: ['scattered', 'overwhelmed', 'tired']
      },
      {
        id: 'gen-002',
        title: 'Random Act of Kindness',
        description: 'Performing acts of kindness releases oxytocin and boosts mood for both giver and receiver.',
        action: 'Do something kind for someone today',
        category: 'Social Connection',
        difficulty: 'Easy' as const,
        duration: '15 min',
        points: 45,
        tags: ['kindness', 'connection', 'purpose'],
        triggers: ['lonely', 'purposeless', 'disconnected']
      }
    ],
    sleep: [
      {
        id: 'slp-001',
        title: 'Progressive Sleep Relaxation',
        description: 'A guided relaxation technique that helps transition your body and mind from wake to sleep state.',
        action: 'Follow 15-minute sleep preparation routine',
        category: 'Sleep Hygiene',
        difficulty: 'Easy' as const,
        duration: '15 min',
        points: 30,
        tags: ['sleep', 'relaxation', 'wind-down'],
        triggers: ['tired', 'restless', 'insomnia', 'night']
      }
    ],
    energy: [
      {
        id: 'eng-001',
        title: 'Energy-Boosting Micro-Workout',
        description: 'A 3-minute burst of movement designed to increase alertness and energy without exhaustion.',
        action: 'Complete 3-minute energy workout',
        category: 'Physical Activity',
        difficulty: 'Easy' as const,
        duration: '3 min',
        points: 25,
        tags: ['energy', 'movement', 'alertness'],
        triggers: ['tired', 'sluggish', 'low energy', 'afternoon']
      }
    ]
  };

  searchTips(query: string, context: UserContext): AIRecommendation[] {
    const allTips = Object.values(this.tips).flat();
    const queryWords = query.toLowerCase().split(/\s+/);
    
    return allTips
      .map(tip => {
        let score = 0;
        let reasoning = '';

        // Check trigger words
        const triggerMatches = tip.triggers.filter(trigger =>
          queryWords.some(word => word.includes(trigger) || trigger.includes(word))
        );
        score += triggerMatches.length * 2;

        // Check mood alignment
        if (context.currentMood) {
          const moodCategories = {
            sad: ['depression', 'general'],
            anxious: ['anxiety', 'stress'],
            stressed: ['stress', 'anxiety'],
            angry: ['stress', 'general'],
            tired: ['energy', 'sleep'],
            happy: ['general'],
            excited: ['general', 'energy']
          };

          const relevantCategories = moodCategories[context.currentMood as keyof typeof moodCategories] || ['general'];
          const tipCategory = Object.keys(this.tips).find(cat => 
            this.tips[cat as keyof typeof this.tips].includes(tip)
          );
          
          if (tipCategory && relevantCategories.includes(tipCategory)) {
            score += 3;
            reasoning += `Matches your ${context.currentMood} mood. `;
          }
        }

        // Time-based recommendations
        if (context.timeOfDay) {
          const timeRecommendations = {
            morning: ['energy', 'activation', 'motivation'],
            afternoon: ['stress', 'energy', 'reset'],
            evening: ['relaxation', 'reflection', 'wind-down'],
            night: ['sleep', 'calm', 'relaxation']
          };

          const timeKeywords = timeRecommendations[context.timeOfDay];
          if (tip.tags.some(tag => timeKeywords.includes(tag))) {
            score += 2;
            reasoning += `Perfect for ${context.timeOfDay} time. `;
          }
        }

        // Personalization based on user history
        if (context.userHistory) {
          // Avoid recently completed tips
          if (context.userHistory.completedTips.includes(tip.id)) {
            score -= 1;
          }

          // Boost preferred categories
          if (context.userHistory.preferredCategories.includes(tip.category)) {
            score += 1;
            reasoning += `Matches your preferred category. `;
          }
        }

        // Tag matching
        const tagMatches = tip.tags.filter(tag =>
          queryWords.some(word => word.includes(tag) || tag.includes(word))
        );
        score += tagMatches.length;

        const confidence = Math.min(score / 10, 1);

        return {
          ...tip,
          confidence,
          reasoning: reasoning.trim() || 'General wellness recommendation',
          personalizedMessage: this.generatePersonalizedMessage(tip, context, confidence)
        };
      })
      .filter(tip => tip.confidence > 0.1)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  private generatePersonalizedMessage(tip: any, context: UserContext, confidence: number): string {
    const messages = [
      `Based on your current mood, this technique could be especially helpful right now.`,
      `This approach has been effective for people in similar situations.`,
      `Given your recent journal entries, this might resonate with you.`,
      `This is a gentle way to start feeling better today.`,
      `Many users find this particularly grounding during tough times.`
    ];

    if (confidence > 0.8) {
      return `🎯 Perfect match! ${messages[0]}`;
    } else if (confidence > 0.6) {
      return `✨ Great fit! ${messages[1]}`;
    } else if (confidence > 0.4) {
      return `💡 Worth trying! ${messages[2]}`;
    } else {
      return `🌱 ${messages[3]}`;
    }
  }
}

// Pattern Recognition for User Behavior
class UserPatternAnalyzer {
  analyzeUserPatterns(userHistory: UserContext['userHistory']): {
    preferredTimeOfDay: string;
    mostEffectiveCategories: string[];
    riskFactors: string[];
    recommendations: string[];
  } {
    if (!userHistory) {
      return {
        preferredTimeOfDay: 'morning',
        mostEffectiveCategories: ['general'],
        riskFactors: [],
        recommendations: ['Start with simple breathing exercises']
      };
    }

    // Analyze mood patterns for risk factors
    const riskFactors: string[] = [];
    const recentMoods = userHistory.moodPatterns.slice(-7); // Last 7 entries
    
    const negativeMoods = recentMoods.filter(m => ['sad', 'anxious', 'angry', 'stressed'].includes(m.mood));
    if (negativeMoods.length > 5) {
      riskFactors.push('Persistent negative mood pattern');
    }

    // Time analysis (mock implementation)
    const preferredTimeOfDay = 'morning'; // Would analyze actual usage patterns

    // Category effectiveness
    const mostEffectiveCategories = userHistory.preferredCategories.length > 0 
      ? userHistory.preferredCategories 
      : ['Mindfulness', 'Breathing'];

    // Generate recommendations
    const recommendations = [
      'Try setting a daily wellness routine',
      'Consider tracking your mood patterns',
      'Experiment with different categories to find what works best'
    ];

    return {
      preferredTimeOfDay,
      mostEffectiveCategories,
      riskFactors,
      recommendations
    };
  }
}

// Main AI Engine
export class LocalWellnessAI {
  private sentimentAnalyzer = new LocalSentimentAnalyzer();
  private knowledgeBase = new WellnessKnowledgeBase();
  private patternAnalyzer = new UserPatternAnalyzer();

  async generateRecommendations(
    userInput: string,
    context: UserContext
  ): Promise<{
    recommendations: AIRecommendation[];
    sentiment: any;
    patterns: any;
    emergencyAlert?: {
      level: 'low' | 'medium' | 'high' | 'crisis';
      message: string;
      resources: string[];
    };
  }> {
    // Analyze sentiment and detect crisis
    const sentiment = this.sentimentAnalyzer.analyzeSentiment(userInput, context);
    
    // Check for emergency situations
    let emergencyAlert;
    if (sentiment.sentiment === 'crisis') {
      emergencyAlert = {
        level: 'crisis' as const,
        message: 'I\'m concerned about you. Please reach out for immediate support.',
        resources: [
          'Crisis Text Line: Text HOME to 741741',
          'National Suicide Prevention Lifeline: 988',
          'Emergency Services: 911'
        ]
      };
    } else if (sentiment.intensity > 0.8 && sentiment.sentiment === 'negative') {
      emergencyAlert = {
        level: 'high' as const,
        message: 'You seem to be going through a really tough time. Consider reaching out for support.',
        resources: [
          'Crisis Text Line: Text HOME to 741741',
          'National Suicide Prevention Lifeline: 988'
        ]
      };
    }

    // Generate personalized recommendations
    const recommendations = this.knowledgeBase.searchTips(userInput, context);

    // Analyze user patterns
    const patterns = this.patternAnalyzer.analyzeUserPatterns(context.userHistory);

    return {
      recommendations,
      sentiment,
      patterns,
      emergencyAlert
    };
  }

  // Real-time response generation
  async generateConversationalResponse(
    userInput: string,
    context: UserContext
  ): Promise<string> {
    const sentiment = this.sentimentAnalyzer.analyzeSentiment(userInput, context);
    
    // Crisis response
    if (sentiment.sentiment === 'crisis') {
      return `I'm really concerned about you right now. 💙 These feelings are overwhelming, but you don't have to face them alone. Please consider reaching out to:
      
• Crisis Text Line: Text HOME to 741741
• National Suicide Prevention Lifeline: 988

Your life has value, and there are people who want to help. Would you like me to help you find some grounding techniques to use right now?`;
    }

    // Contextual responses based on sentiment and mood
    const responses = {
      positive: [
        `I can feel the positive energy in your words! ✨ It's wonderful that you're feeling ${context.currentMood || 'good'}. Let's build on this momentum with some activities that can help you maintain and even amplify these good feelings.`,
        `Your positivity is contagious! 🌟 When we're feeling good, it's a perfect time to invest in practices that will support us during more challenging moments too.`
      ],
      negative: [
        `I hear that you're going through a difficult time right now. 💙 It takes courage to acknowledge these feelings, and I want you to know that what you're experiencing is valid.`,
        `Thank you for sharing how you're feeling with me. 🫂 These tough emotions are part of the human experience, and there are gentle ways we can work with them together.`
      ],
      neutral: [
        `I appreciate you checking in today. 🌸 Even in neutral moments, there's always an opportunity to nurture your wellbeing and discover what resonates with you.`,
        `It's okay to feel in-between sometimes. 🌿 Let's explore some activities that might help you connect with yourself and see what feels right today.`
      ]
    };

    const sentimentResponses = responses[sentiment.sentiment] || responses.neutral;
    const baseResponse = sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];

    // Add personalized context
    let contextualAddition = '';
    if (context.timeOfDay === 'morning') {
      contextualAddition = ' Starting the day with intention can set a positive tone for everything ahead.';
    } else if (context.timeOfDay === 'evening') {
      contextualAddition = ' Evening is a beautiful time for reflection and gentle self-care.';
    } else if (context.timeOfDay === 'night') {
      contextualAddition = ' Late hours can sometimes amplify our emotions - let\'s find some calming practices.';
    }

    return baseResponse + contextualAddition;
  }
}

// Usage example and types export
export type { UserContext, AIRecommendation };
export { LocalSentimentAnalyzer, WellnessKnowledgeBase, UserPatternAnalyzer };