# MindfulSpace - Youth Mental Health Awareness Platform

A comprehensive mental health support application specifically designed for young people (ages 13-25). This full-stack application combines AI-powered chat responses, mood tracking, wellness activities, and mental health resources to create a supportive digital environment for youth mental health awareness.

## 🚨 Important Disclaimer

**This application is designed for mental health support and awareness but is not a replacement for professional help.** For crisis situations or serious mental health concerns, please contact:

- **National Suicide Prevention Lifeline:** 988
- **Crisis Text Line:** Text HOME to 741741
- **Emergency Services:** 911
- **National Helpline:** 1-800-662-HELP (4357)

## ✨ Key Features Overview

### 🤖 **AI-Powered Youth Chat**
- **Google Gemini Pro Integration** - Real-time AI responses specialized for youth mental health
- **Youth-Focused Personality** - Understanding of academic stress, social pressure, identity issues
- **Rate Limiting System** - Smart usage tracking with 50 requests/hour limit
- **Fallback System** - Graceful degradation to local responses when AI unavailable
- **Enhanced UI** - Modern chat interface with avatars, typing indicators, message grouping

### 📊 **Smart Mood Tracking**
- **Local Storage Based** - Private mood tracking with trend analysis
- **Visual Statistics** - Charts and graphs showing mood patterns over time
- **Youth-Specific Categories** - Mood options tailored for young people's experiences

### 🧘 **Wellness & Mindfulness**
- **Guided Breathing Exercises** - Interactive breathing tools for stress relief
- **Mindfulness Activities** - Age-appropriate wellness practices for youth

### 📚 **Mental Health Resources**
- **Curated Resource Library** - Mental health resources specifically for young people
- **Crisis Support Information** - Immediate help resources and hotlines
- **Educational Content** - Mental health awareness and education materials

### 🎨 **Modern User Experience**
- **Youth-Friendly Design** - Empathetic, engaging interface with animations
- **Dark/Light Theme** - Accessible theme options with smooth transitions
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **PWA Support** - Service worker for offline capabilities

## 🛠️ Technology Stack

### Frontend (Client)
- **React 18** - Modern React with hooks and functional components
- **React Router DOM 6** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **CSS3 with Advanced Features** - Keyframe animations, CSS Grid, Flexbox
- **PWA Support** - Service Worker for offline capabilities
- **Environment Variables** - Secure API key management

### Backend (Server)
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for REST API
- **CORS** - Cross-origin resource sharing middleware
- **Morgan** - HTTP request logging
- **Helmet** - Security middleware for Express
- **File-based JSON Storage** - Simple data persistence without database

### AI Integration
- **Google Gemini Pro API** - Advanced AI for natural language processing
- **Rate Limiting** - Smart usage tracking and management
- **Fallback System** - Multi-tier response system for reliability

## 🚀 Quick Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Google Gemini API Key (for AI features)

### 1. Install Dependencies
```bash
# Install all dependencies (root, client, and server)
npm run install:all
```

### 2. Configure Environment Variables
```bash
# In the client/ directory, update .env file:
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=MindfulSpace
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Environment
```bash
# Start both frontend and backend concurrently
npm start
```

This will start:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

### 4. Open the App
Navigate to `http://localhost:3000` in your browser.

## 📂 Project Architecture

