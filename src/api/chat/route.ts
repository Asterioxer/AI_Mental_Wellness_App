import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface ChatRequest {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
  }>;
  personality: {
    name: string;
    style: string;
    greeting: string;
  };
  userContext: {
    currentMood?: string;
    recentEntry?: string;
    conversationScore: number;
  };
}

const crisisKeywords = [
  'suicide', 'kill myself', 'end my life', 'don\'t want to live', 'hurt myself',
  'self harm', 'cutting', 'overdose', 'hopeless', 'worthless', 'nobody cares'
];

const detectCrisis = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
};

const generateSystemPrompt = (personality: any, userContext: any) => {
  const basePrompt = `You are ${personality.name}, a ${personality.style} AI wellness companion for youth mental health.

PERSONALITY TRAITS:
- ${personality.name === 'Sage' ? 'Wise, reflective, uses metaphors and gentle guidance. Often references inner wisdom and personal growth.' : ''}
- ${personality.name === 'Buddy' ? 'Friendly, encouraging, enthusiastic. Uses casual language and lots of positive reinforcement.' : ''}
- ${personality.name === 'Zen' ? 'Calm, mindful, present-focused. Uses meditation concepts and encourages mindfulness practices.' : ''}
- ${personality.name === 'Spark' ? 'Energetic, motivating, action-oriented. Uses dynamic language and focuses on empowerment.' : ''}

CONVERSATION STYLE:
- Keep responses concise (1-3 sentences maximum)
- Use emojis sparingly but meaningfully
- Reference the user's current mood when relevant: ${userContext.currentMood || 'unknown'}
- Be warm, supportive, and non-judgmental
- Ask follow-up questions to encourage deeper reflection
- Provide practical wellness suggestions when appropriate

CURRENT USER CONTEXT:
- Current mood: ${userContext.currentMood || 'Not specified'}
- Recent journal activity: ${userContext.recentEntry ? 'Active journaler' : 'New to journaling'}
- Conversation engagement: ${userContext.conversationScore > 50 ? 'Highly engaged' : 'Building rapport'}

IMPORTANT GUIDELINES:
- Never provide medical advice or diagnosis
- If user mentions crisis thoughts, express concern and suggest professional resources
- Focus on emotional support and wellness techniques
- Encourage healthy coping strategies
- Celebrate small wins and progress`;

  return basePrompt;
};

export async function POST(req: Request) {
  try {
    const { messages, personality, userContext }: ChatRequest = await req.json();

    // Check for crisis indicators in the latest message
    const latestMessage = messages[messages.length - 1];
    const isCrisis = latestMessage && detectCrisis(latestMessage.content);

    if (isCrisis) {
      return new Response(JSON.stringify({
        isCrisis: true,
        response: `I hear that you're struggling right now, and I'm genuinely concerned about you. 💙 Your feelings matter, and there are people who want to help. Please consider reaching out to:

• National Crisis Text Line: Text HOME to 741741
• National Suicide Prevention Lifeline: 988
• Crisis Chat: suicidepreventionlifeline.org

You don't have to go through this alone. Would you like to talk about what's making you feel this way?`
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = generateSystemPrompt(personality, userContext);

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: convertToCoreMessages(messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))),
      maxTokens: 150,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat request',
      fallback: "I'm having trouble connecting right now, but I'm still here to listen. How are you feeling today?"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}