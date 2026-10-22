import { Fragment, StrictMode, useEffect, useState } from 'react';
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';
import './pages.css';
import './gallery.css';
import './media.css';
import './showcase-layout.css';
import './engagement.css';
import './pricing-nav.css';
import './pricing-page.css';
import './back-to-top.css';
import './mobile-glyphs.css';
import './navigation.css';
import './journal.css';
import './client-updates.css';
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/400-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';

gsap.registerPlugin(ScrollTrigger);

const imageFiles = import.meta.glob('/assets/images/**/*.{jpg,jpeg,png,JPG,PNG}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const priceListFiles = import.meta.glob('/assets/images/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const image = (file: string) => imageFiles[`/assets/images/${file}`] ?? '';
const priceListUrl = priceListFiles['/assets/images/CB Price List  (841 x 1189 mm) new.pdf'] ?? '#';
const bookingUrl = 'https://myappointment.co.za/cgi-bin/myappointment/makeappt.pl?1548333612::';
const storeAddress = ['Polofields Crossing', 'Polofields Dr', 'Midrand', '1684'].join(', ');
const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${storeAddress}, South Africa`)}`;
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(`${storeAddress}, South Africa`)}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

const routes = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Our Gallery', to: '/gallery' },
  { label: 'Journal', to: '/journal' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
];

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    window.history.scrollRestoration = 'manual';
    requestAnimationFrame(resetScroll);
    requestAnimationFrame(resetScroll);
  }, [location.pathname]);

  return null;
}

function usePageMotion() {
  const location = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo('.page-intro', { opacity: 0, y: 24 }, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.1,
        clearProps: 'all',
      });
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 34 }, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>('.image-drift img').forEach((element) => {
        gsap.fromTo(element, { yPercent: -5, scale: 1.08 }, {
          yPercent: 5,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        });
      });
      const veil = document.querySelector<HTMLElement>('.evening-veil');
      if (veil) {
        gsap.fromTo(veil, { clipPath: 'ellipse(145% 145% at 50% 45%)' }, {
          clipPath: 'ellipse(0% 0% at 50% 45%)',
          ease: 'none',
          scrollTrigger: { trigger: veil.parentElement, start: 'top bottom', end: 'top top', scrub: 1.2 },
        });
      }
    });
    ScrollTrigger.refresh();
    return () => context.revert();
  }, [location.pathname]);
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    const chapters = document.querySelectorAll<HTMLElement>('[data-chapter="dark"]');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setDark(entry.isIntersecting);
      }
      if (!Array.from(chapters).some((chapter) => chapter.getBoundingClientRect().top < window.innerHeight * 0.5 && chapter.getBoundingClientRect().bottom > window.innerHeight * 0.5)) {
        setDark(false);
      }
    }, { threshold: 0, rootMargin: '-35% 0px -55% 0px' });
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => {
      window.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${dark ? 'is-dark' : ''} ${menuOpen ? 'is-menu-open' : ''}`}>
        <Link className="brand-mark" to="/" aria-label="Cherished Beauty home">
          <img src={image('logo.png')} alt="Cherished Beauty" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {routes.map((route) => route.to === '/services'
            ? <div className="services-dropdown" key={route.to}>
              <Link to={route.to} className={location.pathname === route.to || location.pathname.startsWith(`${route.to}/`) ? 'current' : ''} aria-haspopup="true">Services</Link>
              <nav className="services-submenu" aria-label="Services navigation">
                <Link to="/services/hair">Hair</Link>
                <Link to="/services/nails">Nails</Link>
                <Link to="/services/spa">Spa</Link>
                <a href="/#products">Mizani Products</a>
              </nav>
            </div>
            : <Link key={route.to} to={route.to} className={location.pathname === route.to || (route.to !== '/' && location.pathname.startsWith(`${route.to}/`)) ? 'current' : ''}>{route.label}</Link>)}
        </nav>
        <div className="nav-right">
          <a className="nav-location" href={mapsUrl} target="_blank" rel="noreferrer" aria-label="Cherished Beauty location on Google Maps"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></svg><span>Midrand</span></a>
          <LuxuryButton to="/booking" compact>Book a visit</LuxuryButton>
          <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            <span /><span />
          </button>
        </div>
      </header>
      <div className={`mobile-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <span className="mobile-index">01 · THE HOUSE</span>
        <nav aria-label="Mobile navigation">
          {routes.map((route, index) => <Fragment key={route.to}>
            <Link to={route.to} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{route.label}</Link>
            {route.to === '/services' && <div className="mobile-services-submenu" aria-label="Services navigation">
              <Link to="/services/hair" onClick={() => setMenuOpen(false)}>Hair</Link>
              <Link to="/services/nails" onClick={() => setMenuOpen(false)}>Nails</Link>
              <Link to="/services/spa" onClick={() => setMenuOpen(false)}>Spa</Link>
              <a href="/#products" onClick={() => setMenuOpen(false)}>Mizani Products</a>
            </div>}
          </Fragment>)}
          <a href={bookingUrl} onClick={() => setMenuOpen(false)}><span>07</span>Book a visit</a>
        </nav>
        <p>Polofields Crossing<br />Midrand 1684, South Africa</p>
      </div>
    </>
  );
}

function ArrowGlyph({ direction = 'up-right' }: { direction?: 'up-right' | 'up' | 'down' | 'left' | 'right' }) {
  const props = { viewBox: '0 0 24 24', 'aria-hidden': 'true', className: 'arrow-glyph' } as const;

  const pathMap = {
    'up-right': 'M7 17L17 7M8 7H17V16',
    up: 'M12 19V5M5 12L12 5L19 12',
    down: 'M12 5V19M5 12L12 19L19 12',
    left: 'M17 12H7M12 5L5 12L12 19',
    right: 'M7 12H17M12 5L19 12L12 19',
  } as const;

  return (
    <svg {...props}>
      <path d={pathMap[direction]} />
    </svg>
  );
}

function LuxuryButton({ to, children, compact = false, light = false }: { to: string; children: ReactNode; compact?: boolean; light?: boolean }) {
  const className = `luxury-button ${compact ? 'is-compact' : ''} ${light ? 'is-light' : ''}`;
  if (to === '/booking') return <a className={className} href={bookingUrl}><span>{children}</span><i aria-hidden="true"><ArrowGlyph direction="up-right" /></i></a>;
  return <Link className={className} to={to}><span>{children}</span><i aria-hidden="true"><ArrowGlyph direction="up-right" /></i></Link>;
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</p>;
}

function ImagePanel({ file, alt, className = '', label }: { file: string; alt: string; className?: string; label?: string }) {
  return <figure className={`image-drift ${className}`}><img src={image(file)} alt={alt} loading="lazy" />{label && <figcaption>{label}</figcaption>}</figure>;
}

function SilentVideo({ src, poster, className = '', label }: { src: string; poster: string; className?: string; label: string }) {
  return <figure className={`silent-video ${className}`}>
    <video src={src} poster={image(poster)} autoPlay muted loop playsInline preload="metadata" aria-label={label} />
    <figcaption>{label}<span>· SOUND OFF</span></figcaption>
  </figure>;
}

function NailWork({ file, alt, className = '' }: { file: string; alt: string; className?: string }) {
  return <figure className={`nail-work ${className}`}><img src={image(file)} alt={alt} loading="lazy" /><figcaption>NAIL ROOM <span>· CHERISHED BEAUTY</span></figcaption></figure>;
}

function PageIntro({ eyebrow, title, accent, copy, imageFile, imageAlt, className = '' }: { eyebrow: string; title: string; accent: string; copy: string; imageFile: string; imageAlt: string; className?: string }) {
  return (
    <section className={`page-hero ${className}`} data-chapter="dark" style={{ backgroundImage: `url("${image(imageFile)}")` }}>
      <div className="page-hero-shade" />
      <div className="page-hero-copy">
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1 className="page-intro">{title}<br /><em>{accent}</em></h1>
        <p className="page-intro">{copy}</p>
        <span className="page-hero-caption">{imageAlt}</span>
      </div>
      <span className="hero-index">CB · 0{Math.max(1, routes.findIndex((route) => route.to === window.location.pathname) + 1)}</span>
    </section>
  );
}

