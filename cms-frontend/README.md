# CMS Frontend

Portfolio CMS built with React + Vite, featuring modular architecture for managing projects, blogs, and skills.

---

## Skills Module

### Overview

Complete CRUD implementation for managing technical skills with auto-resolved icons from `simple-icons` package.

### Key Features

- **Auto Icon Resolution**: Icons automatically resolved from skill names (e.g., "React" → React logo)
- **Theme-Aware Colors**: Dark icons (like Express, Next.js) adapt to light/dark theme
- **Smart Name Normalization**: Handles special cases (Node.js, C++, C#, etc.)
- **Icon Title Storage**: Stores official icon titles (e.g., "React" not "react")
- **Level Enum**: Four proficiency levels (beginner, intermediate, advanced, expert)

### Implementation Details

**Icon System**:

- Package: `simple-icons` (2000+ tech logos)
- Storage: Icon slug with `si` prefix (e.g., "siReact", "siNodedotjs")
- Rendering: SVG `<path>` with brand colors or theme colors

**Form Structure**:

- Two-column layout (details left, icon preview right)
- Debounced icon resolution (600ms)
- Skeleton loading state
- Real-time icon preview with brand colors

**Backend**:

- No image uploads (string-based icons only)
- Simplified controller (removed Supabase storage logic)
- Icon field stores slug or skill name

### File Structure

```
src/features/skills/
├── api/
│   └── skillsApi.js          # API calls (publicClient for GET, adminClient for mutations)
├── components/
│   ├── SkillForm.jsx         # Create/Edit form with icon preview
│   └── SkillIcon.jsx         # SVG icon renderer
├── hooks/
│   └── useSkills.js          # SWR hooks for data fetching
├── pages/
│   ├── ListSkills.jsx        # Table view with brand-colored icons
│   ├── CreateSkill.jsx       # Creation page
│   └── EditSkill.jsx         # Edit page
└── utils/
    └── iconResolver.js       # Icon resolution & theme-aware color logic
```

### Routes

- `/cms/skills` - List all skills
- `/cms/skills/new` - Create new skill
- `/cms/skills/:id/edit` - Edit existing skill

### Dependencies

- `simple-icons` - Icon data (title, slug, svg, path, hex)
- `swr` - Data fetching and caching
- Shadcn UI: `skeleton`, `select`, `card`, `button`

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **State Management**: SWR (data fetching)
- **HTTP Client**: Axios
- **Authentication**: JWT-based

## Development

```bash
npm install
npm run dev
```
