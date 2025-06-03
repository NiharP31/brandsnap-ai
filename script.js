// AI-Powered Brand generation with OpenAI integration
class BrandGenerator {
    constructor() {
        // Logo icons for fallback
        this.logoIcons = [
            'fas fa-rocket', 'fas fa-bolt', 'fas fa-star', 'fas fa-gem',
            'fas fa-crown', 'fas fa-fire', 'fas fa-heart', 'fas fa-leaf',
            'fas fa-shield-alt', 'fas fa-trophy', 'fas fa-lightbulb'
        ];

        // Brand name components
        this.brandPrefixes = [
            'pro', 'tech', 'smart', 'quick', 'neo', 'meta', 'ultra', 'super',
            'max', 'prime', 'elite', 'apex', 'nova', 'core', 'edge', 'flux'
        ];

        this.brandSuffixes = [
            'ly', 'fy', 'hub', 'lab', 'tech', 'soft', 'works', 'solutions',
            'sys', 'corp', 'inc', 'pro', 'max', 'ai', 'io', 'app'
        ];

        this.colorPalettes = [
            {
                name: 'Ocean Breeze',
                colors: ['#0077be', '#00a8cc', '#7dd3c0', '#ffd23f', '#ff6b35']
            },
            {
                name: 'Sunset Vibes',
                colors: ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#9b59b6']
            },
            {
                name: 'Forest Fresh',
                colors: ['#27ae60', '#2ecc71', '#f39c12', '#e67e22', '#34495e']
            },
            {
                name: 'Tech Modern',
                colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
            },
            {
                name: 'Minimal Clean',
                colors: ['#2c3e50', '#34495e', '#95a5a6', '#ecf0f1', '#3498db']
            },
            {
                name: 'Vibrant Energy',
                colors: ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#9b59b6']
            },
            {
                name: 'Cool Blues',
                colors: ['#3498db', '#2980b9', '#1abc9c', '#16a085', '#34495e']
            },
            {
                name: 'Warm Sunset',
                colors: ['#ff7675', '#fd79a8', '#fdcb6e', '#e17055', '#6c5ce7']
            }
        ];

        this.currentBrand = null;
        this.openaiApiKey = null;
        this.useAI = false;
        
        // Load stored API key
        this.getStoredApiKey();
    }

    // Set OpenAI API key
    setApiKey(apiKey) {
        this.openaiApiKey = apiKey;
        this.useAI = !!apiKey;
        if (apiKey) {
            localStorage.setItem('brandsnap_api_key', apiKey);
        } else {
            localStorage.removeItem('brandsnap_api_key');
        }
    }

    // Get stored API key
    getStoredApiKey() {
        const stored = localStorage.getItem('brandsnap_api_key');
        if (stored) {
            this.openaiApiKey = stored;
            this.useAI = true;
        }
        return stored;
    }

    // AI-powered brand generation
    async generateBrandWithAI(idea) {
        if (!this.openaiApiKey) {
            throw new Error('OpenAI API key not set');
        }

        const prompt = `You are a professional brand strategist and creative director. Generate a complete brand identity for this startup idea: "${idea}"

Return ONLY a valid JSON object with this exact structure:
{
  "brandName": "creative, memorable brand name (2-3 words max)",
  "tagline": "compelling tagline that captures the essence (8-12 words)",
  "industry": "primary industry category (tech, health, finance, food, education, travel, social, business, entertainment, retail)",
  "vibe": "brand personality (modern, playful, professional, creative, classic, innovative)",
  "reasoning": "brief explanation for the brand name choice (1-2 sentences)",
  "logoDescription": "detailed description for logo image generation (specific visual elements, style, colors, symbols)"
}

Important guidelines:
- Brand name should be unique, brandable, and easy to pronounce
- Tagline should be action-oriented and market-focused
- Industry should be one of the listed categories
- Vibe should match the target audience and market positioning
- Logo description should be specific enough for AI image generation (include style, elements, colors)
- Ensure all fields are properly filled and valid`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional brand strategist. Return only valid JSON responses.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        return this.parseAIResponse(content);
    }

