const StatsBar = () => {
  const stats = [
    { value: '200+', label: 'Projects Completed' },
    { value: '20+', label: 'Years of Experience' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <section className="py-16 bg-secondary">
      <div className="container-max px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold text-primary/70 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-heading font-medium text-secondary-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
