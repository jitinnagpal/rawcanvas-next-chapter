import { Link } from 'react-router-dom';

type Item = { src: string; alt: string; title: string; note: string; wide?: boolean; tall?: boolean };

const items: Item[] = [
  {
    src: '/images/site/study-bar.jpg',
    alt: 'Study with a bar counter, teal stools and a balcony door',
    title: 'Study and bar, apartment, Hyderabad.',
    note: 'A balcony door kept clear so the room works on daylight till evening.',
    wide: true,
  },
  {
    src: '/images/site/reading-nook.jpg',
    alt: 'Reading corner with solid wood shelving and a hand-painted wall',
    title: 'Reading corner.',
    note: 'Hand-painted wall, solid wood shelving.',
  },
  {
    src: '/images/site/kitchen-white.jpg',
    alt: 'White modular kitchen with marble-look backsplash and deep drawers',
    title: 'Kitchen.',
    note: 'Deep drawers over doors, marble-look backsplash.',
  },
  {
    src: '/images/site/bedroom-grey.jpg',
    alt: 'Guest bedroom in grey with a block-print throw',
    title: 'Guest bedroom.',
    note: 'Quiet greys, block-print throw.',
  },
  {
    src: '/images/site/corridor.jpg',
    alt: 'Entrance corridor with carved panel, console and runner rug',
    title: 'Entrance.',
    note: 'A long corridor turned into a gallery.',
  },
];

const rooms = [
  { to: '/gallery/living', label: 'Living spaces' },
  { to: '/gallery/kitchen', label: 'Kitchens' },
  { to: '/gallery/bedroom', label: 'Bedrooms' },
];

const Portfolio = () => (
  <section id="work" className="container-max px-5 md:px-10 pt-20 md:pt-24 pb-10">
    <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
      <h2 className="section-title">Recent homes</h2>
      <p className="text-[17px] text-foreground/75 max-w-[460px]">
        Photographed as lived in, not staged. Every room below is a finished Mokha Designs project.
      </p>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <figure key={it.src} className={`flex flex-col gap-3 ${it.wide ? 'sm:col-span-2' : ''}`}>
          <img
            src={it.src}
            alt={it.alt}
            loading="lazy"
            className={`w-full object-cover ${it.wide ? 'h-[320px] sm:h-[460px] lg:h-[520px]' : 'h-[320px] sm:h-[400px] lg:h-[440px]'}`}
          />
          <figcaption className="text-[15px] text-foreground/75">
            <span className="font-medium text-foreground">{it.title}</span> {it.note}
          </figcaption>
        </figure>
      ))}
    </div>

    <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-[16px]">
      <span className="text-muted-foreground">Browse by room:</span>
      {rooms.map((r) => (
        <Link key={r.to} to={r.to} className="underline underline-offset-4 decoration-border hover:decoration-foreground">
          {r.label}
        </Link>
      ))}
      <a
        href="/brochures/mokha-designs-portfolio.pdf"
        target="_blank"
        rel="noopener"
        className="underline underline-offset-4 decoration-border hover:decoration-foreground"
      >
        Portfolio PDF
      </a>
    </div>
  </section>
);

export default Portfolio;
