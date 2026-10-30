# CineSuggest – AI Movie Recommender

> **Your Next Favourite Movie Starts Here.**  
> An intelligent, mood-aware cinema discovery platform powered by **Google Gemini AI**, verified metadata & streaming availability from **The Movie Database (TMDB)** & **JustWatch**, and **MongoDB Atlas**.

---

## 🌟 Overview

**CineSuggest** is a full-stack, production-ready AI movie discovery application. Instead of forcing users to browse through hundreds of endless catalog rows, CineSuggest enables users to articulate their tastes in plain natural language (e.g., *"I want a mind-bending science fiction movie with an unexpected ending, something similar to Interstellar"* or *"Recommend fun feel-good Telugu family comedy movies"*), combined with their current mood, preferred genres, and languages.

The platform uses Google Gemini's structured generative intelligence to understand semantic intent, cross-references TMDB to verify factual metadata, and integrates JustWatch data to tell users **exactly where the movie is currently streaming (OTT)** across regions like India and the US.

---

## ✨ Features

- 🧠 **Natural Language AI Recommendations**: Formulate complex movie queries describing feelings, plot twists, cinematography, pacing, or aesthetic preferences.
- 📺 **Where to Watch / OTT Streaming Details**:
  - **Live Subscription Platforms**: Shows official streaming platforms like **Netflix, Amazon Prime Video, Disney+ Hotstar / JioHotstar, Zee5, Aha, SonyLIV, VI Movies, Apple TV+**, etc.
  - **Interactive Country Switcher**: Easily toggle between 🇮🇳 **India**, 🇺🇸 **USA**, and 🌐 **Global** regions to view country-specific streaming catalogs.
  - **Rent & Buy Options**: Displays digital rental and purchase availability (Apple TV Store, Google Play, YouTube Movies, Amazon Video).
  - **Official JustWatch Link**: Direct 1-click button to view all regional streaming options.
  - **Quick OTT Card Badges**: Mini streaming provider badges directly visible on movie cards across Home, Discover Studio, and Favourites.
