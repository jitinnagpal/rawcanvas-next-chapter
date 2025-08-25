import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+91 99083 92200',
      action: 'tel:+919908392200'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'rawcanvas22@gmail.com',
      action: 'mailto:rawcanvas22@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: 'Mumbai, India',
      action: '#'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: 'Mon - Fri: 9:00 AM - 6:00 PM',
      action: '#'
    }
  ];

  return (
    <section id="contact" className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your space? Contact us for a free consultation 
            and let's discuss how we can bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-8">
              Let's Start Your Project
            </h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                    {info.action.startsWith('#') ? (
                      <p className="text-muted-foreground">{info.details}</p>
                    ) : (
                      <a 
                        href={info.action}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.details}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-heading font-semibold text-foreground mb-4">
                Why Choose Raw Canvas?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Free consultation and quote</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Turnkey solutions from design to furnishing</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Experienced team of professionals</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Quality materials and timely delivery</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="elegant-card">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
              Send Us a Message
            </h3>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input 
                    id="firstName" 
                    placeholder="Your first name"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input 
                    id="lastName" 
                    placeholder="Your last name"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com"
                  className="bg-background border-border"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+91 Your phone number"
                  className="bg-background border-border"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
                  Project Type
                </label>
                <select 
                  id="projectType"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select project type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="renovation">Renovation</option>
                  <option value="consultation">Consultation Only</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your project..."
                  rows={4}
                  className="bg-background border-border"
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;