import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Kitchen images
import kitchen2 from '@/assets/gallery/kitchen-2.jpg';
import kitchen3 from '@/assets/gallery/kitchen-3.jpg';
import kitchen4 from '@/assets/gallery/kitchen-4.jpg';
import kitchen5 from '@/assets/gallery/kitchen-5.jpg';
import kitchen6 from '@/assets/gallery/kitchen-6.jpg';
import kitchen7 from '@/assets/gallery/kitchen-7.jpg';
import kitchenVideo1 from '@/assets/gallery/kitchen-7.mp4';

// Bedroom images
import bedroom1 from '@/assets/gallery/bedroom-1.jpg';
import bedroom3 from '@/assets/gallery/bedroom-3.jpg';
import bedroom4 from '@/assets/gallery/bedroom-4.jpg';

// Living space images
import living1 from '@/assets/gallery/living-1.jpg';
import living3 from '@/assets/gallery/living-3.jpg';
import living4 from '@/assets/gallery/living-4.jpg';
import living5 from '@/assets/gallery/living-5.jpg';
import living6 from '@/assets/gallery/living-6.jpg';
import living8 from '@/assets/gallery/living-8.jpg';
import living9 from '@/assets/gallery/living-9.jpg';
import living10 from '@/assets/gallery/living-10.jpg';

type GalleryImage = { src: string; alt: string; type?: 'video'; poster?: string; caption?: string };
type GalleryCategory = { title: string; description: string; images: GalleryImage[] };

const SHOWROOM = 'Kitchen Stories showroom, Hyderabad.';

const galleryData: Record<string, GalleryCategory> = {
  kitchen: {
    title: 'Kitchens',
    description:
      'Planned around how your household cooks: deep drawers over doors, counters kept clear, and appliances placed where the work happens.',
    images: [
      {
        src: '/images/site/kitchen-ocean.jpg',
        alt: 'Kitchen with sea-blue base units under white upper cabinets',
        caption:
          'For a family that loves the ocean and surfing: sea-blue base units under white uppers, with the theme carried through the home by a sand-textured abstract waves wallpaper.',
      },
      { src: kitchen5, alt: 'Sage green kitchen with a grey island set for two' },
      { src: kitchen2, alt: 'White kitchen with deep drawers and a marble-look backsplash' },
      {
        src: kitchen3,
        alt: 'Kitchen in navy lacquer and light oak with tall built-in ovens',
        caption: 'Designed by Prerna for the Kitchen Stories showroom, Hyderabad.',
      },
      { src: kitchen4, alt: 'Grey kitchen with an island and open display shelving', caption: SHOWROOM },
      { src: kitchen6, alt: 'Grey kitchen with an island hob and a steel chimney', caption: SHOWROOM },
      { src: kitchenVideo1, alt: 'Kitchen walkthrough video', type: 'video' as const, poster: kitchen7, caption: SHOWROOM },
    ]
  },
  bedroom: {
    title: 'Bedrooms',
    description:
      'Kept calm: one considered wall behind the bed, layered light in place of a single ceiling fixture, and wardrobes built into the plan rather than added at the end.',
    images: [
      { src: '/images/site/bedroom-slatted.jpg', alt: 'Bedroom with a slatted wood ceiling feature running down behind the bed' },
      { src: bedroom1, alt: 'Bedroom with a grasscloth headboard wall and sunburst mirror' },
      { src: bedroom3, alt: 'Bedroom with feather-print wallpaper and a marble-look wardrobe' },
      { src: bedroom4, alt: 'Grey guest bedroom with a block-print throw' },
    ]
  },
  living: {
    title: 'Living spaces',
    description:
      'Living rooms, bars, studies, entrances and balconies. Each is planned for daily use first, then finished with the materials and pieces that make it yours.',
    images: [
      { src: '/images/site/living-mauve.jpg', alt: 'Living room in mauve velvet under a large abstract canvas, lit by daylight' },
      { src: '/images/site/bar-birds.jpg', alt: 'Home bar with a fluted wood wall, brass birds in flight and teal velvet chairs' },
      { src: '/images/site/lounge-screens.jpg', alt: 'Lounge behind brass-framed fluted-glass screens under a slatted wood ceiling' },
      { src: living4, alt: 'Lounge with a burnt-orange textured wall and slatted ceiling' },
      { src: living5, alt: 'Home bar with teal stools and a slatted ceiling' },
      { src: living1, alt: 'Living room in grey and blue with brass coffee tables' },
      { src: living3, alt: 'Long living room with tufted sofas and crystal pendant lights' },
      { src: living8, alt: 'Reading corner with solid wood shelving and a hand-painted wall' },
      { src: living9, alt: 'Armchair corner against a hand-painted wall' },
      {
        src: '/images/site/surfboard-corner.jpg',
        alt: 'Corner with a red surfboard, two cane chairs and a wooden book stand',
        caption: 'The ocean-loving family again: a surfboard given a corner of its own.',
      },
      { src: living10, alt: 'Balcony with a turf floor, red cushions and hanging planters' },
      { src: living6, alt: 'Entrance corridor with a carved panel and runner rug' },
    ]
  },
};

const Gallery = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Scroll to top when gallery loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [category]);
  
  // /gallery/dining existed on the old site; send old links to Living spaces.
  const key = category === 'dining' ? 'living' : category;
  const gallery = key ? galleryData[key] : null;
  
  const handleBackToPortfolio = () => {
    navigate('/');
    setTimeout(() => {
      const portfolioSection = document.getElementById('work');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">Gallery not found</h1>
            <Button onClick={handleBackToPortfolio}>Back to recent homes</Button>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-5 md:px-10 pt-6 pb-16 md:py-24">
        <div className="container-max">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <Button variant="ghost" className="mb-4 md:mb-6 -ml-4" onClick={handleBackToPortfolio}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to recent homes
            </Button>
            <h1 className="text-[32px] md:text-5xl font-heading font-medium tracking-tight text-foreground mb-3 md:mb-4">
              {gallery.title}
            </h1>
            <p className="text-[16px] md:text-xl text-muted-foreground max-w-3xl">
              {gallery.description}
            </p>
          </div>

          {/* Gallery Grid */}
          {gallery.images.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {gallery.images.map((image, index) => (
                <div 
                  key={index}
                  className="elegant-card p-0 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(index)}
                >
                  {image.type === 'video' ? (
                    <video
                      src={image.src}
                      poster={image.poster}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                      muted
                      playsInline
                      controls
                    />
                  ) : (
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {image.caption && (
                    <p className="px-4 py-3 text-[14px] md:text-[15px] leading-snug text-foreground/75 border-t border-border">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Gallery images coming soon...
              </p>
            </div>
          )}

          {/* Lightbox */}
          {selectedImage !== null && (
            <div 
              className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>
              <div className="max-w-7xl max-h-[90vh] relative">
                {(gallery.images[selectedImage] as any).type === 'video' ? (
                  <video
                    src={gallery.images[selectedImage].src}
                    poster={(gallery.images[selectedImage] as any).poster}
                    className="max-w-full max-h-[90vh] object-contain"
                    controls
                    autoPlay
                    playsInline
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <img
                    src={gallery.images[selectedImage].src}
                    alt={gallery.images[selectedImage].alt}
                    className="max-w-full max-h-[90vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {selectedImage > 0 && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(selectedImage - 1);
                      }}
                    >
                      Previous
                    </Button>
                  )}
                  {selectedImage < gallery.images.length - 1 && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(selectedImage + 1);
                      }}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
