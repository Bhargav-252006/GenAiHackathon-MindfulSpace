import axios from 'axios';

/**
 * Gets a response from Google Gemini Pro API
 * @param {string} message - The user's message
 * @param {string} [mood=''] - Optional detected mood of the user
 * @param {string[]} [chatHistory=[]] - Optional array of previous messages for context
 * @returns {Promise<string>} - The AI response text
 */
export async function getGeminiResponse(message, mood = '', chatHistory = []) {
    console.log('getGeminiResponse called with:', {message, mood, historyLength: chatHistory.length});

    try {
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

        // Make API request with simplified structure
        console.log('Making API request to Gemini...');
        console.log('API Key present:', !!process.env.REACT_APP_GEMINI_API_KEY);

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
                    'X-goog-api-key': process.env.REACT_APP_GEMINI_API_KEY
                }
            }
        );

        console.log('Gemini API response received:', response.status);
        console.log('Response data structure:', response.data);

        // Extract and return the response text
        if (response.data.candidates &&
            response.data.candidates[0] &&
            response.data.candidates[0].content &&
            response.data.candidates[0].content.parts) {
            const responseText = response.data.candidates[0].content.parts[0].text;
            console.log('Extracted response text:', responseText);
            return responseText;
        } else {
            console.error('Unexpected response structure:', response.data);
            throw new Error('Unexpected response structure from Gemini API');
        }
    } catch (error) {
        console.error('Gemini API error:', error);
        if (error.response) {
            console.error('Error details:', error.response.data);
        }
        throw error;
    }
}