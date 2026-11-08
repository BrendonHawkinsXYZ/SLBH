"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { LocalReadout } from "@/components/LocalReadout";
import type { Artwork } from "@/lib/artwork";
import type { LandingGroup, LandingProject, LandingView } from "@/lib/landingPreview";
import styles from "./LandingExperience.module.css";

const count = (value: number) => String(value).padStart(2, "0");
const groupNames = { all: "All work", series: "Tell Me How You Feel", supporting: "Supporting studies" };

function destination(view: LandingView, group: LandingGroup = "all", query = "") {
  const params = new URLSearchParams();
  if (view !== "home") params.set("view", view);
  if (view === "collection" && group !== "all") params.set("group", group);
  if (view === "collection" && query.trim()) params.set("q", query.trim());
  return `/preview${params.size ? `?${params}` : ""}`;
}

function ProjectCard({ project, prominent = false }: { project: LandingProject; prominent?: boolean }) {
  return <article className={`${styles.project}${prominent ? ` ${styles.prominent}` : ""}`}>
    <Link href={project.href} className={styles.projectImage} aria-label={`View ${project.title}`}>
      <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height}
        sizes={prominent ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"} />
    </Link>
    <div className={styles.projectRecord}>
      <Link href={project.href}>{project.title}</Link>
      <span>{project.form}</span>
      <span>{project.year}</span>
    </div>
  </article>;
}