- 🌐 **Deep Multilingual Support**: Seamless recommendations across Indian regional cinema (Telugu, Hindi, Tamil, Malayalam, Kannada) and international industries (Korean, Japanese, Spanish, French, English).
- 🎭 **Mood & Vibe Engine**: 8 dynamic moods (*Happy, Sad, Excited, Curious, Relaxed, Romantic, Adventurous, Suspenseful*) paired with genre and language filtering.
- 🛡️ **Verified TMDB Metadata**: Factual release years, accurate TMDB star ratings, high-res posters, and backdrops—never fabricated AI statistics.
- 💡 **AI Match Score & Explanation**: Each recommendation details *why* the film fits your mood, along with an AI-estimated match percentage.
- ❤️ **Persistent Favourites Library**: Add and remove movies from your personal collection, backed by MongoDB Atlas with duplicate prevention.
- 📜 **Recommendation History**: Revisit previous AI queries and recommended movie sets with one-click deletion of individual sessions.
- 🎬 **Comprehensive Movie Details**: In-depth view with backdrops, synopsis, runtime, official genres, similar titles, and embedded trailer previews.
- 🎨 **Cinematic Dark Design**: Crafted with an ultra-sleek dark palette (`#09090B`), vibrant violet gradients (`#8B5CF6`), subtle glassmorphism, and responsive layouts.
- 🔒 **Privacy-Preserving Guest Sessions**: Anonymous session IDs ensure private user libraries without cumbersome mandatory sign-up walls.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | [Next.js](https://nextjs.org/) (v16 App Router) | React 19, Turbopack, Server & Client Components |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) | Base-nova styling, Glassmorphism, Responsive design |
| **Icons & Motion** | [Lucide React](https://lucide.dev/) & [Framer Motion](https://www.framer.com/motion/) | Cinematic micro-interactions |
| **AI / GenAI** | [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`) | Multi-model fallback chain (`gemini-2.5-flash`, `gemini-1.5-flash`), Structured JSON schemas |
| **Movie & OTT Metadata** | [TMDB API](https://www.themoviedb.org/documentation/api) & [JustWatch](https://www.justwatch.com/) | Real-time search, posters, trailers, OTT streaming providers (`/watch/providers`) |
| **Backend** | Next.js API Route Handlers | Zod validation, HTTP-only session cookies |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/) | Connection pooling, compound unique indexes |
| **Deployment** | [Vercel](https://vercel.com/) | Edge-ready serverless deployment |

---

## 📐 Architecture & Flow

```
[ User Prompt + Mood + Genre + Language ]
                   │
                   ▼
       [ Next.js API Route Handler ]
       (/api/recommend with Zod validation)
                   │
           ┌───────┴───────┐
           ▼               ▼
    [ Google Gemini AI ]  [ Guest Session / Auth ]
    (Structured JSON)      (Unique isolated identity)
           │
           ▼
     [ TMDB API Validation & OTT Pipeline ]
     - Factual movie matching & posters
     - JustWatch OTT streaming availability (/watch/providers)
     - Regional providers: IN (Hotstar, Aha, Zee5), US (Netflix, Max, Prime)
           │
           ▼
     [ MongoDB Atlas Persistence ]
     (Save recommendation history & user library)
           │
           ▼
     [ Client UI (Glassmorphic Cards & Details) ]
     (Verified matches + AI explanation + OTT Badges + Trailer + Actions)
```

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18.18+ or v20+)
- `npm`, `pnpm`, or `yarn`
- (Optional) Free API keys for Google Gemini, TMDB, and a MongoDB Atlas cluster.

### 2. Clone and Install

```bash
git clone https://github.com/your-username/cinesuggest.git
cd cinesuggest
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# Google Gemini API Key (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# The Movie Database (TMDB) API Key (https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key_here

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cinesuggest?retryWrites=true&w=majority
```

> **Note on Zero-Config Fallback Mode:**  
> CineSuggest is equipped with intelligent offline fallback engines. If API keys are not supplied initially, the application operates smoothly with curated cinematic datasets and local session storage so you can explore all features right out of the box!

### 4. Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Documentation

### `POST /api/recommend`
Generates 5 personalized movie suggestions with verified metadata and streaming availability based on user specifications.
- **Request Body:**
  ```json
  {
    "prompt": "Suggest mind-bending science fiction movies",
    "mood": "Curious",
    "genre": "Science Fiction",
    "language": "English",
    "movieType": "Movies"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "rec_id",
      "recommendations": [
        {
          "id": 157336,
          "title": "Interstellar",
          "poster_path": "https://image.tmdb.org/t/p/w500/...",
          "vote_average": 8.4,
          "year": 2014,
          "aiReason": "A grand cosmic journey exploring love and gravity...",
          "matchScore": 98,
          "ottProviders": [
            {
              "provider_id": 119,
              "provider_name": "Amazon Prime Video",
              "logo_path": "https://image.tmdb.org/t/p/w92/..."
            }
          ]
        }
      ]
    }
  }
  ```

### `GET /api/favourites`
Retrieves all favourited movies for the current session.

### `POST /api/favourites`
Adds a movie to the user's favourites list (prevents duplicate entries).
- **Request Body:**
  ```json
  {
    "movieId": 157336,
    "title": "Interstellar",
    "posterPath": "/...",
    "releaseDate": "2014-11-05",
    "rating": 8.4,
    "genres": ["Adventure", "Drama", "Science Fiction"]
  }
  ```

### `DELETE /api/favourites/[movieId]`
Removes a movie from the user's favourites by its TMDB movie ID.

### `GET /api/history`
Returns past recommendation queries and results for the current session.

### `DELETE /api/history/[id]`
Deletes a specific recommendation history session.

### `GET /api/movies/[id]`
Fetches full movie metadata (overview, runtime, trailer keys, OTT streaming providers by country, and similar movies) directly from TMDB & JustWatch.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `TMDB_API_KEY`
   - `MONGODB_URI`
4. Click **Deploy**. Vercel will automatically build and deploy the production bundle.

---

## 🔮 Future Roadmap

- [x] Streaming availability badges ("Where to Watch" powered by JustWatch via TMDB).
- [x] Multi-region OTT switcher (India 🇮🇳, USA 🇺🇸, Global 🌐).
- [ ] AI Movie Comparison Matrix ("Compare 2 similar recommendations side-by-side").
- [ ] Spotify / Soundtrack preview integration.
- [ ] Voice input for hands-free natural language recommendations.
- [ ] Multi-user friend watch parties and shared recommendation lists.

---

## 📜 Attribution & License

- **TMDB Attribution**: This product uses the TMDB API but is not endorsed or certified by TMDB.
- **JustWatch Attribution**: Streaming provider data powered by JustWatch via TMDB.
- **License**: MIT License. Built with passion for cinema lovers.