function BookingStrip({ title = 'A visit, made yours.' }: { title?: string }) {
  return <section className="booking-strip reveal"><div><Eyebrow>Polofields Crossing · Midrand</Eyebrow><h2>{title}</h2></div><LuxuryButton to="/booking">Begin a booking</LuxuryButton></section>;
}

function LocationCard() {
  return <section className="location-card-wrap section-pad"><div className="location-card reveal"><div className="location-card-copy"><Eyebrow>OUR STORE</Eyebrow><h2>Find us in<br /><em>Midrand.</em></h2><p>Polofields Crossing<br />Polofields Dr<br />Midrand<br />1684</p><a className="luxury-button" href={mapsUrl} target="_blank" rel="noreferrer"><span>Open in Google Maps</span><i><ArrowGlyph direction="up-right" /></i></a></div><div className="location-map-card"><iframe src={mapEmbedUrl} title="Google Map to Cherished Beauty at Polofields Crossing, Midrand" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><a href={mapsUrl} target="_blank" rel="noreferrer">POLOFIELDS CROSSING · MIDRAND · OPEN IN MAPS <ArrowGlyph direction="up-right" /></a></div></div></section>;
}

const googleReviews = [
  { name: 'Fanele Ntombela', quote: 'What an amazing experience I had. Love the new management. Definitely a place to try, I bet you won’t go anywhere after having an experience there.', href: 'https://www.google.com/maps/contrib/110917794230596316378/reviews?hl=en-GB' },
  { name: 'Kayakazi Sandile', quote: 'Was there 2 weeks ago. Had such a great experience. The staff are kind and professional. Thanks to the new management, you guys know what you’re doing.', href: 'https://www.google.com/maps/contrib/100594492899233719208/reviews?hl=en-GB' },
  { name: 'Tendani Musekwa', quote: 'The staff were very friendly, the salon is exceptionally clean and the playlist was too good.', href: mapsUrl },
  { name: 'Zizipo Ndzingo', quote: 'I had an amazing experience… The best of the best.', href: 'https://www.google.com/maps/contrib/112491699372939043530/reviews?hl=en-GB' },
];

function ReviewsSection() {
  return <section className="reviews-section section-pad"><div className="reviews-heading reveal"><Eyebrow>THE WORD, FROM OUR GUESTS</Eyebrow><h2>Four notes<br />from <em>Google.</em></h2><a className="text-link" href={mapsUrl} target="_blank" rel="noreferrer">Read Cherished Beauty on Google <span><ArrowGlyph direction="up-right" /></span></a></div><div className="reviews-list">{googleReviews.map((review, index) => <article className="review-quote reveal" key={review.name}><span className="review-index">0{index + 1} / 04</span><blockquote>“{review.quote}”</blockquote><a href={review.href} target="_blank" rel="noreferrer">{review.name} <span>· GOOGLE REVIEW <ArrowGlyph direction="up-right" /></span></a></article>)}</div></section>;
}

const faqItems = [
  { question: 'How do I book?', answer: 'Booking an appointment at Cherished Beauty is easy. Book online through our appointment page, or call us directly and our team will help schedule your visit.' },
  { question: 'What are the prices?', answer: 'We believe in transparent pricing. You can find details of our services and prices in the Pricing section. For specific questions or a personalised quote, please contact us.' },
  { question: 'What is your cancellation policy?', answer: 'We understand that plans can change. If you need to cancel or reschedule, please notify us at least 24 hours in advance so we can offer the time to another client. Cancellations made less than 24 hours before the appointment may be subject to a cancellation fee.' },
  { question: 'Can I reschedule my appointment?', answer: 'Yes. Contact us by phone or through the online booking system and we will help find a new time. Please try to reschedule at least 24 hours in advance to avoid any fees.' },
];

function FAQSection() {
  return <section className="faq-section section-pad"><div className="faq-heading reveal"><Eyebrow>A FEW THINGS, ANSWERED</Eyebrow><h2>Before you<br /><em>drop by.</em></h2></div><div className="faq-list">{faqItems.map((item, index) => <details className="faq-item reveal" key={item.question}><summary><span>0{index + 1}</span>{item.question}<i aria-hidden="true">+</i></summary><p>{item.answer}</p></details>)}</div></section>;
}

