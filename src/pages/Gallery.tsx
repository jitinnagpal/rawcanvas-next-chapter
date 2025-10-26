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
      { src: kitchen7, alt: 'Contemporary kitchen with wood tone cabinets' },
    ]
  },
  bedroom: {
    title: 'Luxury Bedrooms',
    description: 'Discover our elegant bedroom designs with warm neutral tones and luxury finishes.',
    images: []
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
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
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
                <img
                  src={gallery.images[selectedImage].src}
                  alt={gallery.images[selectedImage].alt}
                  className="max-w-full max-h-[90vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
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
