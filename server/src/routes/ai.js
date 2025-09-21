const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * POST /api/ai/gemini
 * Secure server-side proxy for Google Gemini API
 * Keeps API key hidden from client
 */
router.post('/gemini', async (req, res) => {
    try {
        const {message, mood = '', chatHistory = []} = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid message',
                message: 'Message is required and must be a string'
            });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) {
            return res.status(503).json({
                error: 'AI service unavailable',
                message: 'Gemini API key not configured on server'
            });
        }

        console.log(`[GEMINI] Processing message: "${message.substring(0, 50)}..." with mood: ${mood}`);

        // Build comprehensive system context for youth mental health support
        const systemContext =
            "You are Mindful Bot, a specialized youth mental health awareness assistant created for young people aged 13-25. " +
            "Your mission is to provide age-appropriate emotional support, mental health education, and awareness resources. " +

            "PERSONALITY & TONE: " +
            "- Use relatable, non-judgmental language that resonates with young people " +
            "- Be warm, empathetic, and understanding of youth-specific challenges " +
            "- Acknowledge that mental health struggles are normal and valid " +
            "- Use encouraging but realistic optimism " +
            "- Avoid being overly clinical or patronizing " +

            "YOUTH-SPECIFIC AWARENESS: " +
            "- Understand academic pressure, social media stress, identity exploration, peer pressure " +
            "- Recognize family conflicts, body image issues, relationship challenges, future anxiety " +
            "- Be aware of bullying, cyberbullying, social isolation, and perfectionism " +
            "- Address sleep issues, technology addiction, and comparison culture " +

            "MENTAL HEALTH EDUCATION: " +
            "- Explain mental health concepts in accessible, teen-friendly language " +
            "- Normalize seeking help and talking about mental health " +
            "- Share healthy coping strategies like mindfulness, journaling, creative outlets " +
            "- Promote self-care routines, healthy boundaries, and stress management " +
            "- Encourage physical activity, good sleep hygiene, and social connection " +

            "RESPONSE GUIDELINES: " +
            "- Keep responses 2-3 sentences, conversational and supportive " +
            "- Validate feelings and experiences without minimizing them " +
            "- Suggest practical, age-appropriate coping strategies " +
            "- Gently encourage professional help for serious concerns " +
            "- Use emojis sparingly but appropriately for emotional connection " +

            "CRISIS AWARENESS: " +
            "- For self-harm or suicidal thoughts, provide immediate resources and encourage professional help " +
            "- Recognize signs of eating disorders, substance abuse, or severe depression " +
            "- Always emphasize that help is available and recovery is possible " +

            "Remember: You're supporting young people in building mental health awareness, resilience, and healthy coping skills.";

        const userMoodContext = mood ? ` The user appears to be feeling ${mood} - respond with extra sensitivity and appropriate support for this emotional state.` : '';

        // Create a comprehensive prompt for youth mental health support
        const fullPrompt = systemContext + userMoodContext +
            "\n\nAs Mindful Bot, respond to this young person with understanding, validation, and helpful guidance:\n\n" +
            "User: " + message + "\n\nMindful Bot:";

        // Make API request to Google Gemini
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            {
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': geminiApiKey
                },
                timeout: 30000 // 30 second timeout
            }
        );

        // Extract response text
        if (response.data.candidates &&
            response.data.candidates[0] &&
            response.data.candidates[0].content &&
            response.data.candidates[0].content.parts) {

            const responseText = response.data.candidates[0].content.parts[0].text;

            console.log(`[GEMINI] Generated response: "${responseText.substring(0, 100)}..."`);

            res.json({
                success: true,
                data: {
                    message: responseText,
                    mood: mood,
                    timestamp: new Date().toISOString(),
                    source: 'gemini'
                }
            });
        } else {
            console.error('[GEMINI] Unexpected response structure:', response.data);
            throw new Error('Unexpected response structure from Gemini API');
        }

    } catch (error) {
        console.error('[GEMINI] Error:', error.message);

        if (error.response) {
            console.error('[GEMINI] API Error Details:', error.response.data);

            // Handle specific API errors
            if (error.response.status === 429) {
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: 'Too many requests to AI service. Please try again later.',
                    retryAfter: 60
                });
            }

            if (error.response.status === 403) {
                return res.status(503).json({
                    error: 'AI service authentication failed',
                    message: 'Invalid API key or permission denied'
                });
            }
        }

        // Generic server error
        res.status(500).json({
            error: 'AI service error',
            message: 'Failed to get response from AI service. Using fallback responses.',
            fallback: true
        });
    }
});

/**
 * GET /api/ai/status
 * Check if Gemini service is configured and available
 */
router.get('/status', (req, res) => {
    const hasApiKey = !!process.env.GEMINI_API_KEY;

    res.json({
        success: true,
        data: {
            geminiConfigured: hasApiKey,
            service: 'Google Gemini 2.0 Flash',
            features: ['youth-specialized', 'mental-health-aware', 'crisis-detection'],
            status: hasApiKey ? 'available' : 'not-configured'
        }
    });
});

module.exports = router;