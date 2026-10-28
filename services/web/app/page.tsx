"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  ArrowRight,
  Check,
  Command,
  Globe2,
  Github,
  Layers3,
  Menu,
  Mail,
  Phone,
  Pin,
  MoveUpRight,
  Sparkles,
  X,
  Award,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AmbientBackground,
  handleCardPointerLeave,
  handleCardPointerMove,
  KineticLine,
  OrbitingNode,
  Preloader,
  handleMagneticPointerLeave,
  handleMagneticPointerMove,
  handlePosterPointerLeave,
  handlePosterPointerMove,
} from "./components/motion-experience";

const navItems = [
  { label: "Intro", href: "#intro" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const skillGroups = [
  {
    number: "01",
    title: "Full-Stack & Frontend",
    note: "Interfaces with intention.",
    icon: Layers3,
    skills: [
      "Next.js",
      "React.js",
      "JavaScript (ES6+)",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
    ],
    className: "skill-card--wide",
  },
  {
    number: "02",
    title: "Backend & Data",
    note: "Reliable foundations.",
    icon: Command,
    skills: [
      "Node.js",
      "Express.js",
      "Python",
      "PostgreSQL",
      "MongoDB",
      "RESTful APIs",
      "Pandas",
    ],
    className: "",
  },
  {
    number: "03",
    title: "AI & Automation",
    note: "Making the complex useful.",
    icon: Sparkles,
    skills: ["Claude", "ChatGPT", "Gemini", "v0", "Prompt Engineering"],
    className: "",
  },
  {
    number: "04",
    title: "Tools & DevOps",
    note: "From local to shipped.",
    icon: Globe2,
    skills: [
      "Git",
      "GitHub",
      "Postman",
      "Docker",
      "Vercel",
      "AWS Cloud Foundations",
    ],
    className: "skill-card--wide",
  },
  {
    number: "05",
    title: "Design Craft",
    note: "Clarity is a feature.",
    icon: Asterisk,
    skills: [
      "UI/UX Design",
      "Wireframing",
      "Figma",
      "Adobe Photoshop",
      "Adobe Illustrator",
    ],
    className: "",
  },
];

const projectFilters = ["All", "Full-Stack", "UI/UX & Figma", "Visual Design"] as const;
type ProjectFilter = (typeof projectFilters)[number];
type ProjectCategory = Exclude<ProjectFilter, "All">;

type Project = {
  index: string;
  category: ProjectCategory;
  artwork: string;
  name: string;
  kind: string;
  description: string;
  tags: string[];
  href?: string;
  sourceHref?: string;
  cover?: string;
  visual: string;
  symbol?: string;
};

const projects: Project[] = [
  {
    index: "01",
    category: "Full-Stack",
    artwork: "registry",
    name: "Corporate Registry Anomaly Detection",
    kind: "DATA · ANOMALY DETECTION",
    description:
      "An ingestion and cleaning pipeline for 188,042 MCA company records. An optimized blocking algorithm reduced 17.68B naive comparisons to 4.27M candidate pairs, with SHA-256 hash-chained integrity.",
    tags: ["Python", "PostgreSQL", "Pandas", "Docker"],
    href: "https://corporate-registry-anomaly-detection.streamlit.app/",
    sourceHref: "https://github.com/riyasisodiya2486/corporate-registry-anomaly-detection/",
    cover: "/projects/corporate-registry.png",
    visual: "project-visual--registry",
    symbol: "CR",
  },
  {
    index: "02",
    category: "Full-Stack",
    artwork: "stepwise",
    name: "Stepwise Events",
    kind: "EVENTS · EXPERIENCE",
    description:
      "Dynamic event management and ticketing architecture with real-time data flows and robust database orchestration.",
    tags: ["React", "Node.js", "AWS", "WebRTC"],
    href: "https://stepwise-events.vercel.app/",
    sourceHref: "https://github.com/yashikahidau/stepwise-events",
    cover: "/projects/stepwise-events.png",
    visual: "project-visual--stepwise",
    symbol: "S.",
  },
  {
    index: "03",
    category: "Full-Stack",
    artwork: "opsfront",
    name: "Opsfront — IT Operations Platform",
    kind: "PRODUCT · OPERATIONS",
    description:
      "A full-stack ticketing platform with JWT authentication, role-protected dashboards, and custom REST APIs for ticket metrics.",
    tags: ["Next.js", "Express.js", "MongoDB", "JWT", "REST APIs", "Tailwind CSS"],
    href: "https://opsfront-psi.vercel.app/",
    sourceHref: "https://github.com/yashikahidau/Opsfront",
    cover: "/projects/opsfront.png",
    visual: "project-visual--ops",
    symbol: "O.",
  },
  {
    index: "04",
    category: "Full-Stack",
    artwork: "alqora",
    name: "Alqora — E-commerce Platform",
    kind: "COMMERCE · DIGITAL EXPERIENCE",
    description:
      "An e-commerce ecosystem with seamless cart management, secure checkout flows, and order history tracking.",
    tags: ["Next.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Vercel"],
    href: "https://alqora-frontend.vercel.app/",
    sourceHref: "https://github.com/yashikahidau/ALQORA",
    cover: "/projects/alqora.png",
    visual: "project-visual--alqora",
    symbol: "a",
  },
  {
    index: "05",
    category: "UI/UX & Figma",
    artwork: "dashboard",
    name: "SaaS Dashboard UI",
    kind: "UI/UX · PRODUCT CONCEPT",
    description:
      "A data-rich dark interface concept exploring dashboard hierarchy, legible metrics, and clear paths from overview to action.",
    tags: ["Figma", "UI Systems", "Dashboard"],
    visual: "project-visual--dashboard",
    symbol: "D",
  },
  {
    index: "06",
    category: "UI/UX & Figma",
    artwork: "editorial",
    name: "Website Reimagination I",
    kind: "UI/UX · EDITORIAL REDESIGN",
    description:
      "An editorial web redesign study focused on a distinctive typographic voice, intentional spacing, and a calmer browsing rhythm.",
    tags: ["Figma", "Art Direction", "Web"],
    visual: "project-visual--editorial",
    symbol: "I",
  },
  {
    index: "07",
    category: "UI/UX & Figma",
    artwork: "editorial-alt",
    name: "Website Reimagination II",
    kind: "UI/UX · WEB REDESIGN",
    description:
      "A second redesign exploration pairing expressive image composition with a practical, responsive page structure.",
    tags: ["Figma", "Responsive Design", "Web"],
    visual: "project-visual--editorial-alt",
    symbol: "II",
  },
  {
    index: "08",
    category: "UI/UX & Figma",
    artwork: "commerce",
    name: "E-commerce Product Page UI",
    kind: "UI/UX · COMMERCE CONCEPT",
    description:
      "A product-page concept balancing a bold product presentation with concise details and clear conversion paths.",
    tags: ["Figma", "E-commerce", "Conversion UX"],
    visual: "project-visual--commerce",
    symbol: "P",
  },
  {
    index: "09",
    category: "Visual Design",
    artwork: "brand",
    name: "Woodland Advertisement & Bajaj Banner",
    kind: "VISUAL DESIGN · CAMPAIGN STUDIES",
    description:
      "A pair of campaign explorations featuring a Woodland outdoor advertisement direction and a bold Bajaj banner study.",
    tags: ["Photoshop", "Illustrator", "Campaign Design"],
    visual: "project-visual--brand",
    symbol: "B",
  },
];

const credentials = [
  {
    number: "01",
    title: "AWS Academy Cloud Foundations",
    detail: "Cloud foundations · 2026",
    icon: Award,
  },
  {
    number: "02",
    title: "Best Presentation Award",
    detail: "College-wide frontend design competition",
    icon: Trophy,
  },
  {
    number: "03",
    title: "College Hackathons",
    detail: "Participation · 2023–2025",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Academic Record",
    detail: "B.Tech CSIT · Symbiosis University · CGPA 8.2",
    secondary: "ISC 90% · ICSE 96.2%",
    icon: GraduationCap,
  },
];

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function useIndoreTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("All");
  const [pageReady, setPageReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const time = useIndoreTime();
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
  const visibleProjects = projects.filter(
    (project) => projectFilter === "All" || project.category === projectFilter,
  );

  useEffect(() => {
    const preloaderSeen = "yashika-portfolio-preloader-seen";
    if (window.sessionStorage.getItem(preloaderSeen)) {
      setPageReady(true);
      return;
    }

    window.sessionStorage.setItem(preloaderSeen, "true");
    setShowPreloader(true);
  }, []);

  return (
    <main>
      <AmbientBackground />
      {showPreloader && !pageReady && (
        <Preloader onComplete={() => setPageReady(true)} />
      )}
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#intro" aria-label="Yashika Hidau, home">
          YH<span>.</span>
        </a>
        <nav className={`desktop-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => setHoveredNav(item.href)}
              onMouseLeave={() => setHoveredNav(null)}
              onFocus={() => setHoveredNav(item.href)}
              onBlur={() => setHoveredNav(null)}
              animate={{ color: hoveredNav === item.href ? "#D3AE37" : "#C7C5C0" }}
              transition={{ duration: 0.22 }}
            >
              {item.label}
              {hoveredNav === item.href && (
                <motion.span
                  className="nav-underline"
                  layoutId="nav-underline"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
            </motion.a>
          ))}
        </nav>
        <div className="header-right">
          <a className="availability" href="#contact">
            <span className="status-dot" />
            <span>Available for Select Opportunities</span>
          </a>
          <a className="header-cta" href="#contact" aria-label="Go to contact section">
            <ArrowUpRight size={15} strokeWidth={1.7} />
          </a>
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div id="main-content">
        <section className="hero section-shell" id="intro" aria-labelledby="hero-title">
          <div className="hero-copy">
            <motion.div
              className="eyebrow hero-eyebrow"
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
              variants={reveal}
              transition={transition}
            >
              <span className="eyebrow-line" />
              <span>ENGINEERING MEETS EXPERIENCE</span>
            </motion.div>
            <motion.h1
              id="hero-title"
              initial={shouldReduceMotion ? false : "hidden"}
              animate={pageReady ? "visible" : "hidden"}
              variants={reveal}
              transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.08 }}
            >
              <KineticLine active={pageReady}>Full-Stack Engineer</KineticLine>
              <KineticLine active={pageReady} delay={0.08}>
                <span className="title-amp">&</span> UI/UX Designer<span className="gold-period">.</span>
              </KineticLine>
            </motion.h1>
            <motion.p
              className="hero-description"
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
              variants={reveal}
              transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.16 }}
            >
              I build full-stack architectures, bring AI into practical
              workflows, and shape every detail with design precision.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
              variants={reveal}
              transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.23 }}
            >
              <a
                className="button button-primary magnetic-cta"
                href="#projects"
                onPointerMove={handleMagneticPointerMove}
                onPointerLeave={handleMagneticPointerLeave}
              >
                Explore Work <ArrowDownRight size={17} />
              </a>
              <a
                className="button button-secondary magnetic-cta"
                href="#contact"
                onPointerMove={handleMagneticPointerMove}
                onPointerLeave={handleMagneticPointerLeave}
              >
                Get in Touch <ArrowUpRight size={15} />
              </a>
            </motion.div>
            <div className="hero-meta">
              <div className="location-chip">
                <span className="location-pulse" />
                <span>INDORE, IN</span>
                <Pin size={11} aria-hidden="true" />
                <span className="meta-divider" />
                <span className="local-time" aria-live="polite">
                  {time || "LOCAL TIME"}
                </span>
              </div>
              <span className="hero-scroll-label">
                SCROLL TO EXPLORE <ArrowDown size={12} />
              </span>
            </div>
          </div>
          <motion.div
            className="hero-art-reveal"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.12 }}
            aria-hidden="true"
          >
            <div
              className="hero-art"
              onPointerMove={handlePosterPointerMove}
              onPointerLeave={handlePosterPointerLeave}
            >
              <div className="hero-art-spotlight" />
              <div className="hero-art-surface">
                <div className="hero-art-grid" />
                <svg className="hero-orbits" viewBox="0 0 400 450" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="orbitStroke" x1="30" y1="225" x2="370" y2="225" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#D3AE37" stopOpacity=".58" />
                      <stop offset=".5" stopColor="#FFFFFF" stopOpacity=".15" />
                      <stop offset="1" stopColor="#D3AE37" stopOpacity=".42" />
                    </linearGradient>
                  </defs>
                  <ellipse className="hero-orbit hero-orbit--one" cx="200" cy="225" rx="148" ry="66" transform="rotate(0 200 225)" />
                  <ellipse className="hero-orbit hero-orbit--two" cx="200" cy="225" rx="136" ry="54" transform="rotate(60 200 225)" />
                  <ellipse className="hero-orbit hero-orbit--three" cx="200" cy="225" rx="124" ry="46" transform="rotate(-60 200 225)" />
                  <OrbitingNode centerX={200} centerY={225} radiusX={148} radiusY={66} rotation={0} duration={28000} className="orbit-node--gold" />
                  <OrbitingNode centerX={200} centerY={225} radiusX={136} radiusY={54} rotation={60} duration={36000} phase={0.34} className="orbit-node--violet" />
                  <OrbitingNode centerX={200} centerY={225} radiusX={124} radiusY={46} rotation={-60} duration={44000} phase={0.68} className="orbit-node--gold" />
                </svg>
                <div className="hero-art-caption">
                  <span>DESIGNING WITH</span>
                  <span>INTENTION <i>✳</i></span>
                </div>
                <div className="hero-core-glow" />
                <div className="hero-monogram">Y<span>H</span><i>.</i></div>
                <div className="hero-art-index">01 — 05</div>
                <span className="hero-art-star hero-art-star--a">✳</span>
                <span className="hero-art-star hero-art-star--b">✦</span>
              </div>
            </div>
          </motion.div>
          <div className="hero-bottom-rule" />
          <span className="hero-index">PORTFOLIO <span>©</span> 2026</span>
        </section>

        <section className="about section-shell section-spacing" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" />01 / A LITTLE ABOUT ME</p>
            <span className="section-side-note">THE PERSON BEHIND THE PIXELS</span>
          </div>
          <div className="about-grid">
            <h2 id="about-title">
              <KineticLine>Building at the</KineticLine>
              <KineticLine delay={0.08}>intersection of</KineticLine>
              <KineticLine delay={0.16}><span>logic & feeling.</span></KineticLine>
            </h2>
            <div className="about-copy">
              <p className="about-lede">
                I&apos;m Yashika Hidau, a final-year CSIT student at Symbiosis
                University, bridging backend depth with thoughtful design.
              </p>
              <p>
                My work spans Python, the MERN stack, and AI-powered workflows.
                I care about how systems work beneath the surface and how
                effortless they feel to use. By pairing reliable engineering
                with design precision, I build digital experiences that are as
                considered as they are useful.
              </p>
              <div className="about-signoff">
                <span className="signoff-mark">YH.</span>
                <span>Curious by nature. Intentional by design.</span>
              </div>
            </div>
          </div>
          <div className="about-stats" aria-label="Profile highlights">
            <div><span className="stat-number">01</span><span className="stat-label">ENGINEERING MINDSET</span></div>
            <div><span className="stat-number">∞</span><span className="stat-label">ROOM TO EXPLORE</span></div>
            <div><span className="stat-number">✳</span><span className="stat-label">DESIGN-LED THINKING</span></div>
          </div>
        </section>

        <section className="skills section-shell section-spacing" id="skills" aria-labelledby="skills-title">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" />02 / THE TOOLKIT</p>
            <span className="section-side-note">A MIX OF CRAFT & CURIOSITY</span>
          </div>
          <div className="section-title-row">
            <h2 id="skills-title">
              <KineticLine>A versatile</KineticLine>
              <KineticLine delay={0.08}><span>toolkit.</span></KineticLine>
            </h2>
            <p>Different challenges call for different tools.<br />Here&apos;s where I like to work.</p>
          </div>
          <div className="skills-grid">
            {skillGroups.map((group, index) => {
              const Icon = group.icon;
              return (
                <motion.article
                  key={group.number}
                  className={`skill-card ${group.className}`}
                  initial={shouldReduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={reveal}
                  transition={{ ...transition, delay: shouldReduceMotion ? 0 : index * 0.04 }}
                  onPointerMove={handleCardPointerMove}
                  onPointerLeave={handleCardPointerLeave}
                >
                  <div className="card-tilt-surface">
                    <div className="skill-card-top">
                      <span className="skill-number">{group.number}</span>
                      <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <div className="skill-card-copy">
                      <div>
                        <h3>{group.title}</h3>
                        <p>{group.note}</p>
                      </div>
                      <ArrowUpRight className="skill-arrow" size={17} />
                    </div>
                    <ul className="skill-tags">
                      {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                    </ul>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="projects section-shell section-spacing" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" />03 / SELECTED WORK</p>
            <span className="section-side-note">ENGINEERING, INTERFACE & IMAGE</span>
          </div>
          <div className="section-title-row projects-title-row">
            <h2 id="projects-title">
              <KineticLine>Made with</KineticLine>
              <KineticLine delay={0.08}><span>purpose.</span></KineticLine>
            </h2>
            <p>Each project starts with a question:<br />how can this work better for people?</p>
          </div>
          <div className="project-filter-row">
            <div className="project-filters" role="group" aria-label="Filter projects by category">
              {projectFilters.map((filter) => (
                <button
                  type="button"
                  className={`project-filter${projectFilter === filter ? " is-active" : ""}`}
                  key={filter}
                  aria-pressed={projectFilter === filter}
                  onClick={() => setProjectFilter(filter)}
                >
                  {filter}
                  {projectFilter === filter && (
                    <motion.span
                      className="project-filter-indicator"
                      layoutId="project-filter-indicator"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              ))}
            </div>
            <span className="project-result-count" aria-live="polite">
              {String(visibleProjects.length).padStart(2, "0")} PROJECTS
            </span>
          </div>
          <div className="projects-grid">
            <AnimatePresence initial={false} mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.article
                className="project-card"
                key={project.name}
                layout
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={reveal}
                transition={{ ...transition, delay: shouldReduceMotion ? 0 : (index % 2) * 0.08 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, transition: { duration: 0.18 } }}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={handleCardPointerLeave}
              >
                <div className="card-tilt-surface">
                  <div className={`project-visual ${project.visual} ${project.cover ? "project-visual--has-cover" : "project-visual--concept"}`}>
                    {project.cover ? (
                      <img className="project-cover" src={project.cover} alt={`${project.name} preview`} />
                    ) : (
                      <div className={`project-artwork project-artwork--${project.artwork}`} role="img" aria-label={`${project.name} visual concept preview`}>
                        <div className="artwork-window">
                          <div className="artwork-toolbar"><span /><span /><span /><i /></div>
                          <div className="artwork-content">
                            <div className="artwork-sidebar"><i /><i /><i /><i /></div>
                            <div className="artwork-main">
                              <span className="artwork-kicker">{project.category === "Visual Design" ? "CAMPAIGN STUDY" : "DESIGN STUDY"}</span>
                              <span className="artwork-headline" />
                              <span className="artwork-copy" />
                              <div className="artwork-tiles"><i /><i /><i /></div>
                              <div className="artwork-chart"><i /><i /><i /><i /><i /><i /><i /></div>
                            </div>
                          </div>
                        </div>
                        {project.artwork === "brand" && <div className="artwork-brand-labels"><span>WOODLAND</span><span>BAJAJ</span></div>}
                      </div>
                    )}
                    <span className="project-index">{project.index} <span>/ 09</span></span>
                    {project.cover && <span className="project-symbol">{project.symbol}</span>}
                    <span className="project-visual-label">{project.kind}</span>
                    {project.href ? (
                      <span className="project-open" aria-hidden="true">
                        <MoveUpRight size={17} />
                      </span>
                    ) : project.sourceHref ? (
                      <span className="project-open" aria-hidden="true">
                        <MoveUpRight size={17} />
                      </span>
                    ) : (
                      <span className="project-private" aria-label="Project destination not provided">
                        <span>CONCEPT</span><span>STUDY</span>
                      </span>
                    )}
                    <span className="project-visual-decoration" />
                  </div>
                  <div className="project-info">
                    <div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                    </div>
                    {project.href && <ArrowUpRight className="project-title-arrow" size={18} aria-hidden="true" />}
                  </div>
                  <ul className="project-tags">
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                {project.href && (
                  <a
                    className="project-card-link"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.name} (opens in a new tab)`}
                  />
                )}
                {project.sourceHref && (
                  <a
                    className="project-source-link"
                    href={project.sourceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.name} source code on GitHub (opens in a new tab)`}
                  >
                    <Github size={15} aria-hidden="true" />
                    <span>Code</span>
                  </a>
                )}
              </motion.article>
            ))}
            </AnimatePresence>
          </div>
          <div className="projects-footnote">
            <span><Check size={14} /> CASE STUDIES & CONCEPT EXPLORATIONS</span>
            <span>CRAFTED WITH INTENTION <ArrowRight size={14} /></span>
          </div>
        </section>

        <section className="credentials section-shell section-spacing" id="credentials" aria-labelledby="credentials-title">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" />04 / CREDENTIALS & MILESTONES</p>
            <span className="section-side-note">LEARNING, RECOGNITION & PROGRESS</span>
          </div>
          <div className="section-title-row credentials-title-row">
            <h2 id="credentials-title">
              <KineticLine>Grounded in</KineticLine>
              <KineticLine delay={0.08}><span>curiosity.</span></KineticLine>
            </h2>
            <p>A few markers from an ongoing journey<br />of building, learning, and showing up.</p>
          </div>
          <div className="credentials-grid">
            {credentials.map((credential, index) => {
              const Icon = credential.icon;
              return (
                <motion.article
                  className={`credential-card${index === 0 ? " credential-card--featured" : ""}`}
                  key={credential.number}
                  initial={shouldReduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={reveal}
                  transition={{ ...transition, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                >
                  <div className="credential-card-top">
                    <span className="skill-number">{credential.number} / 04</span>
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div className="credential-copy">
                    <h3>{credential.title}</h3>
                    <p>{credential.detail}</p>
                    {credential.secondary && <p className="credential-secondary">{credential.secondary}</p>}
                  </div>
                  <span className="credential-rule" />
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="contact section-shell section-spacing" id="contact" aria-labelledby="contact-title">
          <div className="contact-panel">
            <div className="contact-glow" />
            <p className="eyebrow"><span className="eyebrow-line" />05 / YOUR NEXT CHAPTER</p>
            <div className="contact-content">
              <div>
                <p className="contact-pretitle">GOOD THINGS START WITH A CONVERSATION.</p>
                <h2 id="contact-title">
                  <KineticLine>LET&apos;S BUILD</KineticLine>
                  <KineticLine delay={0.08}>SOMETHING <span>EXTRAORDINARY.</span></KineticLine>
                </h2>
              </div>
              <div className="contact-aside">
                <p>
                  Have a thoughtful challenge, an interesting idea, or a team
                  that cares about the details? I&apos;d love to hear about it.
                </p>
                <div className="contact-links" aria-label="Contact links">
                  <a href="mailto:hidauyashika@gmail.com">
                    <Mail size={15} aria-hidden="true" />
                    hidauyashika@gmail.com
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                  <a href="tel:+919669941020">
                    <Phone size={15} aria-hidden="true" />
                    +91 9669941020
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                  <a href="https://www.linkedin.com/in/yashika-hidau-a439a8281" target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                    <MoveUpRight size={14} aria-hidden="true" />
                  </a>
                  <a href="https://github.com/yashikahidau" target="_blank" rel="noopener noreferrer">
                    GitHub Profile
                    <MoveUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
            <div className="contact-bottom">
              <span className="contact-location"><span className="status-dot" /> INDORE, INDIA · {time || "LOCAL TIME"}</span>
              <a className="back-top" href="#intro">BACK TO TOP <ArrowUp size={14} /></a>
            </div>
          </div>
          <footer className="site-footer">
            <a className="brand footer-brand" href="#intro" aria-label="Yashika Hidau, back to top">YH<span>.</span></a>
            <span>© 2026 YASHIKA HIDAU. BUILT WITH PRECISION.</span>
            <span className="footer-note">MERN · PYTHON · AWWWARDS-LEVEL DESIGN <Asterisk size={14} /></span>
          </footer>
        </section>
      </div>
    </main>
  );
}
