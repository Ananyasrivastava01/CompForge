const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
  }

  // Generate component code using AI
  async generateComponent(prompt, chatHistory = []) {
    try {
      console.log('AI Service: Starting component generation');
      console.log('AI Service: Prompt:', prompt);
      console.log('AI Service: Chat history length:', chatHistory.length);
      
      if (!this.apiKey) {
        throw new Error('OpenRouter API key is not configured');
      }

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
7. ALWAYS format the response as JSON with jsxCode and cssCode fields
8. Do NOT include any text outside the JSON format

Example response format:
{
  "jsxCode": "import React from 'react';\n\nexport default function Component() {\n  return (\n    <div className=\"...\">\n      ...\n    </div>\n  );\n}",
  "cssCode": "/* Additional CSS if needed */\n.custom-class {\n  ...\n}"
}

CRITICAL: Your response must be valid JSON with jsxCode and cssCode fields.`
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

      console.log('AI Service: Making request to OpenRouter');
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

      console.log('AI Service: Received response from OpenRouter');
      const content = response.data.choices[0].message.content;
      console.log('AI Service: Raw content length:', content.length);
      
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(content);
        console.log('AI Service: Successfully parsed JSON response');
        return {
          jsxCode: parsed.jsxCode || content,
          cssCode: parsed.cssCode || '',
          message: `Component generated successfully! Here's your ${parsed.jsxCode?.includes('Button') ? 'button' : 'component'}.`,
        };
      } catch (e) {
        console.log('AI Service: Failed to parse as JSON, checking if it\'s JSX code');
        // If not JSON, check if it looks like JSX code
        if (content.includes('import React') || content.includes('export default') || content.includes('<')) {
          // It's JSX code, return it directly with a friendly message
          const componentName = this.extractComponentName(content);
          console.log('AI Service: Detected JSX code, component name:', componentName);
          return {
            jsxCode: content,
            cssCode: '',
            message: `Component generated successfully! Here's your ${componentName || 'component'}.`,
          };
        } else {
          // It's not JSX, return as error
          console.log('AI Service: Invalid response format');
          throw new Error('Invalid response format from AI');
        }
      }
    } catch (error) {
      console.error('AI Service: Generation error:', error.message);
      if (error.response) {
        console.error('AI Service: OpenRouter error response:', error.response.data);
      }
      throw new Error('Failed to generate component');
    }
  }

  // Helper function to extract component name from JSX code
  extractComponentName(jsxCode) {
    const match = jsxCode.match(/export\s+default\s+(\w+)/);
    if (match) {
      return match[1];
    }
    
    const functionMatch = jsxCode.match(/const\s+(\w+)\s*:\s*React\.FC/);
    if (functionMatch) {
      return functionMatch[1];
    }
    
    const componentMatch = jsxCode.match(/function\s+(\w+)/);
    if (componentMatch) {
      return componentMatch[1];
    }
    
    return 'Component';
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
7. ALWAYS format the response as JSON with jsxCode and cssCode fields
8. Do NOT include any text outside the JSON format

Example response format:
{
  "jsxCode": "import React from 'react';\n\nexport default function Component() {\n  return (\n    <div className=\"...\">\n      ...\n    </div>\n  );\n}",
  "cssCode": "/* Additional CSS if needed */\n.custom-class {\n  ...\n}"
}

CRITICAL: Your response must be valid JSON with jsxCode and cssCode fields.`
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