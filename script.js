// AI-Powered Brand generation with OpenAI integration
class BrandGenerator {
    constructor() {
        // Fallback data for when API is unavailable
        this.brandPrefixes = [
            'Spark', 'Nova', 'Zen', 'Flux', 'Echo', 'Pulse', 'Vibe', 'Flow', 'Sync', 'Leap',
            'Swift', 'Bright', 'Smart', 'Quick', 'Pure', 'Bold', 'Fresh', 'Clear', 'Sharp', 'Wise',
            'True', 'Prime', 'Core', 'Edge', 'Peak', 'Max', 'Pro', 'Ultra', 'Meta', 'Hyper',
            'Micro', 'Nano', 'Mega', 'Super', 'Turbo', 'Rapid', 'Instant', 'Direct', 'Simple', 'Easy'
        ];

        this.brandSuffixes = [
            'ly', 'fy', 'io', 'co', 'ai', 'lab', 'hub', 'box', 'kit', 'app',
            'tech', 'soft', 'ware', 'sys', 'net', 'web', 'link', 'sync', 'flow', 'wave',
            'space', 'cloud', 'data', 'mind', 'core', 'base', 'zone', 'spot', 'dock', 'port'
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

        this.logoIcons = [
            'fas fa-rocket', 'fas fa-lightbulb', 'fas fa-star', 'fas fa-bolt', 'fas fa-gem',
            'fas fa-crown', 'fas fa-fire', 'fas fa-leaf', 'fas fa-heart', 'fas fa-shield-alt',
            'fas fa-cog', 'fas fa-cube', 'fas fa-diamond', 'fas fa-feather', 'fas fa-globe',
            'fas fa-magic', 'fas fa-mountain', 'fas fa-paper-plane', 'fas fa-puzzle-piece',
            'fas fa-seedling', 'fas fa-sun', 'fas fa-tree', 'fas fa-trophy', 'fas fa-umbrella'
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

    // Generate brand using OpenAI GPT
    async generateBrandWithAI(idea) {
        if (!this.openaiApiKey) {
            throw new Error('OpenAI API key not set');
        }

        const prompt = `You are a professional brand strategist and creative director. Generate a complete brand identity for the following startup idea:

"${idea}"

Please respond with a JSON object containing exactly these fields:
{
  "brandName": "A creative, memorable brand name (1-2 words, brandable)",
  "tagline": "A compelling tagline (5-8 words, captures essence)",
  "industry": "Primary industry category",
  "vibe": "Brand personality (modern/classic/playful/professional/etc)",
  "reasoning": "Brief explanation of naming choice"
}

Requirements:
- Brand name should be unique, memorable, and easy to pronounce
- Avoid generic names or existing company names
- Tagline should be inspiring and capture the value proposition
- Consider the target audience and market positioning
- Make it brandable and scalable

Respond only with valid JSON, no additional text.`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "user",
                        content: prompt
                    }],
                    temperature: 0.8,
                    max_tokens: 300
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            
            // Parse the JSON response
            let aiResult;
            try {
                aiResult = JSON.parse(content);
            } catch (parseError) {
                // If JSON parsing fails, extract data manually
                aiResult = this.parseAIResponse(content);
            }

            return {
                brandName: aiResult.brandName || 'BrandName',
                tagline: aiResult.tagline || 'Your tagline here',
                industry: aiResult.industry || 'business',
                vibe: aiResult.vibe || 'modern',
                reasoning: aiResult.reasoning || 'AI-generated brand identity'
            };

        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    // Parse AI response if JSON parsing fails
    parseAIResponse(content) {
        const result = {};
        
        // Extract brand name
        const nameMatch = content.match(/"brandName":\s*"([^"]+)"/i);
        result.brandName = nameMatch ? nameMatch[1] : null;
        
        // Extract tagline
        const taglineMatch = content.match(/"tagline":\s*"([^"]+)"/i);
        result.tagline = taglineMatch ? taglineMatch[1] : null;
        
        // Extract industry
        const industryMatch = content.match(/"industry":\s*"([^"]+)"/i);
        result.industry = industryMatch ? industryMatch[1] : null;
        