function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get('newsletter-email') ?? '').trim();
    const subject = encodeURIComponent('Cherished Beauty newsletter sign-up');
    const body = encodeURIComponent(`Please add this email address to the Cherished Beauty newsletter: ${email}`);
    window.location.href = `mailto:waterfall@luxaura.co.za?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };
  return <div className="newsletter-block"><div><Eyebrow light>A LETTER, NOW AND THEN</Eyebrow><h2>A little beauty<br /><em>in your inbox.</em></h2><p>Occasional notes from the house. No noise.</p></div><form className="newsletter-form" onSubmit={submit}><label htmlFor="newsletter-email">Your email address</label><div><input id="newsletter-email" name="newsletter-email" type="email" autoComplete="email" placeholder="you@example.com" required /><button type="submit" aria-label="Sign up for the newsletter">Join <span><ArrowGlyph direction="up-right" /></span></button></div>{submitted && <p className="newsletter-status" role="status">Your email app is opening with your sign-up request addressed to us.</p>}</form></div>;
}

type WorkPhoto = { file: string; alt: string };

const nailPhotos: WorkPhoto[] = [
  ...Array.from({ length: 10 }, (_, index) => ({
    file: `Nails${index + 1}.jpeg`,
    alt: `Nail design at Cherished Beauty, photograph ${index + 1}`,
  })),
  { file: 'Nails/BlueIllusionNails.jpg', alt: 'Blue illusion nail design' },
  { file: 'Nails/DesignerNails.JPG', alt: 'Designer nail art' },
  { file: 'Nails/NailIntroduction.JPG', alt: 'Nail design from Cherished Beauty' },
  { file: 'Nails/PinkNailsWithAFloweronTop.JPG', alt: 'Pink nails with a flower detail' },
  { file: 'Nails/PinkYSignNails.JPG', alt: 'Pink nail design' },
  { file: 'Nails/TransparantNailgelWithWhiteTips.jpg', alt: 'Clear nail gel with white tips' },
  { file: 'NailsAndFlowers.JPG', alt: 'Nail design with flowers' },
  { file: 'Pedicure/NailPedicure.JPG', alt: 'Pedicure at Cherished Beauty' },
];

const hairPhotos: WorkPhoto[] = [
  { file: 'Hair Images/BeardHaircutAndBraids.jpeg', alt: 'Beard, haircut, and braids' },
  { file: 'Hair Images/BlondeLongBraids.jpeg', alt: 'Long blonde braids' },
  { file: 'Hair Images/FemaleWhiteBraidsSideProfile.jpeg', alt: 'Braids shown in side profile' },
  { file: 'Hair Images/MensStitchDreadlockBraids.PNG', alt: 'Men’s stitch dreadlock braids' },
  { file: 'Hair Images/StitchDreadlockBraids.PNG', alt: 'Stitch dreadlock braids' },
  { file: 'Hair Images/WeaveCollage.PNG', alt: 'Weave styles collage' },
  { file: 'Hair Images/WeaveCollage2.PNG', alt: 'Weave styles collage' },
];

const spaPhotos: WorkPhoto[] = [
  { file: 'SPA/CandlesAndTowelImg.JPG', alt: 'Candles and towels prepared for a spa visit' },
  { file: 'SPA/HotStones.JPG', alt: 'Hot stones used in a spa treatment' },
  { file: 'SPA/MassageAndSpaProducts.JPG', alt: 'Spa and massage products' },
];

function WorkGallerySection({ title, photos }: { title: string; photos: WorkPhoto[] }) {
  return <section className="work-gallery-section section-pad">
    <div className="work-gallery-heading reveal"><Eyebrow>CHERISHED BEAUTY · IN FOCUS</Eyebrow><h2>{title}</h2></div>
    <div className="work-gallery-grid">{photos.map((photo) => <figure className="work-gallery-item reveal" key={photo.file}>
      <img src={image(photo.file)} alt={photo.alt} loading="lazy" decoding="async" />
      <figcaption>{photo.alt}</figcaption>
    </figure>)}</div>
  </section>;
}

function OurGalleryPage() {
  return <main className="page-transition">
    <PageIntro eyebrow="CHERISHER’S WORK" title="The work," accent="up close." copy="A closer look at hair, nail, pedicure, and spa work at Cherished Beauty." imageFile="NailsAndFlowers.JPG" imageAlt="Nail art with a floral detail" />
    <WorkGallerySection title="Hair, shaped by hand." photos={hairPhotos} />
    <WorkGallerySection title="Colour, form & finish." photos={nailPhotos} />
    <WorkGallerySection title="A quieter kind of care." photos={spaPhotos} />
    <BookingStrip title="A visit, made yours." />
  </main>;
}

function ProductsSection() {
  const brands = ['Mizani', 'Gelish', 'Lustik', 'Dark and Lovely', 'Milk Solutions', 'Xpression', 'Darling'];

  return <section className="products-section section-pad" id="products" aria-labelledby="products-heading">
    <div className="products-copy reveal"><Eyebrow>IN THE STUDIO</Eyebrow><h2 id="products-heading">Products<br /><em>we use.</em></h2><p>A selection of the products used across our salon services.</p><ul>{brands.map((brand) => <li key={brand}>{brand}</li>)}<li>And more</li></ul></div>
    <figure className="products-image reveal"><img src={image('MizaniProducts.PNG')} alt="Mizani products at Cherished Beauty" loading="lazy" decoding="async" /></figure>
  </section>;
}

function BookingPrompt() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (window.localStorage.getItem('cherished-booking-prompt-seen') === 'true') return;
    } catch {
      // Continue without persistence when browser storage is unavailable.
    }
    let timeout: number | undefined;
    const beginScrollTimer = () => {
      if (timeout !== undefined) return;
      timeout = window.setTimeout(() => {
        try {
          window.localStorage.setItem('cherished-booking-prompt-seen', 'true');
        } catch {
          // The prompt remains dismissible if browser storage is unavailable.
        }
        setOpen(true);
        window.removeEventListener('scroll', beginScrollTimer);
      }, 10_000);
    };
    window.addEventListener('scroll', beginScrollTimer, { passive: true });
    return () => {
      window.removeEventListener('scroll', beginScrollTimer);
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  if (!open) return null;
  return <div className="booking-prompt-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><section className="booking-prompt" role="dialog" aria-modal="true" aria-labelledby="booking-prompt-title"><button className="booking-prompt-close" type="button" aria-label="Close booking invitation" onClick={() => setOpen(false)}><ArrowGlyph direction="left" /></button><Eyebrow>WHENEVER YOU’RE READY</Eyebrow><h2 id="booking-prompt-title">A little time,<br /><em>for you.</em></h2><p>Choose your service and preferred time through our booking page.</p><a className="luxury-button" href={bookingUrl}><span>Make a booking</span><i><ArrowGlyph direction="up-right" /></i></a></section></div>;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 420);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const returnToTop = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  };

  return <button className={`back-to-top ${visible ? 'is-visible' : ''}`} type="button" onClick={returnToTop} aria-label="Back to top" tabIndex={visible ? 0 : -1} aria-hidden={!visible}>
    <span aria-hidden="true"><ArrowGlyph direction="up" /></span><small>TOP</small>
  </button>;
}

function Footer() {
  return (
    <footer className="site-footer" data-chapter="dark">
      <div className="footer-topline"><span>Polofields Crossing · Polofields Dr</span><span>Midrand · 1684 · South Africa</span><a href="tel:0100234291">010 023 4291 <ArrowGlyph direction="up-right" /></a></div>
      <div className="footer-wordmark" aria-label="Cherished Beauty"><span>CHERISHED</span><em>BEAUTY</em></div>
      <NewsletterSignup />
      <div className="footer-bottom">
        <p>An experience never imagined.</p>
        <nav aria-label="Footer navigation">{routes.slice(1).map((route) => <Link to={route.to} key={route.to}>{route.label}</Link>)}<Link to="/services/hair">Hair</Link><Link to="/services/nails">Nails</Link><Link to="/services/spa">Spa</Link></nav>
        <a className="footer-book" href={mapsUrl} target="_blank" rel="noreferrer">Find us in Midrand <ArrowGlyph direction="up-right" /></a>
      </div>
      <a className="footer-email" href="mailto:waterfall@luxaura.co.za">waterfall@luxaura.co.za</a>
      <div className="footer-copyright">© Cherished Beauty · Polofields Crossing · Midrand</div>
      <div className="footer-credit">Powered by <span>Intellisekt Development</span></div>
    </footer>
  );
}

function HomePage() {
  return (
    <main>
      <section className="home-hero" data-chapter="dark">
        <div className="hero-photo" style={{ backgroundImage: `url("${image('CoverPage.jpeg')}")` }} />
        <div className="hero-surface" />
        <div className="hero-meta"><span>CHERISHED BEAUTY</span><span>FORMERLY LUXAURA</span></div>
        <div className="hero-title-wrap">
          <Eyebrow light>A new expression of the familiar</Eyebrow>
          <h1 className="hero-title page-intro">An experience<br /><em>never imagined.</em></h1>
          <div className="hero-bottomline"><span>A beauty house shaped by detail.</span><a href="#first-light">Discover the house <span><ArrowGlyph direction="down" /></span></a></div>
        </div>
        <span className="hero-side-note">A HOUSE OF HAIR · NAILS · SPA</span>
      </section>

      <section className="first-light section-pad" id="first-light" data-chapter="light">
        <div className="first-light-copy reveal"><Eyebrow>THE FIRST IMPRESSION</Eyebrow><h2>Beauty, with<br />a point of <em>view.</em></h2><p>Once known as Luxaura. Now, a world with its own name, and a little more room for the details that stay with you.</p><Link className="text-link" to="/about">The story of the house <span><ArrowGlyph direction="up-right" /></span></Link></div>
        <ImagePanel file="salon-overview.jpg" alt="The salon interior at Cherished Beauty" className="first-light-image" label="THE HOUSE, IN ITS OWN LIGHT" />
        <span className="vertical-note">POLofields · 01 / 04</span>
      </section>

      <section className="journal-feature section-pad" data-chapter="light">
        <div className="journal-feature-copy reveal">
          <Eyebrow>FROM THE JOURNAL · 05 MAY 2026</Eyebrow>
          <h2>The women<br />who <em>raised us.</em></h2>
          <p>A Mother’s Day of beauty, memory, and connection at the salon once known as Luxaura.</p>
          <Link className="text-link" to="/journal/the-women-who-raised-us">Read the story <span><ArrowGlyph direction="up-right" /></span></Link>
        </div>
        <Link className="journal-feature-image" to="/journal/the-women-who-raised-us" aria-label="Read The Women Who Raised Us: A Mother’s Day of Beauty">
          <img src="https://gautenglifestylemagazine.co.za/wp-content/uploads/2026/05/Luxaura-image-1.webp" alt="A Mother’s Day beauty experience at Luxaura Boutique Salon" loading="lazy" />
          <span>THE CHERISHED JOURNAL · 01</span>
        </Link>
      </section>

      <section className="service-world section-pad" data-chapter="light">
        <div className="section-heading reveal"><Eyebrow>A STUDY IN THREE PARTS</Eyebrow><h2>Different rituals.<br /><em>One point of view.</em></h2><span className="section-counter">01 / 03</span></div>
        <div className="service-list">
          <ServiceRow number="01" title="Hair" sub="Texture. Shape. Movement." file="Hair Images/BlondeLongBraids.jpeg" alt="Long blonde braids styled at Cherished Beauty" to="/services/hair" />
          <ServiceRow number="02" title="Nails" sub="Colour with a little character." file="nail-hero.jpg" alt="Glossy manicure with rose and warm stone detail" to="/services/nails" />
          <ServiceRow number="03" title="Spa" sub="A quieter kind of attention." file="spa-room2.jpg" alt="Private treatment room at Cherished Beauty" to="/services/spa" />
        </div>
        <Link className="text-link service-world-link" to="/services">Explore the house <span><ArrowGlyph direction="up-right" /></span></Link>
      </section>

      <section className="rose-chapter section-pad" data-chapter="light">
        <div className="rose-copy reveal"><Eyebrow>THE CHERISHED POINT OF VIEW</Eyebrow><p className="rose-quote">A little more<br />considered.<br /><em>A little more</em><br /><em>you.</em></p><span className="rose-small">CARE IN THE DETAILS<br />SINCE THE VERY FIRST HELLO</span></div>
        <ImagePanel file="salon-hair-stations.jpg" alt="Warmly lit hair styling stations in the salon" className="rose-image" />
        <span className="rose-orbit" aria-hidden="true">C · B</span>
      </section>

      <section className="home-film-chapter" data-chapter="dark">
        <div className="home-film-copy reveal"><Eyebrow light>THE BRAIDING EDIT · MOVING IMAGE</Eyebrow><h2>Made by<br /><em>hand.</em></h2><p>A little movement from the hair room at Polofields.</p><Link className="text-link" to="/services/hair">Discover the hair room <span><ArrowGlyph direction="up-right" /></span></Link></div>
        <SilentVideo src="/videos/braids-video.mp4" poster="Braids1.jpeg" className="home-braid-video" label="Braiding, in motion" />
        <span className="home-film-index">01 · THE BRAIDING EDIT</span>
      </section>

      <section className="home-work section-pad" data-chapter="light">
        <div className="home-work-heading reveal"><Eyebrow>THE WORK, UP CLOSE</Eyebrow><h2>Colour with<br /><em>character.</em></h2><Link className="text-link" to="/services/nails">Enter the nail room <span><ArrowGlyph direction="up-right" /></span></Link></div>
        <NailWork file="bluemercurynails.jpeg" alt="Blue and gold nail art by Cherished Beauty" className="home-work-blue" />
        <NailWork file="beautifulnails.JPG" alt="A polished manicure by Cherished Beauty" className="home-work-detail" />
        <NailWork file="nailsBlue.jpeg" alt="Sculpted blue nail design by Cherished Beauty" className="home-work-blue-alt" />
        <NailWork file="pinknails.jpeg" alt="Pink nail art by Cherished Beauty" className="home-work-pink" />
        <span className="home-work-note">THE NAIL ROOM · A FEW RECENT DETAILS</span>
      </section>

      <ProductsSection />
      <ReviewsSection />

      <section className="home-evening" data-chapter="dark">
        <div className="evening-veil" aria-hidden="true" />
        <div className="evening-content reveal"><Eyebrow light>THE DAY GIVES WAY</Eyebrow><h2>Then the light<br />turns <em>gold.</em></h2><p>For the long appointment. The small pause. The feeling of being exactly where you meant to be.</p><LuxuryButton to="/booking" light>Make time for yourself</LuxuryButton></div>
        <ImagePanel file="nail-section.jpg" alt="Rows of rich nail colour in the Cherished Beauty studio" className="evening-image" label="A MOMENT, KEPT" />
        <span className="evening-coordinate">26°01' S / 28°06' E</span>
      </section>
      <BookingStrip title="We'll keep a place for you." />
      <LocationCard />
      <FAQSection />
    </main>
  );
}

function MotherDayArticle() {
  return <main className="journal-page page-transition">
    <header className="journal-heading">
      <div className="journal-heading-copy">
        <Eyebrow>THE CHERISHED JOURNAL · ARCHIVE</Eyebrow>
        <h1>The Women Who<br /><em>Raised Us:</em><br />A Mother’s Day of Beauty</h1>
        <p className="journal-deck">An intimate invitation to celebrate mothers through luxury self-care experiences rooted in connection and legacy.</p>
        <div className="journal-byline"><span>5 May 2026</span><span>By <a href="https://gautenglifestylemagazine.co.za/author/admin-2/" target="_blank" rel="noreferrer">GLM</a></span></div>
      </div>
      <span className="journal-index">01 <i>/</i> JOURNAL</span>
    </header>
    <figure className="journal-cover">
      <img src="https://gautenglifestylemagazine.co.za/wp-content/uploads/2026/05/Luxaura-image-1.webp" alt="The Mother’s Day experience at Luxaura Boutique Salon" />
      <figcaption>POLOFIELDS CROSSING · MIDRAND</figcaption>
    </figure>
    <article className="journal-body">
      <p className="journal-archive-note">This story was published ahead of the 10 May 2026 Mother’s Day experience.</p>
      <p>This Mother’s Day, Luxaura Boutique Salon invites women to step into a space of softness, care, and intention as it hosts a special in-salon experience on 10 May 2026, dedicated to celebrating mothers and the women who raised us.</p>
      <blockquote>“We wanted to create more than just a Mother’s Day offering. We wanted to create a moment. A space where women can honour the ones who raised them, while also celebrating themselves. For us, beauty has always been about connection, memory, and legacy,” say co-owners Thabisa Moloele and Mercy Kambarami.</blockquote>
      <p>Rooted in the sentiment of “The Women Who Raised Us,” the experience honours mothers, grandmothers, and mother figures through the language of beauty, memory, and connection. It is an invitation to slow down and celebrate the quiet rituals and moments that have shaped generations of women.</p>
      <h2>A considered offering</h2>
      <p>On the day, guests will be treated to a curated selection of Mother’s Day specials, including:</p>
      <ul>
        <li>Natural wash, blow dry, and styling</li>
        <li>Deep conditioning treatments</li>
        <li>Basic hair treatments</li>
        <li>Gel polish services</li>
      </ul>
      <p>Each offering is designed to feel both indulgent and restorative, perfect for mothers and daughters to enjoy together, or as a thoughtful gesture of appreciation. Floral bouquets will form part of the occasion, creating an elevated and thoughtful gifting moment for every guest. Advance bookings were essential so each bouquet could be prepared with care and intention.</p>
      <p>Known for its refined aesthetic and intentional approach to self-care, Luxaura transformed its Waterfall space into a sanctuary of luxury where every detail was considered, and every experience rooted in meaning.</p>
      <p>At the heart of the experience is the belief that self-care is deeply emotional. It lives in the rituals passed down, the lessons quietly taught, and the love that continues across generations. Luxaura brought this to life by creating an environment where those stories could be honoured in a modern, elevated setting.</p>
      <p className="journal-closing">This Mother’s Day, Luxaura extended an invitation to pause, to indulge, and to celebrate the women who have shaped us beautifully, intentionally, and together.</p>
      <p className="journal-source">Originally published by <a href="https://gautenglifestylemagazine.co.za/author/admin-2/" target="_blank" rel="noreferrer">Gauteng Lifestyle Magazine</a>.</p>
    </article>
    <BookingStrip title="A little time, just for you." />
  </main>;
}

function ServiceRow({ number, title, sub, file, alt, to }: { number: string; title: string; sub: string; file: string; alt: string; to: string }) {
  return <Link to={to} className="service-row reveal"><span className="service-number">{number}</span><div className="service-photo"><img src={image(file)} alt={alt} loading="lazy" /></div><div className="service-row-copy"><h3>{title}</h3><span>{sub}</span></div><span className="service-arrow"><ArrowGlyph direction="up-right" /></span></Link>;
}

function AboutPage() {
  return <main className="page-transition">
    <PageIntro eyebrow="A NAME, RECONSIDERED" title="Before Cherished" accent="there was Luxaura." copy="A familiar place. A new name. The beginning of a more personal point of view." imageFile="CherishedBeautySalon.PNG" imageAlt="The Cherished Beauty salon exterior" className="about-page-hero" />

    <section className="about-origin section-pad">
      <div className="origin-heading reveal"><Eyebrow>THE FIRST CHAPTER</Eyebrow><h2>Before the name,<br />there was the <em>feeling.</em></h2></div>
      <p className="origin-copy reveal">The salon at Polofields Crossing is now Cherished Beauty. The team brings professional skill, thoughtful care, and a warm welcome to every visit.</p>
    </section>

    <section className="section-pad" data-chapter="light">
      <div className="origin-heading reveal" style={{ textAlign: 'center' }}><Eyebrow>FOUNDING FAMILIES</Eyebrow><h2>Built by people<br />who truly <em>care.</em></h2></div>
      <div className="about-family-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <article className="reveal" style={{ background: '#f4efe8', border: '1px solid rgba(31, 21, 17, 0.08)', borderRadius: '22px', overflow: 'hidden' }}>
          <img src={image('Founders.PNG')} alt="Thabisa Moloele and Mercy Kambarami" loading="lazy" style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
          <div style={{ padding: '1.4rem 1.3rem 1.6rem' }}>
            <Eyebrow>FOUNDERS</Eyebrow>
            <h3 style={{ fontFamily: '"Bodoni Moda", serif', fontSize: '2rem', margin: '0.4rem 0 0.6rem', lineHeight: 1.08 }}>Thabisa Moloele &amp; Mercy Kambarami</h3>
            <p style={{ margin: 0, color: '#4b3a33', lineHeight: 1.7 }}>Two marketing mavens acquired the salon in Waterfall to create a more personal, more intentional beauty experience rooted in confidence and care.</p>
          </div>
        </article>

        <article className="reveal" style={{ background: '#f4efe8', border: '1px solid rgba(31, 21, 17, 0.08)', borderRadius: '22px', overflow: 'hidden' }}>
          <img src={image('Foundingfamily.PNG')} alt="Supporters and family attending the salon opening" loading="lazy" style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
          <div style={{ padding: '1.4rem 1.3rem 1.6rem' }}>
            <Eyebrow>SUPPORT</Eyebrow>
            <h3 style={{ fontFamily: '"Bodoni Moda", serif', fontSize: '2rem', margin: '0.4rem 0 0.6rem', lineHeight: 1.08 }}>A good grand opening, and a lot of love.</h3>
            <p style={{ margin: 0, color: '#4b3a33', lineHeight: 1.7 }}>Friends, family, and our wider community showed up on the 20th of September 2026 to celebrate the new chapter and welcome the house into the neighbourhood.</p>
          </div>
        </article>

        <article className="reveal" style={{ background: '#f4efe8', border: '1px solid rgba(31, 21, 17, 0.08)', borderRadius: '22px', overflow: 'hidden' }}>
          <img src={image('AllStaff.PNG')} alt="The Cherished Beauty staff team" loading="lazy" style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
          <div style={{ padding: '1.4rem 1.3rem 1.6rem' }}>
            <Eyebrow>STAFF</Eyebrow>
            <h3 style={{ fontFamily: '"Bodoni Moda", serif', fontSize: '2rem', margin: '0.4rem 0 0.6rem', lineHeight: 1.08 }}>A team shaped by detail.</h3>
            <p style={{ margin: 0, color: '#4b3a33', lineHeight: 1.7 }}>From the salon floor to the treatment room, the Cherished Beauty team works with warmth, precision, and a genuine understanding of how beauty should feel.</p>
          </div>
        </article>
      </div>
    </section>

    <section className="about-change" data-chapter="dark">
      <div className="about-change-image"><img src={image('Clientshavingaconversation.PNG')} alt="Clients having a conversation in the salon" loading="lazy" /></div>
      <div className="about-change-copy reveal">
        <Eyebrow light>THEN SOMETHING CHANGED</Eyebrow>
        <p>Not a departure.<br />A becoming.</p>
        <span>The next chapter has a name.</span>
      </div>
    </section>

    <section className="about-name section-pad" data-chapter="light">
      <Eyebrow>THE NAME WE CHOSE</Eyebrow>
      <h2 className="about-wordmark">Cherished<br /><em>Beauty.</em></h2>
      <p>At Polofields Crossing, Midrand.</p>
      <LuxuryButton to="/services">Step inside the house</LuxuryButton>
    </section>

    <BookingStrip title="Come meet the new chapter." />
  </main>;
}

const disciplines = [
  { index: '01', title: 'Hair', line: 'Texture · shape · movement', image: 'Hair Images/BlondeLongBraids.jpeg', to: '/services/hair', align: 'left' },
  { index: '02', title: 'Nails', line: 'Colour · form · finish', image: 'nail-section2.jpg', to: '/services/nails', align: 'right' },
  { index: '03', title: 'Spa', line: 'Skin · stillness · space', image: 'spa-room1.jpg', to: '/services/spa', align: 'left' },
];
function ServicesPage() {
  return <main className="page-transition"><section className="services-page-heading"><Eyebrow>THE HOUSE MENU</Eyebrow><h1 className="page-intro">Three ways to<br /><em>make a moment.</em></h1><p className="page-intro">Explore the different rooms of Cherished Beauty. Each has its own rhythm; all are found at Polofields Crossing.</p></section>
    <section className="discipline-list section-pad">{disciplines.map((item) => <Link to={item.to} className={`discipline reveal ${item.align}`} key={item.index}><span className="discipline-index">{item.index} / THE HOUSE</span><div className="discipline-image"><img src={image(item.image)} alt={`${item.title} at Cherished Beauty`} loading="lazy" /></div><div className="discipline-copy"><Eyebrow>{item.line}</Eyebrow><h2>{item.title}<i><ArrowGlyph direction="up-right" /></i></h2><span>Discover this room</span></div></Link>)}</section>
    <BookingStrip />
  </main>;
}

const disciplinePages = {
  hair: {
    eyebrow: 'THE HAIR ROOM', title: 'Hair,', accent: 'in its element.', copy: 'Texture, shape and movement, considered in the chair and finished in the mirror.', hero: 'Hair Images/BlondeLongBraids.jpeg', heroAlt: 'Long blonde braids styled at Cherished Beauty', detailImage: 'hair-silk-back.jpg', detailAlt: 'A glossy, smooth hair finish', detailTitle: 'A study in', detailAccent: 'movement.', categories: ['Braiding & curls', 'Silk press & styling', 'Treatments & relaxers', 'Weaves & natural hair'], second: 'salon-hair-stations.jpg', secondAlt: 'Hair styling stations at the studio',
  },
  nails: {
    eyebrow: 'THE NAIL ROOM', title: 'The detail', accent: 'changes everything.', copy: 'A considered palette. A steady hand. A finish that feels entirely your own.', hero: 'nail-hero.jpg', heroAlt: 'A deep rose manicure with fine gold details', detailImage: 'nail-section.jpg', detailAlt: 'The polish collection in the nail studio', detailTitle: 'Colour, with', detailAccent: 'intention.', categories: ['Manicure & gel', 'Acrylic & polygel', 'Pedicure', 'Nail art & finishing'], second: 'nail-section2.jpg', secondAlt: 'The colour library at Cherished Beauty',
  },
  spa: {
    eyebrow: 'THE TREATMENT ROOM', title: 'A softer', accent: 'kind of hour.', copy: 'A quiet room at Polofields Crossing. Time set aside for body care and a slower pace.', hero: 'SPA/CandlesAndTowelImg.JPG', heroAlt: 'Candles and towels prepared for a spa visit', detailImage: 'SPA/HotStones.JPG', detailAlt: 'Hot stones used in a spa treatment', detailTitle: 'The outside', detailAccent: 'can wait.', categories: ['Body massage', 'Body care', 'Waxing'], second: 'SPA/MassageAndSpaProducts.JPG', secondAlt: 'Spa and massage products at Cherished Beauty',
  },
};
function DisciplinePage({ kind }: { kind: keyof typeof disciplinePages }) {
  const [activeNailPhoto, setActiveNailPhoto] = useState<number | null>(null);
  const item = disciplinePages[kind];

  useEffect(() => {
    if (activeNailPhoto === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveNailPhoto(null);
      if (event.key === 'ArrowRight') setActiveNailPhoto((index) => index === null ? null : (index + 1) % nailPhotos.length);
      if (event.key === 'ArrowLeft') setActiveNailPhoto((index) => index === null ? null : (index + nailPhotos.length - 1) % nailPhotos.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeNailPhoto]);

  return <main className={`page-transition discipline-page discipline-${kind}`}>
    <PageIntro eyebrow={item.eyebrow} title={item.title} accent={item.accent} copy={item.copy} imageFile={item.hero} imageAlt={item.heroAlt} />
    <section className="discipline-story section-pad"><div className="discipline-story-copy reveal"><Eyebrow>AN EDITORIAL IN {kind.toUpperCase()}</Eyebrow><h2>{item.detailTitle}<br /><em>{item.detailAccent}</em></h2><p>For service details, availability and the right appointment for you, speak with the Cherished Beauty team directly.</p><a className="text-link" href="tel:0100234291">Call the studio · 010 023 4291 <span><ArrowGlyph direction="up-right" /></span></a></div><ImagePanel file={item.detailImage} alt={item.detailAlt} className="discipline-story-image" label={item.eyebrow} /></section>
    {kind === 'hair' && <section className="braid-feature" aria-label="Braids at Cherished Beauty"><div className="braid-feature-image"><img src={image('Hair Images/MaleBraids.jpeg')} alt="Male braids styled at Cherished Beauty" loading="lazy" /></div><div className="braid-feature-copy reveal"><Eyebrow>THE BRAIDING EDIT</Eyebrow><h2>Parting.<br />Pattern.<br /><em>Presence.</em></h2><p>A close look at the craft in every line.</p><a className="text-link" href="https://myappointment.co.za/cgi-bin/myappointment/makeappt.pl?1548333612::">Explore braiding appointments <span><ArrowGlyph direction="up-right" /></span></a></div><span className="braid-feature-index">HAIR ROOM · 01</span></section>}
    {kind === 'hair' && <section className="hair-film-edit" data-chapter="dark"><div className="hair-film-heading reveal"><Eyebrow light>THE BRAIDING EDIT · IN MOTION</Eyebrow><h2>Three studies<br />in <em>braid.</em></h2></div><div className="hair-film-grid"><SilentVideo src="/videos/long-blonde-braids.mp4" poster="Braids1.jpeg" label="Long blonde braids" /><SilentVideo src="/videos/luxury-braid-design.mp4" poster="brownBraids-optimized.jpg" label="Braid design, considered" /><SilentVideo src="/videos/braids-video.mp4" poster="dreadlocksBrown.JPG" label="The braiding edit" /></div></section>}
    {kind === 'hair' && <section className="hair-gallery section-pad"><div className="hair-gallery-heading reveal"><Eyebrow>TEXTURE · LENGTH · FINISH</Eyebrow><h2>Hair, in<br /><em>many forms.</em></h2></div><div className="hair-gallery-grid"><ImagePanel file="wig5.JPG" alt="Curly braids with soft, defined texture" className="hair-look hair-look-curly-braids" label="CURLY BRAIDS" /><ImagePanel file="wigDoll.JPG" alt="Voluminous curly wig styled at Cherished Beauty" className="hair-look hair-look-wig" label="CURLY WIG" /><ImagePanel file="brownBraids-optimized.jpg" alt="Long brown braids with curly ends" className="hair-look hair-look-brown-braids" label="BRAIDS, WITH CURL" /><ImagePanel file="curlyweave.jpeg" alt="Defined curls styled at the salon" className="hair-look hair-look-weave" label="CURLY WEAVE" /><ImagePanel file="dreadlocksBrown.JPG" alt="Brown dreadlocks styled at Cherished Beauty" className="hair-look hair-look-dreadlocks" label="DREADLOCKS" /></div></section>}
    {kind === 'nails' && <section className="discipline-story section-pad" style={{ paddingTop: '4rem' }}>
      <div className="discipline-story-copy reveal"><Eyebrow>THE CHERISHED TEAM</Eyebrow><h2>Care in<br /><em>every detail.</em></h2><p>Our team brings professional skills, thoughtful care, and attention to detail to each client experience.</p></div>
      <ImagePanel file="staffbraiding.PNG" alt="A team member braiding a client's hair at the salon" className="discipline-story-image" label="THE CHERISHED TEAM · AT WORK" />
    </section>}
    {kind === 'nails' && <section className="nail-gallery-section" aria-labelledby="nail-gallery-heading">
      <div className="nail-gallery-heading reveal"><Eyebrow>THE NAIL ROOM · IN FOCUS</Eyebrow><h2 id="nail-gallery-heading">Colour, form<br /><em>&amp; finish.</em></h2><p>A closer look at the details, from Cherished Beauty.</p></div>
      <div className="nail-gallery-grid">
        {nailPhotos.map((photo, index) => {
          return <button className={`nail-gallery-item nail-gallery-item-${index + 1} reveal`} type="button" key={photo.file} onClick={() => setActiveNailPhoto(index)} aria-label={`Open nail gallery photograph ${index + 1}`}>
            <img src={image(photo.file)} alt={photo.alt} loading="lazy" />
            <span className="nail-gallery-number">{String(index + 1).padStart(2, '0')} / {String(nailPhotos.length).padStart(2, '0')}</span>
            <span className="nail-gallery-expand" aria-hidden="true"><ArrowGlyph direction="up-right" /></span>
          </button>;
        })}
      </div>
      <div className="nail-gallery-footnote"><span>THE NAIL ROOM</span><span>POLOFIELDS CROSSING · MIDRAND</span></div>
      {activeNailPhoto !== null && <div className="nail-lightbox" role="dialog" aria-modal="true" aria-label={`Nail gallery photograph ${activeNailPhoto + 1}`} onClick={() => setActiveNailPhoto(null)}>
        <button className="nail-lightbox-close" type="button" aria-label="Close gallery" onClick={() => setActiveNailPhoto(null)}><ArrowGlyph direction="left" /></button>
        <button className="nail-lightbox-nav nail-lightbox-prev" type="button" aria-label="Previous photograph" onClick={(event) => { event.stopPropagation(); setActiveNailPhoto((activeNailPhoto + nailPhotos.length - 1) % nailPhotos.length); }}><ArrowGlyph direction="left" /></button>
        <img src={image(nailPhotos[activeNailPhoto].file)} alt={nailPhotos[activeNailPhoto].alt} onClick={(event) => event.stopPropagation()} />
        <span className="nail-lightbox-count">{String(activeNailPhoto + 1).padStart(2, '0')} <i>/</i> {String(nailPhotos.length).padStart(2, '0')}</span>
        <button className="nail-lightbox-nav nail-lightbox-next" type="button" aria-label="Next photograph" onClick={(event) => { event.stopPropagation(); setActiveNailPhoto((activeNailPhoto + 1) % nailPhotos.length); }}><ArrowGlyph direction="right" /></button>
      </div>}
    </section>}
    {kind === 'hair' && <WorkGallerySection title="Hair, in many forms." photos={hairPhotos} />}
    {kind === 'spa' && <WorkGallerySection title="A quieter kind of care." photos={spaPhotos} />}
    <section className="menu-chapter" data-chapter="dark"><div className="menu-chapter-top"><Eyebrow light>THE ROOM, AT A GLANCE</Eyebrow><span>POLOFIELDS · {kind.toUpperCase()}</span></div><h2 className="menu-chapter-title">A few of<br /><em>our rituals.</em></h2><div className="ritual-list">{item.categories.map((category, index) => <div className="ritual-line reveal" key={category}><span>0{index + 1}</span><p>{category}</p><i aria-hidden="true"><ArrowGlyph direction="up-right" /></i></div>)}</div><p className="menu-note">{kind === 'spa' ? 'Body massage pricing and durations are being prepared. Please contact the studio for current details.' : 'For current service availability and appointment details, please contact the studio.'}</p></section>
    <section className="discipline-last"><ImagePanel file={item.second} alt={item.secondAlt} className="discipline-last-image" /><div className="discipline-last-copy reveal"><Eyebrow>AT POLOFIELDS CROSSING</Eyebrow><p>Made of<br />small, good<br /><em>details.</em></p><LuxuryButton to="/booking">Ask about a visit</LuxuryButton></div></section>
    <BookingStrip title="Your time, your way." />
  </main>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Cherished Beauty enquiry: ${String(data.get('name') ?? '')}`);
    const body = encodeURIComponent(`${String(data.get('message') ?? '')}\n\nReply to: ${String(data.get('email') ?? '')}`);
    window.location.href = `mailto:waterfall@luxaura.co.za?subject=${subject}&body=${body}`;
    setSent(true);
  };
  return <main className="page-transition">
    <section className="contact-layout section-pad" data-chapter="dark"><div className="contact-invitation reveal"><Eyebrow light>FIND THE HOUSE</Eyebrow><h2>We'll be<br />right <em>here.</em></h2><p>Polofields Crossing<br />Polofields Dr<br />Midrand<br />1684</p><a className="contact-phone" href="tel:0100234291">010 023 4291 <span><ArrowGlyph direction="up-right" /></span></a><a className="contact-map" href={mapsUrl} target="_blank" rel="noreferrer">Open directions <span><ArrowGlyph direction="up-right" /></span></a><a className="contact-email" href="mailto:waterfall@luxaura.co.za">waterfall@luxaura.co.za <span><ArrowGlyph direction="up-right" /></span></a></div>
      <div className="contact-form-wrap reveal"><Eyebrow light>A NOTE TO THE STUDIO</Eyebrow><h3>What can we help you find?</h3><form onSubmit={submit}><label>Your name<input name="name" autoComplete="name" required /></label><label>Email address<input type="email" name="email" autoComplete="email" required /></label><label>Your note<textarea name="message" rows={4} required /></label><button className="luxury-button" type="submit"><span>Compose your note <i><ArrowGlyph direction="up-right" /></i></span><i><ArrowGlyph direction="up-right" /></i></button>{sent && <p className="form-note" role="status">Your email app is opening with your note addressed to the studio.</p>}</form></div>
    </section>
    <LocationCard />
    <FAQSection />
  </main>;
}

