import { useState, lazy, Suspense } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEntryMode } from '@/hooks/useEntryMode';
import { trackEstimateCostClicked } from '@/utils/analytics';

const Contact = lazy(() => import('@/components/Contact'));

const Hero = () => {
  const { setEntryMode } = useEntryMode();
  const [showFormDialog, setShowFormDialog] = useState(false);

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
          <img
            src="/images/site/living-grey.jpg"
            alt="Living room with grey sofas, blue rug and brass coffee table, designed by Mokha Designs"
            className="order-1 lg:order-2 -mx-5 w-[calc(100%+2.5rem)] max-w-none sm:mx-0 sm:w-full h-[44vh] min-h-[300px] max-h-[420px] sm:max-h-none sm:h-[480px] lg:h-[620px] object-cover sm:rounded-[4px]"
            fetchPriority="high"
          />
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
