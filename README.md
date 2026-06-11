# QuizHub - Online Quiz Platform

QuizHub je moderna web aplikacija za kreiranje i rešavanje kvizova, razvijena koristeći .NET 8 Web API backend i React frontend.

## 🚀 Funkcionalnosti

### Za korisnike:
- **Registracija i prijava** - Kreiranje naloga i bezbedna autentifikacija
- **Pregled kvizova** - Pretraživanje kvizova po kategorijama i težini
- **Rešavanje kvizova** - Interaktivno rešavanje kvizova sa vremenskim ograničenjem
- **Praćenje rezultata** - Pregled ličnih rezultata i statistika
- **Leaderboard** - Rangiranje najboljih igrača globalno i po kategorijama

### Za administratore:
- **Upravljanje kvizovima** - Kreiranje, editovanje i brisanje kvizova
- **Upravljanje kategorijama** - Dodavanje i organizovanje kategorija
- **Analitika** - Detaljni uvid u statistike i rezultate svih korisnika
- **Admin dashboard** - Centralizovani pregled svih aktivnosti

## 🛠️ Tehnologije

### Backend (.NET 8)
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core** - ORM za rad sa bazom podataka
- **SQL Server** - Relaciona baza podataka
- **AutoMapper** - Mapiranje objekata
- **JWT Authentication** - Bezbedna autentifikacija
- **Clean Architecture** - Organizacija koda

### Frontend (React)
- **React 18** - Moderna JavaScript biblioteka
- **React Router** - Navigacija između stranica
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Ikone
- **React Hook Form** - Upravljanje formama
- **React Hot Toast** - Notifikacije

## 📁 Struktura projekta

```
KvizHub/
├── src/
│   ├── KvizHub.API/              # Web API kontroleri
│   ├── KvizHub.Application/      # Biznis logika i servisi
│   ├── KvizHub.Domain/           # Entiteti i interfejsi
│   └── KvizHub.Infrastructure/   # Implementacija repozitorijuma
├── frontend/
│   ├── src/
│   │   ├── components/           # React komponente
│   │   ├── pages/               # Stranice aplikacije
│   │   ├── services/            # API servisi
│   │   ├── store/               # Redux store
│   │   └── hooks/               # Custom React hooks
│   └── public/                  # Statički fajlovi
└── README.md
```

## 🚦 Pokretanje aplikacije

### Preduslovi
- .NET 8 SDK
- Node.js (v18 ili noviji)
- SQL Server ili SQL Server Express
- Visual Studio 2022 ili VS Code

### Backend setup

1. **Kloniraj repozitorijum**
 ```bash
 git clone <repository-url>
 cd quiz-hub-project
 ```

### 📌 Kreiranje konfiguracije

U folderu:

QuizHub-api/QuizHub-api/

napravi fajl:

appsettings.json

i ubaci sledeće:
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

---
### 📦 Instalacija dependencies
 ```bash
cd QuizHub-api
dotnet restore
```
---


3. **Pokreni migracije**
```bash
dotnet ef database update
```

4. **Pokreni backend**
```bash
dotnet run
```
Backend će biti dostupan na `https://localhost:7244`

### Frontend setup

1. **Instaliraj dependencies**
```bash
cd frontend
npm install
 ```
### ⚙️ Environment (.env)

U frontend folderu napravi .env:
```env
VITE_API_BASE_URL=https://localhost:7244/api
VITE_API_URL=https://localhost:7244
VITE_APP_NAME=KvizHub
```
---

2. **Pokreni frontend**
```bash
npm run dev
```
Frontend će biti dostupan na `http://localhost:5173`

## 📊 Baza podataka

Aplikacija koristi SQL Server sa sledećim glavnim tabelama:
- **Users** - Korisnički nalozi
- **Categories** - Kategorije kvizova
- **Quizzes** - Kvizovi
- **Questions** - Pitanja
- **QuizAttempts** - Pokušaji rešavanja kvizova
- **UserAnswers** - Odgovori korisnika

## 🔐 Autentifikacija

Aplikacija koristi JWT (JSON Web Token) autentifikaciju:
- Tokeni se čuvaju u localStorage
- Automatsko osvežavanje sesije
- Role-based pristup (User/Admin)

## 🎨 UI/UX

Aplikacija koristi moderni, responzivni dizajn sa:
- **Tailwind CSS** za stilizovanje
- **Accessibility** standardi
- **Smooth animations** i tranzicije