function BookingPage() {
  useEffect(() => { window.location.replace(bookingUrl); }, []);
  return <main className="booking-redirect"><p className="eyebrow">CHERISHED BEAUTY · APPOINTMENTS</p><a href={bookingUrl}>Continue to our booking page <span><ArrowGlyph direction="up-right" /></span></a></main>;
}

type PriceGroup = { title: string; rows: { service: string; price: string }[] };

const nailPriceGroups: PriceGroup[] = [
  { title: 'Pedicures', rows: [
    { service: 'Express Pedi', price: 'R380' },
    { service: 'Pedi & Gel Polish', price: 'R550' },
    { service: 'Pedicure', price: 'R400' },
    { service: 'Heel Peel Pedi', price: 'R600' },
    { service: 'Acrylic on Big Toes', price: 'R200' },
    { service: 'Add Paraffin Wax', price: 'R200' },
    { service: 'Add Clear Topcoat', price: 'R80' },
    { service: 'Soak Off Toes', price: 'R100' },
    { service: 'Soak Off Only on Hands/Feet', price: 'R130' },
  ] },
  { title: 'Manicure', rows: [
    { service: 'Mani', price: 'R300' },
    { service: 'Men’s Mani with Gel Coat', price: 'R320' },
    { service: 'Shape, Buff and Shine', price: 'R200' },
    { service: 'Mani with Gel', price: 'R600' },
    { service: 'Mani with Nail Polish', price: 'R450' },
    { service: 'Add Clear Topcoat', price: 'R100' },
    { service: 'Add Scrub', price: 'R150' },
    { service: 'Add Paraffin Wax', price: 'R200' },
  ] },
  { title: 'Acrylic', rows: [
    { service: 'Acrylic', price: 'R560' },
    { service: 'Acrylic Sculpture / Tips / Polygel (1–3)', price: 'R560' },
    { service: 'Acrylic Sculpture / Tips / Polygel (4–6)', price: 'R660' },
    { service: 'Acrylic Sculpture / Tips / Polygel (7+)', price: 'R720' },
    { service: 'Acrylic Overlay', price: 'R500' },
    { service: 'Add Manicure', price: 'R250' },
    { service: 'Add Gel', price: 'R150' },
    { service: 'File Down / Shorten / Reshape', price: 'R100' },
    { service: 'Soak Off', price: 'R100' },
    { service: 'Soak Off Only', price: 'R130' },
    { service: 'Acrylic Nail Repair', price: 'R100' },
  ] },
  { title: 'Gel', rows: [
    { service: 'Gel Polish (Hands)', price: 'R380' },
    { service: 'Gel Polish (Feet)', price: 'R350' },
    { service: 'Full Cover Tips + Gel', price: 'R550' },
    { service: 'Add Manicure', price: 'R180' },
    { service: 'Gel Repair', price: 'R70' },
    { service: 'Gel Soak Off', price: 'R90' },
    { service: 'Soak Off Only', price: 'R100' },
    { service: 'Repair Big Toes', price: 'R70' },
    { service: 'Hard Gel', price: 'R520' },
    { service: 'Hard Gel Fill', price: 'R400' },
  ] },
  { title: 'Teens (12–16 years)', rows: [
    { service: 'Gelish Polish', price: 'R300' },
    { service: 'Sculpture', price: 'R600' },
    { service: 'Overlay', price: 'R500' },
    { service: 'Manicure', price: 'R250' },
    { service: 'Pedi', price: 'R300' },
  ] },
  { title: 'Refills', rows: [
    { service: '2 Weeks · 1–3', price: 'R350' },
    { service: '2 Weeks · 4–6', price: 'R420' },
    { service: '2 Weeks · 7+', price: 'R500' },
    { service: '3 Weeks · 1–3', price: 'R500' },
    { service: '3 Weeks · 4–6', price: 'R550' },
    { service: '3 Weeks · 7+', price: 'R550' },
    { service: '4 Weeks', price: 'R550' },
  ] },
  { title: 'Nail Art', rows: [
    { service: 'Glitter, Basic, Chrome · 1 Nail', price: 'R30' },
    { service: 'Glitter, Basic, Chrome · 2 Nails', price: 'R80' },
    { service: 'Glitter, Basic, Chrome · 10 Nails', price: 'R250' },
    { service: 'Hand Painted Design · 1 Nail', price: 'R40' },
    { service: 'Hand Painted Design · 2 Nails', price: 'R80' },
    { service: 'Hand Painted Design · 4 Nails', price: 'R160' },
    { service: '3D and Encapsulated · 1 Nail', price: 'R50' },
    { service: '3D and Encapsulated · 2 Nails', price: 'R100' },
    { service: '3D and Encapsulated · 4 Nails', price: 'R200' },
    { service: 'Stones · ½ Nail', price: 'R50' },
    { service: 'Stones · ¼ Nail', price: 'R30' },
    { service: 'Stones · Full Designer', price: 'R120' },
  ] },
];

