# LearnSphere - Next.js Version

A beautiful, space-themed learning platform that transforms your notes into an interactive cosmic experience. This is a Next.js conversion of the original CosmoLearn React project.

## Features

- **Space-Themed UI**: Immersive cosmic design with animated backgrounds, stars, and nebula effects
- **Planet-Based Organization**: Organize subjects as planets in your personal learning universe
- **AI-Powered Tools**: 
  - AI Tutor for personalized explanations
  - Quiz Generator for practice questions
  - Summarizer for concise content summaries
- **File Upload**: Drag and drop support for PDF, TXT, DOC, and DOCX files
- **Responsive Design**: Fully responsive across all devices
- **Modern UI Components**: Built with shadcn/ui and Radix UI

## Tech Stack

- **Framework**: Next.js 15.3.4
- **Language**: JavaScript (converted from TypeScript)
- **Styling**: Tailwind CSS with custom space theme
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: React Query (TanStack Query)
- **Animations**: Custom CSS animations and Tailwind CSS

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Space-themed CSS with animations
│   ├── layout.js            # Root layout with metadata
│   └── page.js              # Main page component
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── tabs.jsx
│   │   ├── textarea.jsx
│   │   ├── toast.jsx
│   │   ├── toaster.jsx
│   │   ├── sonner.jsx
│   │   └── tooltip.jsx
│   ├── App.jsx              # Main app component with routing
│   ├── Dashboard.jsx        # Dashboard with planet cards
│   ├── LandingPage.jsx      # Landing page with hero section
│   ├── LoginScreen.jsx      # Login form
│   ├── PlanetCard.jsx       # Individual planet/subject card
│   ├── SubjectDetail.jsx    # Subject detail with AI tools
│   └── UploadNotes.jsx      # File upload interface
├── hooks/
│   └── use-toast.js         # Toast notification hook
└── lib/
    └── utils.js             # Utility functions
```

## Key Features

### Landing Page
- Animated cosmic background with floating particles
- Hero section with gradient text effects
- Feature showcase with glass morphism cards

### Login Screen
- Space-themed login form
- Animated background effects
- Form validation and loading states

### Dashboard
- Planet-based subject organization
- Search functionality
- Create new subjects
- Upload notes integration

### Subject Detail
- AI Tutor for Q&A
- Quiz Generator for practice
- Summarizer for content analysis
- Tabbed interface for different tools

### Upload Notes
- Drag and drop file upload
- Multiple file support
- File type validation
- Progress tracking

## Customization

### Colors
The space theme uses custom colors defined in `tailwind.config.js`:
- `space-deep`: Deep space background
- `space-dark`: Dark space variants
- `space-accent`: Purple accent color
- `space-bright`: Bright purple
- `space-star`: Golden star color
- `space-nebula`: Pink nebula color

### Animations
Custom CSS animations are defined in `globals.css`:
- `twinkle`: Star twinkling effect
- `cosmic-float`: Floating particle animation
- `nebula-float`: Nebula movement
- `text-shimmer`: Gradient text animation

## Deployment

This is a Next.js application that can be deployed to:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

## Conversion Notes

This project was converted from a React + Vite + TypeScript project to Next.js + JavaScript. Key changes:

- Removed TypeScript types and converted to JavaScript
- Replaced React Router with Next.js App Router
- Converted Vite build system to Next.js
- Maintained all original functionality and design
- Added proper Next.js metadata and SEO

## License

This project is part of the LearnSphere learning platform.
