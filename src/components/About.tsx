const About = () => (
  <section id="studio" className="container-max px-5 md:px-10 py-20 md:py-24 grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
    <img
      src="/images/site/prerna.jpg"
      alt="Prerna Mokha, principal designer at Mokha Designs"
      loading="lazy"
      className="w-full max-w-[520px] h-[460px] sm:h-[600px] object-cover object-[center_20%]"
    />
    <div className="flex flex-col gap-6">
      <p className="eyebrow">The studio</p>
      <h2 className="section-title">Prerna Mokha</h2>
      <p className="text-[18px] leading-[1.7] text-foreground/75">
        Prerna has led more than 200 interiors projects. Every Mokha home is designed under her direction and delivered
        by one team, from the first brief to the day you move in, so the design you sign off is the home you get.
      </p>
    </div>
  </section>
);

export default About;