```
mindful-space-local/
├── client/                          # React Frontend Application
│   ├── public/
│   │   ├── index.html              # Main HTML template
│   │   ├── manifest.json           # PWA manifest
│   │   └── sw.js                   # Service Worker for PWA
│   ├── src/
│   │   ├── components/             # React Components
│   │   │   ├── App.jsx             # Main router and theme provider
│   │   │   ├── Header.jsx          # Navigation with theme toggle
│   │   │   ├── Home.jsx            # Landing page with animations
│   │   │   ├── Chat.jsx            # AI-powered chat interface
│   │   │   ├── MoodTracker.jsx     # Mood tracking and analytics
│   │   │   ├── Wellness.jsx        # Breathing exercises and mindfulness
│   │   │   ├── Resources.jsx       # Mental health resources library
│   │   │   └── Settings.jsx        # App settings and preferences
│   │   ├── styles/                 # CSS Stylesheets
│   │   │   ├── App.css             # Global styles and home page
│   │   │   ├── Header.css          # Navigation styles
│   │   │   ├── Chat.css            # Chat interface styling
│   │   │   ├── Home.css            # Advanced animations for home
│   │   │   └── index.css           # Base styles and theme variables
│   │   ├── utils/                  # Utility Functions
│   │   │   ├── localStorage.js     # Local storage management
│   │   │   └── ai/
│   │   │       └── geminiService.js # Google Gemini API integration
│   │   ├── data/                   # Static Data
│   │   │   ├── mockResponses.js    # Youth-focused fallback responses
│   │   │   └── resources.js        # Mental health resources data
│   │   └── index.js                # App entry point with SW registration
│   ├── .env                        # Environment variables
│   └── package.json                # Client dependencies
├── server/                         # Express Backend API
│   ├── src/
│   │   ├── index.js                # Server entry point
│   │   ├── routes/                 # API Route Handlers
│   │   │   ├── chat.js             # Chat API endpoints
│   │   │   ├── mood.js             # Mood tracking endpoints
│   │   │   └── resources.js        # Resources API endpoints
│   │   ├── utils/
│   │   │   └── fileStorage.js      # File-based data storage
│   │   └── data/                   # JSON Data Files
│   │       ├── moods.json          # Mood entries storage
│   │       ├── resources.json      # Resources database
│   │       └── responses.json      # Chat response templates
│   ├── .env                        # Server environment variables
│   └── package.json                # Server dependencies
├── package.json                    # Root package for concurrent commands
└── README.md                       # This documentation
```

## 🔧 Client Application Details

### Core Features Implementation

#### 🤖 **AI Chat System** (`Chat.jsx`)
- **Multi-tier Response System:**
  1. **Primary:** Google Gemini Pro API with youth-specialized prompts
  2. **Secondary:** Express server with keyword-based responses
  3. **Fallback:** Local mock responses for offline support

- **Smart Features:**
  - **Rate Limiting:** 50 AI requests/hour with visual tracking
  - **Mood Detection:** Analyzes user input for emotional context
  - **Message Grouping:** Intelligent avatar display and message clustering
  - **Typing Indicators:** Real-time conversation feedback
  - **Error Handling:** Graceful degradation with user notifications

- **Youth-Specific Intelligence:**
  - Academic stress recognition (school, exams, grades)
  - Social anxiety detection (friends, peer pressure)
  - Family relationship support (parents, home conflicts)
  - Identity exploration guidance (self-worth, confidence)
  - Future anxiety management (career, uncertainty)

#### 🎨 **Enhanced User Interface**
- **Modern Chat Design:**
  - Avatars for bot and user messages
  - Enhanced header with online status indicator
  - Message timestamps and source badges
  - Textarea input with Shift+Enter support
  - Icon-based toolbar for enhanced UX

- **Advanced Animations** (`Home.css`):
  - Keyframe animations (float, pulse, wave, sparkle)
  - Parallax effects and scroll indicators
  - Interactive feature cards with hover effects
  - Typewriter effects and blinking cursors
  - Reduced motion support for accessibility

#### 📊 **Rate Limiting & Usage Tracking**
- **Visual Indicators:**
  - Real-time usage counter in chat header
  - Color-coded warnings (green → orange → red)
  - Warning banners at 80% usage threshold
  - Error messages when limits exceeded

- **Smart Management:**
  - Hourly reset mechanism with localStorage persistence
  - Automatic fallback to local responses when limited
  - User education about responsible API usage

### Configuration & Environment

