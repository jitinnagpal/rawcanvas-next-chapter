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
      <section id="home" className="container-max px-5 md:px-10 pt-6 pb-16 md:pb-20">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-2 lg:items-end">
          <div className="flex flex-col gap-6 md:gap-7 lg:pb-3">
            <p className="eyebrow">Residential interiors, design to handover</p>
            <h1 className="font-heading font-medium tracking-[-0.02em] text-foreground text-[40px] leading-[1.05] sm:text-[52px] xl:text-[68px]">
              Homes that hold the light, and the way you live in them.
            </h1>
            <p className="text-[18px] md:text-[19px] leading-relaxed text-foreground/75 max-w-[520px]">
              Mokha Designs is Prerna Mokha's studio in Hyderabad. We design, build and furnish apartments and villas
              end to end, so one team answers for how it looks and how it is made.
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={openForm} className="btn-ink">
                Book a design call
              </button>
              <a href="#work" className="btn-outline">
                See recent homes
              </a>
            </div>
          </div>
          <img
            src="/images/site/living-grey.jpg"
            alt="Living room with grey sofas, blue rug and brass coffee table, designed by Mokha Designs"
            className="w-full h-[380px] sm:h-[480px] lg:h-[620px] object-cover rounded-[4px]"
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
