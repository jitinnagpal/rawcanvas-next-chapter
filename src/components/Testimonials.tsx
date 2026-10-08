const testimonials = [
  {
    quote:
      'Even though we were not in the country the design and execution was handled very well. Their team kept us updated via emails, WhatsApp messages so we were aware of the progress and were able to take timely decisions for material selections.',
    who: 'Pallavi Bhatt',
    what: 'New apartment, Hyderabad',
  },
  {
    quote:
      'Ours was a full renovation job and we had quite a few specific requests to personalize our home. Mokha Designs ensured to keep in mind our customized requests while still keeping it within the budget. We are very happy with the finished outcome.',
    who: 'Nishant Vijayvergiya',
    what: 'Apartment renovation, Hyderabad',
  },
  {
    quote:
      'The design matched our brief for creating a rustic yet functional hospitality experience for our guests. The documentation provided was very detailed and that allowed us to follow through on the execution from our end.',
    who: 'Rahul Vardareddy',
    what: 'Hotel rooms, Araku Valley',
  },
];

const Testimonials = () => (
  <section id="testimonials" className="bg-card">
    <div className="container-max px-5 md:px-10 py-20 md:py-24 flex flex-col gap-10">
      <h2 className="section-title">From our clients</h2>
      <div className="grid gap-10 md:grid-cols-3">
        {testimonials.map((t) => (
          <blockquote key={t.who} className="flex flex-col gap-4">
            <p className="text-[17px] leading-[1.7] text-foreground">"{t.quote}"</p>
            <footer className="text-[15px] text-muted-foreground">
              {t.who}, {t.what}
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
