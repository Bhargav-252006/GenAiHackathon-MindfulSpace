import React, {useMemo, useState, useEffect} from 'react';
import {resources} from '../data/resources';
import {getStoredData, saveData, showNotification} from '../utils/localStorage';
import '../styles/Resources.css';

function Resources() {
    // UI state
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTags, setActiveTags] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [quickView, setQuickView] = useState(null);
    const [viewSavedOnly, setViewSavedOnly] = useState(false);

    // Derived categories and tags
    const categories = useMemo(() => ['all', ...Array.from(new Set(resources.map(r => r.category)))], []);

    const allTags = useMemo(() => {
        // Derive tags: split title and description keywords + category
        const base = new Set();
        resources.forEach(r => {
            base.add(r.category);
            r.title.split(/\s+/).forEach(w => base.add(w.toLowerCase().replace(/[^a-z0-9]/g, '')));
        });
        // Keep only meaningful tags
        return Array.from(base).filter(t => t && t.length > 3 && t !== 'https');
    }, []);

    // Persist bookmarks
    useEffect(() => {
        setBookmarks(getStoredData('saved-resources', []));
    }, []);

    useEffect(() => {
        saveData('saved-resources', bookmarks);
    }, [bookmarks]);

    const toggleBookmark = (id) => {
        setBookmarks(prev => {
            const exists = prev.includes(id);
            const next = exists ? prev.filter(x => x !== id) : [...prev, id];
            showNotification(exists ? 'Removed from Saved' : 'Saved to Bookmarks', exists ? 'warning' : 'success');
            return next;
        });
    };

    const isBookmarked = (id) => bookmarks.includes(id);

    const filteredResources = useMemo(() => {
        return resources.filter(resource => {
            const inCategory = selectedCategory === 'all' || resource.category === selectedCategory;
            const bySearch = (resource.title + ' ' + resource.description)
                .toLowerCase().includes(searchTerm.toLowerCase());
            const byTags = activeTags.length === 0 || activeTags.every(tag =>
                (resource.title + ' ' + resource.description + ' ' + resource.category)
                    .toLowerCase().includes(tag.toLowerCase())
            );
            const bySaved = !viewSavedOnly || isBookmarked(resource.id);
            return inCategory && bySearch && byTags && bySaved;
        });
    }, [selectedCategory, searchTerm, activeTags, viewSavedOnly, bookmarks]);

    const getCategoryIcon = (category) => {
        const icons = {
            crisis: '🚨',
            anxiety: '😰',
            depression: '💙',
            therapy: '🗣️',
            'self-help': '📚',
            meditation: '🧘',
            all: '📋'
        };
        return icons[category] || '📄';
    };

    return (
        <div className="page resources-page">
            <div className="resources-hero">
                <div className="hero-text">
                    <h2 className="title">📚 Mental Health Resources</h2>
                    <p className="subtitle">Trusted tools, helplines, and self‑care guides curated for youth (13–25)</p>
                </div>
                <div className="hero-actions">
                    <button className={`pill ${viewSavedOnly ? 'active' : ''}`} onClick={() => setViewSavedOnly(v => !v)}>
                        {viewSavedOnly ? '★ Viewing Saved' : '☆ View Saved Only'}
                    </button>
                </div>
            </div>

            <div className="resources-header">
                <div className="crisis-banner">
                    <h3>🚨 Crisis Support</h3>
                    <p>If you're in immediate danger or having thoughts of self-harm:</p>
                    <div className="crisis-contacts">
                        <div className="crisis-contact">
                            <strong>National Suicide Prevention Lifeline:</strong> 988
                        </div>
                        <div className="crisis-contact">
                            <strong>Crisis Text Line:</strong> Text HOME to 741741
                        </div>
                        <div className="crisis-contact">
                            <strong>Emergency Services:</strong> 911
                        </div>
                    </div>
                </div>
            </div>

            <div className="resources-filters">
                <div className="search-bar">
                    <span className="search-icon">🔎</span>
                    <input
                        type="text"
                        placeholder="Search by name, purpose, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear" onClick={() => setSearchTerm('')}>✕</button>
                    )}
                </div>

                <div className="category-filters">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                            title={`Filter by ${category}`}
                        >
                            {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="tag-cloud">
                    {allTags.slice(0, 20).map(tag => (
                        <button
                            key={tag}
                            className={`tag ${activeTags.includes(tag) ? 'active' : ''}`}
                            onClick={() => setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                        >
                            #{tag}
                        </button>
                    ))}
                    {activeTags.length > 0 && (
                        <button className="tag clear-tags" onClick={() => setActiveTags([])}>Clear tags</button>
                    )}
                </div>
            </div>

            <div className="resources-grid">
                {filteredResources.length === 0 ? (
                    <div className="empty">
                        <div className="empty-icon">🔍</div>
                        <h3>No resources found</h3>
                        <p>Try different keywords or clear filters.</p>
                    </div>
                ) : (
                    filteredResources.map(resource => (
                        <article key={resource.id} className="resource-card" style={{'--accent': categoryColor(resource.category)}}>
                            <div className="card-top">
                                <div className="badge">{getCategoryIcon(resource.category)} {resource.category}</div>
                                <button
                                    className={`bookmark ${isBookmarked(resource.id) ? 'saved' : ''}`}
                                    onClick={() => toggleBookmark(resource.id)}
                                    aria-label={isBookmarked(resource.id) ? 'Remove bookmark' : 'Save bookmark'}
                                >
                                    {isBookmarked(resource.id) ? '★' : '☆'}
                                </button>
                            </div>
                            <h3 className="card-title">{resource.title}</h3>
                            <p className="card-desc">{resource.description}</p>
                            <div className="card-actions">
                                {resource.website && (
                                    <a className="btn primary" href={resource.website} target="_blank" rel="noopener noreferrer">Visit Site ↗</a>
                                )}
                                {resource.phone && (
                                    <a className="btn ghost" href={`tel:${resource.phone.replace(/[^0-9+]/g, '')}`}>Call {resource.phone}</a>
                                )}
                                <button className="btn outline" onClick={() => setQuickView(resource)}>Quick View</button>
                            </div>
                            <div className="meta">
                                {resource.availability && <span>⏱ {resource.availability}</span>}
                                {resource.cost && <span>💸 {resource.cost}</span>}
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="resources-disclaimer">
                <h3>Important Disclaimer</h3>
                <p>
                    These resources are provided for informational purposes only and do not constitute medical advice.
                    Please consult with a qualified healthcare professional for personalized treatment recommendations.
                    If you're experiencing a mental health emergency, please contact emergency services immediately.
                </p>
            </div>

            {quickView && (
                <div className="modal-backdrop" onClick={() => setQuickView(null)}>
                    <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header" style={{'--accent': categoryColor(quickView.category)}}>
                            <div className="badge">{getCategoryIcon(quickView.category)} {quickView.category}</div>
                            <button className="close" onClick={() => setQuickView(null)}>✕</button>
                        </div>
                        <h3 className="modal-title">{quickView.title}</h3>
                        <p className="modal-desc">{quickView.description}</p>
                        <div className="modal-meta">
                            {quickView.availability && <span>⏱ {quickView.availability}</span>}
                            {quickView.cost && <span>💸 {quickView.cost}</span>}
                            {quickView.phone && <span>📞 {quickView.phone}</span>}
                        </div>
                        <div className="modal-actions">
                            {quickView.website && (
                                <a className="btn primary" href={quickView.website} target="_blank" rel="noopener noreferrer">Open Website ↗</a>
                            )}
                            <button className="btn ghost" onClick={() => toggleBookmark(quickView.id)}>
                                {isBookmarked(quickView.id) ? '★ Saved' : '☆ Save for later'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Resources;

// Helper to colorize categories
function categoryColor(category) {
    const map = {
        crisis: '#ff6b6b',
        anxiety: '#f59e0b',
        depression: '#4f46e5',
        therapy: '#10b981',
        'self-help': '#0ea5e9',
        meditation: '#a855f7',
        default: '#64748b'
    };
    return map[category] || map.default;
}