# Music Data Explorer

🌐 **Live Demo:** [https://music-data-explorer.vercel.app/](https://music-data-explorer.vercel.app/)

---

## 🧩 Tech Stack

- **Next.js 15 (App Router)** → Used as both backend and frontend framework in a single project.  
  I chose Next.js to integrate **API Routes** and **React frontend** within one structure, 
  optimizing development speed (less scalable for large projects, but ideal for this challenge).

- **React (with React Compiler)** → Leveraged the new React Compiler to optimize component rendering performance.  
  First time using it — helped improve UI efficiency.

- **TypeScript** → Added for static typing and reliable autocompletion.

- **ESLint** → Keeps code consistent, clean, and detects potential issues early.

- **TailwindCSS** → Used for fast prototyping and consistent responsive design directly within JSX.

- **Recharts** → Library for building the data visualizations (popularity, duration, etc.).

---

## 🎯 Data Visualization Strategy

Initially, I aimed to use Spotify’s **Audio Features** and **Audio Analysis** endpoints to visualize musical attributes 
like *danceability*, *energy*, and *valence*.  
However, these endpoints turned out to be **deprecated or unavailable** using the public (client credentials) authentication flow.  

So, I **pivoted the data strategy** to focus on endpoints still available in Spotify’s public API:

- `/search` → search artists by name.  
- `/artists/{id}/top-tracks` → fetch top songs for a given artist.  
- `/artists/{id}/albums` → retrieve discography and release dates.  
- `/browse/new-releases` → list recent album releases to display “recommended” artists.

Using these, I was able to visualize meaningful data such as:
- **Average popularity** of tracks and albums.  
- **Average track duration** per album.  
- **Popularity trends** over the years.  
- **Album release activity** (count and type per year).

---

## 🧠 Development Process

### 1️⃣ Planning
The project began with defining the main goal: build a full-stack app that consumes Spotify’s API 
and presents meaningful insights about an artist through visual and interactive charts.  
The initial idea was to explore **musical analytics** in a clean, data-driven interface.

### 2️⃣ Stack Selection
I chose **Next.js** because it allows building both the **backend (API Routes)** and **frontend (React)** in a single environment.  
This streamlined integration between data and UI.  
Additionally, **TailwindCSS** was chosen for styling and **Recharts** for data visualization.

### 3️⃣ Backend Development
The first step was implementing all the backend routes under `/api/spotify`, 
responsible for communicating with Spotify’s Web API.

Each endpoint has a specific role:
- `/search` → search artists.  
- `/top-tracks` → fetch top tracks of an artist.  
- `/albums` → get albums with average track duration and release year.  
- `/albums/details` → get extended album info.  
- `/artist-insights` → consolidate artist data into one unified response.  
- `/new-releases` → fetch recently released artists to display on the homepage.

All endpoints rely on a `spotify.ts` helper for authentication and API token management.

### 4️⃣ Frontend Development
Once the backend was solid, I built the frontend using **Next.js App Router** routes:

- `/` → home page with search input and recommended artists.  
- `/artist/[id]` → artist detail page showing charts, statistics, and discography.

Each view was modularized using reusable components (`ArtistHeader`, `ArtistTopTracks`, `ArtistCharts`, etc.).

### 5️⃣ Visualization & UX
The **Artist Insights** section includes:
- A chart of **Popularity by Year**.  
- A chart of **Average Track Duration per Album**.  
- Stats cards showing total albums, average popularity, top track, etc.

Additionally, I implemented **infinite scroll** for artist search results 
and **toast notifications** (using Sonner) for errors and feedback.

---

## 🚀 Final Result

A full-stack **Next.js** application that allows users to:
- Search for artists and explore their music.  
- Visualize their discography and popularity trends.  
- Interact with real Spotify data through a modern, minimalistic UI.

All built with a performance-focused, single-project architecture.

---

## 📦 Deployment

The app is deployed on **Vercel**, the native Next.js hosting platform.  
This enables seamless integration of both the frontend and backend (API Routes) with no configuration needed.  
Environment variables (Spotify Client ID and Secret) were securely set in Vercel’s project dashboard.

🌐 **Live URL:** [https://music-data-explorer.vercel.app/](https://music-data-explorer.vercel.app/)

