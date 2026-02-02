---
title: YTDB - YouTube Database
summary: A community-driven platform for discovering, rating, and curating YouTube content beyond the algorithm
date: 2024-08-12
github: https://github.com/jatoran/ytdb
---

## Overview

YTDB (YouTube Database) is a full-stack web application that serves as a community-driven alternative to YouTube's algorithmic recommendations. Users can discover, rate, review, and curate YouTube videos into custom lists, breaking free from the platform's echo chamber effect.

The application features a sophisticated trust-based rating system where user ratings are weighted by their trust score, calculated from their engagement history. This creates a meritocratic system where established, active contributors have more influence on video rankings than new or passive users.

## Screenshots

<!-- SCREENSHOT: Homepage showing the hero section with "Discover, Rate, Curate" tagline and carousels of trending/top-rated videos -->
![YTDB Homepage](/images/projects/ytdb/screenshot-1.png)

<!-- SCREENSHOT: Video detail page showing embedded player, weighted rating display, review submission form, and related videos carousel -->
![Video Detail Page](/images/projects/ytdb/screenshot-2.png)

<!-- SCREENSHOT: Advanced search page with filter sidebar showing category, rating, duration, and tag filters -->
![Advanced Search](/images/projects/ytdb/screenshot-3.png)

<!-- SCREENSHOT: Admin panel showing the trust score ranking or API statistics dashboard -->
![Admin Dashboard](/images/projects/ytdb/screenshot-4.png)

## Problem

YouTube's recommendation algorithm optimizes for engagement metrics, often promoting clickbait and keeping users in content bubbles. Finding high-quality, in-depth content on specific topics requires significant manual effort. There's no community-driven curation layer that surfaces genuinely valuable videos based on user expertise rather than algorithmic predictions.

Additionally, there's no reliable way to track watched content, create shareable curated lists, or discover videos through trusted community recommendations rather than platform-driven suggestions.

## Approach

Built a full-stack application with a React frontend and Node.js/Express backend, using MongoDB for flexible document storage. The architecture emphasizes community trust and video discovery.

### Stack

- **Frontend** - React 18 with React Router for SPA navigation, lazy loading for performance optimization
- **Backend** - Node.js/Express with comprehensive middleware (rate limiting, sanitization, helmet security)
- **Database** - MongoDB with Mongoose ODM, featuring optimized compound indexes for search queries
- **YouTube Integration** - Google APIs for fetching video metadata, thumbnails, and channel information
- **Authentication** - JWT-based auth with refresh token rotation and bcrypt password hashing
- **Scheduling** - node-cron for automated jobs (rating recalculation, video info updates, database backups)

### Challenges

- **Trust-weighted ratings** - Implemented a trust score system where user contributions (reviews, list curation, community engagement) accumulate into a score that weights their ratings. This required careful balance of action weights to prevent gaming while rewarding genuine participation.

- **Related video discovery** - Built a multi-factor similarity scoring algorithm using Levenshtein distance for title matching, category/tag overlap, temporal proximity, and view count similarity to surface genuinely related content.

- **Advanced search performance** - Created compound MongoDB indexes and optimized query building to handle complex filter combinations (category, tags, duration range, rating range, date range) without performance degradation.

- **Rate limiting strategy** - Implemented tiered rate limiting with different thresholds for authentication, search, and video submission endpoints to prevent abuse while maintaining good UX for legitimate users.

## Outcomes

The application successfully provides an alternative discovery mechanism for YouTube content. Key features that work well:

- **Weighted rating system** prevents rating manipulation by tying influence to community contribution
- **Custom list creation** enables thematic curation that can be shared publicly or kept private
- **Watch later and watched tracking** persists across sessions with automatic list management
- **Admin panel** provides comprehensive content moderation, user management, and API analytics
- **Cron job automation** keeps video metadata fresh and recalculates ratings hourly

Learned significant lessons about building trust systems, preventing rating manipulation, and designing search interfaces that balance power with usability.

## Implementation Notes

### Trust Score Calculation

The trust scoring system weighs different actions to build user reputation:

```javascript
const WEIGHTS = {
  SUBMIT_RATING: 1,
  SUBMIT_REVIEW_TEXT: 2,
  REVIEW_LENGTH_BONUS: 0.01, // per character up to 100
  ADD_VIDEO: 3,
  WATCH_VIDEO: 0.5,
  RECEIVE_REVIEW_LIKE: 0.5,
  RECEIVE_LIST_LIKE: 0.3,
  ACCOUNT_AGE_DAYS: 0.05,
  // ... more weights
};
```

### Weighted Rating Algorithm

Video ratings are weighted by reviewer trust scores, recalculated hourly:

```javascript
for (const review of reviews) {
  const weight = review.userId.trustScore;
  weightedSum += review.rating * weight;
  weightSum += weight;
}
const weightedRating = weightSum > 0 ? weightedSum / weightSum : 0;
```

### Related Video Similarity Scoring

Multi-factor approach combining categorical and content-based signals:

```javascript
function calculateSimilarityScore(video1, video2) {
  let score = 0;
  // Category match: +30 points
  // Tag matches: +10 points per common tag
  // Title similarity (Levenshtein): up to +20 points
  // Publish date proximity: up to +10 points
  // View count similarity: up to +10 points
  return score;
}
```

### MongoDB Index Strategy

Compound indexes optimized for common query patterns:

```javascript
videoSchema.index({ category: 1, weightedRating: -1 }); // Top-rated in category
videoSchema.index({ tags: 1, publishedAt: -1 });        // Newest with tag
videoSchema.index({ weightedRating: -1, publishedAt: -1 }); // Global rankings
```
