# Yashika Hidau Portfolio

## Goal
Build a polished, responsive personal portfolio for Yashika Hidau that presents her engineering background, skills, selected projects, and contact details in a dark luxury visual system.

## Experience and design
- Use an obsidian background with charcoal gradients, champagne-gold accents, restrained violet ambient lighting, white headings, and silver-gray body text.
- Pair a high-impact display face with a legible sans-serif. Avoid layout shift and keep the initial render lightweight.
- Use a fixed glass navigation bar with the YH. monogram, availability status, and working anchors for Intro, About, Skills, Projects, and Contact.
- Provide a responsive hero with the headline “Full-Stack Engineer & UI/UX Architect.”, concise positioning copy, a live Indore local-time badge, and links to Projects and Contact.
- Present an editorial About narrative describing Yashika as a final-year CSIT student at Symbiosis University, bridging backend engineering and design.
- Organize the requested technologies into responsive, interactive skill bento categories: Full-Stack & Frontend; Backend & Data; AI & Automation; Tools & DevOps; Design Craft.
- Show four project cards with descriptions and technology badges. Use outbound links only for verified URLs supplied by the user: Opsfront (`https://opsfront-dakrbnt5w-yashikas-projects-76231cf3.vercel.app/#`) and Alqora (`https://alqora-demo.vercel.app`). Corporate Registry Anomaly Detection and Stepwise Events have no supplied destinations; do not fabricate links or make those cards point to unrelated destinations.
- End with the “LET'S BUILD SOMETHING EXTRAORDINARY.” contact section, working email and phone actions, LinkedIn and GitHub profiles, and a 2026 copyright footer.

## Technical approach
- Use Next.js App Router and TypeScript with Tailwind CSS, Framer Motion, and Lucide React.
- Implement a static, frontend-only site; no database, authentication, or backend API is required.
- Prefer native anchor navigation with smooth scrolling and reduced-motion support. Keep animation lightweight and avoid unnecessary scroll libraries.
- Use optimized assets and avoid heavy third-party dependencies. Load any remote font through an appropriate Next.js font strategy when available; retain a robust system fallback.
- Make external links open in a new tab with `rel="noopener noreferrer"`. Keep email and telephone links as `mailto:` and `tel:` actions.
- Ensure responsive layouts across mobile, desktop, and wide screens, with keyboard-accessible navigation and visible focus states.

## Acceptance criteria
1. The site builds and runs using the repository's documented commands.
2. Every navigation item reaches its matching section; hero CTAs reach Projects and Contact.
3. All supplied contact links and verified project links use the exact destinations specified above.
4. Missing project destinations are not invented.
5. The page is readable and usable at mobile and desktop widths, honors reduced-motion preferences, and does not depend on a blocking preloader.
6. The five skill categories, four project cards, About narrative, location/time badge, availability status, and footer are present.

## Out of scope
- Backend services, data persistence, authentication, content-management tooling, and fabricated deployment destinations for projects without supplied URLs.
