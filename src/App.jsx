import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const titles = [
  ["Grandma Has a Flamethrower", "Action · 1h 52m", "grandma-flamethrower"],
  ["Tax Evasion: The Musical", "Comedy · 2h 03m", "tax-musical"],
  ["Crocodile in Accounting", "Workplace thriller · 1h 38m", "crocodile-office"],
  ["My Ex Is a Time Traveller", "Rom-com · 1h 44m", "time-travel-romance"],
  ["The Wi-Fi Died at Dawn", "Survival drama · 1h 29m", "wifi-apocalypse"],
  ["Return of the Angry Pigeon", "Revenge epic · 1h 57m", "angry-pigeon"],
  ["The Last Uber From Mars", "Sci-fi · 2h 11m", "mars-cab"],
  ["Kung Fu Accountant", "Action comedy · 1h 41m", "kungfu-accountant"],
  ["Who Put a Goat in HR?", "Office comedy · 8 episodes", "goat-office"],
  ["Sasquatch: Regional Manager", "Mockumentary · 10 episodes", "sasquatch-manager"],
  ["Sharks With LinkedIn", "Business horror · 1h 36m", "shark-boardroom"],
  ["The Intern Knows Too Much", "Conspiracy · 1h 48m", "intern-conspiracy"],
  ["Weekend at Dracula's", "Dark comedy · 1h 55m", "dracula-weekend"],
  ["Aliens Stole My Bakkie", "South African sci-fi · 1h 46m", "alien-bakkie"],
  ["Loadshedding 2099", "Dystopian comedy · 2h 06m", "future-city-dark"],
  ["My Dad Joined a Cult for Gym Discounts", "Comedy · 1h 39m", "gym-cult"],
  ["The Dishwasher Is Sentient", "Tech horror · 1h 31m", "robot-kitchen"],
  ["CSI: Neighbourhood WhatsApp Group", "Crime parody · 12 episodes", "neighbourhood-phone"],
  ["Planet of the Accountants", "Sci-fi comedy · 2h 12m", "planet-accountants"],
  ["Fast & Curious: Parking Lot Drift", "Action parody · 1h 43m", "parking-drift"],
].map(([title, meta, seed], id) => ({
  id,
  title,
  meta,
  image: `https://picsum.photos/seed/${seed}/900/1200`,
}));

const rows = [
  ["Because your week was too normal", titles.slice(0, 6)],
  ["Critically questionable choices", titles.slice(6, 12)],
  ["Made with suspicious confidence", titles.slice(12, 18)],
];

function Icon({ name }) {
  const paths = {
    play: <path d="M8 5v14l11-7z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <path d="m20 20-4.5-4.5M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4.2 4.2L19 6.8" />,
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      {paths[name]}
    </svg>
  );
}

function MovieCard({ item, saved, onSave, onOpen }) {
  return (
    <article className="movie-card group" tabIndex="0" onClick={() => onOpen(item)}>
      <div className="movie-art">
        <img src={item.image} alt="" loading="lazy" />
        <div className="movie-overlay" />
        <button
          className="save-button"
          aria-label={saved ? `Remove ${item.title} from My Nope` : `Add ${item.title} to My Nope`}
          onClick={(event) => {
            event.stopPropagation();
            onSave(item.id);
          }}
        >
          <Icon name={saved ? "check" : "plus"} />
        </button>
      </div>
      <h3>{item.title}</h3>
      <p>{item.meta}</p>
    </article>
  );
}