    parseAIResponse(content) {
        try {
            // Clean the content to extract JSON
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in AI response');
            }
            
            const jsonStr = jsonMatch[0];
            const parsed = JSON.parse(jsonStr);
            
            // Validate required fields
            if (!parsed.brandName || !parsed.tagline || !parsed.industry || !parsed.vibe) {
                throw new Error('Missing required fields in AI response');
            }
            
            // Set defaults for optional fields
            return {
                brandName: parsed.brandName,
                tagline: parsed.tagline,
                industry: parsed.industry || 'business',
                vibe: parsed.vibe || 'modern',
                reasoning: parsed.reasoning || 'AI-generated brand identity',
                logoDescription: parsed.logoDescription || null
            };
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            throw new Error('Invalid AI response format');
        }
    }

    // Generate color palette based on industry and vibe
    generateSmartColorPalette(industry, vibe) {
        const paletteMap = {
            'tech': ['Tech Modern', 'Cool Blues', 'Minimal Clean'],
            'technology': ['Tech Modern', 'Cool Blues', 'Minimal Clean'],
            'health': ['Forest Fresh', 'Ocean Breeze', 'Minimal Clean'],
            'healthcare': ['Forest Fresh', 'Ocean Breeze', 'Minimal Clean'],
            'finance': ['Minimal Clean', 'Cool Blues', 'Tech Modern'],
            'financial': ['Minimal Clean', 'Cool Blues', 'Tech Modern'],
            'food': ['Warm Sunset', 'Forest Fresh', 'Vibrant Energy'],
            'education': ['Ocean Breeze', 'Forest Fresh', 'Cool Blues'],
            'travel': ['Sunset Vibes', 'Ocean Breeze', 'Warm Sunset'],
            'social': ['Vibrant Energy', 'Sunset Vibes', 'Warm Sunset'],
            'business': ['Minimal Clean', 'Tech Modern', 'Cool Blues'],
            'entertainment': ['Vibrant Energy', 'Sunset Vibes', 'Warm Sunset'],
            'retail': ['Warm Sunset', 'Vibrant Energy', 'Sunset Vibes']
        };

        const vibeMap = {
            'modern': ['Tech Modern', 'Minimal Clean', 'Cool Blues'],
            'playful': ['Sunset Vibes', 'Vibrant Energy', 'Warm Sunset'],
            'professional': ['Minimal Clean', 'Cool Blues', 'Tech Modern'],
            'creative': ['Vibrant Energy', 'Sunset Vibes', 'Warm Sunset'],
            'natural': ['Forest Fresh', 'Ocean Breeze', 'Warm Sunset'],
            'classic': ['Minimal Clean', 'Cool Blues', 'Forest Fresh'],
            'innovative': ['Tech Modern', 'Vibrant Energy', 'Cool Blues']
        };

        // Choose palette based on industry and vibe
        let candidatePalettes = [];
        
        if (paletteMap[industry?.toLowerCase()]) {
            candidatePalettes = [...paletteMap[industry.toLowerCase()]];
        }
        
        if (vibeMap[vibe?.toLowerCase()]) {
            candidatePalettes = [...candidatePalettes, ...vibeMap[vibe.toLowerCase()]];
        }
        
        if (candidatePalettes.length === 0) {
            candidatePalettes = ['Tech Modern', 'Minimal Clean', 'Ocean Breeze'];
        }
        
        // Remove duplicates and pick one
        const uniquePalettes = [...new Set(candidatePalettes)];
        const chosenPaletteName = uniquePalettes[Math.floor(Math.random() * uniquePalettes.length)];
        
        return this.colorPalettes.find(p => p.name === chosenPaletteName) || this.colorPalettes[0];
    }

    // Generate logo image using DALL-E
    async generateLogoImage(logoDescription, brandName, retryCount = 0) {
        if (!this.openaiApiKey) {
            throw new Error('OpenAI API key not set');
        }

        const maxRetries = 2;
        
        // Enhanced prompt for better logo generation
        const enhancedPrompt = `Professional minimalist logo design for "${brandName}": ${logoDescription}. 
Style: Clean, modern, scalable vector-style logo on transparent or white background. 
High contrast, suitable for business use, memorable and distinctive. 
Avoid text/typography, focus on symbolic elements and shapes.`;

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiApiKey}`
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: enhancedPrompt,
                    size: '1024x1024',
                    quality: 'standard',
                    n: 1
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                
                // Handle specific DALL-E errors
                if (errorData.error?.code === 'content_policy_violation') {
                    // Fallback to generic description
                    if (retryCount < maxRetries) {
                        const genericPrompt = `Minimalist professional logo design: simple geometric shapes, clean lines, modern style, suitable for ${brandName} brand. Vector-style, high contrast, white background.`;
                        return this.generateLogoImage(genericPrompt, brandName, retryCount + 1);
                    }
                }
                
                throw new Error(errorData.error?.message || 'DALL-E API request failed');
            }

            const data = await response.json();
            return data.data[0].url; // Return the generated image URL
            
        } catch (error) {
            // Fallback for API errors
            if (retryCount < maxRetries) {
                const fallbackPrompt = `Simple professional logo: abstract symbol, clean design, modern style for business brand`;
                return this.generateLogoImage(fallbackPrompt, brandName, retryCount + 1);
            }
            
            console.warn('Logo image generation failed:', error.message);
            return null; // Return null to fall back to icon-based logo
        }
    }

    // Generate logo (enhanced with AI image generation)
    async generateSmartLogo(brandName, industry, vibe, logoDescription = null, useAI = false) {
        const industryIcons = {
            'tech': ['fas fa-rocket', 'fas fa-bolt', 'fas fa-cog', 'fas fa-cube'],
            'technology': ['fas fa-rocket', 'fas fa-bolt', 'fas fa-cog', 'fas fa-cube'],
            'health': ['fas fa-heart', 'fas fa-leaf', 'fas fa-shield-alt', 'fas fa-seedling'],
            'healthcare': ['fas fa-heart', 'fas fa-leaf', 'fas fa-shield-alt', 'fas fa-seedling'],
            'finance': ['fas fa-gem', 'fas fa-shield-alt', 'fas fa-crown', 'fas fa-trophy'],
            'financial': ['fas fa-gem', 'fas fa-shield-alt', 'fas fa-crown', 'fas fa-trophy'],
            'food': ['fas fa-leaf', 'fas fa-heart', 'fas fa-sun', 'fas fa-fire'],
            'education': ['fas fa-lightbulb', 'fas fa-star', 'fas fa-tree', 'fas fa-globe'],
            'travel': ['fas fa-paper-plane', 'fas fa-globe', 'fas fa-mountain', 'fas fa-umbrella'],
            'social': ['fas fa-heart', 'fas fa-star', 'fas fa-globe', 'fas fa-puzzle-piece'],
            'business': ['fas fa-rocket', 'fas fa-crown', 'fas fa-trophy', 'fas fa-bolt'],
            'entertainment': ['fas fa-star', 'fas fa-fire', 'fas fa-magic', 'fas fa-trophy'],
            'retail': ['fas fa-gem', 'fas fa-crown', 'fas fa-star', 'fas fa-heart']
        };

        const vibeGradients = {
            'modern': [
                'linear-gradient(135deg, #667eea, #764ba2)',
                'linear-gradient(135deg, #4facfe, #00f2fe)',
                'linear-gradient(135deg, #43e97b, #38f9d7)'
            ],
            'playful': [
                'linear-gradient(135deg, #f093fb, #f5576c)',
                'linear-gradient(135deg, #fa709a, #fee140)',
                'linear-gradient(135deg, #ff9a9e, #fecfef)'
            ],
            'professional': [
                'linear-gradient(135deg, #667eea, #764ba2)',
                'linear-gradient(135deg, #2c3e50, #34495e)',
                'linear-gradient(135deg, #4facfe, #00f2fe)'
            ],
            'creative': [
                'linear-gradient(135deg, #f093fb, #f5576c)',
                'linear-gradient(135deg, #fa709a, #fee140)',
                'linear-gradient(135deg, #a8edea, #fed6e3)'
            ],
            'classic': [
                'linear-gradient(135deg, #2c3e50, #34495e)',
                'linear-gradient(135deg, #667eea, #764ba2)',
                'linear-gradient(135deg, #27ae60, #2ecc71)'
            ],
            'innovative': [
                'linear-gradient(135deg, #667eea, #764ba2)',
                'linear-gradient(135deg, #f093fb, #f5576c)',
                'linear-gradient(135deg, #43e97b, #38f9d7)'
            ]
        };

        // Try AI logo generation first if enabled and description available
        if (useAI && logoDescription && this.openaiApiKey) {
            try {
                const logoImageUrl = await this.generateLogoImage(logoDescription, brandName);
                if (logoImageUrl) {
                    return {
                        type: 'image',
                        imageUrl: logoImageUrl,
                        text: brandName,
                        description: logoDescription
                    };
                }
            } catch (error) {
                console.warn('AI logo generation failed, falling back to icon-based logo:', error.message);
            }
        }

        // Fallback to icon-based logo
        let iconOptions = industryIcons[industry?.toLowerCase()] || this.logoIcons;
        const icon = iconOptions[Math.floor(Math.random() * iconOptions.length)];

        let gradientOptions = vibeGradients[vibe?.toLowerCase()] || vibeGradients.modern;
        const gradient = gradientOptions[Math.floor(Math.random() * gradientOptions.length)];

        return {
            type: 'icon',
            icon: icon,
            gradient: gradient,
            text: brandName
        };
    }

    // Fallback brand name generation (original algorithm)
    generateBrandNameFallback(idea) {
        const words = idea.toLowerCase().split(' ');
        const keyWords = words.filter(word => 
            word.length > 3 && 
            !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'they', 'have', 'will'].includes(word)
        );

        if (keyWords.length > 0 && Math.random() > 0.5) {
            const keyWord = keyWords[Math.floor(Math.random() * keyWords.length)];
            const cleanWord = keyWord.replace(/[^a-z]/g, '');
            
            if (Math.random() > 0.5) {
                const prefix = this.brandPrefixes[Math.floor(Math.random() * this.brandPrefixes.length)];
                return this.capitalize(prefix + cleanWord);
            } else {
                const suffix = this.brandSuffixes[Math.floor(Math.random() * this.brandSuffixes.length)];
                return this.capitalize(cleanWord + suffix);
            }
        }

        const prefix = this.brandPrefixes[Math.floor(Math.random() * this.brandPrefixes.length)];
        const suffix = this.brandSuffixes[Math.floor(Math.random() * this.brandSuffixes.length)];
        return this.capitalize(prefix + suffix);
    }

    // Fallback tagline generation
    generateTaglineFallback(idea) {
        const taglineTemplates = [
            "Revolutionizing business for everyone",
            "The future is here",
            "Simplifying life, one step at a time",
            "Where innovation meets excellence",
            "Empowering your journey",
            "Making the impossible possible",
            "Your trusted companion",
            "Transforming how you think",
            "Innovation that drives progress",
            "The smart way to succeed"
        ];
        
        return taglineTemplates[Math.floor(Math.random() * taglineTemplates.length)];
    }

    // Generate complete brand package
    async generateBrand(idea) {
        let brandData;
        let generatedWithAI = false;
        
        try {
            if (this.useAI && this.openaiApiKey) {
                // Try AI generation first
                brandData = await this.generateBrandWithAI(idea);
                generatedWithAI = true;
            } else {
                throw new Error('AI not available, using fallback');
            }
        } catch (error) {
            console.log('Using fallback generation:', error.message);
            // Fallback to algorithmic generation
            brandData = {
                brandName: this.generateBrandNameFallback(idea),
                tagline: this.generateTaglineFallback(idea),
                industry: 'business',
                vibe: 'modern',
                reasoning: 'Generated using algorithmic approach',
                logoDescription: null
            };
        }

        // Generate color palette
        const colorPalette = this.generateSmartColorPalette(brandData.industry, brandData.vibe);
        
        // Generate logo with AI if available
        const logo = await this.generateSmartLogo(
            brandData.brandName, 
            brandData.industry, 
            brandData.vibe, 
            brandData.logoDescription,
            generatedWithAI
        );

        this.currentBrand = {
            idea: idea,
            brandName: brandData.brandName,
            tagline: brandData.tagline,
            colorPalette: colorPalette,
            logo: logo,
            industry: brandData.industry,
            vibe: brandData.vibe,
            reasoning: brandData.reasoning,
            generatedWithAI: generatedWithAI,
            timestamp: new Date().toISOString()
        };

        return this.currentBrand;
    }

    // Regenerate specific component
    async regenerateComponent(type, idea) {
        if (!this.currentBrand) return null;

        switch (type) {
            case 'name':
                if (this.useAI && this.openaiApiKey) {
                    try {
                        const aiResult = await this.generateBrandWithAI(idea);
                        this.currentBrand.brandName = aiResult.brandName;
                        this.currentBrand.reasoning = aiResult.reasoning;
                        this.currentBrand.generatedWithAI = true;
                        // Regenerate logo with new brand name
                        this.currentBrand.logo = await this.generateSmartLogo(
                            this.currentBrand.brandName, 
                            this.currentBrand.industry, 
                            this.currentBrand.vibe,
                            aiResult.logoDescription,
                            true
                        );
                    } catch (error) {
                        this.currentBrand.brandName = this.generateBrandNameFallback(idea);
                        this.currentBrand.generatedWithAI = false;
                        this.currentBrand.logo = await this.generateSmartLogo(
                            this.currentBrand.brandName, 
                            this.currentBrand.industry, 
                            this.currentBrand.vibe,
                            null,
                            false
                        );
                    }
                } else {
                    this.currentBrand.brandName = this.generateBrandNameFallback(idea);
                    this.currentBrand.generatedWithAI = false;
                    this.currentBrand.logo = await this.generateSmartLogo(
                        this.currentBrand.brandName, 
                        this.currentBrand.industry, 
                        this.currentBrand.vibe,
                        null,
                        false
                    );
                }
                break;
            case 'tagline':
                if (this.useAI && this.openaiApiKey) {
                    try {
                        const aiResult = await this.generateBrandWithAI(idea);
                        this.currentBrand.tagline = aiResult.tagline;
                        this.currentBrand.generatedWithAI = true;
                    } catch (error) {
                        this.currentBrand.tagline = this.generateTaglineFallback(idea);
                        this.currentBrand.generatedWithAI = false;
                    }
                } else {
                    this.currentBrand.tagline = this.generateTaglineFallback(idea);
                    this.currentBrand.generatedWithAI = false;
                }
                break;
            case 'colors':
                this.currentBrand.colorPalette = this.generateSmartColorPalette(
                    this.currentBrand.industry, 
                    this.currentBrand.vibe
                );
                break;
            case 'logo':
                if (this.useAI && this.openaiApiKey) {
                    try {
                        const aiResult = await this.generateBrandWithAI(idea);
                        this.currentBrand.logo = await this.generateSmartLogo(
                            this.currentBrand.brandName, 
                            this.currentBrand.industry, 
                            this.currentBrand.vibe,
                            aiResult.logoDescription,
                            true
                        );
                        this.currentBrand.generatedWithAI = true;
                    } catch (error) {
                        this.currentBrand.logo = await this.generateSmartLogo(
                            this.currentBrand.brandName, 
                            this.currentBrand.industry, 
                            this.currentBrand.vibe,
                            null,
                            false
                        );
                        this.currentBrand.generatedWithAI = false;
                    }
                } else {
                    this.currentBrand.logo = await this.generateSmartLogo(
                        this.currentBrand.brandName, 
                        this.currentBrand.industry, 
                        this.currentBrand.vibe,
                        null,
                        false
                    );
                    this.currentBrand.generatedWithAI = false;
                }
                break;
        }

        return this.currentBrand;
    }

    // Helper methods
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// AI-Powered Brand generation with OpenAI integration
class BrandAgent {
    constructor(brandGenerator) {
        this.brandGenerator = brandGenerator;
        this.conversationHistory = [];
        this.currentContext = null;
        this.isActive = false;
    }

    // Initialize conversation with the user
    async startConsultation(initialIdea = null) {
        this.isActive = true;
        this.conversationHistory = [];
        
        const welcomeMessage = initialIdea 
            ? `Hi! I'm your AI Brand Consultant. I see you're interested in "${initialIdea}". I'd love to help you create the perfect brand identity! Let me ask you a few questions to understand your vision better.

