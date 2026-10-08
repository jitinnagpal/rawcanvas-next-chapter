const facts = [
  { value: '200+', label: 'projects completed' },
  { value: '15+ years', label: 'of large-scale turnkey work in the UAE' },
  { value: 'One team', label: 'design, civil work, carpentry, furnishing' },
  { value: 'West Hyderabad', label: 'Lanco Hills, Manikonda, Gachibowli and beyond' },
];

const StatsBar = () => (
  <section className="border-y border-border">
    <div className="container-max px-5 md:px-10 py-8 grid gap-6 grid-cols-2 lg:grid-cols-4">
      {facts.map((f) => (
        <div key={f.value}>
          <div className="text-[26px] md:text-[34px] font-medium text-foreground leading-tight">{f.value}</div>
          <div className="text-[15px] text-muted-foreground mt-1">{f.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsBar;
