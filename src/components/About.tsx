import { Award, Users, Home } from 'lucide-react';
import prernaProfile from '@/assets/prerna-profile.jpg';

const About = () => {
  const stats = [
    { icon: Home, number: '200+', label: 'Projects Completed' },
    { icon: Users, number: '150+', label: 'Happy Clients' },
    { icon: Award, number: '20+', label: 'Years Experience' },
  ];

  return (
    <section id="about" className="px-6 pt-6 pb-16 lg:px-12 lg:pt-8 lg:pb-24 bg-muted/30">
      <div className="container-max">
        {/* Stats bar — above heading */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center py-6 px-2 rounded-2xl bg-secondary/60 border border-border/60"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight">{stat.number}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              About Mokha Designs
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Mokha Designs is created with the intent to design spaces that are beautiful 
              and have a practical flow of movement to them. We are associated with 
              reliable & resourceful contractors to cater to all aspects of interior 
              design and execution.
            </p>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our focus is to create aesthetic design solutions that complement the 
                space usability, thereby enhancing its functionality with attractive layouts.
              </p>
            </div>
          </div>

          {/* Principal Designer */}
          <div className="elegant-card">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <img
                  src={prernaProfile}
                  alt="Prerna Mokha - Principal Designer at Mokha Designs"
                  className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-primary/20"
                />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                Prerna Mokha
              </h3>
              <p className="text-primary font-semibold mb-4">Principal Designer</p>
              
              <p className="text-muted-foreground leading-relaxed">
                With a passion for creating beautiful, functional spaces, Prerna brings 
                years of experience in residential and commercial interior design. Her 
                approach combines aesthetic excellence with practical functionality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
