# QuizHub - Online Quiz Platform

QuizHub is a modern web application for creating and solving quizzes, built with a **.NET 8** Web API backend and a **React** frontend. It features real-time multiplayer capabilities powered by **SignalR**.

## 🚀 Features

### For Users
- **Registration & Login** — Account creation and secure authentication
- **Browse Quizzes** — Search quizzes by category and difficulty
- **Solve Quizzes** — Interactive quiz solving with a time limit
- **Track Results** — View personal results and statistics
- **Leaderboard** — Global and per-category player rankings

### For Admins
- **Quiz Management** — Create, edit, and delete quizzes
- **Category Management** — Add and organize categories
- **Analytics** — Detailed statistics and results for all users
- **Admin Dashboard** — Centralized overview of all activity
---
## 🛠️ Tech Stack
 
### Backend (.NET 8)
| Technology | Purpose |
|---|---|
| ASP.NET Core Web API | RESTful API |
| Entity Framework Core | ORM / database access |
| SQL Server | Relational database |
| SignalR | Real-time communication |
| AutoMapper | Object mapping |
| JWT Authentication | Secure token-based auth |
| Clean Architecture | Layered project structure |

### Frontend (React)
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| React Router | Client-side routing |
| Redux Toolkit | State management |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| React Hook Form | Form handling |
| React Hot Toast | Notifications |
 
---

## 📁 Project Structure
 
```
QuizHub/
├── src/
│   ├── KvizHub.API/              # Web API controllers
│   ├── KvizHub.Application/      # Business logic and services
│   ├── KvizHub.Domain/           # Entities and interfaces
│   └── KvizHub.Infrastructure/   # Repository implementations
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Application pages
│   │   ├── services/             # API services
│   │   ├── store/                # Redux store
│   │   └── hooks/                # Custom React hooks
│   └── public/                   # Static files
└── README.md
```
 
---

## 🚦 Getting Started
 
### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js v18+](https://nodejs.org/)
- SQL Server or SQL Server Express
- Visual Studio 2022 or VS Code
---

### Backend Setup
 
**1. Clone the repository**
 ```bash
 git clone <repository-url>
 cd quiz-hub-project
 ```

**2. Create the configuration file**
 
Inside `QuizHub-api/QuizHub-api/`, create a file named `appsettings.json`:
 
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY",
    "Issuer": "KvizHub",
    "Audience": "KvizHub-Users",
    "ExpirationInMinutes": 60
  },
  "DefaultAdmin": {
    "Username": "YOUR_ADMIN_USERNAME",
    "Email": "YOUR_ADMIN_EMAIL",
    "Password": "YOUR_ADMIN_PASSWORD"
  },
  "Cloudinary": {
    "CloudName": "YOUR_CLOUD_NAME",
    "ApiKey": "YOUR_CLOUDINARY_API_KEY",
    "ApiSecret": "YOUR_CLOUDINARY_API_SECRET"
  },
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_CONNECTION_STRING"
  },
  "AllowedHosts": "*"
}
```
> ℹ️ **Cloudinary is optional.** It's only used for profile picture uploads. If you don't configure it, the rest of the app will work fine — just leave the placeholder values or an empty string, and skip the profile picture feature.

**3. Install dependencies**
 ```bash
cd QuizHub-api
dotnet restore
```

**4. Apply database migrations**

> Note: `dotnet ef` commands must be run from the folder containing the `.csproj` file (`QuizHub-api/QuizHub-api`).

```bash
cd QuizHub-api
dotnet ef database update
```

If `dotnet ef` is not found, install the tool globally:
```bash
dotnet tool install --global dotnet-ef
```

**5. Run the backend**
```bash
dotnet run
```
The backend will be available at `https://localhost:7244`

---
 
### Frontend Setup
 
**1. Install dependencies**
```bash
cd frontend
npm install
```

**2. Create the environment file**
 
Inside the `frontend/` folder, create a `.env` file:
 
```env
VITE_API_BASE_URL=https://localhost:7244/api
VITE_API_URL=https://localhost:7244
VITE_APP_NAME=KvizHub
```

**3. Run the frontend**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

---
 
## 📊 Database
 
The application uses SQL Server with the following main tables:
 
| Table | Description |
|---|---|
| `Users` | User accounts |
| `Categories` | Quiz categories |
| `Quizzes` | Quizzes |
| `Questions` | Questions |
| `QuizAttempts` | Quiz attempt records |
| `UserAnswers` | User responses |
 
---

## 🔐 Authentication
 
- JWT tokens stored in `localStorage`
- Automatic session refresh
- Role-based access control: **User** / **Admin**