#### **Environment Variables** (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000          # Backend API URL
REACT_APP_NAME=MindfulSpace                      # Application name
REACT_APP_GEMINI_API_KEY=your_api_key_here      # Google Gemini API key
```

#### **PWA Support**
- **Service Worker** (`sw.js`): Basic offline capability
- **Manifest** (`manifest.json`): App installation support
- **Registration:** Automatic service worker registration in `index.js`

## 🖥️ Server Application Details

### API Architecture

#### **Core Server** (`src/index.js`)
- **Express Setup:** CORS, Helmet, Morgan middleware
- **API Prefix:** Configurable via environment variable (`/api`)
- **Health Check:** Simple endpoint for monitoring server status
- **File Storage:** JSON-based data persistence without database

#### **Chat API** (`routes/chat.js`)
- **POST `/api/chat/message`:**
  - Accepts user message and session ID
  - Keyword-based response matching
  - Returns structured response with metadata
  - Categories: sad, anxious, angry, positive, general

#### **Mood Tracking API** (`routes/mood.js`)
- **GET `/api/mood`:** List all mood entries
- **POST `/api/mood`:** Create new mood entry
- **GET `/api/mood/history`:** Get mood history with optional date filtering
- **GET `/api/mood/stats`:** Get mood statistics and trends

#### **Resources API** (`routes/resources.js`)
- **GET `/api/resources`:** Get mental health resources
- **GET `/api/resources/categories`:** Get available categories
- **Search & Filter:** Query and category-based filtering

### Data Storage

#### **File-Based Storage** (`utils/fileStorage.js`)
- **JSON Files:** Simple file-based database alternative
- **CRUD Operations:** Read, write, update, delete functionality
- **Error Handling:** Robust file system error management
- **Data Persistence:** Automatic file creation and management

#### **Environment Configuration** (`.env`)
```env
PORT=5000                    # Server port
API_PREFIX=/api             # API route prefix
NODE_ENV=development        # Environment mode
```

## 🔄 Integration Architecture

### AI Integration Flow

1. **User Input** → Chat.jsx component
2. **Rate Limit Check** → Local storage validation
3. **Mood Detection** → Enhanced keyword analysis
4. **API Priority:**
   - **Primary:** Gemini Pro API with specialized prompts
   - **Secondary:** Express server keyword matching
   - **Fallback:** Local mock responses
5. **Response Display** → Enhanced UI with source indication

### Data Flow

1. **Frontend State Management:**
   - React hooks for local state
   - localStorage for persistence
   - Context for theme management

2. **API Communication:**
   - Axios for HTTP requests
   - Environment-based URL configuration
   - Error handling with user feedback

3. **Backend Processing:**
   - Express middleware pipeline
   - File-based data operations
   - Structured JSON responses

## 🎯 Youth Mental Health Specialization

### Targeted Features

#### **Age-Appropriate Language** (13-25 years)
- Relatable, non-judgmental communication
- Understanding of youth-specific challenges
- Validation of teenage/young adult experiences

#### **Youth-Specific Challenges**
- **Academic Pressure:** School stress, exam anxiety, grade pressure
- **Social Dynamics:** Peer pressure, social media stress, fitting in
- **Family Relations:** Parent conflicts, independence struggles
- **Identity Formation:** Self-discovery, confidence building, worth validation
- **Future Anxiety:** Career uncertainty, life decisions, what-if scenarios

#### **Mental Health Education**
- Accessible explanations of mental health concepts
- Normalization of seeking help and discussing mental health
- Healthy coping strategies appropriate for young people
- Crisis recognition and resource provision

### Response Categories

#### **Specialized Mock Responses**
- **Academic:** School-focused support and stress management
- **Social:** Peer pressure and friendship guidance
- **Family:** Parent-teen relationship navigation
- **Identity:** Self-discovery and confidence building
- **Traditional:** Sad, anxious, angry, positive emotional support

## 🚦 Getting Started Guide

### Development Setup

1. **Clone and Install:**
   ```bash
   git clone [repository-url]
   cd mindful-space-local
   npm run install:all
   ```

2. **Configure Environment:**
   - Get Google Gemini API key from [Google AI Studio](https://ai.google.dev/)
   - Update `client/.env` with your API key
   - Verify server `.env` configuration

3. **Start Development:**
   ```bash
   npm start  # Starts both client (3000) and server (5000)
   ```

4. **Test Features:**
   - Chat with AI responses (if API key configured)
   - Track mood entries and view analytics
   - Explore wellness activities and resources
   - Test dark/light theme switching

### Production Considerations

- **Environment Variables:** Secure API key management
- **Rate Limiting:** Consider implementing server-side rate limiting
- **Data Backup:** Regular backup of JSON data files
- **Monitoring:** Add logging and error tracking
- **Security:** HTTPS, content security policies, input validation

## 📱 User Experience Highlights

### Accessibility Features
- **Theme Support:** Light/dark mode with system preference detection
- **Responsive Design:** Mobile-first approach with touch-friendly interfaces
- **Reduced Motion:** Respects user motion preferences
- **Keyboard Navigation:** Full keyboard accessibility support
- **Screen Reader Support:** Semantic HTML and ARIA labels

### Performance Features
- **Rate Limiting:** Prevents API abuse and manages costs
- **Local Storage:** Offline data persistence and faster loading
- **Service Worker:** Basic offline capability and PWA support
- **Optimized Assets:** Efficient loading and caching strategies

## 🔮 Future Enhancement Opportunities

### Technical Improvements
- **Database Integration:** Replace file storage with proper database
- **User Authentication:** Individual user accounts and data isolation
- **Real-time Features:** WebSocket integration for live chat
- **Advanced Analytics:** More sophisticated mood and usage analytics

### Feature Expansions
- **Crisis Detection:** Advanced AI for identifying crisis situations
- **Resource Recommendations:** Personalized resource suggestions
- **Community Features:** Peer support and group discussions
- **Professional Integration:** Connect with licensed mental health professionals

### AI Enhancements
- **Conversation Memory:** Multi-session conversation context
- **Personalization:** Adaptive responses based on user patterns
- **Multiple Models:** Integration with various AI providers
- **Voice Support:** Audio input and response capabilities

---

**MindfulSpace** represents a modern approach to youth mental health awareness, combining cutting-edge AI technology with empathetic design to create a supportive digital environment for young people navigating mental health challenges.
│   │   │   ├── mockResponses.js     # Chat response data
│   │   │   └── resources.js         # Mental health resources
│   │   └── index.js                 # React entry point
│   ├── package.json
│   └── .env
├── server/                          # Express backend
│   ├── src/
│   │   ├── index.js                 # Express server setup
│   │   ├── routes/
│   │   │   ├── chat.js              # Chat API endpoints
│   │   │   ├── mood.js              # Mood tracking endpoints
│   │   │   └── resources.js         # Resources API endpoints
│   │   ├── data/
│   │   │   ├── responses.json       # Mock chat responses
│   │   │   ├── resources.json       # Mental health resources data
│   │   │   └── moods.json           # Mood entries storage
│   │   └── utils/
│   │       └── fileStorage.js       # File operations utility
│   ├── package.json
│   └── .env
├── package.json                     # Root project scripts
└── README.md
```