        // Extract vibe
        const vibeMatch = content.match(/"vibe":\s*"([^"]+)"/i);
        result.vibe = vibeMatch ? vibeMatch[1] : null;
        
        return result;
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

    // Generate logo based on industry
    generateSmartLogo(brandName, industry, vibe) {
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

        // Choose icon based on industry
        let iconOptions = industryIcons[industry?.toLowerCase()] || this.logoIcons;
        const icon = iconOptions[Math.floor(Math.random() * iconOptions.length)];

        // Choose gradient based on vibe
        let gradientOptions = vibeGradients[vibe?.toLowerCase()] || vibeGradients.modern;
        const gradient = gradientOptions[Math.floor(Math.random() * gradientOptions.length)];

        return {
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
                reasoning: 'Generated using algorithmic approach'
            };
        }

        // Generate color palette and logo based on AI insights or fallback
        const colorPalette = this.generateSmartColorPalette(brandData.industry, brandData.vibe);
        const logo = this.generateSmartLogo(brandData.brandName, brandData.industry, brandData.vibe);

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
                    } catch (error) {
                        this.currentBrand.brandName = this.generateBrandNameFallback(idea);
                        this.currentBrand.generatedWithAI = false;
                    }
                } else {
                    this.currentBrand.brandName = this.generateBrandNameFallback(idea);
                    this.currentBrand.generatedWithAI = false;
                }
                this.currentBrand.logo = this.generateSmartLogo(
                    this.currentBrand.brandName, 
                    this.currentBrand.industry, 
                    this.currentBrand.vibe
                );
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
                this.currentBrand.logo = this.generateSmartLogo(
                    this.currentBrand.brandName, 
                    this.currentBrand.industry, 
                    this.currentBrand.vibe
                );
                break;
        }

        return this.currentBrand;
    }

    // Helper methods
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Main application
class BrandSnapApp {
    constructor() {
        this.generator = new BrandGenerator();
        this.initializeEventListeners();
        this.initializeAPIKeyManagement();
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
        const nav = document.querySelector('.nav');
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
        
        nav.appendChild(settingsBtn);
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
        const currentKey = this.generator.getStoredApiKey();
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
        
        this.generator.setApiKey(apiKey);
        this.updateAPIKeyStatus();
        this.showSuccess('API key saved! AI generation is now enabled.');
    }

    removeApiKey() {
        this.generator.setApiKey(null);
        document.getElementById('apiKeyInput').value = '';
        this.updateAPIKeyStatus();
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
        
        if (this.generator.useAI) {
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
        if (this.generator.useAI) {
            loadingText.textContent = 'AI is analyzing your idea and creating your brand...';
        } else {
            loadingText.textContent = 'Generating your brand identity...';
        }

        try {
            const brand = await this.generator.generateBrand(idea);
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
        
        if (!idea || !this.generator.currentBrand) {
            this.showError('Please generate a brand first!');
            return;
        }

        // Show mini loading for the specific component
        this.showComponentLoading(type, true);

        try {
            const brand = await this.generator.regenerateComponent(type, idea);
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
        const logoElement = document.getElementById('logoPlaceholder');
        logoElement.innerHTML = `
            <i class="${brand.logo.icon}"></i>
            <span>${brand.logo.text}</span>
        `;
        logoElement.style.background = brand.logo.gradient;

        // Update color palette
        this.displayColorPalette(brand.colorPalette);

        // Show AI indicator if generated with AI
        this.showAIIndicator(brand.generatedWithAI);

        // Show results section
        const resultsSection = document.getElementById('results');
        resultsSection.classList.remove('hidden');
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
                const logoElement = document.getElementById('logoPlaceholder');
                logoElement.innerHTML = `
                    <i class="${brand.logo.icon}"></i>
                    <span>${brand.logo.text}</span>
                `;
                logoElement.style.background = brand.logo.gradient;
                break;
            case 'tagline':
                document.getElementById('tagline').textContent = brand.tagline;
                break;
            case 'colors':
                this.displayColorPalette(brand.colorPalette);
                break;
            case 'logo':
                const logo = document.getElementById('logoPlaceholder');
                logo.innerHTML = `
                    <i class="${brand.logo.icon}"></i>
                    <span>${brand.logo.text}</span>
                `;
                logo.style.background = brand.logo.gradient;
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
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            button.disabled = true;
        } else {
            const icons = {
                'name': 'fas fa-redo',
                'tagline': 'fas fa-redo',
                'colors': 'fas fa-redo',
                'logo': 'fas fa-redo'
            };
            button.innerHTML = `<i class="${icons[type]}"></i> Regenerate`;
            button.disabled = false;
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
        if (!this.generator.currentBrand) {
            this.showError('No brand data to download!');
            return;
        }

        const brand = this.generator.currentBrand;
        
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BrandSnapApp();
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