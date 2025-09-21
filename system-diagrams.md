# MindfulSpace - System Diagrams for Hackathon Presentation

for use case daigram slide 8


## 1. PROCESS FLOW DIAGRAM

### Main User Journey Process Flow

```
START → [User Opens MindfulSpace] 
           ↓
    [Landing Page Display]
           ↓
    [User Enters Chat Interface]
           ↓
    [User Types Message] → [Input Validation]
           ↓                     ↓
    [Rate Limit Check] ←─── [Valid Input?] ──→ [Error Message]
           ↓                                         ↑
    [Within Limit?] ──→ [Limit Exceeded] ──→ [Show Warning] ──┘
           ↓
    [Send to AI Processing]
           ↓
    [Google Gemini API Call]
           ↓
    [API Success?] ──→ [No] ──→ [Fallback Response System]
           ↓                           ↓
         [Yes]                   [Display Mock Response]
           ↓                           ↓
    [Apply Youth Filter] ←──────────────┘
           ↓
    [Mood Detection Analysis]
           ↓
    [Generate Personalized Response]
           ↓
    [Display Response to User]
           ↓
    [Update Usage Counter]
           ↓
    [Store Conversation History]
           ↓
    [User Continues?] ──→ [Yes] ──→ [Back to User Types Message]
           ↓
         [No]
           ↓
    [Save Session Data]
           ↓
        END
```

---

## 2. USE CASE DIAGRAM

### Primary Actors and Use Cases

```
                    MindfulSpace Use Case Diagram

    Youth User (13-25)              System Admin              AI Service
         │                              │                        │
         │                              │                        │
    ┌────▼────┐                   ┌─────▼─────┐           ┌─────▼─────┐
    │         │                   │           │           │           │
    │ Chat    │◄──────────────────┤ Monitor   │           │ Process   │
    │ with AI │                   │ Usage     │           │ Request   │
    │         │                   │           │           │           │
    └────┬────┘                   └─────┬─────┘           └─────┬─────┘
         │                              │                       │
    ┌────▼────┐                   ┌─────▼─────┐           ┌─────▼─────┐
    │ Track   │                   │ Update    │           │ Generate  │
    │ Mood    │                   │ Resources │           │ Response  │
    │         │                   │           │           │           │
    └────┬────┘                   └─────┬─────┘           └─────┬─────┘
         │                              │                       │
    ┌────▼────┐                   ┌─────▼─────┐           ┌─────▼─────┐
    │ Access  │                   │ Review    │           │ Apply     │
    │ Resources│                  │ Analytics │           │ Safety    │
    │         │                   │           │           │ Filters   │
    └────┬────┘                   └───────────┘           └───────────┘
         │
    ┌────▼────┐
    │ Get     │
    │ Crisis  │
    │ Support │
    └─────────┘

Use Cases for Youth User:
• UC1: Start Chat Session
• UC2: Send Message to AI
• UC3: Receive Personalized Response
• UC4: Track Mood Patterns
• UC5: Access Wellness Resources
• UC6: Get Crisis Support
• UC7: View Usage Statistics
• UC8: Set Wellness Goals

Use Cases for System Admin:
• UC9: Monitor Platform Usage
• UC10: Update Resource Database
• UC11: Review User Analytics
• UC12: Configure AI Parameters

Use Cases for AI Service:
• UC13: Process User Input
• UC14: Generate Youth-Appropriate Response
• UC15: Apply Content Safety Filters
• UC16: Detect Mood Patterns
```

---

## 3. SYSTEM ARCHITECTURE DIAGRAM

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (PWA)                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐   │
│  │    Chat     │ │    Mood     │ │  Wellness   │ │ Settings │   │
│  │ Component   │ │   Tracker   │ │ Resources   │ │Component │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────────────┐
│                         BUSINESS LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Backend Server                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐   │
│  │    Chat     │ │    Mood     │ │  Resource   │ │   Rate   │   │
│  │   Routes    │ │   Routes    │ │   Routes    │ │ Limiting │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                ↕ API Calls
┌─────────────────────────────────────────────────────────────────┐
│                       INTEGRATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│  │  Google Gemini  │ │   Gemini API    │ │   Youth Filter  │    │
│  │   Pro Service   │ │   Integration   │ │    Service      │    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                ↕ File I/O
┌─────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐   │
│  │   Moods     │ │  Resources  │ │  Response   │ │  User    │   │
│  │   JSON      │ │    JSON     │ │    JSON     │ │LocalStore│   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. DETAILED CHAT FLOW DIAGRAM

### AI Chat Processing Flow

