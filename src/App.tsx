import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Theme = "dark" | "light";
type SectionId = "home" | "experience" | "impact" | "skills" | "education" | "contact";
type SkillGroupId = "backend" | "frontend" | "integration" | "observability" | "platform";
type Story = {
  id: string;
  title: string;
  label: string;
  challenge: string;
  solution: string;
  outcome: string;
  tools: string[];
};

const navigationItems: { id: SectionId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "impact", label: "Impact" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const highlights = [
  { value: "Sep 2024", label: "Started production engineering at Capgemini" },
  { value: "~60%", label: "Fewer service calls in the ICM verification flow" },
  { value: "UUID", label: "Tracing added for easier debugging across environments" },
  { value: "8.6", label: "B.Tech GPA in Information Technology" },
];

const experienceBullets = [
  "Delivering financial-services solutions for Standard Chartered Bank on Capgemini's Wealth and Retail Banking engagement.",
  "Consolidated multiple customer verification service calls into a single ICM profile API through Kong to simplify manual inbound and outbound workflows.",
  "Built fallback-driven API handling for customer employment data parsing to improve resilience under inconsistent upstream responses.",
  "Implemented structured logging, UUID-based tracing, and standardized error codes to speed up debugging and support production visibility.",
  "Investigated cross-environment inconsistencies and identified PII masking differences as the root cause.",
  "Worked closely with cross-functional teams to improve observability, issue triage, and maintainability of backend utilities.",
];

const stories: Story[] = [
  {
    id: "cems",
    title: "CEMS API Consolidation",
    label: "Performance",
    challenge:
      "Customer call verification depended on multiple backend requests, making the workflow slower and harder to reason about during incidents.",
    solution:
      "Moved the verification flow onto a single ICM profile API through Kong and built reusable extraction utilities to keep the integration maintainable.",
    outcome:
      "Reduced repeated service calls by roughly 60% while making the verification path more predictable for teams supporting the application.",
    tools: ["Java", "Spring MVC", "Kong API Gateway", "REST APIs"],
  },
  {
    id: "observability",
    title: "Tracing and Debug Visibility",
    label: "Observability",
    challenge:
      "Production issues were difficult to track across environments because logs and request traces were inconsistent.",
    solution:
      "Added structured logging and UUID-based transaction tracing so related requests could be followed more reliably during debugging.",
    outcome:
      "Improved incident investigation speed and gave teams clearer visibility into how requests moved through the system.",
    tools: ["Logging", "UUID tracing", "Monitoring", "Debugging"],
  },
  {
    id: "errors",
    title: "Reliable Error Handling",
    label: "Resilience",
    challenge:
      "Upstream responses varied, which increased the chance of brittle parsing logic and confusing failures for downstream consumers.",
    solution:
      "Introduced fallback handling for customer employment data and standardized error codes around response wrappers.",
    outcome:
      "Made failures easier to understand, reduced repeated fixes, and created a steadier baseline for production support.",
    tools: ["Response wrappers", "Standardized error codes", "API integration"],
  },
];

const skillGroups: { id: SkillGroupId; label: string; items: string[] }[] = [
  {
    id: "backend",
    label: "Backend",
    items: ["Java", "Spring Boot", "Spring MVC", "REST APIs", "Microservices"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React", "JavaScript", "HTML", "CSS", "Vite"],
  },
  {
    id: "integration",
    label: "Integration",
    items: ["JSON APIs", "Kong API Gateway", "API Integration", "Response Wrapper Pattern"],
  },
  {
    id: "observability",
    label: "Observability",
    items: ["Structured Logging", "Debugging", "Transaction ID (UUID)", "Monitoring", "PII masking analysis"],
  },
  {
    id: "platform",
    label: "Platforms",
    items: ["OpenShift (OCP)", "Tomcat", "MySQL", "PostgreSQL", "Agile/Scrum"],
  },
];

const education = [
  {
    school: "JIS College of Engineering",
    degree: "B.Tech, Information Technology",
    period: "Sep 2021 - Jun 2024",
    location: "Kolkata, West Bengal",
    detail:
      "Graduated with an 8.6 GPA after building real-world projects in machine learning, including sentiment analysis and plant disease analysis.",
  },
  {
    school: "Gayeshpur Government Polytechnic",
    degree: "Diploma, Civil Engineering",
    period: "Jul 2018 - Aug 2021",
    location: "Kolkata, West Bengal",
    detail: "Completed diploma studies with an 8 GPA before transitioning into software and product-focused work.",
  },
  {
    school: "Hazinagar Adarsha Hindi Vidyalaya",
    degree: "12th Standard, Science",
    period: "Mar 2016 - May 2017",
    location: "Kolkata, West Bengal",
    detail: "Built a strong academic base in science before moving into engineering studies.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function readInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem("portfolio-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [selectedStoryId, setSelectedStoryId] = useState<string>(stories[0].id);
  const [selectedSkillGroup, setSelectedSkillGroup] = useState<SkillGroupId>("backend");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("portfolio-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const sectionElements = navigationItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];

        if (mostVisibleEntry) {
          setActiveSection(mostVisibleEntry.target.id as SectionId);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const selectedStory = stories.find((story) => story.id === selectedStoryId) ?? stories[0];
  const visibleSkillGroup =
    skillGroups.find((group) => group.id === selectedSkillGroup) ?? skillGroups[0];

  function handleJump(sectionId: SectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(sectionId);
    setMenuOpen(false);
  }

  return (
    <div className={`app theme-${theme}`}>
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="site-header">
        <div className="brand-lockup">
          <p className="brand-eyebrow">Portfolio</p>
          <button className="brand-button" onClick={() => handleJump("home")}>
            Aman Shaw
          </button>
        </div>

        <nav className="desktop-nav" aria-label="Primary">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={activeSection === item.id ? "nav-link is-active" : "nav-link"}
              onClick={() => handleJump(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <a className="button button-secondary" href="/101-portfolio/resume.pdf" download="Aman_Shaw_Resume.pdf">
            Download CV
          </a>
          <button
            className="theme-toggle"
            onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {navigationItems.map((item) => (
              <button key={item.id} className="mobile-link" onClick={() => handleJump(item.id)}>
                {item.label}
              </button>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <main className="page-shell">
        <motion.section
          className="hero-section"
          id="home"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.55 }}
        >
          <div className="hero-copy">
            <p className="section-kicker">Backend engineer building reliable banking systems</p>
            <h1>
              Java, Spring Boot, and production-focused API work shaped around clarity,
              resilience, and speed.
            </h1>
            <p className="hero-summary">
              Mid-level software engineer based in Bangalore, India. I build backend systems,
              improve service integrations, and debug production issues with a strong focus on
              observability and maintainability.
            </p>

            <div className="hero-actions">
              <button className="button button-primary" onClick={() => handleJump("impact")}>
                Explore Impact
              </button>
              <a className="button button-secondary" href="mailto:ashaw3859@gmail.com">
                Contact Me
              </a>
            </div>

            <ul className="contact-strip" aria-label="Contact links">
              <li>Bangalore, India</li>
              <li>
                <a href="tel:+917890762159">+91 7890762159</a>
              </li>
              <li>
                <a href="mailto:ashaw3859@gmail.com">ashaw3859@gmail.com</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/aman-s-1b0a35118/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/amanongith/" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <motion.aside
            className="hero-panel"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <p className="panel-label">Current focus</p>
            <h2>Shipping backend improvements that make customer-facing operations simpler.</h2>
            <p>
              Recent work has centered on API consolidation, logging, production debugging,
              response shaping, and reducing the complexity of manual verification workflows.
            </p>

            <div className="focus-list">
              <div>
                <span>Role</span>
                <strong>Software Engineer at Capgemini</strong>
              </div>
              <div>
                <span>Domain</span>
                <strong>Wealth and Retail Banking</strong>
              </div>
              <div>
                <span>Strengths</span>
                <strong>API design, tracing, error handling, debugging</strong>
              </div>
            </div>
          </motion.aside>
        </motion.section>

        <section className="highlights-grid" aria-label="Career highlights">
          {highlights.map((item, index) => (
            <motion.article
              key={item.label}
              className="highlight-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08 }}
            >
              <p>{item.value}</p>
              <span>{item.label}</span>
            </motion.article>
          ))}
        </section>

        <motion.section
          className="content-section"
          id="experience"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="section-heading">
            <p className="section-kicker">Experience</p>
            <h2>Production engineering experience in financial services</h2>
          </div>

          <div className="experience-layout">
            <article className="experience-card">
              <div className="experience-head">
                <div>
                  <p className="eyebrow">Capgemini</p>
                  <h3>Software Engineer</h3>
                </div>
                <div className="experience-meta">
                  <span>Sep 2024 - Present</span>
                  <span>Bengaluru, Karnataka</span>
                </div>
              </div>

              <ul className="experience-list">
                {experienceBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>

            <aside className="summary-card">
              <p className="panel-label">Summary</p>
              <p>
                Software engineer with hands-on experience building scalable Java and Spring
                backend systems, improving reliability, and solving production issues quickly.
              </p>
              <p>
                Seeking opportunities to bring the same strengths in system design, debugging,
                and delivery to a broader engineering team.
              </p>
            </aside>
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          id="impact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="section-heading">
            <p className="section-kicker">Impact</p>
            <h2>Selected work threads from the CV, turned into a clearer case-study view</h2>
          </div>

          <div className="impact-layout">
            <div className="story-list" role="tablist" aria-label="Case studies">
              {stories.map((story) => (
                <button
                  key={story.id}
                  className={story.id === selectedStory.id ? "story-tab is-selected" : "story-tab"}
                  onClick={() => setSelectedStoryId(story.id)}
                  role="tab"
                  aria-selected={story.id === selectedStory.id}
                >
                  <span>{story.label}</span>
                  <strong>{story.title}</strong>
                </button>
              ))}
            </div>

            <motion.article
              key={selectedStory.id}
              className="story-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="story-grid">
                <div>
                  <p className="panel-label">Challenge</p>
                  <p>{selectedStory.challenge}</p>
                </div>
                <div>
                  <p className="panel-label">Solution</p>
                  <p>{selectedStory.solution}</p>
                </div>
                <div>
                  <p className="panel-label">Outcome</p>
                  <p>{selectedStory.outcome}</p>
                </div>
              </div>

              <div className="chip-row">
                {selectedStory.tools.map((tool) => (
                  <span key={tool} className="chip">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.article>
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          id="skills"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="section-heading">
            <p className="section-kicker">Skills</p>
            <h2>A reactive skill view instead of one long line of keywords</h2>
          </div>

          <div className="skills-shell">
            <div className="skill-tabs" role="tablist" aria-label="Skill groups">
              {skillGroups.map((group) => (
                <button
                  key={group.id}
                  className={group.id === visibleSkillGroup.id ? "skill-tab is-selected" : "skill-tab"}
                  onClick={() => setSelectedSkillGroup(group.id)}
                  role="tab"
                  aria-selected={group.id === visibleSkillGroup.id}
                >
                  {group.label}
                </button>
              ))}
            </div>

            <motion.div
              key={visibleSkillGroup.id}
              className="skills-panel"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {visibleSkillGroup.items.map((item) => (
                <span key={item} className="skill-pill">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          id="education"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="section-heading">
            <p className="section-kicker">Education</p>
            <h2>An academic path that shifted from civil engineering into software</h2>
          </div>

          <div className="education-grid">
            {education.map((entry) => (
              <article key={entry.school + entry.degree} className="education-card">
                <p className="eyebrow">{entry.period}</p>
                <h3>{entry.school}</h3>
                <strong>{entry.degree}</strong>
                <span>{entry.location}</span>
                <p>{entry.detail}</p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="content-section contact-section"
          id="contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <div className="contact-card">
            <p className="section-kicker">Contact</p>
            <h2>Open to backend engineering opportunities where reliability really matters.</h2>
            <p>
              If you are hiring for Java, Spring Boot, API integration, or production support
              work, I would be glad to connect.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="mailto:ashaw3859@gmail.com">
                Send Email
              </a>
              <a
                className="button button-secondary"
                href="https://github.com/amanongith/"
                target="_blank"
                rel="noreferrer"
              >
                View GitHub
              </a>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
