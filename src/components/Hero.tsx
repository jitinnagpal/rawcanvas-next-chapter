import { useState, useEffect, lazy, Suspense } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEntryMode } from '@/hooks/useEntryMode';
import { trackEstimateCostClicked } from '@/utils/analytics';

const Contact = lazy(() => import('@/components/Contact'));

// Three homes, three palettes. Crossfades every 6s; stays on the first image
// for visitors who ask their device to reduce motion.
const HERO_IMAGES = [
  {
    src: '/images/site/living-mauve.jpg',
    alt: 'Living room in mauve velvet under a large abstract canvas, lit by daylight through sheer curtains, designed by Mokha Designs',
    pos: '85% 50%',
  },
  {
    src: '/images/site/hero-lounge-orange.jpg',
    alt: 'Lounge with a burnt-orange leaf-textured wall, slatted wood ceiling and brass-framed screens, designed by Mokha Designs',
    pos: '40% 50%',
  },
  {
    src: '/images/site/hero-kitchen-sage.jpg',
    alt: 'Sage green kitchen with a grey island set for two, designed by Mokha Designs',
    pos: '60% 50%',
  },
];
const HERO_INTERVAL_MS = 6000;

const Hero = () => {
  const { setEntryMode } = useEntryMode();
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [slide, setSlide] = useState(0);
  const [restLoaded, setRestLoaded] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    // Load the other images only after the page has settled, then start rotating.
    const start = window.setTimeout(() => setRestLoaded(true), 2500);
    const tick = window.setInterval(() => {
      if (!document.hidden) setSlide((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_INTERVAL_MS);
    return () => { window.clearTimeout(start); window.clearInterval(tick); };
  }, []);

  const openForm = () => {
    setEntryMode('consult');
    trackEstimateCostClicked();
    setShowFormDialog(true);
  };

  return (
    <>
      <section id="home" className="container-max px-5 md:px-10 pt-0 sm:pt-6 pb-14 md:pb-20">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-2 lg:items-end">
          <div className="order-2 lg:order-1 flex flex-col gap-5 md:gap-7 lg:pb-3">
            <p className="eyebrow hidden sm:block">Residential interiors, design to handover</p>
            <h1 className="font-heading font-medium tracking-[-0.02em] text-foreground text-[34px] leading-[1.08] sm:text-[52px] xl:text-[68px]">
              Homes that hold the light, and the way you live in them.
            </h1>
            <p className="text-[16px] md:text-[19px] leading-relaxed text-foreground/75 max-w-[520px]">
              Mokha Designs is Prerna Mokha's studio in Hyderabad. We design, build and furnish apartments and villas
              end to end, so one team answers for how it looks and how it is made.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
              <button type="button" onClick={openForm} className="btn-ink">
                Book a design call
              </button>
              <a href="#work" className="btn-outline hidden sm:inline-flex">
                See recent homes
              </a>
              <a href="#work" className="sm:hidden text-[16px] font-medium underline underline-offset-4 decoration-border">
                See recent homes
              </a>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative overflow-hidden -mx-5 w-[calc(100%+2.5rem)] max-w-none sm:mx-0 sm:w-full h-[44vh] min-h-[300px] max-h-[420px] sm:max-h-none sm:h-[480px] lg:h-[620px] sm:rounded-[4px] bg-muted">
            {HERO_IMAGES.map((img, i) =>
              i === 0 || restLoaded ? (
                <img
                  key={img.src}
                  src={img.src}
                  alt={i === slide ? img.alt : ''}
                  aria-hidden={i !== slide}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-in-out ${i === (restLoaded ? slide : 0) ? 'opacity-100' : 'opacity-0'}`}
                  style={{ objectPosition: img.pos }}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                />
              ) : null
            )}
          </div>
        </div>
      </section>

      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <VisuallyHidden>
            <DialogTitle>Book a design call</DialogTitle>
          </VisuallyHidden>
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading form...</div>}>
            <Contact embedded />
          </Suspense>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Hero;