```
User Input
     ↓
┌─────────────────┐
│ Input Validation│
│ • Length Check  │
│ • Content Filter│
└─────┬───────────┘
      ↓
┌─────────────────┐    Rate Limit    ┌─────────────────┐
│ Rate Limit Check│ ──── Exceeded ──→│ Show Warning    │
│ (50 req/hour)   │                  │ + Suggest Wait  │
└─────┬───────────┘                  └─────────────────┘
      ↓ (Within Limit)
┌─────────────────┐
│ Prepare API Call│
│ • Add Context   │
│ • Youth Prompt  │
└─────┬───────────┘
      ↓
┌─────────────────┐    API Fails     ┌─────────────────┐
│ Google Gemini   │ ──────────────→  │ Fallback System │
│ API Request     │                  │ • Mock Response │
└─────┬───────────┘                  │ • Local Data    │
      ↓ (Success)                    └─────┬───────────┘
┌─────────────────┐                        ↓
│ Response Filter │                        ↓
│ • Safety Check  │ ←──────────────────────┘
│ • Youth Adapt   │
└─────┬───────────┘
      ↓
┌─────────────────┐
│ Mood Detection  │
│ • Sentiment     │
│ • Keywords      │
└─────┬───────────┘
      ↓
┌─────────────────┐
│ Display Response│
│ • Format Text   │
│ • Add Resources │
│ • Update UI     │
└─────────────────┘
```

---

## 5. COMPONENT INTERACTION DIAGRAM

### Frontend Component Relationships

```
                    App.jsx (Root Component)
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Header.jsx       Chat.jsx         Settings.jsx
        │                │                │
        │      ┌─────────┼─────────┐      │
        │      │         │         │      │
        │  MoodTracker Wellness  Home    │
        │      │      │     │       │     │
        │      │      │     │       │     │
   Navigation   │   Resources│   Welcome   │
              Mood      │   Screen      │
            History   Crisis          │
                    Support         │
                                  Storage
                                 Utils

Data Flow:
Chat.jsx ──→ geminiService.js ──→ Google Gemini API
    ↓                 ↓
localStorage ←── Rate Limiting ←── Response Processing
    ↓
MoodTracker.jsx ──→ Mood Analysis ──→ Wellness.jsx
```

---

## 6. SECURITY FLOW DIAGRAM

### Data Protection and Safety Measures

```
User Input
     ↓
┌─────────────────┐
│ Client-Side     │
│ Input Validation│
│ • XSS Prevention│
│ • Length Limits │
└─────┬───────────┘
      ↓
┌─────────────────┐
│ Rate Limiting   │
│ • 50 req/hour   │
│ • User Tracking │
│ • Reset Timer   │
└─────┬───────────┘
      ↓
┌─────────────────┐
│ Content Filter  │
│ • Crisis Words  │
│ • Harmful Content│
│ • Spam Detection│
└─────┬───────────┘
      ↓
┌─────────────────┐
│ API Security    │
│ • HTTPS Only    │
│ • API Key Auth  │
│ • Header Secure │
└─────┬───────────┘
      ↓
┌─────────────────┐
│ Response Safety │
│ • Content Review│
│ • Youth Filter  │
│ • Resource Links│
└─────┬───────────┘
      ↓
┌─────────────────┐
│ Data Storage    │
│ • Local Only    │
│ • No Sensitive  │
│ • Session Based │
└─────────────────┘
```

---

## 7. DEPLOYMENT ARCHITECTURE

### Production Environment Setup

```
┌─────────────────────────────────────────────────────────────┐
│                      CLOUD INFRASTRUCTURE                  │
│                                                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Frontend  │    │   Backend   │    │  External   │    │
│  │   (Vercel/  │    │  (Railway/  │    │  Services   │    │
│  │   Netlify)  │    │   Heroku)   │    │             │    │
│  │             │    │             │    │             │    │
│  │ React PWA   │◄──►│ Express.js  │◄──►│ Google      │    │
│  │ Static      │    │ Node.js     │    │ Gemini API  │    │
│  │ Assets      │    │ JSON Files  │    │             │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│        ▲                   ▲                   ▲          │
│        │                   │                   │          │
│  ┌─────▼─────┐    ┌────────▼────────┐ ┌────────▼────────┐ │
│  │   CDN     │    │   Environment   │ │   API Gateway   │ │
│  │ (Global   │    │   Variables     │ │   Rate Limits   │ │
│  │ Caching)  │    │   Secrets Mgmt  │ │   Monitoring    │ │
│  └───────────┘    └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────▼─────────┐
                    │      USERS        │
                    │                   │
                    │ • Web Browsers    │
                    │ • Mobile Devices  │
                    │ • PWA Install     │
                    └───────────────────┘
```

---

## Visual Implementation Tips:

### For PowerPoint/Presentation Tools:
1. **Use SmartArt Graphics** for flowcharts
2. **Apply consistent colors** - blues/greens for wellness theme
3. **Add icons** from the icon library for each component
4. **Animate flows** with entrance effects
5. **Group related elements** with subtle backgrounds

### Recommended Tools:
- **PowerPoint SmartArt** - Built-in diagram tools
- **Draw.io** - Free online diagram maker
- **Lucidchart** - Professional diagramming
- **Canva** - Easy-to-use with templates
- **Figma** - For detailed UI mockups

### Color Coding Suggestions:
- **User Actions**: Blue (#4A90E2)
- **System Processes**: Green (#7ED321)
- **External Services**: Orange (#F5A623)
- **Data Storage**: Gray (#9B9B9B)
- **Error/Warning**: Red (#D0021B)

These diagrams will make your technical presentation much more engaging and help the audience understand the sophisticated architecture behind your MindfulSpace platform!