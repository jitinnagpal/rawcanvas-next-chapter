const steps = [
  {
    n: '01',
    title: 'Design',
    body: 'Layouts, 3D views, material and finish boards, built around how your family actually uses each room.',
  },
  {
    n: '02',
    title: 'Build',
    body: 'Civil changes, carpentry, electrical and finishing, run by our own site team with regular updates on WhatsApp.',
  },
  {
    n: '03',
    title: 'Furnish',
    body: 'Furniture, lighting, soft furnishings and art, sourced and styled so the home is ready the day you move in.',
  },
];

const Services = () => (
  <section id="approach" className="bg-secondary mt-10 md:mt-16 scroll-mt-16 md:scroll-mt-[76px]">
    <div className="container-max px-5 md:px-10 py-16 md:py-24 flex flex-col gap-10 md:gap-12">
      <h2 className="section-title max-w-[760px]">One studio from the first sketch to the last cushion.</h2>
      <div className="grid gap-8 md:gap-10 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="flex flex-col gap-3 border-t border-foreground pt-5">
            <div className="text-[14px] text-muted-foreground">{s.n}</div>
            <h3 className="text-[22px] md:text-[24px] font-medium text-foreground">{s.title}</h3>
            <p className="text-[15px] md:text-[16px] leading-relaxed text-foreground/75">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
