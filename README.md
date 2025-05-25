# Social Media Kaka

## Overview
Social Media Kaka is a full-featured social media platform that allows users to connect, share posts, chat, and interact with each other. The application provides features like posts, comments, likes, messaging, friend relationships, notifications, and bookmarks.

## Tech Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Architecture**: Clean Architecture
  - Domain Layer: Contains business entities and rules
  - Application Layer: Contains business logic and use cases
  - Infrastructure Layer: Contains implementation details
  - Web Layer: Contains API endpoints and web UI integration
- **API Documentation**: Swagger/OpenAPI
- **Real-time Communication**: SignalR (for chat and notifications)
- **Logging**: Serilog

### Frontend
- **Framework**: Next.js 14
- **State Management**: React Query
- **UI Components**: 
  - Radix UI
  - Tailwind CSS
  - Framer Motion (animations)
- **Form Handling**: React Hook Form with Zod validation
- **Rich Text Editor**: TipTap
- **File Uploads**: UploadThing
- **Testing**: Jest, React Testing Library, Playwright

## Features
- **Authentication & Authorization**
- **User Profiles**
- **Posts Management**:
  - Create, read, update, delete posts
  - Media uploads (images/videos)
  - Like/unlike posts
- **Comments System**:
  - Add, view, delete comments
  - Like/unlike comments
- **Friend/Follow System**:
  - Follow/unfollow users
  - Friend relationships
- **Messaging System**:
  - Real-time chat using SignalR
  - Conversation management
- **Notifications**:
  - Real-time notifications for activities
- **Bookmarks**:
  - Save posts for later viewing
- **Search Functionality**
- **Responsive Design**

## Project Structure

### Backend
```
src/
├── core/
│   ├── Domain/         # Business entities, enums, exceptions
│   └── Application/    # Business logic, use cases, DTOs
├── Web/                # API endpoints, controllers, hubs
├── external/           # External services integration
└── Infrastructure/     # Data access, external services implementations
```

### Frontend
```
src/Web/ClientApp/
├── src/                # Source code
├── public/             # Static assets
└── __tests__/          # Test files
```

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 20.x
- Docker (optional, for containerized deployment)

### Development Setup
1. Clone the repository
```bash
git clone https://github.com/your-username/Social-Media-Kaka.git
cd Social-Media-Kaka
```

2. Set up the backend
```bash
cd src/Web
dotnet restore
dotnet build
```

3. Set up the frontend
```bash
cd ClientApp
npm install
```

4. Run the application
```bash
# In src/Web directory
dotnet run

# In a separate terminal, in src/Web/ClientApp directory
npm run dev
```

5. Access the application
- API: http://localhost:5000/api
- Frontend: http://localhost:3000

### Docker Deployment
The application can be containerized using Docker:

```bash
# Build and run the Docker container
docker build -t social-media-kaka .
docker run -p 80:80 -p 443:443 social-media-kaka
```

## Testing
- **Backend Tests**: `dotnet test`
- **Frontend Unit Tests**: `npm test` (in ClientApp directory)
- **E2E Tests**: `npm run e2e` (in ClientApp directory)

## License
[Specify your license here]

## Contributors
[List contributors here] 