export function LandingExperience({ projects, feature, biography, initialQuery }: {
  projects: LandingProject[];
  feature: Artwork[];
  biography: string;
  initialQuery: string;
}) {
  const params = useSearchParams();
  const view: LandingView = params.get("view") === "collection" ? "collection" : params.get("view") === "studio" ? "studio" : "home";
  const group: LandingGroup = params.get("group") === "series" ? "series" : params.get("group") === "supporting" ? "supporting" : "all";
  const query = params.get("q") ?? "";
  const [headerQuery, setHeaderQuery] = useState(initialQuery);
  const [phase, setPhase] = useState<"intro" | "leaving" | "ready">(view === "home" ? "intro" : "ready");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const collectionSearch = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const touchStart = useRef<number | null>(null);
  const opening = phase !== "ready";

  const enter = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhase(current => current === "intro" ? "leaving" : current);
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setPhase("ready");
      content.current?.focus({ preventScroll: true });
    }, reduced ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!opening && !menuOpen && !searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [opening, menuOpen, searchOpen]);

  useEffect(() => {
    if (phase !== "intro") return;
    const wheel = (event: WheelEvent) => { if (event.deltaY > 12) enter(); };
    const keyboard = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "Enter", " ", "Escape"].includes(event.key)) {
        event.preventDefault();
        enter();
      }
    };
    window.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("keydown", keyboard);
    return () => { window.removeEventListener("wheel", wheel); window.removeEventListener("keydown", keyboard); };
  }, [phase, enter]);

  useEffect(() => {
    if (window.location.hash) setPhase("ready");
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      setHeaderQuery(params.get("q") ?? "");
      setPhase("ready");
      setMenuOpen(false);
      setSearchOpen(false);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  useEffect(() => {
    if (menuOpen || searchOpen) {
      dialog.current?.showModal();
      if (searchOpen) dialog.current?.querySelector<HTMLInputElement>("#mobile-collection-search")?.focus();
    } else dialog.current?.close();
  }, [menuOpen, searchOpen]);

  const navigate = (nextView: LandingView, nextGroup: LandingGroup = "all", nextQuery = "") => {
    window.history.pushState(null, "", destination(nextView, nextGroup, nextQuery));
    setHeaderQuery(nextQuery);
    setPhase("ready");
    setMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  };

  const go = (event: MouseEvent<HTMLAnchorElement>, nextView: LandingView, nextGroup: LandingGroup = "all") => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate(nextView, nextGroup);
  };

  const replay = () => {
    navigate("home");
    setPhase("intro");
  };

  const closePanel = () => {
    const trigger = searchOpen ? searchButton : menuButton;
    setMenuOpen(false);
    setSearchOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("collection", "all", headerQuery);
  };

  const updateQuery = (value: string) => {
    setHeaderQuery(value);
    window.history.replaceState(null, "", destination("collection", group, value));
  };

  const filtered = projects.filter(project => {
    if (group !== "all" && project.group !== group) return false;
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const text = `${project.title} ${project.shortTitle} ${project.form} ${project.place} ${project.year} ${project.summary}`.toLocaleLowerCase();
    return words.every(word => text.includes(word));
  });
  const series = projects.filter(project => project.group === "series");
  const supporting = projects.filter(project => project.group === "supporting");

  const groupLinks = <nav className={styles.groupLinks} aria-label="Collection groups">
    {(["all", "series", "supporting"] as const).map(value => <a
      key={value} href={destination("collection", value)}
      aria-current={view === "collection" && group === value ? "page" : undefined}
      onClick={event => go(event, "collection", value)}>
      <span>({count(value === "all" ? projects.length : projects.filter(project => project.group === value).length)})</span>
      <span>{groupNames[value]}</span>
    </a>)}
  </nav>;

  return <div className={styles.experience}>
    {opening && <section className={`${styles.intro} site-surface${phase === "leaving" ? ` ${styles.introLeaving}` : ""}`}
      aria-label="Studio introduction" aria-hidden={phase === "leaving"}
      onTouchStart={event => { touchStart.current = event.touches[0].clientY; }}
      onTouchMove={event => { if (touchStart.current !== null && touchStart.current - event.touches[0].clientY > 32) enter(); }}>
      <h1 className={styles.introCopy}><span className={styles.introName}>Studio Lab BH</span><span>{biography.replace(/^Studio Lab BH /, "")}</span></h1>
      <button className={styles.enter} onClick={enter} tabIndex={phase === "leaving" ? -1 : 0} aria-label="Enter Studio Lab BH">
        <span>Enter studio <span aria-hidden="true">↓</span></span>
      </button>
      <div className={styles.introClock}><LocalReadout /></div>
    </section>}

    <div ref={content} tabIndex={-1} className={styles.content} inert={opening}>
      <header className={`${styles.header} site-surface`}>
        <a href="/preview" className={styles.wordmark} aria-current={view === "home" ? "page" : undefined} onClick={event => go(event, "home")}>Studio Lab BH</a>
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <a href={destination("collection")} aria-current={view === "collection" ? "page" : undefined} onClick={event => go(event, "collection")}>Collection</a>
          <a href={destination("studio")} aria-current={view === "studio" ? "page" : undefined} onClick={event => go(event, "studio")}>Studio</a>
          <a href="#contact">Contact</a>
        </nav>
        <form className={styles.headerSearch} role="search" aria-label="Search selected work" onSubmit={search}>
          <input aria-label="Search work" placeholder="Search" value={headerQuery} onChange={event => setHeaderQuery(event.target.value)} type="search" />
          <button type="submit" aria-label="Submit search">↵</button>
        </form>
        <button ref={menuButton} className={styles.menuButton} aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>Menu</button>
        <div className={styles.clock}><LocalReadout /></div>
      </header>

      <div className={styles.page}>
        {view === "home" && <>
          <h1 ref={heading} tabIndex={-1} className={styles.srOnly}>Studio Lab BH — selected work</h1>
          <section className={styles.feature} aria-labelledby="feature-title">
            <div className={styles.featureImages}>
              {feature.map((image, index) => <Link key={image.src} href={image.href} className={styles.featureImage} aria-label={`View ${image.project}`}>
                <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 640px) 50vw, 33vw" preload={index === 1} />
              </Link>)}
            </div>
            <div className={styles.offset}>
              <div className={styles.featureRecord}>
                <h2 id="feature-title">Tell Me How You Feel</h2>
                <span>Installations, workshops & public encounters</span>
                <span>New York · 2026–ongoing</span>
              </div>
              <div className={styles.featureNote}>
                <p>Different ways of giving feeling a form. An evolving series of encounters through light, drawing, food, and conversation.</p>
                <a href={destination("collection", "series")} onClick={event => go(event, "collection", "series")}>Explore the series <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </section>

          <section aria-labelledby="series-title">
            <div className={styles.sectionMarker}>
              <div><h2 id="series-title"><span>({count(series.length)})</span> Tell Me How You Feel</h2>
                <a href={destination("collection")} onClick={event => go(event, "collection")}>View the collection <span aria-hidden="true">↗</span></a></div>
            </div>
            <div className={styles.seriesGrid}>{series.map(project => <ProjectCard key={project.slug} project={project} />)}</div>
          </section>

          <section aria-labelledby="supporting-title">
            <div className={styles.sectionMarker}><div><h2 id="supporting-title"><span>({count(supporting.length)})</span> Supporting studies</h2></div></div>
            <div className={styles.supportingGrid}>{supporting.map(project => <ProjectCard key={project.slug} project={project} prominent />)}</div>
          </section>
        </>}

        {view === "collection" && <section aria-labelledby="collection-title" className={styles.collection}>
          <div className={styles.collectionTools}>
            <div>{groupLinks}</div>
            <div className={styles.collectionIntroduction}><p>Encounters with feeling, and the studies that inform them.</p><a href={destination("studio")} onClick={event => go(event, "studio")}>About the practice <span aria-hidden="true">↗</span></a></div>
            <div className={styles.collectionSearch}><label htmlFor="collection-search">Find a project</label><input ref={collectionSearch} id="collection-search" type="search" placeholder="Title, form, or place" value={query} onChange={event => updateQuery(event.target.value)} /></div>
          </div>
          <div className={styles.collectionHeading}>
            <h1 ref={heading} tabIndex={-1} id="collection-title">({count(filtered.length)}) {groupNames[group]}</h1>
            {(query || group !== "all") && <button onClick={() => navigate("collection")}>Reset collection <span aria-hidden="true">↺</span></button>}
          </div>
          <p className={styles.srOnly} role="status">{filtered.length} {filtered.length === 1 ? "project" : "projects"} found{query ? ` for ${query}` : ""}.</p>
          {filtered.length > 0 ? <div className={styles.collectionGrid}>{filtered.map(project => <ProjectCard key={project.slug} project={project} />)}</div>
            : <div className={styles.empty}><p>No projects match “{query}”.</p><button onClick={() => navigate("collection")}>Return to the collection <span aria-hidden="true">↗</span></button></div>}
          <button ref={searchButton} className={`${styles.mobileSearch} site-surface`} aria-haspopup="dialog" onClick={() => setSearchOpen(true)}>({count(projects.length)}) Search collection <span aria-hidden="true">↑</span></button>
        </section>}

        {view === "studio" && <section className={styles.studio} aria-labelledby="studio-title">
          <div className={styles.studioColumn}><h1 ref={heading} tabIndex={-1} id="studio-title">Studio Lab BH</h1><p>{biography}</p><p className={styles.mono}>New York, NY<br />Established 2024</p><Link href="/studio">More about the studio <span aria-hidden="true">↗</span></Link></div>
          <div className={styles.studioColumn}><h2>The current inquiry</h2><p>The studio’s current research centers affect: how internal states are described, represented, interpreted, externalized, and encountered by people and computational systems.</p><p>Tell Me How You Feel brings those questions into shared environments. A light installation, a drawing prompt, and a table each offer a different way to begin.</p><Link href="/research/emotion-as-system">Emotion as System <span aria-hidden="true">↗</span></Link><div className={styles.studioCredit}><span>Brendon Hawkins</span><span>Founder / systems theorist, researcher, artist & technologist</span><Link href="/brendon">Biography & CV <span aria-hidden="true">↗</span></Link></div></div>
        </section>}

        <footer id="contact" className={styles.footer}>
          <div className={styles.offset}>
            <a className={styles.footerWordmark} href="/preview" onClick={event => go(event, "home")}>Studio Lab BH</a>
            <div className={styles.contactBlock}><p>For conversations, collaborations,<br />and things we haven’t imagined yet.</p><a href="mailto:brendon@studiolabbh.xyz">brendon@studiolabbh.xyz <span aria-hidden="true">↗</span></a><a href="https://instagram.com/studiolabbh" target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">↗</span></a></div>
            <div className={styles.footerLinks}><Link href="/brendon">Brendon Hawkins / CV <span aria-hidden="true">↗</span></Link><a href="/" >Current site <span aria-hidden="true">↗</span></a></div>
            <details className={styles.colophon}><summary>Colophon</summary><div><p>Studio Lab BH<br />Images, projects & research: Studio Lab BH</p><p>Orbitron / Inter / IBM Plex Mono<br />Local time. A shared, shifting near-black.</p><button onClick={replay}>Replay introduction <span aria-hidden="true">↑</span></button></div></details>
          </div>
          <div className={styles.footerBase}><span>© {new Date().getFullYear()} Studio Lab BH</span><button onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}>Back to top <span aria-hidden="true">↑</span></button></div>
        </footer>
      </div>
    </div>

    <dialog ref={dialog} className={`${styles.dialog} site-surface`} aria-label={searchOpen ? "Search the collection" : "Navigation"} onCancel={event => { event.preventDefault(); closePanel(); }} onClose={() => { setMenuOpen(false); setSearchOpen(false); }}>
      <div className={styles.dialogHeader}><span className={styles.wordmark}>Studio Lab BH</span><button onClick={closePanel}>Close <span aria-hidden="true">×</span></button></div>
      {searchOpen ? <div className={styles.searchPanel}><form onSubmit={event => { event.preventDefault(); navigate("collection", group, query); }}><label htmlFor="mobile-collection-search">Find a project</label><input autoFocus id="mobile-collection-search" type="search" placeholder="Title, form, or place" value={query} onChange={event => updateQuery(event.target.value)} /><button type="submit">Show results <span aria-hidden="true">↗</span></button></form>{groupLinks}</div>
        : <nav className={styles.menuLinks} aria-label="Mobile navigation"><a href="/preview" onClick={event => go(event, "home")}>Index</a><a href={destination("collection")} onClick={event => go(event, "collection")}>Collection</a><a href={destination("studio")} onClick={event => go(event, "studio")}>Studio</a><a href="#contact" onClick={() => { closePanel(); requestAnimationFrame(() => document.getElementById("contact")?.scrollIntoView()); }}>Contact</a></nav>}
      <div className={styles.dialogClock}><LocalReadout /></div>
    </dialog>
  </div>;
}
