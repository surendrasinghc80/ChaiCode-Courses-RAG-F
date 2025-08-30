# ChaiCode-Courses-RAG-F Frontend

A modern, AI-powered course management and chat interface built with Next.js that provides an intuitive frontend for the ChaiCode RAG (Retrieval-Augmented Generation) platform. This application enables users to interact with course content through intelligent conversations, manage educational resources, and access powerful administrative tools.

## 🚀 Features

### **Core Features**
- **🎯 AI-Powered Chat Interface**: Interactive conversations with course content using OpenAI's GPT models
- **📚 Course Management**: Complete CRUD operations for educational courses
- **🔐 Role-Based Authentication**: Secure login with admin and user roles
- **📱 Responsive Design**: Modern UI built with Radix UI and TailwindCSS
- **🎨 Dark/Light Theme**: Seamless theme switching with system preference detection
- **📊 Admin Dashboard**: Comprehensive platform management and analytics

### **Advanced Features**
- **🎵 Text-to-Speech**: ElevenLabs integration for audio playback of AI responses
- **📄 Source Citations**: Real-time display of content sources with confidence scores
- **💬 Conversation Management**: Save, archive, share, and organize chat sessions
- **📈 Analytics Dashboard**: User engagement metrics and platform statistics
- **🔄 Real-time Updates**: Live conversation updates and message streaming
- **📋 Message Feedback**: User rating system for AI responses

### **User Experience**
- **🌟 Beautiful Landing Page**: Animated hero section with feature highlights
- **🎯 Smart Routing**: Automatic role-based redirects after authentication
- **⚡ Fast Performance**: Optimized with Next.js App Router and server components
- **🔍 Search & Filter**: Advanced conversation and course filtering capabilities
- **📱 Mobile-First**: Fully responsive design for all device sizes

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 14+** - React framework with App Router
- **React 18+** - Component-based UI library
- **TypeScript** - Type-safe JavaScript

### **UI & Styling**
- **Radix UI** - Accessible component primitives
- **TailwindCSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon library
- **Framer Motion** - Animation library

### **Authentication & API**
- **NextAuth.js** - Authentication framework
- **Axios** - HTTP client with interceptors
- **JWT** - Token-based authentication

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Sonner** - Toast notifications

## 📋 Prerequisites

Before setting up the frontend, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **ChaiCode-Courses-RAG-B** backend server running
- Environment variables configured

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ChaiCode-Courses-RAG-F
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Optional: Custom configurations
NEXT_PUBLIC_APP_NAME=ChaiCode RAG
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
ChaiCode-Courses-RAG-F/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   └── tts/                  # Text-to-speech endpoints
│   ├── app/                      # Main chat application
│   ├── archives/                 # Archived conversations
│   ├── conversation/             # Individual conversation pages
│   ├── dashboard/                # Admin dashboard
│   ├── login/                    # Authentication page
│   ├── layout.jsx                # Root layout
│   └── page.jsx                  # Home page
├── components/                   # React components
│   ├── admin/                    # Admin-specific components
│   ├── ui/                       # Reusable UI components
│   ├── chat-interface.jsx        # Main chat component
│   ├── chat-sidebar.jsx          # Conversation sidebar
│   ├── course-management.jsx     # Course CRUD interface
│   ├── landing-page.jsx          # Marketing landing page
│   └── theme-toggle.jsx          # Dark/light theme switcher
├── lib/                          # Utility libraries
│   ├── api.js                    # API client functions
│   ├── auth.js                   # NextAuth setup
│   ├── auth.config.js            # Auth configuration
│   └── utils.ts                  # Helper utilities
├── public/                       # Static assets
├── .env.example                  # Environment template
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
└── tailwind.config.js            # TailwindCSS configuration
```

## 🎯 Usage Guide

### **For Students/Users**

1. **Getting Started**
   - Visit the landing page to learn about features
   - Click "Get Started" to access the login page
   - Sign up or log in with your credentials

2. **Using the Chat Interface**
   - Access the main chat at `/app`
   - Start new conversations or continue existing ones
   - Ask questions about course content
   - Use text-to-speech for audio responses
   - Rate AI responses with thumbs up/down

3. **Managing Conversations**
   - View all conversations in the sidebar
   - Search conversations by title or content
   - Rename, archive, or delete conversations
   - Share conversations with others

### **For Administrators**

1. **Admin Dashboard**
   - Access the dashboard at `/dashboard`
   - View platform statistics and user metrics
   - Monitor system health and usage

2. **Course Management**
   - Create new courses with metadata
   - Upload VTT subtitle files for content
   - Edit course details and pricing
   - Manage course activation status

3. **User Management**
   - View all registered users
   - Grant/revoke course access
   - Block/unblock users
   - Reset user message limits

## 🔧 Configuration

### **API Integration**
The frontend communicates with the backend through:
- **Authentication**: JWT tokens via NextAuth
- **Course APIs**: CRUD operations for courses
- **Chat APIs**: Message sending and conversation management
- **Admin APIs**: User management and analytics

### **Theme Configuration**
- Supports system preference detection
- Manual theme switching
- Persistent theme storage
- CSS custom properties for theming

### **Authentication Flow**
1. User submits credentials
2. NextAuth validates with backend API
3. JWT token stored in session
4. Role-based redirect (admin → dashboard, user → app)
5. API requests include auth headers

## 🚀 Deployment

### **Vercel Deployment (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Environment Variables for Production**
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-frontend-domain.com
```

## 🎯 Target Customers

### **Primary Customers**

1. **🎓 Educational Institutions**
   - Universities and colleges
   - Online learning platforms
   - Corporate training departments
   - Professional development organizations

2. **👨‍🏫 Course Creators & Educators**
   - Independent instructors
   - Subject matter experts
   - Training consultants
   - Educational content producers

3. **🏢 Enterprise Organizations**
   - Companies with internal training programs
   - HR departments managing employee development
   - Consulting firms delivering client training
   - Technology companies with documentation needs

### **Use Cases**

- **📚 Interactive Learning**: Students can ask questions about course content and get instant, contextual answers
- **🎯 Personalized Education**: AI-powered responses tailored to individual learning needs
- **📊 Learning Analytics**: Track student engagement and identify knowledge gaps
- **🔄 Content Management**: Efficiently organize and update educational materials
- **👥 Scalable Support**: Reduce instructor workload with automated Q&A assistance

### **Industry Applications**

- **Technology Training**: Programming courses, software tutorials, technical documentation
- **Professional Development**: Business skills, leadership training, certification programs
- **Academic Education**: University courses, research materials, study guides
- **Compliance Training**: Regulatory requirements, safety protocols, policy updates

## 🔒 Security Features

- **🛡️ JWT Authentication**: Secure token-based authentication
- **🔐 Role-Based Access**: Admin and user permission levels
- **🚫 Route Protection**: Middleware-based route guarding
- **🔄 Token Refresh**: Automatic session management
- **🌐 CORS Configuration**: Secure cross-origin requests

## 📈 Performance Optimizations

- **⚡ Next.js App Router**: Server-side rendering and static generation
- **🎯 Code Splitting**: Automatic bundle optimization
- **🖼️ Image Optimization**: Next.js Image component
- **📱 Responsive Design**: Mobile-first approach
- **🔄 API Caching**: Efficient data fetching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the backend repository

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added text-to-speech and enhanced UI
- **v1.2.0** - Improved admin dashboard and analytics

---

**Built with ❤️ by the ChaiCode Team**
