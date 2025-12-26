import { OpenAIApi, Configuration } from '@azure/openai';

// Azure OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.AZURE_OPENAI_KEY,
  basePath: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  baseOptions: {
    headers: {
      'api-key': process.env.AZURE_OPENAI_KEY,
    },
    params: {
      'api-version': '2023-12-01-preview',
    },
  },
});

const openai = new OpenAIApi(configuration);

// Ethical AI boundaries - STRICT ENFORCEMENT
const FORBIDDEN_PATTERNS = [
  /complete.*assignment/i,
  /solve.*exam/i,
  /answer.*test/i,
  /write.*essay.*for/i,
  /do.*homework/i,
  /medical.*advice/i,
  /diagnose/i,
  /financial.*advice/i,
  /investment.*recommendation/i
];

const ETHICAL_SYSTEM_PROMPT = `You are an educational AI assistant for students. You must follow these STRICT rules:

FORBIDDEN ACTIONS:
- Never generate complete assignments, essays, or homework
- Never answer exam questions directly
- Never provide medical advice or diagnoses
- Never give financial advice or investment recommendations
- Never do the work for students

ALLOWED ACTIONS:
- Explain concepts and reasoning
- Provide study guidance and learning strategies
- Help structure thinking and approaches
- Encourage independent learning
- Ask guiding questions

Always encourage students to think independently and do their own work. If asked to do something forbidden, politely decline and explain why.`;

export class AIService {
  // Check if a request violates ethical boundaries
  static isRequestEthical(prompt: string): { allowed: boolean; reason?: string } {
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(prompt)) {
        return {
          allowed: false,
          reason: 'This request asks me to do work that students should complete independently. I can help explain concepts or provide guidance instead.'
        };
      }
    }
    return { allowed: true };
  }

  // Generate AI response with ethical constraints
  static async generateResponse(userPrompt: string, context?: any): Promise<string> {
    // Check ethical boundaries first
    const ethicalCheck = this.isRequestEthical(userPrompt);
    if (!ethicalCheck.allowed) {
      return `I can't help with that. ${ethicalCheck.reason}

Instead, I can:
- Explain the concepts involved
- Help you understand the problem structure
- Suggest learning resources
- Guide you through the thinking process

What specific concept would you like me to explain?`;
    }

    try {
      const messages = [
        { role: 'system', content: ETHICAL_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ];

      // Add context if provided (user profile, goals, etc.)
      if (context) {
        messages.splice(1, 0, {
          role: 'system',
          content: `Student context: ${JSON.stringify(context, null, 2)}`
        });
      }

      const response = await openai.createChatCompletion({
        model: 'gpt-35-turbo', // Use your deployment name
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('AI Service error:', error);
      return 'I apologize, but I encountered an error. Please try again later.';
    }
  }

  // Generate daily routine suggestions
  static async generateDailyRoutine(userProfile: any, goals: any[], habits: any[], tasks: any[]): Promise<string> {
    const context = {
      profile: userProfile,
      activeGoals: goals.filter(g => g.status === 'active').length,
      habitCount: habits.length,
      todaysTasks: tasks.length
    };

    const prompt = `Based on my student profile and current commitments, suggest a balanced daily routine for today. Consider my energy preferences and current workload. Focus on:
- Study blocks with breaks
- Habit integration
- Well-being reminders
- Realistic time allocation

Keep suggestions gentle and flexible, not rigid or overwhelming.`;

    return this.generateResponse(prompt, context);
  }

  // Generate study guidance
  static async generateStudyGuidance(subject: string, topic: string, userLevel: string): Promise<string> {
    const prompt = `I'm studying ${subject}, specifically ${topic}. I'm at a ${userLevel} level. Can you help me understand the key concepts and suggest a learning approach? Please explain the reasoning behind important points rather than just giving me answers.`;

    return this.generateResponse(prompt);
  }

  // Generate career micro-tasks
  static async generateCareerTasks(degree: string, interests: string[]): Promise<string[]> {
    const prompt = `I'm studying ${degree} and interested in ${interests.join(', ')}. Suggest 3 small, actionable career development tasks I could do this week (15-30 minutes each). Focus on skill building or exploration, not overwhelming commitments.`;

    const response = await this.generateResponse(prompt);
    
    // Parse response into individual tasks
    // This is a simple implementation - could be improved with better parsing
    const tasks = response.split('\n')
      .filter(line => line.trim().match(/^\d+\.|\-|\•/))
      .map(line => line.replace(/^\d+\.|\-|\•/, '').trim())
      .filter(task => task.length > 0)
      .slice(0, 3);

    return tasks.length > 0 ? tasks : ['Explore industry trends in your field', 'Update your LinkedIn profile', 'Research one company you admire'];
  }
}