## 🎯 Available Scripts

### Root Directory
- `npm start` - Start both frontend and backend
- `npm run dev` - Start with backend in development mode (auto-restart)
- `npm run client` - Start only frontend
- `npm run server` - Start only backend
- `npm run server:dev` - Start backend in development mode
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies
- `npm run clean` - Remove all node_modules and build folders
- `npm run reset` - Clean and reinstall everything

### Client Directory
```bash
cd client
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

### Server Directory
```bash
cd server
npm start        # Start production server
npm run dev      # Start development server with auto-restart
```

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api/v1`

#### Health Check
- `GET /health` - Server health status

#### Chat API
- `POST /api/v1/chat/message` - Send chat message and get response
- `GET /api/v1/chat/history/:sessionId?` - Get chat history (returns empty for local-only)
- `DELETE /api/v1/chat/history/:sessionId?` - Clear chat history
- `GET /api/v1/chat/categories` - Get available response categories

#### Mood API
- `GET /api/v1/mood` - Get mood entries with pagination and filtering
- `POST /api/v1/mood` - Add new mood entry
- `GET /api/v1/mood/stats` - Get mood statistics and trends
- `DELETE /api/v1/mood/:id` - Delete mood entry

#### Resources API
- `GET /api/v1/resources` - Get mental health resources with filtering
- `GET /api/v1/resources/:id` - Get specific resource by ID
- `GET /api/v1/resources/meta/categories` - Get available categories
- `GET /api/v1/resources/crisis/emergency` - Get crisis/emergency resources
- `POST /api/v1/resources/search` - Advanced resource search

