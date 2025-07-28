const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
  }

  // Generate component code using AI
  async generateComponent(prompt, chatHistory = []) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an expert React component generator. Create modern, clean React components with TypeScript and Tailwind CSS.

IMPORTANT RULES:
1. Always return valid JSX/TSX code
2. Use Tailwind CSS classes for styling
3. Include proper TypeScript types
4. Make components responsive and accessible
5. Use modern React patterns (hooks, functional components)
6. Return ONLY the component code, no explanations in the code
7. Format the response as JSON with jsxCode and cssCode fields

Example response format:
{
  "jsxCode": "import React from 'react';\n\nexport default function Component() {\n  return (\n    <div className=\"...\">\n      ...\n    </div>\n  );\n}",
  "cssCode": "/* Additional CSS if needed */\n.custom-class {\n  ...\n}"
}`
        },
        ...chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://compforge.app',
            'X-Title': 'CompForge',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(content);
        return {
          jsxCode: parsed.jsxCode || content,
          cssCode: parsed.cssCode || '',
        };
      } catch (e) {
        // If not JSON, return as plain JSX
        return {
          jsxCode: content,
          cssCode: '',
        };
      }
    } catch (error) {
      console.error('AI generation error:', error.message);
      throw new Error('Failed to generate component');
    }
  }

  // Stream component generation
  async streamComponent(prompt, chatHistory = [], res) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an expert React component generator. Create modern, clean React components with TypeScript and Tailwind CSS.

IMPORTANT RULES:
1. Always return valid JSX/TSX code
2. Use Tailwind CSS classes for styling
3. Include proper TypeScript types
4. Make components responsive and accessible
5. Use modern React patterns (hooks, functional components)
6. Return ONLY the component code, no explanations in the code
7. Format the response as JSON with jsxCode and cssCode fields`
        },
        ...chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://compforge.app',
            'X-Title': 'CompForge',
          },
          responseType: 'stream',
        }
      );

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let fullContent = '';

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              res.write(`data: [DONE]\n\n`);
              res.end();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0]?.delta?.content) {
                const content = parsed.choices[0].delta.content;
                fullContent += content;
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      });

      response.data.on('end', () => {
        // Try to parse the full content as JSON
        try {
          const parsed = JSON.parse(fullContent);
          res.write(`data: ${JSON.stringify({ 
            jsxCode: parsed.jsxCode || fullContent,
            cssCode: parsed.cssCode || '',
            done: true 
          })}\n\n`);
        } catch (e) {
          res.write(`data: ${JSON.stringify({ 
            jsxCode: fullContent,
            cssCode: '',
            done: true 
          })}\n\n`);
        }
        res.end();
      });

    } catch (error) {
      console.error('AI streaming error:', error.message);
      res.write(`data: ${JSON.stringify({ error: 'Failed to generate component' })}\n\n`);
      res.end();
    }
  }

  // Modify existing component
  async modifyComponent(originalCode, modificationPrompt, chatHistory = []) {
    try {
      const prompt = `Modify this React component based on the following request:

ORIGINAL COMPONENT:
${originalCode}

MODIFICATION REQUEST:
${modificationPrompt}

Please return the modified component code. Keep the same structure but apply the requested changes.`;

      return await this.generateComponent(prompt, chatHistory);
    } catch (error) {
      console.error('Component modification error:', error.message);
      throw new Error('Failed to modify component');
    }
  }
}

module.exports = new AIService(); 