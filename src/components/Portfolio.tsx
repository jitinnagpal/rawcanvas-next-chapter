import { Link } from 'react-router-dom';

type Item = { src: string; alt: string; title: string; note: string; wide?: boolean; tall?: boolean; pos?: string };

const items: Item[] = [
  {
    src: '/images/site/bar-birds.jpg',
    alt: 'Home bar with a fluted wood wall, brass birds in flight and teal velvet chairs',
    title: 'Bar wall, apartment, Hyderabad.',
    note: 'Fluted wood, brass birds in flight, and a backlit mirror over the wash counter.',
    wide: true,
  },
  {
    src: '/images/site/lounge-screens.jpg',
    alt: 'Lounge behind brass-framed fluted-glass screens under a slatted wood ceiling',
    title: 'Lounge.',
    note: 'Brass-framed glass screens divide it from the entrance without closing it off.',
  },
  {
    src: '/images/site/kitchen-ocean.jpg',
    alt: 'Kitchen with sea-blue base units under white upper cabinets',
    title: 'Kitchen.',
    note: 'Sea-blue base units for a family that loves the ocean.',
    pos: '18% 50%',
  },
  {
    src: '/images/site/reading-nook.jpg',
    alt: 'Reading corner with solid wood shelving and a hand-painted wall',
    title: 'Reading corner.',
    note: 'Hand-painted wall, solid wood shelving.',
  },
  {
    src: '/images/site/bedroom-slatted.jpg',
    alt: 'Bedroom with a slatted wood ceiling feature running down behind the bed',
    title: 'Bedroom.',
    note: 'A slatted ceiling that runs down the wall to become the headboard.',
  },
];

const rooms = [
  { to: '/gallery/living', label: 'Living spaces' },
  { to: '/gallery/kitchen', label: 'Kitchens' },
  { to: '/gallery/bedroom', label: 'Bedrooms' },
];

const Portfolio = () => (
  <section id="work" className="container-max px-5 md:px-10 pt-16 md:pt-24 pb-10 scroll-mt-16 md:scroll-mt-[76px]">
    <div className="flex flex-wrap items-end justify-between gap-4 md:gap-5 mb-8 md:mb-10">
      <h2 className="section-title">Recent homes</h2>
      <p className="text-[16px] md:text-[17px] text-foreground/75 max-w-[460px]">
        Photographed as lived in, not staged. Every room below is a finished Mokha Designs project.
      </p>
    </div>

    <div className="grid gap-9 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <figure key={it.src} className={`flex flex-col gap-3 ${it.wide ? 'sm:col-span-2' : ''}`}>
          <img
            src={it.src}
            alt={it.alt}
            loading="lazy"
            style={it.pos ? { objectPosition: it.pos } : undefined}
            className={`-mx-5 w-[calc(100%+2.5rem)] max-w-none sm:mx-0 sm:w-full object-cover ${it.wide ? 'h-[300px] sm:h-[460px] lg:h-[520px]' : 'h-[300px] sm:h-[400px] lg:h-[440px]'}`}
          />
          <figcaption className="text-[14px] md:text-[15px] leading-snug text-foreground/75">
            <span className="font-medium text-foreground">{it.title}</span> {it.note}
          </figcaption>
        </figure>
      ))}
    </div>

    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <span className="text-[15px] text-muted-foreground">Browse by room</span>
      <div className="flex flex-wrap gap-2.5">
        {rooms.map((r) => (
          <Link key={r.to} to={r.to} className="rounded-full border border-border px-4 py-2.5 text-[15px] text-foreground hover:border-foreground transition-colors">
            {r.label}
          </Link>
        ))}
        <a
          href="/brochures/mokha-designs-portfolio.pdf"
          target="_blank"
          rel="noopener"
          className="rounded-full border border-border px-4 py-2.5 text-[15px] text-foreground hover:border-foreground transition-colors"
        >
          Portfolio PDF
        </a>
      </div>
    </div>
  </section>
);

export default Portfolio;