## 💾 Data Storage

All data is stored locally:

### Frontend Storage (localStorage)
- `mindful-theme` - Selected theme (light/dark)
- `mindful-chat-history` - Chat conversation history
- `mood-history` - Mood tracking entries

### Backend Storage (JSON files)
- `server/src/data/moods.json` - Mood entries from API
- `server/src/data/responses.json` - Chat response templates
- `server/src/data/resources.json` - Mental health resources

## 🎨 Features Overview

### 1. Mock Chat System
- Keyword-based response selection
- Emotional state detection (sad, anxious, angry, positive)
- Realistic typing delays
- Local chat history storage
- Supportive and appropriate responses

### 2. Mood Tracking
- 7-point mood scale with emojis
- Optional notes for context
- Statistics and trend analysis
- Visual mood history
- Data export capability

### 3. Wellness Activities
- Guided breathing exercise (4-4-6 pattern)
- Visual breathing circle with animations
- Daily affirmations
- Quick wellness tips
- Session tracking

### 4. Mental Health Resources
- Comprehensive resource database
- Category filtering (crisis, therapy, meditation, etc.)
- Search functionality
- Crisis resources prominently displayed
- Real contact information for actual services

### 5. Settings & Customization
- Dark/light theme toggle
- Data export functionality
- Clear all data option
- App information and privacy details

## 🔧 Development Notes

### Mock Data
- Chat responses are keyword-based and designed to be supportive
- Mood data is stored locally and persists between sessions
- Resources contain real mental health organizations and services

### Security
- CORS configured for local development only
- No external API calls or data transmission
- All data remains on the local machine
- Helmet middleware for basic security headers

### Performance
- React components are optimized for re-rendering
- CSS uses efficient selectors and transitions
- File storage operations are asynchronous
- Pagination implemented for large datasets

## 🚨 Limitations

### Development Only
- **Not for production use**
- **Not a replacement for real mental health services**
- **Mock responses only - no real AI or professional advice**
- **Local development environment only**

### Technical Limitations
- No user authentication
- No multi-user support
- No data synchronization
- File-based storage (not scalable)
- No real-time features
- No push notifications

## 🔍 Testing the Application

### Frontend Testing
1. Navigate through all pages using the header navigation
2. Test mood tracking by adding several entries
3. Try the chat system with different emotional keywords
4. Use the breathing exercise
5. Toggle between light and dark themes
6. Test data export and clear functions

### Backend Testing
Use a tool like Postman or curl to test API endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Send chat message
curl -X POST http://localhost:5000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "I feel sad today"}'

# Add mood entry
curl -X POST http://localhost:5000/api/v1/mood \
  -H "Content-Type: application/json" \
  -d '{"mood": 4, "note": "Feeling okay today"}'

# Get resources
curl http://localhost:5000/api/v1/resources?category=crisis
```

## 📝 License

This project is for educational and development purposes only. Not licensed for production use.

## ⚠️ Final Reminder

**This application is for development and testing only.** For real mental health support, please contact:

- National Suicide Prevention Lifeline: **988**
- Crisis Text Line: **Text HOME to 741741**
- Emergency Services: **911**
- Your healthcare provider or local mental health services

The resources provided in this app are real and can be used for actual support when needed.