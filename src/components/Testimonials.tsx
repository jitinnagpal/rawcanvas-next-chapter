import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'Hyderabad',
      project: 'Residential Villa',
      rating: 5,
      text: 'Mokha Designs transformed our home beyond our expectations. The attention to detail and quality of work is exceptional. Prerna understood our vision perfectly and brought it to life.',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Rajesh Patel',
      location: 'Hyderabad',
      project: 'Office Space',
      rating: 5,
      text: 'Professional, timely, and absolutely stunning results. The team managed our office renovation seamlessly while we continued working. The new space has improved our team productivity significantly.',
      avatar: 'RP'
    },
    {
      id: 3,
      name: 'Meera Sharma',
      location: 'Hyderabad',
      project: 'Apartment Renovation',
      rating: 5,
      text: 'From design to execution, everything was handled with utmost care. The team is creative, responsive, and delivers exactly what they promise. Our apartment now feels like a luxury hotel.',
      avatar: 'MS'
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-primary fill-current' : 'text-muted'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Client Testimonials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients 
            have to say about their experience with Mokha Designs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="elegant-card">
              <div className="mb-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location} • {testimonial.project}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-heading font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-heading font-bold text-primary mb-2">4.9</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-heading font-bold text-primary mb-2">150+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
          <div>
            <div className="text-3xl font-heading font-bold text-primary mb-2">200+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;