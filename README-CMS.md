# CMS Implementation for alen.is

## Overview

## Structure

```
src/
├── data/                    # JSON content files
│   ├── experiences.json     # Work experience data
│   ├── projects.json        # Project portfolio data
│   ├── personal-info.json   # Personal information
│   └── social-links.json    # Social media links
├── lib/
│   ├── cms.ts              # JSON-based content utilities
│   └── cms-db.ts           # Database-based content utilities
├── types/
│   └── cms.ts              # TypeScript definitions
└── app/
    ├── (admin)/admin/      # Admin interface
    └── ...                 # Updated pages using CMS data
```

## Content Management

Edit content directly in the JSON files:

- `src/data/experiences.json` - Work experience
- `src/data/projects.json` - Project portfolio
- `src/data/personal-info.json` - Personal information
- `src/data/social-links.json` - Social media links

Then run the following command to migrate the data to the database:

```bash
# CMS
npm run cms:migrate        # Migrate JSON data to database
```

## 📋 Data Schema

### Experience
```typescript
interface Experience {
  id: string
  company: string
  position: string
  period: string
  location: string
  description: string[]
  current: boolean
  order: number
  published: boolean
}
```

### Project
```typescript
interface Project {
  id: string
  title: string
  period: string
  description: string
  link: string
  type: string              // "GitHub" | "NPM" | "Website"
  image?: string            // Optional image path
  icon?: string             // Optional icon name
  technologies: string[]
  featured: boolean
  order: number
  published: boolean
}
```

### Personal Info
```typescript
interface PersonalInfo {
  hero_title: string
  hero_description: string
  about_me_paragraph_1: string
  about_me_paragraph_2: string
  contact_description: string
  signature_name: string
  meta_title: string
  meta_description: string
  job_title: string
  company: string
  skills: string[]
}
```

### Social Link
```typescript
interface SocialLink {
  id: string
  name: string
  url: string
  icon: string             // React Icon name
  order: number
  published: boolean
}
```