const hairPriceGroups: PriceGroup[] = [
  { title: 'Braiding', rows: [
    { service: 'Bob Braids', price: 'R650' },
    { service: 'Adult Bohemian', price: 'R980+' },
    { service: 'Kids Bohemian', price: 'R850+' },
    { service: 'Faux Locs – Long', price: 'R1,200' },
    { service: 'Freehand', price: 'R300' },
    { service: 'Wig Lines', price: 'R280' },
    { service: 'Freehand with Style', price: 'R380' },
    { service: 'Adult French Curls – Long', price: 'R1,350' },
    { service: 'Adult French Curls – Medium', price: 'R1,150' },
    { service: 'Adult French Curls – Short', price: 'R950' },
    { service: 'Kids French Curls – Long', price: 'R950+' },
    { service: 'Kids French Curls – Medium', price: 'R750' },
    { service: 'Kids French Curls – Short', price: 'R650' },
    { service: 'Men Cornrows – Big Lines', price: 'R250' },
    { service: 'Men Cornrows – Medium', price: 'R300' },
    { service: 'Braids – Long', price: 'R950+' },
    { service: 'Braids – Medium', price: 'R800' },
    { service: 'Braids – Short', price: 'R750' },
    { service: 'Wash Braids', price: 'R350' },
    { service: 'Treatment on Braids', price: 'R480' },
    { service: 'Wash Braids/Locs Retwist & Style', price: 'R550' },
    { service: 'Kids Braids', price: 'R550+' },
    { service: 'Kids Cornrows', price: 'R380' },
    { service: 'Adult Knotless Braids – Long', price: 'R950+' },
    { service: 'Adult Knotless Braids – Medium', price: 'R850' },
    { service: 'Adult Knotless Braids – Short', price: 'R750' },
    { service: 'Kids Knotless Braids – Long', price: 'R800+' },
    { service: 'Kids Knotless Braids – Medium', price: 'R750' },
    { service: 'Kids Knotless Braids – Short', price: 'R650' },
    { service: 'Kids Twists – Long', price: 'R950' },
    { service: 'Kids Twists – Medium', price: 'R850' },
    { service: 'Kids Twists – Short', price: 'R750' },
    { service: 'Adult Twists – Long', price: 'R1,050' },
    { service: 'Adult Twists – Medium', price: 'R950' },
    { service: 'Adult Twists – Short', price: 'R850' },
  ] },
  { title: 'Natural Hair', rows: [
    { service: 'Undo Braids', price: 'R200' },
    { service: 'Undo Weave', price: 'R200' },
    { service: 'Undo Freehand', price: 'R100' },
    { service: 'Removal of Glued Wig', price: 'R80' },
    { service: 'Detangle Hair', price: 'R150+' },
    { service: 'Kids Detangle & Wash', price: 'R180' },
    { service: 'Cholesterol Hair Treatment', price: 'R350' },
    { service: 'Wash & Dry', price: 'R250' },
    { service: 'Wash & Twist Natural Hair', price: 'R550' },
    { service: 'Natural Wash of Weave', price: 'R350' },
    { service: 'Wash Weave with Treatment', price: 'R450' },
    { service: 'Wash Weave and Style', price: 'R380' },
    { service: 'Wash Closure & Deglue', price: 'R150' },
    { service: 'Wig Undo & Pondo Glue', price: 'R380' },
    { service: 'Gel Pondo', price: 'R480' },
    { service: 'Glueless, Install + Style', price: 'R450' },
    { service: 'Wig Install & Style', price: 'R650' },
  ] },
  { title: 'Treatments', rows: [
    { service: 'Kids Treatment', price: 'R300' },
    { service: 'Hot Oil & Head Massage', price: 'R480' },
    { service: 'Mizani Treatment', price: 'R450' },
    { service: 'Mizani Luxury Treatment & Stem', price: 'R600' },
    { service: 'Mizani Treatment Silk Press with Blowout', price: 'R680' },
    { service: 'Mizani Relaxer', price: 'R500' },
    { service: 'Mizani Relaxer, Cut, Blowwave & Flat Iron', price: 'R750' },
    { service: 'Mizani Sensitive Relaxer', price: 'R530' },
    { service: 'Dark & Lovely Relaxer', price: 'R350' },
  ] },
  { title: 'Styling', rows: [
    { service: 'Sew in Weave', price: 'R650' },
    { service: 'Frontal Sew in Wig/Weave', price: 'R850' },
    { service: 'Wash and Style with Rollers', price: 'R300' },
  ] },
];

