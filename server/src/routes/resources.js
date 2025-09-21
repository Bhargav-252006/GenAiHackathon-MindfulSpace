const express = require('express');
const router = express.Router();
const path = require('path');
const {readFileData} = require('../utils/fileStorage');

// Mental health resources data file
const RESOURCES_FILE = path.join(__dirname, '../data/resources.json');

// Get all resources
router.get('/', async (req, res) => {
    try {
        const {category, search, limit = 50, offset = 0} = req.query;

        console.log(`[RESOURCES] Fetching resources (category: ${category || 'all'}, search: ${search || 'none'})`);

        let resources = await readFileData(RESOURCES_FILE);

        // Filter by category
        if (category && category !== 'all') {
            resources = resources.filter(resource =>
                resource.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by search term
        if (search) {
            const searchTerm = search.toLowerCase();
            resources = resources.filter(resource =>
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.category.toLowerCase().includes(searchTerm)
            );
        }

        // Apply pagination
        const total = resources.length;
        const paginatedResources = resources.slice(
            parseInt(offset),
            parseInt(offset) + parseInt(limit)
        );

        res.json({
            success: true,
            data: {
                resources: paginatedResources,
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                filters: {
                    category: category || 'all',
                    search: search || null
                }
            }
        });

    } catch (error) {
        console.error('[RESOURCES] Error fetching resources:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch resources'
        });
    }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;

        console.log(`[RESOURCES] Fetching resource with ID: ${id}`);

        const resources = await readFileData(RESOURCES_FILE);
        const resource = resources.find(r => r.id === parseInt(id));

        if (!resource) {
            return res.status(404).json({
                error: 'Resource not found',
                message: `No resource found with ID ${id}`
            });
        }

        res.json({
            success: true,
            data: resource
        });

    } catch (error) {
        console.error('[RESOURCES] Error fetching resource:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch resource'
        });
    }
});

// Get available categories
router.get('/meta/categories', async (req, res) => {
    try {
        console.log('[RESOURCES] Fetching available categories');

        const resources = await readFileData(RESOURCES_FILE);

        // Get unique categories
        const categories = [...new Set(resources.map(r => r.category))];

        // Count resources per category
        const categoryCounts = {};
        resources.forEach(resource => {
            categoryCounts[resource.category] = (categoryCounts[resource.category] || 0) + 1;
        });

        res.json({
            success: true,
            data: {
                categories: categories.sort(),
                categoryCounts,
                totalCategories: categories.length,
                totalResources: resources.length
            }
        });

    } catch (error) {
        console.error('[RESOURCES] Error fetching categories:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch categories'
        });
    }
});

// Get crisis resources (alias for /crisis/emergency)
router.get('/crisis', async (req, res) => {
    try {
        console.log('[RESOURCES] Fetching crisis resources');

        const resources = await readFileData(RESOURCES_FILE);

        // Filter for crisis resources
        const crisisResources = resources.filter(r => r.category === 'crisis');

        // Sort by priority (crisis resources should have priority field)
        crisisResources.sort((a, b) => (a.priority || 999) - (b.priority || 999));

        res.json({
            success: true,
            data: {
                resources: crisisResources,
                total: crisisResources.length,
                emergency: {
                    phone: '911',
                    text: 'Text HOME to 741741',
                    suicide: '988'
                },
                message: 'If you are in immediate danger, please call emergency services'
            }
        });

    } catch (error) {
        console.error('[RESOURCES] Error fetching crisis resources:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch crisis resources'
        });
    }
});

// Get crisis resources specifically
router.get('/crisis/emergency', async (req, res) => {
    try {
        console.log('[RESOURCES] Fetching emergency crisis resources');

        const resources = await readFileData(RESOURCES_FILE);

        // Filter for crisis resources
        const crisisResources = resources.filter(r => r.category === 'crisis');

        // Sort by priority (crisis resources should have priority field)
        crisisResources.sort((a, b) => (a.priority || 999) - (b.priority || 999));

        res.json({
            success: true,
            data: {
                resources: crisisResources,
                total: crisisResources.length,
                emergency: {
                    phone: '911',
                    text: 'Text HOME to 741741',
                    suicide: '988'
                },
                message: 'If you are in immediate danger, please call emergency services'
            }
        });

    } catch (error) {
        console.error('[RESOURCES] Error fetching crisis resources:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch crisis resources'
        });
    }
});

// Search resources with advanced filtering
router.post('/search', async (req, res) => {
    try {
        const {
            query,
            categories = [],
            cost = 'all',
            availability = 'all',
            limit = 20,
            offset = 0
        } = req.body;

        console.log(`[RESOURCES] Advanced search: "${query}", categories: [${categories.join(', ')}]`);

        let resources = await readFileData(RESOURCES_FILE);

        // Text search
        if (query) {
            const searchTerm = query.toLowerCase();
            resources = resources.filter(resource =>
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }

        // Category filter
        if (categories.length > 0) {
            resources = resources.filter(resource =>
                categories.includes(resource.category)
            );
        }

        // Cost filter
        if (cost !== 'all') {
            if (cost === 'free') {
                resources = resources.filter(resource =>
                    resource.cost && resource.cost.toLowerCase().includes('free')
                );
            } else if (cost === 'paid') {
                resources = resources.filter(resource =>
                    resource.cost && !resource.cost.toLowerCase().includes('free')
                );
            }
        }

        // Availability filter
        if (availability !== 'all') {
            if (availability === '24/7') {
                resources = resources.filter(resource =>
                    resource.availability && resource.availability.includes('24/7')
                );
            }
        }

        // Apply pagination
        const total = resources.length;
        const paginatedResources = resources.slice(
            parseInt(offset),
            parseInt(offset) + parseInt(limit)
        );

        res.json({
            success: true,
            data: {
                resources: paginatedResources,
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                searchCriteria: {
                    query: query || null,
                    categories,
                    cost,
                    availability
                }
            }
        });

    } catch (error) {
        console.error('[RESOURCES] Error in advanced search:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to perform advanced search'
        });
    }
});

module.exports = router;