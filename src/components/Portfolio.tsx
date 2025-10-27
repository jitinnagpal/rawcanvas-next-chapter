import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import kitchenImage from '@/assets/portfolio-kitchen.jpg';
import bedroomImage from '@/assets/portfolio-bedroom.jpg';
import livingSpaceImage from '@/assets/portfolio-living-space.jpg';
import diningImage from '@/assets/portfolio-dining.jpg';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Residential', 'Commercial', 'Kitchen', 'Bedroom'];

  const projects = [
    {
      id: 1,
      title: 'Modern Kitchens',
      category: 'Kitchen',
      type: 'Residential',
      image: kitchenImage,
      description: 'Contemporary kitchen with gold hardware and natural materials',
      galleryLink: '/gallery/kitchen'
    },
    {
      id: 2,
      title: 'Luxury Bedrooms',
      category: 'Bedroom',
      type: 'Residential',
      image: bedroomImage,
      description: 'Elegant bedroom design with warm neutral tones and luxury finishes',
      galleryLink: '/gallery/bedroom'
    },
    {
      id: 3,
      title: 'Living Spaces',
      category: 'Living',
      type: 'Residential',
      image: livingSpaceImage,
      description: 'Warm and inviting living space with artistic wall features and elegant furnishings',
      galleryLink: '/gallery/living'
    },
    {
      id: 4,
      title: 'Transformations',
      category: 'Dining',
      type: 'Residential',
      image: diningImage,
      description: 'Sophisticated dining area with contemporary lighting and luxury finishes',
      galleryLink: '/gallery/dining'
    }
  ];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => 
        project.category === activeCategory || project.type === activeCategory
      );

  return (
    <section id="portfolio" className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Our Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our collection of beautifully designed spaces that showcase 
            our expertise in creating functional and aesthetically pleasing interiors.
          </p>

        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="elegant-card group p-0 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button variant="secondary" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {project.type}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <Link to={project.galleryLink}>
                  <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-primary">
                    View Projects
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View All Projects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;