function PriceList({ groups }: { groups: PriceGroup[] }) {
  return <div className="price-groups">{groups.map((group) => <section className="price-group" key={group.title} aria-labelledby={`price-group-${group.title.toLowerCase().replaceAll(' ', '-')}`}>
    <h3 id={`price-group-${group.title.toLowerCase().replaceAll(' ', '-')}`}>{group.title}</h3>
    <table><thead><tr><th scope="col">Service</th><th scope="col">Price</th></tr></thead><tbody>{group.rows.map((row) => <tr key={row.service}><th scope="row">{row.service}</th><td>{row.price}</td></tr>)}</tbody></table>
  </section>)}</div>;
}

function PricingPage() {
  const [activeCategory, setActiveCategory] = useState<'nails' | 'hair'>('nails');
  const categories = [
    { id: 'nails' as const, label: 'Nails' },
    { id: 'hair' as const, label: 'Hair' },
  ];
  const selectCategoryWithKeyboard = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? categories.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : categories.length - 1)) % categories.length;
    setActiveCategory(categories[nextIndex].id);
    document.getElementById(`pricing-tab-${categories[nextIndex].id}`)?.focus();
  };

  return <main className="page-transition pricing-page">
    <section className="pricing-document-section section-pad" aria-labelledby="pricing-document-heading">
      <div className="pricing-document-intro reveal">
        <div><Eyebrow>CHERISHED BEAUTY · MIDRAND</Eyebrow><h1 className="page-intro" id="pricing-document-heading">The details,<br /><em>in full.</em></h1><p className="page-intro">Choose a service to browse our prices, or open the original PDF for the full price list.</p></div>
        <div className="pricing-document-actions"><a className="luxury-button" href={priceListUrl} target="_blank" rel="noreferrer"><span>View full price list</span><i><ArrowGlyph direction="up-right" /></i></a><a className="pricing-download-link" href={priceListUrl} download="CB Price List.pdf">Download the PDF <span><ArrowGlyph direction="down" /></span></a></div>
      </div>
      <div className="pricing-category-tabs" role="tablist" aria-label="Price list categories">{categories.map((category, index) => <button id={`pricing-tab-${category.id}`} key={category.id} type="button" role="tab" tabIndex={activeCategory === category.id ? 0 : -1} aria-selected={activeCategory === category.id} aria-controls="pricing-panel" className={activeCategory === category.id ? 'is-active' : ''} onClick={() => setActiveCategory(category.id)} onKeyDown={(event) => selectCategoryWithKeyboard(event, index)}>{category.label}</button>)}</div>
      <div id="pricing-panel" role="tabpanel" aria-labelledby={`pricing-tab-${activeCategory}`} className="pricing-panel reveal"><PriceList groups={activeCategory === 'nails' ? nailPriceGroups : hairPriceGroups} /></div>
      <div className="pricing-document-foot"><span>THE OFFICIAL CHERISHED BEAUTY PRICE LIST</span><a href="tel:0100234291">Questions? Call 010 023 4291 <ArrowGlyph direction="up-right" /></a></div>
    </section>
  </main>;
}

function NotFound() {
  return <main className="not-found"><Eyebrow>YOU'VE FOUND A QUIET CORNER</Eyebrow><h1>Let's find<br /><em>the house.</em></h1><LuxuryButton to="/">Back to the beginning</LuxuryButton></main>;
}

function App() {
  usePageMotion();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  return <><ScrollToTopOnRouteChange /><Navbar /><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/gallery" element={<OurGalleryPage />} />
    <Route path="/journal/the-women-who-raised-us" element={<MotherDayArticle />} />
    <Route path="/journal" element={<MotherDayArticle />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/services/hair" element={<DisciplinePage kind="hair" />} />
    <Route path="/services/nails" element={<DisciplinePage kind="nails" />} />
    <Route path="/services/spa" element={<DisciplinePage kind="spa" />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/booking" element={<BookingPage />} />
    <Route path="/pricing" element={<PricingPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes><Footer /><BookingPrompt /><BackToTop /><div className="grain" aria-hidden="true" /></>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>);