export default function App() {
  const rootRef = useRef(null);
  const storyRef = useRef(null);
  const heroRef = useRef(null);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(new Set([1, 8]));
  const [active, setActive] = useState(null);

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return [["Search results", titles.filter((item) => item.title.toLowerCase().includes(q))]];
  }, [query]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-shell", { y: -28, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".hero-kicker, .hero h1, .hero-copy, .hero-actions", {
        y: 42,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(".hero-poster", {
        x: 90,
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.utils.toArray(".reveal-word").forEach((word, index, words) => {
        gsap.fromTo(
          word,
          { opacity: 0.12 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: ".manifesto",
              start: `top+=${index * 4} 78%`,
              end: "bottom 42%",
              scrub: true,
            },
          },
        );
      });

      const desktop = window.matchMedia("(min-width: 900px)").matches;
      if (desktop && storyRef.current) {
        ScrollTrigger.create({
          trigger: storyRef.current,
          start: "top 18%",
          end: "bottom 74%",
          pin: ".story-copy",
          pinSpacing: false,
        });
      }

      gsap.utils.toArray(".story-card img").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 0.86, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: img,
              start: "top 88%",
              end: "center 52%",
              scrub: true,
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const toggleSaved = (id) => {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main ref={rootRef} className="app-shell">
      <header className="nav-wrap">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Nopeflix home">
            <img src="/logo.svg" alt="Nopeflix" />
          </a>
          <div className="nav-links">
            <a href="#browse">Browse</a>
            <a href="#unhinged">Unhinged</a>
            <a href="#my-nope">My Nope <span>{saved.size}</span></a>
          </div>
          <label className="search-box">
            <Icon name="search" />
            <span className="sr-only">Search titles</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search nonsense"
            />
          </label>
        </nav>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-glow" />
        <div className="hero-content">
          <p className="hero-kicker">No algorithms were emotionally prepared for this.</p>
          <h1>Grandma got tired of bingo. Now she has a flamethrower.</h1>
          <p className="hero-copy">
            A prestige action epic about pension disputes, suburban justice, and one extremely
            overqualified grandmother.
          </p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => setActive(titles[0])}>
              <Icon name="play" /> Watch the chaos
            </button>
            <button className="button secondary" onClick={() => toggleSaved(0)}>
              <Icon name={saved.has(0) ? "check" : "plus"} />
              {saved.has(0) ? "In My Nope" : "My Nope"}
            </button>
          </div>
        </div>

        <button className="hero-poster" onClick={() => setActive(titles[0])} aria-label="Open Grandma Has a Flamethrower">
          <img src={titles[0].image} alt="" />
          <span>NOPEFLIX ORIGINAL-ISH</span>
        </button>
      </section>

      <section className="marquee" aria-label="Featured absurd titles">
        <div className="marquee-track">
          {[...titles.slice(1, 8), ...titles.slice(1, 8)].map((item, index) => (
            <span key={`${item.id}-${index}`}>{item.title}<i /></span>
          ))}
        </div>
      </section>

      <section className="catalogue" id="browse">
        {filteredRows.map(([label, items]) => (
          <div className="content-row" key={label}>
            <div className="row-heading">
              <h2>{label}</h2>
              <span>{items.length} titles your therapist did not recommend</span>
            </div>
            {items.length ? (
              <div className="movie-grid">
                {items.map((item) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                    saved={saved.has(item.id)}
                    onSave={toggleSaved}
                    onOpen={setActive}
                  />
                ))}
              </div>
            ) : (
              <p className="empty-state">Nothing. Even we were not weird enough for that search.</p>
            )}
          </div>
        ))}
      </section>

      <section className="manifesto-wrap" id="unhinged">
        <p className="manifesto">
          {"Streaming got predictable. So we built a place where a kung fu accountant can share a homepage with a corporate crocodile and nobody asks follow-up questions."
            .split(" ")
            .map((word, index) => (
              <span className="reveal-word" key={index}>{word} </span>
            ))}
        </p>
      </section>

      <section className="bento" aria-label="Nopeflix features">
        <article className="bento-card bento-main">
          <div>
            <p>For people who are tired of “gritty detective drama #47”.</p>
            <h2>Press play on bad decisions with excellent production values.</h2>
          </div>
          <img src="https://picsum.photos/seed/blue-cinema-chaos/1400/900" alt="" />
        </article>
        <article className="bento-card">
          <p>My Nope</p>
          <h3>Save the titles you absolutely should not watch before an important meeting.</h3>
        </article>
        <article className="bento-card">
          <p>Search without dignity</p>
          <h3>Try “goat”, “tax”, “alien”, or “accountant”. We have made several regrettable choices.</h3>
        </article>
        <article className="bento-card bento-wide">
          <p>One subscription tier in this prototype: emotionally available.</p>
          <div className="ticker-line">
            <span>No ads</span><span>No red logo</span><span>No sensible catalogue</span><span>Maximum blue</span>
          </div>
        </article>
      </section>

      <section className="story-section" ref={storyRef}>
        <div className="story-copy">
          <p>Tonight's plans</p>
          <h2>
            Cancelled. We found
            <span
              className="inline-image"
              style={{ backgroundImage: `url(${titles[13].image})` }}
              aria-hidden="true"
            />
            something worse.
          </h2>
        </div>
        <div className="story-stack">
          {titles.slice(13, 17).map((item, index) => (
            <button className="story-card" key={item.id} onClick={() => setActive(item)}>
              <img src={item.image} alt="" />
              <div>
                <span>0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.meta}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="accordion-section">
        <div className="accordion-heading">
          <h2>Choose a terrible idea</h2>
          <p>Hover a genre. Regret nothing.</p>
        </div>
        <div className="genre-accordion">
          {[
            ["Corporate Horror", "Meetings that could have been an exorcism.", "office-horror"],
            ["Budget Sci-Fi", "The aliens arrived. Production forgot the permit.", "cheap-space"],
            ["Unqualified Heroes", "Nobody here has the correct certification.", "unlikely-hero"],
            ["Romance-ish", "Two people. Zero communication skills.", "awkward-romance"],
          ].map(([name, copy, seed]) => (
            <article className="genre-panel" key={name}>
              <img src={`https://picsum.photos/seed/${seed}/1000/1400`} alt="" />
              <div>
                <h3>{name}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="saved-section" id="my-nope">
        <div>
          <p>My Nope</p>
          <h2>{saved.size ? "Your questionable decisions, safely stored." : "You have shown suspicious restraint."}</h2>
        </div>
        <div className="saved-list">
          {titles.filter((item) => saved.has(item.id)).map((item) => (
            <button key={item.id} onClick={() => setActive(item)}>
              <img src={item.image} alt="" />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </section>

      <footer>
        <img src="/logo.svg" alt="Nopeflix" />
        <p>Fictional streaming concept. Distinct branding, wildly unserious catalogue.</p>
        <span>Built for terrible movie-night judgement.</span>
      </footer>

      {active && (
        <div className="modal-backdrop" role="presentation" onClick={() => setActive(null)}>
          <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setActive(null)} aria-label="Close">
              <Icon name="close" />
            </button>
            <img src={active.image} alt="" />
            <div className="modal-content">
              <p>{active.meta}</p>
              <h2 id="detail-title">{active.title}</h2>
              <p>
                Nobody approved this synopsis. That is precisely why it made the homepage.
                Expect heroic mistakes, unnecessary confidence, and at least one scene that
                should have required legal review.
              </p>
              <div className="hero-actions">
                <button className="button primary" onClick={() => setActive(null)}>
                  <Icon name="play" /> Start pretending
                </button>
                <button className="button secondary" onClick={() => toggleSaved(active.id)}>
                  <Icon name={saved.has(active.id) ? "check" : "plus"} />
                  {saved.has(active.id) ? "Saved" : "My Nope"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
