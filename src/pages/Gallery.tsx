import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Kitchen images
import kitchen1 from '@/assets/gallery/kitchen-1.jpg';
import kitchen2 from '@/assets/gallery/kitchen-2.jpg';
import kitchen3 from '@/assets/gallery/kitchen-3.jpg';
import kitchen4 from '@/assets/gallery/kitchen-4.jpg';
import kitchen5 from '@/assets/gallery/kitchen-5.jpg';
import kitchen6 from '@/assets/gallery/kitchen-6.jpg';
import kitchen7 from '@/assets/gallery/kitchen-7.jpg';
import kitchenVideo1 from '@/assets/gallery/kitchen-7.mov';

// Bedroom images
import bedroom1 from '@/assets/gallery/bedroom-1.jpg';
import bedroom2 from '@/assets/gallery/bedroom-2.jpg';
import bedroom3 from '@/assets/gallery/bedroom-3.jpg';
import bedroom4 from '@/assets/gallery/bedroom-4.jpg';
import bedroom5 from '@/assets/gallery/bedroom-5.jpg';

const galleryData = {
  kitchen: {
    title: 'Modern Kitchens',
    description: 'Explore our collection of contemporary kitchen designs featuring gold hardware, natural materials, and sophisticated finishes.',
    images: [
      { src: kitchen1, alt: 'Modern kitchen with blue and white cabinets' },
      { src: kitchen2, alt: 'Contemporary kitchen with marble backsplash' },
      { src: kitchen3, alt: 'Industrial kitchen with wood and concrete elements' },
      { src: kitchen4, alt: 'Modern kitchen showroom display' },
      { src: kitchen5, alt: 'Kitchen with sage green island and dining setup' },
      { src: kitchen6, alt: 'Minimalist kitchen with marble island' },
      { src: kitchenVideo1, alt: 'Kitchen walkthrough video', type: 'video', poster: kitchen7 },
    ]
  },
  bedroom: {
    title: 'Luxury Bedrooms',
    description: 'Discover our elegant bedroom designs with warm neutral tones and luxury finishes.',
    images: [
      { src: bedroom1, alt: 'Modern bedroom with gold sunburst mirror and textured wall' },
      { src: bedroom2, alt: 'Contemporary bedroom with ambient lighting and mirrored wardrobe' },
      { src: bedroom3, alt: 'Elegant bedroom with palm leaf wallpaper and purple accents' },
      { src: bedroom4, alt: 'Serene bedroom with textured wallpaper and breakfast tray' },
      { src: bedroom5, alt: 'Cozy bedroom with textured walls and garden view' },
    ]
  },
  living: {
    title: 'Living Spaces',
    description: 'Browse our warm and inviting living space designs with artistic wall features and elegant furnishings.',
    images: []
  },
  dining: {
    title: 'Elegant Dining Rooms',
    description: 'View our sophisticated dining area designs with contemporary lighting and luxury finishes.',
    images: []
  }
};

const Gallery = () => {
  const { category } = useParams<{ category: string }>();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const gallery = category ? galleryData[category as keyof typeof galleryData] : null;

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Gallery not found</h1>
          <Link to="/#portfolio">
            <Button>Back to Portfolio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="mb-12">
            <Link to="/#portfolio">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              {gallery.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {gallery.description}
            </p>
          </div>

          {/* Gallery Grid */}
          {gallery.images.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.images.map((image, index) => (
                <div 
                  key={index}
                  className="elegant-card p-0 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(index)}
                >
                  {image.type === 'video' ? (
                    <video
                      src={image.src}
                      poster={(image as any).poster}
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
