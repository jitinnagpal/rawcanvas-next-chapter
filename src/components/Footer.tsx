import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border pb-24 md:pb-0">
      <div className="container-max px-5 md:px-10 py-10 grid gap-8 md:grid-cols-3 text-[15px]">
        <div className="flex flex-col gap-2">
          <img src="/lovable-uploads/999fcb58-9950-43a9-8aaa-df494205944f.png" alt="Mokha Designs logo" width="56" height="56" className="h-14 w-14 self-start mb-2" loading="lazy" />
          <span className="text-[18px] font-semibold text-foreground">Mokha Designs</span>
          <span className="text-muted-foreground">Interior design and turnkey homes in Hyderabad.</span>
        </div>
        <div className="flex flex-col gap-2">
          <a href="tel:+919908392200" className="text-foreground hover:text-muted-foreground">+91 99083 92200</a>
          <a href="mailto:mokhadesigns@outlook.com" className="text-foreground hover:text-muted-foreground">mokhadesigns@outlook.com</a>
        </div>
        <div className="flex flex-col gap-2">
          <a href="https://www.instagram.com/mokhadesigns/" target="_blank" rel="noopener" className="text-foreground hover:text-muted-foreground">Instagram</a>
          <a href="https://www.facebook.com/Mokhadesigns" target="_blank" rel="noopener" className="text-foreground hover:text-muted-foreground">Facebook</a>
          <Link to="/privacy-policy" className="text-foreground hover:text-muted-foreground">Privacy policy</Link>
        </div>
      </div>
      <div className="container-max px-5 md:px-10 pb-8 text-[13px] text-muted-foreground">
        © {year} Mokha Designs, a unit of Raw Canvas.
      </div>
    </footer>
  );
};

export default Footer;
