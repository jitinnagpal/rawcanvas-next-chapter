const facts = [
  { value: '200+', label: 'projects completed' },
  { value: 'Prerna-led', label: 'design direction on every home' },
  { value: 'One team', label: 'design, civil work, carpentry and furnishing' },
  { value: 'Brief to handover', label: 'one point of accountability, no hand-offs' },
];

const StatsBar = () => (
  <section className="border-y border-border">
    <div className="container-max px-5 md:px-10 py-7 md:py-8 grid gap-x-5 gap-y-6 grid-cols-2 lg:grid-cols-4">
      {facts.map((f) => (
        <div key={f.value}>
          <div className="text-[22px] md:text-[34px] font-medium text-foreground leading-tight">{f.value}</div>
          <div className="text-[14px] md:text-[15px] text-muted-foreground mt-1">{f.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsBar;
