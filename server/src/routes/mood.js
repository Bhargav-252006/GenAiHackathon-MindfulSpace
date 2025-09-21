const express = require('express');
const router = express.Router();
const path = require('path');
const {readFileData, writeFileData} = require('../utils/fileStorage');

// Mock mood data file
const MOODS_FILE = path.join(__dirname, '../data/moods.json');

// Get mood entries
router.get('/', async (req, res) => {
    try {
        const {limit = 50, offset = 0, startDate, endDate} = req.query;

        console.log(`[MOOD] Fetching mood entries (limit: ${limit}, offset: ${offset})`);

        let moods = await readFileData(MOODS_FILE);

        // Filter by date range if provided
        if (startDate) {
            moods = moods.filter(mood => mood.date >= startDate);
        }
        if (endDate) {
            moods = moods.filter(mood => mood.date <= endDate);
        }

        // Sort by date (newest first)
        moods.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Apply pagination
        const paginatedMoods = moods.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

        res.json({
            success: true,
            data: {
                moods: paginatedMoods,
                total: moods.length,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });

    } catch (error) {
        console.error('[MOOD] Error fetching mood entries:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch mood entries'
        });
    }
});

// Add new mood entry
router.post('/', async (req, res) => {
    try {
        const {mood, note, date} = req.body;

        if (!mood || typeof mood !== 'number' || mood < 1 || mood > 7) {
            return res.status(400).json({
                error: 'Invalid mood value',
                message: 'Mood must be a number between 1 and 7'
            });
        }

        const moodEntry = {
            id: Date.now(),
            mood: parseInt(mood),
            note: note ? note.trim() : '',
            date: date || new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            source: 'api'
        };

        console.log(`[MOOD] Adding new mood entry: ${mood}/7 with note: "${note || 'none'}"`);

        // Load existing moods
        const moods = await readFileData(MOODS_FILE);

        // Add new mood entry
        moods.unshift(moodEntry);

        // Keep only last 1000 entries to prevent file from growing too large
        if (moods.length > 1000) {
            moods.splice(1000);
        }

        // Save back to file
        await writeFileData(MOODS_FILE, moods);

        res.status(201).json({
            success: true,
            data: moodEntry,
            message: 'Mood entry added successfully'
        });

    } catch (error) {
        console.error('[MOOD] Error adding mood entry:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to add mood entry'
        });
    }
});

// Get mood history (alias for stats)
router.get('/history', async (req, res) => {
    try {
        const {days = 30} = req.query;

        console.log(`[MOOD] Fetching mood history for last ${days} days`);

        const moods = await readFileData(MOODS_FILE);

        // Filter to last N days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

        const recentMoods = moods.filter(mood =>
            new Date(mood.timestamp) >= cutoffDate
        );

        res.json({
            success: true,
            data: {
                moods: recentMoods,
                total: recentMoods.length,
                period: `${days} days`
            }
        });

    } catch (error) {
        console.error('[MOOD] Error fetching mood history:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch mood history'
        });
    }
});

// Get mood statistics
router.get('/stats', async (req, res) => {
    try {
        const {days = 30} = req.query;

        console.log(`[MOOD] Generating mood statistics for last ${days} days`);

        const moods = await readFileData(MOODS_FILE);

        // Filter to last N days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

        const recentMoods = moods.filter(mood =>
            new Date(mood.timestamp) >= cutoffDate
        );

        if (recentMoods.length === 0) {
            return res.json({
                success: true,
                data: {
                    period: `${days} days`,
                    totalEntries: 0,
                    averageMood: 0,
                    trend: 'no-data',
                    moodDistribution: {},
                    message: 'No mood data available for the specified period'
                }
            });
        }

        // Calculate statistics
        const totalEntries = recentMoods.length;
        const averageMood = recentMoods.reduce((sum, mood) => sum + mood.mood, 0) / totalEntries;

        // Calculate trend (compare first half vs second half of period)
        const midpoint = Math.floor(totalEntries / 2);
        const firstHalf = recentMoods.slice(midpoint);
        const secondHalf = recentMoods.slice(0, midpoint);

        let trend = 'stable';
        if (firstHalf.length > 0 && secondHalf.length > 0) {
            const firstAvg = firstHalf.reduce((sum, mood) => sum + mood.mood, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, mood) => sum + mood.mood, 0) / secondHalf.length;

            if (secondAvg > firstAvg + 0.5) trend = 'improving';
            else if (secondAvg < firstAvg - 0.5) trend = 'declining';
        }

        // Mood distribution
        const moodDistribution = {};
        recentMoods.forEach(mood => {
            moodDistribution[mood.mood] = (moodDistribution[mood.mood] || 0) + 1;
        });

        res.json({
            success: true,
            data: {
                period: `${days} days`,
                totalEntries,
                averageMood: Math.round(averageMood * 10) / 10,
                trend,
                moodDistribution,
                highestMood: Math.max(...recentMoods.map(m => m.mood)),
                lowestMood: Math.min(...recentMoods.map(m => m.mood))
            }
        });

    } catch (error) {
        console.error('[MOOD] Error generating mood statistics:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to generate mood statistics'
        });
    }
});

// Delete mood entry
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;

        console.log(`[MOOD] Deleting mood entry with ID: ${id}`);

        const moods = await readFileData(MOODS_FILE);
        const initialLength = moods.length;

        // Filter out the mood entry with the specified ID
        const filteredMoods = moods.filter(mood => mood.id !== parseInt(id));

        if (filteredMoods.length === initialLength) {
            return res.status(404).json({
                error: 'Mood entry not found',
                message: `No mood entry found with ID ${id}`
            });
        }

        // Save filtered moods back to file
        await writeFileData(MOODS_FILE, filteredMoods);

        res.json({
            success: true,
            message: 'Mood entry deleted successfully'
        });

    } catch (error) {
        console.error('[MOOD] Error deleting mood entry:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to delete mood entry'
        });
    }
});

module.exports = router;