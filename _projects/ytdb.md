---
title: YTDB - YouTube Database
summary: A community-driven platform for discovering, rating, and reviewing YouTube videos with trust-weighted scoring
started: 2024-08-09
updated: 2024-08-19
type: web-app
github: https://github.com/jatoran/ytdb
stack:
  - JavaScript
  - React
  - Node.js
  - Express
  - MongoDB
  - YouTube Data API
tags:
  - data
  - developer-tools
  - automation
loc: 12000
files: 131
architecture:
  auth: JWT
  database: MongoDB
  api: REST
  realtime: none
  background: node-cron
  cache: in-memory
  search: none
---

## Overview

YTDB (YouTube Database) is a full-stack web application that transforms how users discover and evaluate YouTube content. Instead of relying solely on YouTube's algorithm-driven recommendations, YTDB provides a community-curated database where users can rate, review, and organize videos by categories and tags.

The platform features a trust-weighted rating system that gives more influence to established contributors, ensuring that video ratings reflect the opinions of engaged community members rather than drive-by ratings.

## Screenshots

<!-- SCREENSHOT: Main homepage showing featured video carousels organized by category with rating overlays -->
![Homepage](/images/projects/ytdb/screenshot-1.png)

<!-- SCREENSHOT: Video detail page displaying embedded YouTube player, trust-weighted rating, and user reviews -->
![Video Page](/images/projects/ytdb/screenshot-2.png)

<!-- SCREENSHOT: Advanced search interface with filters for duration, rating, view count, and tags -->
![Search Interface](/images/projects/ytdb/screenshot-3.png)

## Problem

YouTube's native search and recommendation systems prioritize engagement metrics (watch time, clicks) over content quality. Users seeking high-quality educational content, tutorials, or niche topics often struggle to filter through low-quality or clickbait videos. Additionally, YouTube's rating system (likes/dislikes) provides limited granularity and no weighted credibility.

YTDB addresses this by creating a parallel curation layer where:
- Videos are organized into meaningful categories and tagged with descriptive metadata
- Ratings use a 1-10 scale weighted by reviewer trust scores
- Users can build and share curated lists
- Advanced filtering enables precise content discovery

## Approach

### Stack

- **Frontend (React 18)** - SPA with lazy-loaded routes for performance, context-based state management for user sessions, lists, and watched videos
- **Backend (Express.js)** - RESTful API with rate limiting, input validation, and security middleware (Helmet, XSS protection, MongoDB sanitization)
- **Database (MongoDB)** - Document-based storage with Mongoose ODM, optimized with compound indexes for common query patterns
- **YouTube Integration** - Google APIs for fetching video metadata, thumbnail, and channel information when users submit new videos
- **Scheduled Jobs (node-cron)** - Background tasks for updating video statistics, recalculating weighted ratings, and running backups

### Challenges

- **Trust Score Gaming** - Implemented a multi-factor trust calculation that considers account age, review quality (length/likes received), and contribution history to prevent score manipulation. Scores are capped at 1000 and require diverse activity types.

- **Related Video Discovery** - Built a TF-IDF similarity engine using the `natural` library to recommend related videos based on title, tags, and category similarity with stop-word filtering and cosine similarity scoring.

- **Weighted Ratings** - Created a system where video ratings are weighted by reviewer trust scores, making established contributors' opinions more influential while still allowing new users to participate.

```javascript
// Trust-weighted rating calculation
for (const review of reviews) {
  const weight = review.userId.trustScore;
  weightedSum += review.rating * weight;
  weightSum += weight;
}
const weightedRating = weightSum > 0 ? weightedSum / weightSum : 0;
```

- **Metadata Suggestions** - When users add new videos, the system analyzes similarity against existing videos to suggest appropriate categories and tags, reducing friction and improving consistency.

## Outcomes

The application successfully demonstrates a production-ready content curation platform with:

- **Comprehensive Video Management** - CRUD operations with category/tag relationships, video history tracking, and trending score calculations
- **User Engagement Features** - Watch later lists, watched tracking, custom lists with ordering, review system with likes
- **Admin Dashboard** - API statistics, user management, and content moderation tools with Recharts visualizations
- **Security Hardening** - Rate limiting (general, auth, search), JWT refresh tokens, input sanitization, and CSP headers

Key learnings included the complexity of building fair reputation systems, the importance of database indexing for video discovery queries, and effective patterns for optional authentication middleware.

## Implementation Notes

### Database Schema Design

The schema uses MongoDB's document model with strategic denormalization:

```javascript
// Video model with comprehensive metadata
const videoSchema = new mongoose.Schema({
  youtubeId: { type: String, required: true, unique: true },
  weightedRating: { type: Number, default: 0 },
  trendingScore: { type: Number, default: 0 },
  viewCountGrowth24h: { type: Number, default: 0 },
  // Compound indexes for common queries
});
videoSchema.index({ category: 1, weightedRating: -1 });
videoSchema.index({ tags: 1, publishedAt: -1 });
```

### Trust Score System

The trust scoring uses weighted actions to reward quality contributions:

| Action | Weight |
|--------|--------|
| Add Video | +3 |
| Submit Review Text | +2 |
| Receive Review Like | +0.5 |
| Account Age (per day) | +0.05 |
| Delete Own Review | -2 |

### API Architecture

Routes are modularized with consistent patterns:
- `/api/videos` - Video CRUD with category filtering
- `/api/search` - Advanced multi-parameter search
- `/api/reviews` - User reviews with like functionality
- `/api/lists` - User-created and system lists
- `/api/suggestions` - TF-IDF metadata suggestions
