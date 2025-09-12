import { Phone, Mail, MapPin, Clock, Send, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const Contact = () => {
  const [projectType, setProjectType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [apartmentSize, setApartmentSize] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [consultationDate, setConsultationDate] = useState<Date>();

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
      details: 'mokhadesigns@outlook.com',
      action: 'mailto:mokhadesigns@outlook.com'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: 'Hyderabad, India',
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
                Why Choose Mokha Designs?
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
              Begin Your Design Journey With Us
            </h3>
            
            <form className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="Your full name"
                    className="bg-background border-border mt-2"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number *
                    </Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 Your phone number"
                      className="bg-background border-border mt-2"
                      required
                      pattern="[+]?[0-9\s\-\(\)]+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com"
                      className="bg-background border-border mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-foreground">
                    Property Location *
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border mt-2">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="bengaluru">Bengaluru</SelectItem>
                      <SelectItem value="goa">Goa</SelectItem>
                      <SelectItem value="dubai">Dubai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    Type of Project *
                  </Label>
                  <RadioGroup value={projectType} onValueChange={setProjectType} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="residential" id="residential" />
                      <Label htmlFor="residential">Residential</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="commercial" id="commercial" />
                      <Label htmlFor="commercial">Commercial</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Conditional: Residential Property Type */}
                {projectType === 'residential' && (
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Property Type
                    </Label>
                    <RadioGroup value={propertyType} onValueChange={setPropertyType} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apartment" id="apartment" />
                        <Label htmlFor="apartment">Apartment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="villa" id="villa" />
                        <Label htmlFor="villa">Villa</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Conditional: Residential Property Size */}
                {projectType === 'residential' && (propertyType === 'apartment' || propertyType === 'villa') && (
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Residential Property Size
                    </Label>
                    <RadioGroup value={apartmentSize} onValueChange={setApartmentSize} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3bhk" id="3bhk" />
                        <Label htmlFor="3bhk">3BHK</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4bhk" id="4bhk" />
                        <Label htmlFor="4bhk">4BHK</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5bhk" id="5bhk" />
                        <Label htmlFor="5bhk">5BHK+</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Conditional: Commercial Property Size */}
                {projectType === 'commercial' && (
                  <div>
                    <Label htmlFor="commercial-size" className="text-sm font-medium text-foreground">
                      Commercial Property Size (sqft) *
                    </Label>
                    <Input 
                      id="commercial-size" 
                      type="number" 
                      placeholder="Enter size in square feet"
                      className="bg-background border-border mt-2"
                      min="1"
                      required
                    />
                  </div>
                )}

                {/* Property Status */}
                {projectType && (
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Status of Property
                    </Label>
                    <RadioGroup value={propertyStatus} onValueChange={setPropertyStatus} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="under-construction" id="under-construction" />
                        <Label htmlFor="under-construction">Under construction</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="handed-over" id="handed-over" />
                        <Label htmlFor="handed-over">Handed over (new)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="renovation" id="renovation" />
                        <Label htmlFor="renovation">Renovation required</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>

              {/* Next Step Preference */}
              {projectType && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Next Step Preference
                    </Label>
                    <RadioGroup value={nextStep} onValueChange={setNextStep} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="callback" id="callback" />
                        <Label htmlFor="callback">Request a callback</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="consultation" id="consultation" />
                        <Label htmlFor="consultation">Schedule a free consultation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="direct-call" id="direct-call" />
                        <Label htmlFor="direct-call">I'll call you directly</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Conditional: Calendar Picker */}
                  {nextStep === 'consultation' && (
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-3 block">
                        Preferred Consultation Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background border-border",
                              !consultationDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {consultationDate ? format(consultationDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background border-border" align="start">
                          <Calendar
                            mode="single"
                            selected={consultationDate}
                            onSelect={setConsultationDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                <Send className="w-5 h-5 mr-2" />
                Design My Space
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;