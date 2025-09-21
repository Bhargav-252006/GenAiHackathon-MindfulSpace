const express = require('express');
const router = express.Router();
const path = require('path');
const {readFileData, writeFileData} = require('../utils/fileStorage');

// Mock chat responses data file
const RESPONSES_FILE = path.join(__dirname, '../data/responses.json');

// Get chat response
router.post('/message', async (req, res) => {
    try {
        const {message, sessionId} = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid message',
                message: 'Message is required and must be a string'
            });
        }

        console.log(`[CHAT] Received message: "${message}" from session: ${sessionId || 'anonymous'}`);

        // Load mock responses
        const responses = await readFileData(RESPONSES_FILE);

        // Simple keyword-based response selection
        const lowerMessage = message.toLowerCase();
        let responseCategory = 'general';

        if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
            responseCategory = 'sad';
        } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
            responseCategory = 'anxious';
        } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
            responseCategory = 'angry';
        } else if (lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('happy')) {
            responseCategory = 'positive';
        }

        // Get random response from category
        const categoryResponses = responses[responseCategory] || responses.general;
        const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const response = {
            id: Date.now(),
            message: randomResponse,
            category: responseCategory,
            timestamp: new Date().toISOString(),
            sessionId: sessionId || null
        };

        console.log(`[CHAT] Sending response: "${randomResponse}" (category: ${responseCategory})`);

        res.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('[CHAT] Error processing message:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to process chat message'
        });
    }
});

// Get chat history (mock endpoint)
router.get('/history/:sessionId?', async (req, res) => {
    try {
        const {sessionId} = req.params;

        console.log(`[CHAT] Fetching chat history for session: ${sessionId || 'all'}`);

        // Return empty history as this is local-only
        res.json({
            success: true,
            data: {
                sessionId: sessionId || null,
                messages: [],
                totalMessages: 0,
                note: 'Chat history is stored locally in the client application'
            }
        });

    } catch (error) {
        console.error('[CHAT] Error fetching chat history:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch chat history'
        });
    }
});

// Clear chat history (mock endpoint)
router.delete('/history/:sessionId?', async (req, res) => {
    try {
        const {sessionId} = req.params;

        console.log(`[CHAT] Clearing chat history for session: ${sessionId || 'all'}`);

        res.json({
            success: true,
            message: 'Chat history cleared successfully',
            note: 'Chat history is stored locally in the client application'
        });

    } catch (error) {
        console.error('[CHAT] Error clearing chat history:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to clear chat history'
        });
    }
});

// Get available response categories
router.get('/categories', async (req, res) => {
    try {
        const responses = await readFileData(RESPONSES_FILE);

        res.json({
            success: true,
            data: {
                categories: Object.keys(responses),
                totalResponses: Object.values(responses).reduce((total, arr) => total + arr.length, 0)
            }
        });

    } catch (error) {
        console.error('[CHAT] Error fetching categories:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch response categories'
        });
    }
});

module.exports = router;