What's the main problem your startup solves, and who is your target audience?`
            : `Hi! I'm your AI Brand Consultant. I'm here to help you create an amazing brand identity for your startup. 

Could you tell me about your business idea? What problem does it solve and who are your customers?`;

        this.conversationHistory.push({
            role: 'assistant',
            content: welcomeMessage,
            timestamp: Date.now()
        });

        return welcomeMessage;
    }

    // Process user input and provide intelligent responses
    async chat(userMessage) {
        if (!this.brandGenerator.openaiApiKey) {
            throw new Error('OpenAI API key required for AI Agent');
        }

        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage,
            timestamp: Date.now()
        });

        // Generate AI response based on conversation context
        const response = await this.generateAgentResponse(userMessage);
        
        // Add assistant response to history
        this.conversationHistory.push({
            role: 'assistant',
            content: response.message,
            timestamp: Date.now(),
            action: response.action || null,
            brandData: response.brandData || null
        });

        return response;
    }

    // Generate intelligent agent response using OpenAI
    async generateAgentResponse(userMessage) {
        const systemPrompt = `You are an expert AI Brand Consultant for BrandSnap.ai. Your role is to:

1. Guide users through creating their brand identity through conversation
2. Ask strategic questions about their business, target audience, and vision
3. Provide actionable branding advice and insights
4. Determine when you have enough information to generate a brand
5. Offer specific suggestions for brand names, taglines, and visual direction

Current conversation context: ${this.conversationHistory.length} messages
User's latest message: "${userMessage}"

Respond with a JSON object in this format:
{
  "message": "Your conversational response to the user (friendly, professional, helpful)",
  "action": "next_step|generate_brand|ask_questions|provide_advice|refine_brand",
  "readyToGenerate": boolean,
  "brandInsights": {
    "industry": "detected industry if clear",
    "targetAudience": "identified target audience if mentioned",
    "keyValues": ["identified brand values"],
    "competitivePosition": "market positioning insights if discussed"
  },
  "suggestedQuestions": ["follow-up questions if needed"]
}

Guidelines:
- Be conversational and engaging, not robotic
- Ask 1-2 strategic questions maximum per response
- Build on previous conversation context
- Provide specific, actionable advice
- Signal when ready to generate brand based on gathered information
- Offer alternatives and explain reasoning`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...this.conversationHistory.slice(-6), // Last 6 messages for context
            { role: 'user', content: userMessage }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.brandGenerator.openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 600,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate agent response');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            return JSON.parse(content);
        } catch (error) {
            // Fallback if JSON parsing fails
            return {
                message: content,
                action: 'ask_questions',
                readyToGenerate: false
            };
        }
    }

    // Generate brand based on conversation insights
    async generateBrandFromConversation() {
        // Extract key insights from conversation
        const insights = this.extractConversationInsights();
        
        // Create enhanced prompt based on conversation
        const enhancedIdea = this.buildEnhancedPrompt(insights);
        
        // Generate brand using existing method with enhanced context
        return await this.brandGenerator.generateBrandWithAI(enhancedIdea);
    }

    // Extract insights from conversation history
    extractConversationInsights() {
        const userMessages = this.conversationHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content)
            .join(' ');

        return {
            businessDescription: userMessages,
            keyTopics: this.extractKeyTopics(userMessages),
            conversationLength: this.conversationHistory.length
        };
    }

    // Build enhanced prompt from conversation
    buildEnhancedPrompt(insights) {
        return `Based on detailed conversation: ${insights.businessDescription}
        
Key insights gathered: ${insights.keyTopics.join(', ')}
Context: This brand was developed through ${insights.conversationLength} conversational exchanges with the user.`;
    }

    // Extract key topics and themes from conversation
    extractKeyTopics(text) {
        const keywords = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
        const frequency = {};
        
        keywords.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        return Object.entries(frequency)
            .filter(([word, count]) => count > 1)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word]) => word);
    }

    // Provide brand refinement suggestions
    async provideBrandFeedback(currentBrand, userFeedback) {
        if (!this.brandGenerator.openaiApiKey) {
            throw new Error('OpenAI API key required for brand feedback');
        }

        const prompt = `As an AI Brand Consultant, provide specific feedback and improvement suggestions for this brand:

Current Brand:
- Name: ${currentBrand.brandName}
- Tagline: ${currentBrand.tagline}
- Industry: ${currentBrand.industry}

User Feedback: "${userFeedback}"

Provide a JSON response with:
{
  "feedback": "specific analysis of the current brand",
  "suggestions": ["3-4 specific improvement suggestions"],
  "alternatives": {
    "names": ["2-3 alternative brand names"],
    "taglines": ["2-3 alternative taglines"]
  },
  "reasoning": "explanation of suggested changes"
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.brandGenerator.openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500,
                temperature: 0.8
            })
        });

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    }

    // Reset conversation
    reset() {
        this.conversationHistory = [];
        this.currentContext = null;
        this.isActive = false;
    }

    // Get conversation summary
    getConversationSummary() {
        return {
            messageCount: this.conversationHistory.length,
            duration: this.conversationHistory.length > 0 
                ? Date.now() - this.conversationHistory[0].timestamp 
                : 0,
            insights: this.extractConversationInsights()
        };
    }
}

// Main application
class BrandSnapApp {
    constructor() {
        this.brandGenerator = new BrandGenerator();
        this.brandAgent = new BrandAgent(this.brandGenerator);
        this.voiceAgent = new VoiceAgent(this.brandAgent);
        this.agentMode = false; // Toggle between quick generation and agent consultation
        this.voiceMode = false; // Voice consultation mode
        this.initializeEventListeners();
        this.initializeAPIKeyManagement();
        this.initializeAgentInterface();
        this.initializeVoiceInterface();
    }

    initializeEventListeners() {
        // Main generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateBrand();
        });

        // Enter key in textarea
        document.getElementById('startupIdea').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateBrand();
            }
        });

        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadResults();
        });

        // Regenerate buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('regenerate-btn') || e.target.parentElement.classList.contains('regenerate-btn')) {
                const button = e.target.classList.contains('regenerate-btn') ? e.target : e.target.parentElement;
                const type = button.getAttribute('data-type');
                this.regenerateComponent(type);
            }
        });
    }

    initializeAPIKeyManagement() {
        // Create settings button in header
        this.createSettingsButton();
        
        // Create settings modal
        this.createSettingsModal();
        
        // Update UI based on API key status
        this.updateAPIKeyStatus();
    }

    createSettingsButton() {
        const settingsContainer = document.querySelector('.settings-container');
        const settingsBtn = document.createElement('button');
        settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
        settingsBtn.className = 'settings-btn';
        settingsBtn.title = 'AI Settings';
        settingsBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 8px;
            color: white;
            padding: 8px 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 16px;
        `;
        
        settingsBtn.addEventListener('click', () => {
            this.showSettingsModal();
        });
        
        settingsBtn.addEventListener('mouseenter', () => {
            settingsBtn.style.background = 'rgba(255, 255, 255, 0.3)';
            settingsBtn.style.transform = 'translateY(-2px)';
        });
        
        settingsBtn.addEventListener('mouseleave', () => {
            settingsBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            settingsBtn.style.transform = 'translateY(0)';
        });
        
        settingsContainer.appendChild(settingsBtn);
    }

    createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'settingsModal';
        modal.className = 'settings-modal hidden';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-robot"></i> AI Settings</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="ai-status">
                        <div class="status-indicator">
                            <span class="status-dot"></span>
                            <span class="status-text">AI Status: Checking...</span>
                        </div>
                    </div>
                    
                    <div class="api-key-section">
                        <label for="apiKeyInput">OpenAI API Key:</label>
                        <div class="input-group">
                            <input type="password" id="apiKeyInput" placeholder="sk-..." />
                            <button id="toggleApiKey" type="button">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <small class="help-text">
                            Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a>
                        </small>
                    </div>
                    
                    <div class="modal-actions">
                        <button id="saveApiKey" class="save-btn">Save & Enable AI</button>
                        <button id="removeApiKey" class="remove-btn">Remove Key</button>
                        <button id="testApiKey" class="test-btn">Test Connection</button>
                    </div>
                    
                    <div class="ai-info">
                        <h4>AI vs Algorithmic Generation</h4>
                        <div class="comparison">
                            <div class="method">
                                <h5><i class="fas fa-robot"></i> AI-Powered</h5>
                                <ul>
                                    <li>More creative and contextual</li>
                                    <li>Industry-aware suggestions</li>
                                    <li>Better understanding of nuances</li>
                                    <li>Requires OpenAI API key</li>
                                </ul>
                            </div>
                            <div class="method">
                                <h5><i class="fas fa-cogs"></i> Algorithmic</h5>
                                <ul>
                                    <li>Fast and reliable</li>
                                    <li>No API costs</li>
                                    <li>Works offline</li>
                                    <li>Pattern-based generation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.hideSettingsModal();
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            this.hideSettingsModal();
        });
        
        modal.querySelector('#toggleApiKey').addEventListener('click', () => {
            this.toggleApiKeyVisibility();
        });
        
        modal.querySelector('#saveApiKey').addEventListener('click', () => {
            this.saveApiKey();
        });
        
        modal.querySelector('#removeApiKey').addEventListener('click', () => {
            this.removeApiKey();
        });
        
        modal.querySelector('#testApiKey').addEventListener('click', () => {
            this.testApiKey();
        });
    }

    showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        const apiKeyInput = document.getElementById('apiKeyInput');
        
        // Load current API key
        const currentKey = this.brandGenerator.getStoredApiKey();
        if (currentKey) {
            apiKeyInput.value = currentKey;
        }
        
        modal.classList.remove('hidden');
        this.updateAPIKeyStatus();
    }

    hideSettingsModal() {
        const modal = document.getElementById('settingsModal');
        modal.classList.add('hidden');
    }

    toggleApiKeyVisibility() {
        const input = document.getElementById('apiKeyInput');
        const button = document.getElementById('toggleApiKey');
        
        if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            button.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        
        if (!apiKey) {
            this.showError('Please enter an API key');
            return;
        }
        
        if (!apiKey.startsWith('sk-')) {
            this.showError('Invalid API key format. Should start with "sk-"');
            return;
        }
        
        this.brandGenerator.setApiKey(apiKey);
        this.updateAPIKeyStatus();
        this.updateVoiceAvailability();
        this.showSuccess('API key saved! AI generation and voice features are now enabled.');
    }

    removeApiKey() {
        this.brandGenerator.setApiKey(null);
        document.getElementById('apiKeyInput').value = '';
        this.updateAPIKeyStatus();
        this.updateVoiceAvailability();
        this.showSuccess('API key removed. Using algorithmic generation.');
    }

    async testApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        
        if (!apiKey) {
            this.showError('Please enter an API key first');
            return;
        }
        
        const testBtn = document.getElementById('testApiKey');
        const originalText = testBtn.innerHTML;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        testBtn.disabled = true;
        
        try {
            // Test with a simple request
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "user",
                        content: "Say 'API test successful' if you can read this."
                    }],
                    max_tokens: 10
                })
            });
            
            if (response.ok) {
                this.showSuccess('API key is valid! Connection successful.');
            } else {
                const errorData = await response.json();
                this.showError(`API Error: ${errorData.error?.message || 'Invalid API key'}`);
            }
        } catch (error) {
            this.showError('Connection failed. Please check your API key and internet connection.');
        } finally {
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
        }
    }

    updateAPIKeyStatus() {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        const generateBtn = document.getElementById('generateBtn');
        
        if (!statusDot || !statusText) return;
        
        if (this.brandGenerator.useAI) {
            statusDot.style.background = '#27ae60';
            statusText.textContent = 'AI Status: Enabled (OpenAI GPT)';
            generateBtn.innerHTML = '<i class="fas fa-robot"></i> Generate Brand with AI';
        } else {
            statusDot.style.background = '#f39c12';
            statusText.textContent = 'AI Status: Disabled (Algorithmic Mode)';
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Brand';
        }
    }

    async generateBrand() {
        const idea = document.getElementById('startupIdea').value.trim();
        
        if (!idea) {
            this.showError('Please enter your startup idea first!');
            return;
        }

        this.showLoading(true);

        // Show different loading messages based on AI status
        const loadingText = document.querySelector('.loading-content p');
        if (this.brandGenerator.useAI) {
            loadingText.textContent = 'AI is analyzing your idea and creating your brand...';
        } else {
            loadingText.textContent = 'Generating your brand identity...';
        }

        try {
            const brand = await this.brandGenerator.generateBrand(idea);
            this.displayResults(brand);
            this.showLoading(false);
            this.scrollToResults();
        } catch (error) {
            console.error('Brand generation error:', error);
            this.showError(`Generation failed: ${error.message || 'Unknown error'}. Check console for details.`);
            this.showLoading(false);
        }
    }

    async regenerateComponent(type) {
        const idea = document.getElementById('startupIdea').value.trim();
        
        if (!idea || !this.brandGenerator.currentBrand) {
            this.showError('Please generate a brand first!');
            return;
        }

        // Show mini loading for the specific component
        this.showComponentLoading(type, true);

        try {
            const brand = await this.brandGenerator.regenerateComponent(type, idea);
            this.updateComponent(type, brand);
            this.showComponentLoading(type, false);
        } catch (error) {
            this.showError('Failed to regenerate. Please try again!');
            this.showComponentLoading(type, false);
        }
    }

    displayResults(brand) {
        // Update brand name
        document.getElementById('brandName').textContent = brand.brandName;

        // Update tagline
        document.getElementById('tagline').textContent = brand.tagline;

        // Update logo
        this.displayLogo(brand.logo);

        // Update color palette
        this.displayColorPalette(brand.colorPalette);

        // Show AI indicator if generated with AI
        this.showAIIndicator(brand.generatedWithAI);

        // Show results section
        const resultsSection = document.getElementById('results');
        resultsSection.classList.remove('hidden');
    }

    displayLogo(logo) {
        const logoElement = document.getElementById('logoPlaceholder');
        
        if (logo.type === 'image' && logo.imageUrl) {
            // Display AI-generated image logo
            logoElement.innerHTML = `
                <div class="logo-image-container">
                    <img src="${logo.imageUrl}" alt="${logo.text} logo" class="logo-image" />
                    <div class="logo-ai-badge">
                        <i class="fas fa-robot"></i> AI Generated
                    </div>
                </div>
                <span class="logo-text">${logo.text}</span>
            `;
            logoElement.style.background = 'linear-gradient(135deg, #f8f9fa, #e9ecef)';
            logoElement.classList.add('image-logo');
        } else {
            // Display icon-based logo (fallback)
            logoElement.innerHTML = `
                <i class="${logo.icon}"></i>
                <span>${logo.text}</span>
            `;
            logoElement.style.background = logo.gradient;
            logoElement.classList.remove('image-logo');
        }
    }

    showAIIndicator(generatedWithAI) {
        // Remove existing indicator
        const existingIndicator = document.querySelector('.ai-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Add new indicator
        const resultsHeader = document.querySelector('.results-header');
        const indicator = document.createElement('div');
        indicator.className = 'ai-indicator';
        indicator.innerHTML = generatedWithAI 
            ? '<i class="fas fa-robot"></i> Generated with AI'
            : '<i class="fas fa-cogs"></i> Algorithmic Generation';
        indicator.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: ${generatedWithAI ? '#27ae60' : '#f39c12'};
            color: white;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
        `;
        
        resultsHeader.appendChild(indicator);
    }

    updateComponent(type, brand) {
        switch (type) {
            case 'name':
                document.getElementById('brandName').textContent = brand.brandName;
                // Also update logo text
                this.displayLogo(brand.logo);
                break;
            case 'tagline':
                document.getElementById('tagline').textContent = brand.tagline;
                break;
            case 'colors':
                this.displayColorPalette(brand.colorPalette);
                break;
            case 'logo':
                this.displayLogo(brand.logo);
                break;
        }
        
        // Update AI indicator
        this.showAIIndicator(brand.generatedWithAI);
    }

    displayColorPalette(palette) {
        const paletteElement = document.getElementById('colorPalette');
        paletteElement.innerHTML = palette.colors.map(color => `
            <div class="color-swatch" 
                 style="background-color: ${color}" 
                 data-color="${color}"
                 title="Click to copy ${color}"
                 onclick="navigator.clipboard.writeText('${color}'); this.style.transform='scale(1.2)'; setTimeout(() => this.style.transform='scale(1)', 200);">
            </div>
        `).join('');
    }

    showComponentLoading(type, show) {
        const button = document.querySelector(`[data-type="${type}"]`);
        if (show) {
            if (type === 'logo' && this.brandGenerator.useAI) {
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating AI Logo...';
                // Add loading shimmer to logo placeholder
                const logoElement = document.getElementById('logoPlaceholder');
                logoElement.classList.add('loading');
            } else {
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            }
            button.disabled = true;
        } else {
            const icons = {
                'name': 'fas fa-redo',
                'tagline': 'fas fa-redo', 
                'colors': 'fas fa-redo',
                'logo': 'fas fa-redo'
            };
            const labels = {
                'name': 'Regenerate',
                'tagline': 'Regenerate',
                'colors': 'New Palette', 
                'logo': 'New Style'
            };
            button.innerHTML = `<i class="${icons[type]}"></i> ${labels[type]}`;
            button.disabled = false;
            
            // Remove loading shimmer from logo placeholder
            if (type === 'logo') {
                const logoElement = document.getElementById('logoPlaceholder');
                logoElement.classList.remove('loading');
            }
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            error: '#e74c3c',
            success: '#27ae60',
            info: '#3498db'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            max-width: 300px;
            word-wrap: break-word;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    scrollToResults() {
        document.getElementById('results').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    downloadResults() {
        if (!this.brandGenerator.currentBrand) {
            this.showError('No brand data to download!');
            return;
        }

        const brand = this.brandGenerator.currentBrand;
        
        // Create downloadable data
        const data = {
            brandName: brand.brandName,
            tagline: brand.tagline,
            colorPalette: {
                name: brand.colorPalette.name,
                colors: brand.colorPalette.colors
            },
            logo: {
                icon: brand.logo.icon,
                style: brand.logo.gradient
            },
            originalIdea: brand.idea,
            industry: brand.industry,
            vibe: brand.vibe,
            reasoning: brand.reasoning,
            generatedWithAI: brand.generatedWithAI,
            generatedAt: brand.timestamp
        };

        // Create text version
        const textContent = `
BRAND IDENTITY PACKAGE
Generated by BrandSnap.ai
${new Date().toLocaleDateString()}

BRAND NAME: ${brand.brandName}

TAGLINE: ${brand.tagline}

INDUSTRY: ${brand.industry}
BRAND VIBE: ${brand.vibe}

COLOR PALETTE: ${brand.colorPalette.name}
${brand.colorPalette.colors.map((color, index) => `Color ${index + 1}: ${color}`).join('\n')}

LOGO CONCEPT: ${brand.logo.icon.replace('fas fa-', '').replace('-', ' ')} icon
Background: Gradient design

GENERATION METHOD: ${brand.generatedWithAI ? 'AI-Powered (OpenAI GPT)' : 'Algorithmic'}
${brand.reasoning ? `REASONING: ${brand.reasoning}` : ''}

ORIGINAL IDEA: ${brand.idea}

---
Generated with ❤️ by BrandSnap.ai
        `.trim();

        // Download JSON
        this.downloadFile(`${brand.brandName}_brand_package.json`, JSON.stringify(data, null, 2), 'application/json');
        
        // Download text version
        setTimeout(() => {
            this.downloadFile(`${brand.brandName}_brand_package.txt`, textContent, 'text/plain');
        }, 500);

        this.showSuccess('Brand package downloaded successfully!');
    }

    downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    initializeAgentInterface() {
        // Create agent toggle button
        this.createAgentToggle();
        // Create agent chat interface
        this.createAgentChatInterface();
        // Initialize agent event listeners
        this.initializeAgentEventListeners();
    }

    createAgentToggle() {
        const settingsContainer = document.querySelector('.settings-container');
        const agentToggle = document.createElement('div');
        agentToggle.className = 'agent-toggle';
        agentToggle.innerHTML = `
            <button id="agent-mode-btn" class="agent-mode-btn" title="Switch to AI Consultant Mode">
                <i class="fas fa-robot"></i>
                <span>AI Consultant</span>
            </button>
        `;
        settingsContainer.appendChild(agentToggle);
    }

    createAgentChatInterface() {
        const container = document.querySelector('.container');
        const agentInterface = document.createElement('div');
        agentInterface.id = 'agent-interface';
        agentInterface.className = 'agent-interface hidden';
        agentInterface.innerHTML = `
            <div class="agent-header">
                <div class="agent-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="agent-info">
                    <h3>AI Brand Consultant</h3>
                    <p>Chat or speak to create your perfect brand</p>
                </div>
                <div class="voice-controls">
                    <button class="voice-control voice-settings-btn" id="voice-settings-btn" title="Voice Settings">
                        <i class="fas fa-microphone-alt"></i>
                    </button>
                </div>
                <button class="close-agent-btn" id="close-agent-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="agent-chat" id="agent-chat">
                <div class="chat-messages" id="chat-messages"></div>
                <div class="chat-input-container">
                    <div class="chat-input-wrapper">
                        <input type="text" id="agent-input" placeholder="Type or hold mic to speak..." maxlength="500">
                        <button id="voice-record-btn" class="voice-control voice-record-btn" title="Hold to record voice">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <button id="send-message-btn" class="send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="voice-status" id="voice-status">
                        <div class="voice-indicator">
                            <span class="voice-dot"></span>
                            <span class="voice-text">Voice ready</span>
                        </div>
                        <div class="audio-controls">
                            <button id="stop-audio-btn" class="audio-control-btn hidden" title="Stop audio">
                                <i class="fas fa-stop"></i>
                            </button>
                            <button id="toggle-autoplay-btn" class="audio-control-btn voice-control" title="Toggle auto-play responses">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chat-actions">
                        <button id="generate-from-chat-btn" class="generate-chat-btn hidden">
                            <i class="fas fa-magic"></i> Generate Brand
                        </button>
                        <button id="voice-generate-btn" class="voice-generate-btn hidden voice-control">
                            <i class="fas fa-microphone"></i> Say "Generate my brand"
                        </button>
                        <button id="reset-chat-btn" class="reset-chat-btn">
                            <i class="fas fa-refresh"></i> New Consultation
                        </button>
                    </div>
                </div>
            </div>

            <!-- Voice Settings Modal -->
            <div id="voice-settings-modal" class="voice-settings-modal hidden">
                <div class="modal-overlay"></div>
                <div class="voice-modal-content">
                    <div class="voice-modal-header">
                        <h3><i class="fas fa-microphone-alt"></i> Voice Settings</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="voice-modal-body">
                        <div class="voice-section">
                            <label>AI Voice:</label>
                            <select id="voice-selector" class="voice-selector">
                                <option value="alloy">Alloy (Neutral)</option>
                                <option value="echo">Echo (Male)</option>
                                <option value="fable">Fable (British)</option>
                                <option value="onyx">Onyx (Deep)</option>
                                <option value="nova">Nova (Female)</option>
                                <option value="shimmer">Shimmer (Bright)</option>
                            </select>
                        </div>
                        <div class="voice-section">
                            <label>
                                <input type="checkbox" id="autoplay-toggle" checked>
                                Auto-play AI responses
                            </label>
                        </div>
                        <div class="voice-section">
                            <button id="test-voice-btn" class="test-voice-btn voice-control">
                                <i class="fas fa-play"></i> Test Voice
                            </button>
                            <button id="init-voice-btn" class="init-voice-btn voice-control">
                                <i class="fas fa-microphone"></i> Enable Microphone
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert before the main generator section
        const generatorSection = document.querySelector('.generator-section');
        container.insertBefore(agentInterface, generatorSection);
    }

    initializeAgentEventListeners() {
        // Agent mode toggle
        document.getElementById('agent-mode-btn').addEventListener('click', () => {
            this.toggleAgentMode();
        });

        // Close agent interface
        document.getElementById('close-agent-btn').addEventListener('click', () => {
            this.toggleAgentMode(false);
        });

        // Send message
        document.getElementById('send-message-btn').addEventListener('click', () => {
            this.sendAgentMessage();
        });

        // Enter key to send message
        document.getElementById('agent-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendAgentMessage();
            }
        });

        // Generate brand from conversation
        document.getElementById('generate-from-chat-btn').addEventListener('click', () => {
            this.generateBrandFromAgent();
        });

        // Reset conversation
        document.getElementById('reset-chat-btn').addEventListener('click', () => {
            this.resetAgentConversation();
        });

        // Voice Controls
        this.initializeVoiceEventListeners();
    }

    initializeVoiceEventListeners() {
        // Voice settings button
        document.getElementById('voice-settings-btn').addEventListener('click', () => {
            this.showVoiceSettings();
        });

        // Voice record button (hold to record)
        const recordBtn = document.getElementById('voice-record-btn');
        let recordTimeout;

        recordBtn.addEventListener('mousedown', async () => {
            if (!this.brandGenerator.openaiApiKey) {
                this.showError('OpenAI API key required for voice features');
                return;
            }
            await this.startVoiceRecording();
        });

        recordBtn.addEventListener('mouseup', () => {
            this.stopVoiceRecording();
        });

        recordBtn.addEventListener('mouseleave', () => {
            this.stopVoiceRecording();
        });

        // Touch events for mobile
        recordBtn.addEventListener('touchstart', async (e) => {
            e.preventDefault();
            if (!this.brandGenerator.openaiApiKey) {
                this.showError('OpenAI API key required for voice features');
                return;
            }
            await this.startVoiceRecording();
        });

        recordBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopVoiceRecording();
        });

        // Voice settings modal
        document.getElementById('voice-settings-modal').querySelector('.modal-close').addEventListener('click', () => {
            this.hideVoiceSettings();
        });

        document.getElementById('voice-settings-modal').querySelector('.modal-overlay').addEventListener('click', () => {
            this.hideVoiceSettings();
        });

        // Voice selector
        document.getElementById('voice-selector').addEventListener('change', (e) => {
            this.voiceAgent.setVoice(e.target.value);
        });

        // Auto-play toggle
        document.getElementById('autoplay-toggle').addEventListener('change', (e) => {
            this.voiceAgent.toggleAutoPlay();
        });

        // Stop audio button
        document.getElementById('stop-audio-btn').addEventListener('click', () => {
            this.voiceAgent.stopAudio();
            this.updateVoiceStatus();
        });

        // Toggle auto-play button
        document.getElementById('toggle-autoplay-btn').addEventListener('click', () => {
            const autoPlay = this.voiceAgent.toggleAutoPlay();
            const btn = document.getElementById('toggle-autoplay-btn');
            btn.innerHTML = autoPlay ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
            btn.title = autoPlay ? 'Auto-play enabled' : 'Auto-play disabled';
        });

        // Test voice button
        document.getElementById('test-voice-btn').addEventListener('click', async () => {
            await this.testVoice();
        });

        // Initialize voice button
        document.getElementById('init-voice-btn').addEventListener('click', async () => {
            await this.initializeVoice();
        });

        // Voice generate button (for voice-specific generation)
        document.getElementById('voice-generate-btn').addEventListener('click', async () => {
            const testMessage = "Generate my brand based on our conversation";
            await this.processVoiceCommand(testMessage);
        });
    }

    async startVoiceRecording() {
        try {
            // Initialize voice if not already done
            if (!this.voiceAgent.voiceEnabled) {
                const initialized = await this.voiceAgent.initializeVoice();
                if (!initialized) {
                    this.showError('Could not initialize voice recording');
                    return;
                }
            }

            const started = await this.voiceAgent.startRecording();
            if (started) {
                this.updateVoiceStatus('recording');
                this.showVoiceRecordingIndicator(true);
            }
        } catch (error) {
            console.error('Voice recording error:', error);
            this.showError('Voice recording failed: ' + error.message);
        }
    }

    async stopVoiceRecording() {
        try {
            const stopped = this.voiceAgent.stopRecording();
            if (stopped) {
                this.updateVoiceStatus('processing');
                this.showVoiceRecordingIndicator(false);
                
                // Processing will be handled by the VoiceAgent's processVoiceInput
                // which will call our voice response handler
            }
        } catch (error) {
            console.error('Voice stop error:', error);
            this.updateVoiceStatus('ready');
        }
    }

    async processVoiceCommand(transcription) {
        // Check for generation command
        const generationKeywords = ['generate', 'create', 'make', 'build', 'design'];
        const brandKeywords = ['brand', 'logo', 'identity', 'company', 'business'];
        
        const hasGenerationKeyword = generationKeywords.some(keyword => 
            transcription.toLowerCase().includes(keyword)
        );
        const hasBrandKeyword = brandKeywords.some(keyword => 
            transcription.toLowerCase().includes(keyword)
        );

        if (hasGenerationKeyword && hasBrandKeyword) {
            // User wants to generate the brand
            await this.generateBrandFromAgent(true); // true = voice-initiated
            return;
        }

        // Regular conversation
        return await this.brandAgent.chat(transcription);
    }

    showVoiceRecordingIndicator(show) {
        const recordBtn = document.getElementById('voice-record-btn');
        const voiceStatus = document.getElementById('voice-status');
        
        if (show) {
            recordBtn.classList.add('recording');
            voiceStatus.classList.add('recording');
        } else {
            recordBtn.classList.remove('recording');
            voiceStatus.classList.remove('recording');
        }
    }

    updateVoiceStatus(status = 'ready') {
        const voiceDot = document.querySelector('.voice-dot');
        const voiceText = document.querySelector('.voice-text');
        const stopBtn = document.getElementById('stop-audio-btn');
        
        switch (status) {
            case 'recording':
                voiceDot.className = 'voice-dot recording';
                voiceText.textContent = 'Listening...';
                break;
            case 'processing':
                voiceDot.className = 'voice-dot processing';
                voiceText.textContent = 'Processing speech...';
                break;
            case 'playing':
                voiceDot.className = 'voice-dot playing';
                voiceText.textContent = 'AI speaking...';
                stopBtn.classList.remove('hidden');
                break;
            case 'ready':
            default:
                voiceDot.className = 'voice-dot ready';
                voiceText.textContent = 'Voice ready';
                stopBtn.classList.add('hidden');
                break;
        }
    }

    showVoiceSettings() {
        document.getElementById('voice-settings-modal').classList.remove('hidden');
    }

    hideVoiceSettings() {
        document.getElementById('voice-settings-modal').classList.add('hidden');
    }

    async testVoice() {
        const testMessage = "Hello! I'm your AI Brand Consultant. I'm ready to help you create an amazing brand identity through conversation.";
        await this.voiceAgent.speakText(testMessage);
    }

    async initializeVoice() {
        const initialized = await this.voiceAgent.initializeVoice();
        if (initialized) {
            this.showSuccess('Voice recording enabled! You can now use voice commands.');
            this.updateVoiceAvailability();
        } else {
            this.showError('Could not enable voice recording. Please check microphone permissions.');
        }
    }

    async generateBrandFromAgent(voiceInitiated = false) {
        if (!this.brandAgent.isActive) {
            this.showError('No active conversation to generate from');
            return;
        }

        // Show loading state
        this.showLoading(true);
        
        // Update voice status if voice-initiated
        if (voiceInitiated) {
            this.updateVoiceStatus('processing');
        }

        try {
            // Generate the brand from conversation
            const brand = await this.brandAgent.generateBrandFromConversation();
            
            // Update the current brand in generator
            this.brandGenerator.currentBrand = brand;
            
            // Display the visual results
            this.displayResults(brand);
            this.scrollToResults();
            
            // Prepare response message
            const successMessage = voiceInitiated 
                ? `Perfect! I've created your brand identity based on our conversation. Your brand name is ${brand.brandName} with the tagline "${brand.tagline}". Check out the complete brand package below with your logo, colors, and all the details!`
                : `Perfect! I've generated your brand identity based on our conversation. Check it out below! 🎉`;
            
            // Add success message to chat
            this.addChatMessage('assistant', successMessage);
            
            // Speak the success message if voice-initiated
            if (voiceInitiated && this.voiceAgent.autoPlayResponses) {
                await this.voiceAgent.speakText(successMessage);
            }
            
            // Hide generate buttons and show completion state
            document.getElementById('generate-from-chat-btn').classList.add('hidden');
            document.getElementById('voice-generate-btn').classList.add('hidden');
            
            // Add a celebration message
            setTimeout(() => {
                this.addChatMessage('assistant', 'Your brand is ready! You can download the complete brand package or ask me any questions about your new brand identity. 🎨✨');
            }, 2000);
            
        } catch (error) {
            console.error('Failed to generate brand from agent:', error);
            this.showError('Failed to generate brand. Please try again.');
            
            if (voiceInitiated) {
                await this.voiceAgent.speakText("I'm sorry, I had trouble generating your brand. Please try again or check your connection.");
            }
        } finally {
            this.showLoading(false);
            this.updateVoiceStatus('ready');
        }
    }

    async toggleAgentMode(force = null) {
        this.agentMode = force !== null ? force : !this.agentMode;
        
        const agentInterface = document.getElementById('agent-interface');
        const generatorSection = document.querySelector('.generator-section');
        const agentBtn = document.getElementById('agent-mode-btn');

        if (this.agentMode) {
            // Switch to agent mode
            agentInterface.classList.remove('hidden');
            generatorSection.classList.add('hidden');
            agentBtn.classList.add('active');
            
            // Initialize voice interface
            this.updateVoiceAvailability();
            
            // Start consultation if not already started
            if (!this.brandAgent.isActive) {
                await this.startAgentConsultation();
            }
        } else {
            // Switch to quick generation mode
            agentInterface.classList.add('hidden');
            generatorSection.classList.remove('hidden');
            agentBtn.classList.remove('active');
            
            // Stop any ongoing voice activities
            this.voiceAgent.stopAudio();
            this.voiceAgent.stopRecording();
        }
    }

    async startAgentConsultation() {
        if (!this.brandGenerator.openaiApiKey) {
            this.showError('OpenAI API key required for AI Consultant. Please set it in settings.');
            this.toggleAgentMode(false);
            return;
        }

        try {
            const welcomeMessage = await this.brandAgent.startConsultation();
            this.addChatMessage('assistant', welcomeMessage);
            
            // Auto-speak welcome message if voice is enabled
            if (this.voiceAgent.voiceEnabled && this.voiceAgent.autoPlayResponses) {
                await this.voiceAgent.speakText(welcomeMessage);
            }
        } catch (error) {
            console.error('Failed to start agent consultation:', error);
            this.showError('Failed to start AI consultation. Please try again.');
        }
    }

    async sendAgentMessage() {
        const input = document.getElementById('agent-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addChatMessage('user', message);
        input.value = '';

        // Show typing indicator
        this.showAgentTyping(true);

        try {
            const response = await this.brandAgent.chat(message);
            
            // Hide typing indicator
            this.showAgentTyping(false);
            
            // Add agent response
            this.addChatMessage('assistant', response.message);
            
            // Auto-speak response if voice enabled
            if (this.voiceAgent.autoPlayResponses) {
                this.updateVoiceStatus('playing');
                await this.voiceAgent.speakText(response.message);
                this.updateVoiceStatus('ready');
            }
            
            // Show generate button if ready
            if (response.readyToGenerate) {
                document.getElementById('generate-from-chat-btn').classList.remove('hidden');
                document.getElementById('voice-generate-btn').classList.remove('hidden');
            }
            
        } catch (error) {
            this.showAgentTyping(false);
            console.error('Agent chat error:', error);
            this.addChatMessage('assistant', "I apologize, but I'm having trouble responding right now. Please try again or use the quick generation mode.");
        }
    }

    addChatMessage(role, content) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}-message`;
        
        const avatar = role === 'assistant' 
            ? '<div class="message-avatar"><i class="fas fa-robot"></i></div>'
            : '<div class="message-avatar"><i class="fas fa-user"></i></div>';
        
        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">${content}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showAgentTyping(show) {
        const chatMessages = document.getElementById('chat-messages');
        const existingTyping = chatMessages.querySelector('.typing-indicator');
        
        if (show && !existingTyping) {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message assistant-message typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-avatar"><i class="fas fa-robot"></i></div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else if (!show && existingTyping) {
            existingTyping.remove();
        }
    }

    resetAgentConversation() {
        this.brandAgent.reset();
        this.voiceAgent.stopAudio();
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('generate-from-chat-btn').classList.add('hidden');
        document.getElementById('voice-generate-btn').classList.add('hidden');
        this.startAgentConsultation();
    }

    // Update API key methods to include voice availability
    saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        
        if (!apiKey) {
            this.showError('Please enter an API key');
            return;
        }
        
        if (!apiKey.startsWith('sk-')) {
            this.showError('Invalid API key format. Should start with "sk-"');
            return;
        }
        
        this.brandGenerator.setApiKey(apiKey);
        this.updateAPIKeyStatus();
        this.updateVoiceAvailability();
        this.showSuccess('API key saved! AI generation and voice features are now enabled.');
    }

    removeApiKey() {
        this.brandGenerator.setApiKey(null);
        document.getElementById('apiKeyInput').value = '';
        this.updateAPIKeyStatus();
        this.updateVoiceAvailability();
        this.showSuccess('API key removed. Using algorithmic generation.');
    }

    async initializeVoiceInterface() {
        // Initialize voice capabilities when API key is available
        this.updateVoiceAvailability();
    }

    updateVoiceAvailability() {
        const hasApiKey = !!this.brandGenerator.openaiApiKey;
        const voiceControls = document.querySelectorAll('.voice-control');
        
        voiceControls.forEach(control => {
            if (hasApiKey) {
                control.classList.remove('disabled');
                control.title = 'Voice features available';
            } else {
                control.classList.add('disabled');
                control.title = 'Requires OpenAI API key';
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.brandSnapApp = new BrandSnapApp();
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
});

// Voice Agent for OpenAI Whisper + TTS integration
class VoiceAgent {
    constructor(brandAgent) {
        this.brandAgent = brandAgent;
        this.isRecording = false;
        this.isPlaying = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.currentAudio = null;
        this.voiceEnabled = false;
        this.autoPlayResponses = true;
        this.selectedVoice = 'alloy'; // Default OpenAI TTS voice
        
        this.voices = [
            { id: 'alloy', name: 'Alloy (Neutral)', description: 'Balanced and professional' },
            { id: 'echo', name: 'Echo (Male)', description: 'Clear and friendly male voice' },
            { id: 'fable', name: 'Fable (British)', description: 'Sophisticated British accent' },
            { id: 'onyx', name: 'Onyx (Deep)', description: 'Deep and authoritative' },
            { id: 'nova', name: 'Nova (Female)', description: 'Warm and engaging female voice' },
            { id: 'shimmer', name: 'Shimmer (Bright)', description: 'Energetic and upbeat' }
        ];
    }

    // Initialize voice capabilities
    async initializeVoice() {
        try {
            // Check if browser supports required APIs
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Voice recording not supported in this browser');
            }

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });
            
            // Stop the stream immediately (we just needed permission)
            stream.getTracks().forEach(track => track.stop());
            
            this.voiceEnabled = true;
            console.log('Voice agent initialized successfully');
            return true;
        } catch (error) {
            console.error('Voice initialization failed:', error);
            this.voiceEnabled = false;
            return false;
        }
    }

    // Start recording user voice
    async startRecording() {
        if (!this.voiceEnabled || this.isRecording) return false;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });

            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                await this.processVoiceInput(audioBlob);
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            return true;
        } catch (error) {
            console.error('Recording failed:', error);
            return false;
        }
    }

    // Stop recording
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            return true;
        }
        return false;
    }

    // Process voice input using OpenAI Whisper
    async processVoiceInput(audioBlob) {
        if (!this.brandAgent.brandGenerator.openaiApiKey) {
            throw new Error('OpenAI API key required for voice processing');
        }

        try {
            // Convert to proper format for Whisper
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-1');
            formData.append('language', 'en');

            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.brandAgent.brandGenerator.openaiApiKey}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Speech recognition failed');
            }

            const data = await response.json();
            const transcription = data.text.trim();
            
            if (transcription) {
                // Get the app instance to handle the response
                const app = window.brandSnapApp;
                
                // Add user message to chat
                app.addChatMessage('user', transcription);
                
                // Check for generation commands
                const generationKeywords = ['generate', 'create', 'make', 'build', 'design'];
                const brandKeywords = ['brand', 'logo', 'identity', 'company', 'business'];
                
                const hasGenerationKeyword = generationKeywords.some(keyword => 
                    transcription.toLowerCase().includes(keyword)
                );
                const hasBrandKeyword = brandKeywords.some(keyword => 
                    transcription.toLowerCase().includes(keyword)
                );

                if (hasGenerationKeyword && hasBrandKeyword) {
                    // User wants to generate the brand
                    await app.generateBrandFromAgent(true); // true = voice-initiated
                    return;
                }
                
                // Show typing indicator
                app.showAgentTyping(true);
                
                // Send transcription to brand agent and get response
                const agentResponse = await this.brandAgent.chat(transcription);
                
                // Hide typing indicator
                app.showAgentTyping(false);
                
                // Add agent response to chat
                app.addChatMessage('assistant', agentResponse.message);
                
                // Auto-play AI response if enabled
                if (this.autoPlayResponses && agentResponse.message) {
                    app.updateVoiceStatus('playing');
                    await this.speakText(agentResponse.message);
                    app.updateVoiceStatus('ready');
                }
                
                // Show generate buttons if ready
                if (agentResponse.readyToGenerate) {
                    document.getElementById('generate-from-chat-btn').classList.remove('hidden');
                    document.getElementById('voice-generate-btn').classList.remove('hidden');
                }
                
                return {
                    transcription,
                    response: agentResponse
                };
            } else {
                throw new Error('No speech detected');
            }
        } catch (error) {
            console.error('Voice processing error:', error);
            // Get the app instance to show error
            const app = window.brandSnapApp;
            app.updateVoiceStatus('ready');
            app.showError('Voice processing failed: ' + error.message);
            throw error;
        }
    }

    // Convert text to speech using OpenAI TTS
    async speakText(text) {
        if (!this.brandAgent.brandGenerator.openaiApiKey || this.isPlaying) {
            return false;
        }

        try {
            this.isPlaying = true;

            const response = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.brandAgent.brandGenerator.openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'tts-1',
                    input: text,
                    voice: this.selectedVoice,
                    response_format: 'mp3',
                    speed: 1.0
                })
            });

            if (!response.ok) {
                throw new Error('Text-to-speech failed');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Stop any currently playing audio
            this.stopAudio();
            
            this.currentAudio = new Audio(audioUrl);
            this.currentAudio.onended = () => {
                this.isPlaying = false;
                URL.revokeObjectURL(audioUrl);
            };
            
            this.currentAudio.onerror = () => {
                this.isPlaying = false;
                URL.revokeObjectURL(audioUrl);
            };

            await this.currentAudio.play();
            return true;
        } catch (error) {
            console.error('Text-to-speech error:', error);
            this.isPlaying = false;
            return false;
        }
    }

    // Stop current audio playback
    stopAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.isPlaying = false;
        }
    }

    // Set TTS voice
    setVoice(voiceId) {
        if (this.voices.find(v => v.id === voiceId)) {
            this.selectedVoice = voiceId;
            return true;
        }
        return false;
    }

    // Toggle auto-play responses
    toggleAutoPlay() {
        this.autoPlayResponses = !this.autoPlayResponses;
        return this.autoPlayResponses;
    }

    // Get voice status
    getStatus() {
        return {
            voiceEnabled: this.voiceEnabled,
            isRecording: this.isRecording,
            isPlaying: this.isPlaying,
            selectedVoice: this.selectedVoice,
            autoPlayResponses: this.autoPlayResponses
        };
    }
} 