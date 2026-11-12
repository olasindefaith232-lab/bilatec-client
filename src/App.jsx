import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import { apiRequest } from './data/api'
import { SiteDataProvider, useSiteData } from './data/SiteDataContext'

const Icon = ({ name, size = 20 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    sun: <><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></>,
    tool: <><path d="m14.7 6.3 3-3a4.2 4.2 0 0 0-5.7 5.7L4 17a2.1 2.1 0 1 0 3 3l8-8a4.2 4.2 0 0 0 5.7-5.7l-3 3-3-3Z" /></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.28-1.28a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    quote: <><path d="M4 19h16" /><path d="M6 16V8l6-4 6 4v8" /><path d="M9 16v-4h6v4" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function Logo() {
  return <Link className="logo" to="/" aria-label="Bilatec home"><span className="logo-mark"><Icon name="bolt" size={20} /></span><span><strong>BILATEC</strong><small>VOCATIONAL HUB</small></span></Link>
}

function SectionHeading({ eyebrow, title, copy, light = false }) {
  return <div className={`section-heading ${light ? 'section-heading--light' : ''}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
}

function PageHeader() {
  const { company } = useSiteData()
  return <>
    <div className="announcement"><span className="pulse-dot" /> <span>{company.motto}</span><Link to="/contact">Start a project <Icon name="arrow" size={15} /></Link></div>
    <header className="navbar navbar--solid"><div className="container nav-inner"><Logo /><nav className="nav-links" aria-label="Main navigation">
      <NavLink to="/about">About</NavLink><NavLink to="/services">Services</NavLink><NavLink to="/products">Products</NavLink><NavLink to="/training">Training</NavLink><NavLink to="/projects">Projects</NavLink><Link className="nav-cta" to="/contact">Request a quote <Icon name="arrow" size={16} /></Link>
    </nav><Link className="menu-button menu-link" to="/">Menu</Link></div></header>
  </>
}

function PageFooter() {
  const { company } = useSiteData()
  return <footer className="footer"><div className="container footer-top"><div><Logo /><p>{company.motto}<br />{company.slogan}</p></div><div className="footer-links"><div><span>Explore</span><Link to="/about">About us</Link><Link to="/services">Services</Link><Link to="/projects">Projects</Link></div><div><span>Connect</span><a href={`mailto:${company.email}`}>Email us</a>{company.phones[0] && <a href={`tel:${company.phones[0].replace(/\s/g, '')}`}>Call the team</a>}<Link to="/training">Training</Link></div><div className="newsletter"><span>Notes from the workshop</span><p>Occasional updates on power, projects, and practical skills.</p><small className="success-note">{company.motto}</small></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {company.name}</span><span>{company.location}</span></div></footer>
}

function PageIntro({ kicker, title, accent, copy, image, video = false }) {
  const { services, projects, heroSlides } = useSiteData()
  const images = [...new Set([image, ...services.map((service) => service.image), ...projects.map((project) => project.image)].filter(Boolean))].slice(0, 3)
  const [activeImage, setActiveImage] = useState(0)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const videoSource = heroSlides.find((slide) => slide.video)?.video

  useEffect(() => {
    if (prefersReducedMotion || images.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [images.length, prefersReducedMotion])

  return <section className="page-intro relative flex min-h-[510px] items-end overflow-hidden bg-navy text-white max-[680px]:min-h-[470px]"><div className={`page-intro-visual ${video && videoSource ? 'page-intro-visual--video' : ''}`} aria-hidden="true">{images.map((src, index) => <img className={index === activeImage ? 'page-intro-image page-intro-image--active' : 'page-intro-image'} src={src} alt="" key={src} />)}{video && videoSource && <video className="page-intro-video" autoPlay={!prefersReducedMotion} muted loop playsInline poster={image}><source src={videoSource} type="video/mp4" /></video>}</div><div className="container page-intro-content relative z-[3] pt-[100px] pb-[76px] max-[680px]:pb-[57px]"><span className="eyebrow eyebrow--gold">{kicker}</span><h1>{title}<br /><em>{accent}</em></h1><p>{copy}</p></div></section>
}

function AboutPage() {
  const { services, siteContent } = useSiteData()
  const page = siteContent.find((item) => item.id === 'about') || {}
  return <div className="page-shell"><PageHeader /><main><PageIntro kicker={page.kicker || 'About Bilatec / 01'} title={page.title || 'Useful power.'} accent={page.accent || 'Practical people.'} copy={page.copy || 'Bilatec Vocational Hub is an engineering and skills platform for people who believe good work should be understood, well-made, and useful.'} image={services[2].image} /><section className="section-pad about-story"><div className="container about-story-grid"><div><span className="eyebrow">{page.storyEyebrow || 'Our point of view'}</span><h2>{page.storyTitle || 'We make technical work feel'} <em>{page.storyAccent || 'possible.'}</em></h2></div><div><p className="lead">{page.storyLead || 'Your skill, our priority.'}</p><p>{page.storyCopy || 'We are building Bilatec around a simple promise: connect dependable electrical engineering with practical learning that changes what people can do.'}</p><p>{page.storyDetail || 'From Sango Ota, we serve households, businesses, and the next generation of technicians with energy systems, industrial services, products, and hands-on training.'}</p></div></div></section><section className="about-motto"><div className="container"><span className="eyebrow eyebrow--gold">{page.mottoEyebrow || 'The Bilatec motto'}</span><h2>{page.mottoTitle || 'Your skill.'}<br /><em>{page.mottoAccent || 'Our priority.'}</em></h2><p>{page.mottoCopy || 'Every service, product, and training programme should leave you more capable than when you arrived.'}</p></div></section><section className="section-pad principles"><div className="container"><SectionHeading eyebrow={page.principlesEyebrow || 'How we work / 02'} title={page.principlesTitle || 'Clear thinking. Clean work.'} copy={page.principlesCopy || 'The details matter — especially when the details carry power.'} /><div className="principle-grid">{(page.principles || [{ title: 'Listen first', copy: 'We start from the real need, not a one-size-fits-all package.' }, { title: 'Build for use', copy: 'We value solutions that are understandable, maintainable, and ready for everyday life.' }, { title: 'Pass it on', copy: 'We make room for people to learn, practise, and grow into technical confidence.' }]).map((principle, index) => <div key={principle.title}><strong>0{index + 1}</strong><h3>{principle.title}</h3><p>{principle.copy}</p></div>)}</div></div></section></main><PageFooter /></div>
}

function ServicesPage() {
  const { services, siteContent } = useSiteData()
  const page = siteContent.find((item) => item.id === 'services') || {}
  return <div className="page-shell"><PageHeader /><main><PageIntro kicker={page.kicker || 'Services / 02'} title={page.title || 'Power that'} accent={page.accent || 'performs.'} copy={page.copy || 'From first sketch to final test, our work is designed around dependable outcomes.'} image={services[0].image} /><section className="section-pad services-page"><div className="container"><SectionHeading eyebrow={page.sectionEyebrow || 'Capabilities / 03'} title={page.sectionTitle || 'Four ways to move forward.'} copy={page.sectionCopy || 'Choose the starting point that matches what you need today.'} /><div className="service-page-grid">{services.map((service, index) => <article className="service-page-card" key={service.id}><div className="service-page-image" style={{ backgroundImage: `url(${service.image})` }}><span>0{index + 1}</span></div><div><span className="eyebrow">{service.eyebrow}</span><h3>{service.title}</h3><p>{service.description}</p><Link className="card-link" to="/contact">Talk to an engineer <Icon name="arrow" size={15} /></Link></div></article>)}</div></div></section><section className="service-callout"><div className="container"><span className="eyebrow eyebrow--gold">{page.calloutEyebrow || 'Need a different starting point?'}</span><h2>{page.calloutTitle || 'Let’s turn the'}<br /><em>{page.calloutAccent || 'unknown into a plan.'}</em></h2><Link className="button button--gold" to="/contact">{page.calloutButton || 'Tell us what you need'} <Icon name="arrow" size={17} /></Link></div></section></main><PageFooter /></div>
}

function ProductsPage() {
  const [filter, setFilter] = useState('All')
  const { products, services, siteContent } = useSiteData()
  const page = siteContent.find((item) => item.id === 'products') || {}
  const categories = ['All', ...new Set(products.map((product) => product.category))]
  const filtered = filter === 'All' ? products : products.filter((product) => product.category === filter)
  return <div className="page-shell"><PageHeader /><main><PageIntro kicker={page.kicker || 'Products / 03'} title={page.title || 'Specify better.'} accent={page.accent || 'Source with confidence.'} copy={page.copy || 'A sample product catalogue for components, protection, and solar equipment.'} image={services[1].image} /><section className="section-pad"><div className="container"><div className="filter-row">{categories.map((category) => <button className={filter === category ? 'filter-chip filter-chip--active' : 'filter-chip'} key={category} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="product-grid product-grid--page">{filtered.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt="" /><span>{product.availability}</span></div><div className="product-card-body"><span className="card-kicker">{product.category} · {product.brand}</span><h3>{product.name}</h3><p>{product.description}</p><Link className="card-link" to="/contact">Request details <Icon name="arrow" size={15} /></Link></div></article>)}</div></div></section></main><PageFooter /></div>
}

function TrainingPage() {
  const { services, courses, siteContent } = useSiteData()
  const page = siteContent.find((item) => item.id === 'training') || {}
  return <div className="page-shell"><PageHeader /><main><PageIntro kicker={page.kicker || 'Training / 04'} title={page.title || 'Learn by'} accent={page.accent || 'doing.'} copy={page.copy || 'Practical programmes for people who want useful electrical, solar, and maintenance skills.'} image={services[3].image} video /><section className="section-pad training-page"><div className="container"><SectionHeading eyebrow={page.sectionEyebrow || 'The workshop'} title={page.sectionTitle || 'Your next skill starts here.'} copy={page.sectionCopy || 'Small groups. Practical tools. A clear path from first principles to confident work.'} /><div className="course-page-grid">{courses.map((course) => <article className="course-page-card" key={course.id}><span className="course-number">0{course.id}</span><span className="eyebrow">{course.label}</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-meta"><span>{course.duration}</span><span>{course.mode}</span></div><Link className="button button--navy" to="/contact">Apply now <Icon name="arrow" size={17} /></Link></article>)}</div></div></section><section className="training-motto"><div className="container"><span className="eyebrow eyebrow--gold">{page.mottoEyebrow || 'Skill is a power source'}</span><h2>{page.mottoTitle || 'Don’t just watch'}<br /><em>{page.mottoAccent || 'the future happen.'}</em></h2><p>{page.mottoCopy || 'Build the confidence to take part in it.'}</p></div></section></main><PageFooter /></div>
}

function ProjectsPage() {
  const { projects, siteContent } = useSiteData()
  const page = siteContent.find((item) => item.id === 'projects') || {}
  return <div className="page-shell"><PageHeader /><main><PageIntro kicker={page.kicker || 'Projects / 05'} title={page.title || 'Work that'} accent={page.accent || 'holds up.'} copy={page.copy || 'A visual sample of the project stories we will document properly as Bilatec grows.'} image={projects[0]?.image} /><section className="section-pad"><div className="container"><SectionHeading eyebrow={page.sectionEyebrow || 'Field notes / 06'} title={page.sectionTitle || 'Built in the real world.'} copy={page.sectionCopy || 'Every finished project should show the thinking, the craft, and the result.'} /><div className="projects-grid projects-grid--page">{projects.map((project) => <article className="project-card" key={project.id}><img src={project.image} alt="" /><div className="project-overlay"><span>{project.category}</span><h3>{project.title}</h3><small>{project.location}</small></div></article>)}</div></div></section></main><PageFooter /></div>
}

function ContactPage() {
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState('')
  const { company, services, siteContent } = useSiteData()
  const page = siteContent.find((item) => item.id === 'contact') || {}
  const submitInquiry = async (event) => {
    event.preventDefault()
    setFormError('')
    const form = new FormData(event.currentTarget)
    try {
      await apiRequest('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(form.entries())),
      })
      setSent(true)
    } catch (error) {
      setFormError(error.message)
    }
  }
  return <div className="page-shell"><PageHeader /><main><PageIntro kicker={page.kicker || 'Contact / 06'} title={page.title || 'Start with a'} accent={page.accent || 'conversation.'} copy={page.copy || 'Tell us where you are starting from. We’ll help you identify the next practical step.'} image={services[2].image} /><section className="section-pad contact-page"><div className="container contact-page-grid"><div><SectionHeading eyebrow={page.sectionEyebrow || 'Sango Ota · Ogun State'} title={page.sectionTitle || 'The right answer starts with the right question.'} copy={page.sectionCopy || 'Use the form, call, or send an email. Send us a message and we will get back to you.'} /><div className="contact-details"><a href={`tel:${company.phones[0]?.replace(/\s/g, '')}`}><Icon name="phone" size={17} /> {company.phones[0]}</a><a href={`mailto:${company.email}`}><Icon name="mail" size={17} /> {company.email}</a><span><Icon name="pin" size={17} /> {company.location}</span></div></div><div className="contact-form-card">{sent ? <div className="success-panel"><span className="success-icon"><Icon name="check" size={25} /></span><span className="eyebrow">Message received</span><h2>We’ll be in touch.</h2><p>Your enquiry has been sent to the Bilatec team.</p></div> : <form className="modal-form" onSubmit={submitInquiry}><div className="form-row"><label>Name<input name="name" required minLength="2" maxLength="120" placeholder="Your name" /></label><label>Phone<input name="phone" required minLength="5" maxLength="40" placeholder="0800 000 0000" /></label></div><label>Email address<input name="email" required type="email" maxLength="254" placeholder="you@example.com" /></label><label>What can we help with?<select name="subject" defaultValue="" required><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.id}>{service.title}</option>)}<option>Training application</option><option>Product enquiry</option></select></label><label>Message<textarea name="message" required minLength="5" maxLength="5000" rows="5" placeholder="Tell us a little about what you need..." /></label>{formError && <p role="alert" className="form-error">{formError}</p>}<button className="button button--navy button--full" type="submit">Send enquiry <Icon name="arrow" size={17} /></button></form>}</div></div></section></main><PageFooter /></div>
}

function App() {
  return <SiteDataProvider><BrowserRouter><Routes><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/products" element={<ProductsPage />} /><Route path="/training" element={<TrainingPage />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<AboutPage />} /></Routes></BrowserRouter></SiteDataProvider>
}

function HomePage() {
  const { company, courses, products, projects, services, stats, heroSlides, siteContent, apiError } = useSiteData()
  const home = siteContent.find((item) => item.id === 'home') || {}
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeHero, setActiveHero] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  const [activeServiceId, setActiveServiceId] = useState(services[0]?.id)
  const [productFilter, setProductFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [newsletterSent, setNewsletterSent] = useState(false)
  const [formError, setFormError] = useState('')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const activeService = services.find((service) => service.id === activeServiceId) || services[0]
  const categories = ['All', ...new Set(products.map((product) => product.category))]
  const filteredProducts = useMemo(() => productFilter === 'All' ? products : products.filter((product) => product.category === productFilter), [productFilter, products])

  const closeModal = () => { setModal(null); setSubmitted(false) }
  const scrollTo = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  useEffect(() => {
    if (heroPaused || prefersReducedMotion || heroSlides.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroSlides.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [heroPaused, prefersReducedMotion, heroSlides.length])

  useEffect(() => {
    if (activeHero >= heroSlides.length) setActiveHero(0)
  }, [activeHero, heroSlides.length])

  const changeHero = (direction) => {
    if (heroSlides.length === 0) return
    setActiveHero((current) => (current + direction + heroSlides.length) % heroSlides.length)
  }

  const submitModalInquiry = async (event) => {
    event.preventDefault()
    setFormError('')
    const form = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      await apiRequest('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify({ ...form, subject: form.programme || form.service || 'Project enquiry' }),
      })
      setSubmitted(true)
    } catch (error) {
      setFormError(error.message)
    }
  }

  const submitNewsletter = async (event) => {
    event.preventDefault()
    setFormError('')
    const email = new FormData(event.currentTarget).get('email')
    try {
      await apiRequest('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify({ name: 'Newsletter subscriber', phone: 'Not provided', email, subject: 'Newsletter subscription', message: 'Please add me to the Bilatec newsletter.' }),
      })
      setNewsletterSent(true)
    } catch (error) {
      setFormError(error.message)
    }
  }

  return <div id="top" className="site-shell">
    {apiError && <div role="status" style={{ padding: '8px 16px', color: '#7f1d1d', background: '#fee2e2', textAlign: 'center', fontSize: 12 }}>Live content is unavailable; showing saved sample content. {apiError}</div>}
    <div className="announcement"><span className="pulse-dot" /> <span>{home.announcement || company.motto}</span><button onClick={() => setModal('quote')}>Start a project <Icon name="arrow" size={15} /></button></div>
    <header className="navbar">
      <div className="container nav-inner"><Logo /><nav className={menuOpen ? 'nav-links nav-links--open' : 'nav-links'} aria-label="Main navigation">
        {[['About', '/about'], ['Services', '/services'], ['Products', '/products'], ['Training', '/training'], ['Projects', '/projects']].map(([item, path]) => <Link key={item} to={path} onClick={() => setMenuOpen(false)}>{item}</Link>)}
        <button className="nav-cta" onClick={() => setModal('quote')}>Request a quote <Icon name="arrow" size={16} /></button>
      </nav><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button></div>
    </header>

    <main>
      <section className="hero relative isolate flex min-h-[min(780px,calc(100vh-34px))] items-center overflow-hidden bg-navy text-white max-[680px]:min-h-[690px]">
        <div className="hero-visual" aria-hidden="true">{heroSlides.map((slide, index) => <div className={index === activeHero ? 'hero-image-layer hero-image-layer--active' : 'hero-image-layer'} key={slide.label}><img src={slide.image} alt="" />{slide.video && index === activeHero && <video className="hero-video" autoPlay={!prefersReducedMotion} muted loop playsInline poster={slide.image}><source src={slide.video} type="video/mp4" /></video>}</div>)}</div>
        <div className="hero-grid" />
        <div className="container hero-content"><div className="hero-copy"><span className="eyebrow eyebrow--gold">{home.heroEyebrow || 'Bilatec / skill-first engineering'}</span><h1>{home.heroTitle || 'Your skill.'}<br /><em>{home.heroAccent || 'Our priority.'}</em></h1><p>{home.heroCopy || 'Electrical engineering, sustainable energy, and practical skills for the systems and people that keep businesses moving.'}</p><div className="hero-actions"><button className="button button--gold" onClick={() => setModal('quote')}>{home.heroButton || 'Discuss your project'} <Icon name="arrow" size={17} /></button><Link className="text-button text-button--light" to="/services">{home.heroLink || 'Explore services'} <Icon name="arrow" size={17} /></Link></div></div><div className="hero-aside"><span className="vertical-label">BILATEC / 001</span><div className="hero-note"><span className="note-line" /><span>{company.slogan}</span></div></div></div>
        <div className="hero-motto-stamp"><span>Your skill</span><strong>Our priority.</strong></div><div className="hero-controls absolute bottom-[27px] left-[max(32px,calc((100%-1240px)/2))] z-[3] flex items-center gap-[13px] font-mono text-[9px] uppercase tracking-[.1em] text-white/80 max-[680px]:bottom-5 max-[680px]:left-3 max-[680px]:gap-2" aria-label="Hero slideshow controls"><button type="button" className="hero-control-arrow bg-transparent px-1 py-[7px] text-[18px] leading-none text-inherit focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4" onClick={() => changeHero(-1)} aria-label="Previous hero image">←</button><div className="hero-dots flex gap-[7px]" role="group" aria-label="Choose a hero image">{heroSlides.map((slide, index) => <button type="button" key={slide.label} className={index === activeHero ? 'hero-dot w-[34px] bg-gold transition-[width,background-color] duration-300 ease-in-out max-[680px]:w-6' : 'hero-dot w-[19px] bg-white/40 transition-[width,background-color] duration-300 ease-in-out max-[680px]:w-[13px]'} onClick={() => setActiveHero(index)} aria-label={`Show ${slide.label}`} aria-pressed={index === activeHero} />)}</div><button type="button" className="hero-control-arrow bg-transparent px-1 py-[7px] text-[18px] leading-none text-inherit focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4" onClick={() => changeHero(1)} aria-label="Next hero image">→</button><button type="button" className="hero-pause bg-transparent py-[7px] pl-2 font-mono uppercase text-inherit focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 max-[680px]:pl-1" onClick={() => setHeroPaused(!heroPaused)} aria-pressed={heroPaused}>{heroPaused ? 'Play' : 'Pause'}</button></div><div className="scroll-cue"><span>Scroll to explore</span><span className="scroll-line" /></div>
      </section>

      <section className="intro section-pad" id="about"><div className="container intro-grid"><div><span className="eyebrow">{home.introEyebrow || 'A capable partner'}</span><h2>{home.introTitle || 'Technical thinking.'}<br /><span>{home.introAccent || 'Practical delivery.'}</span></h2></div><div className="intro-copy"><p className="lead">{home.introLead || 'Bilatec Vocational Hub brings engineering services and practical technical training together under one roof.'}</p><p>{home.introCopy || 'Whether you need a dependable power solution, a cleaner installation, or the confidence to build a career with your hands, our work starts with understanding the real problem.'}</p><button className="text-button" onClick={() => scrollTo('contact')}>{home.introButton || 'Meet Bilatec'} <Icon name="arrow" size={17} /></button></div></div><div className="container stats-row">{stats.map((stat) => <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></section>

      <section className="service-section section-pad" id="services"><div className="container"><SectionHeading eyebrow={home.servicesEyebrow || 'What we do / 01'} title={home.servicesTitle || 'Built for the real world.'} copy={home.servicesCopy || 'A focused set of services for better power, better systems, and better technical outcomes.'} /><div className="service-explorer"><div className="service-tabs">{services.map((service, index) => <button className={activeService?.id === service.id ? 'service-tab service-tab--active' : 'service-tab'} key={service.id} onClick={() => setActiveServiceId(service.id)}><span>0{index + 1}</span><strong>{service.shortTitle}</strong><Icon name="arrow" size={16} /></button>)}</div>{activeService && <div className="service-feature"><div className="service-feature-image" style={{ backgroundImage: `url(${activeService.image})` }}><span className="image-label">Bilatec field note / {activeService.id}</span></div><div className="service-feature-copy"><span className="eyebrow">{activeService.eyebrow}</span><h3>{activeService.title}</h3><p className="lead">{activeService.description}</p><p>{activeService.detail}</p><div className="tag-row">{activeService.tags?.map((tag) => <span key={tag}><Icon name="check" size={14} /> {tag}</span>)}</div><button className="button button--navy" onClick={() => setModal('quote')}>Talk to an engineer <Icon name="arrow" size={17} /></button></div></div>}</div></div></section>

      <section className="solar-band"><div className="solar-band-image" style={{ backgroundImage: `linear-gradient(90deg, var(--navy) 0%, rgba(7,26,47,.74) 35%, rgba(7,26,47,.1)), url("${services[1]?.image || ''}")` }} /><div className="container solar-content"><span className="eyebrow eyebrow--gold">{home.solarEyebrow || 'A smarter energy direction'}</span><h2>{home.solarTitle || 'Make power'}<br /><em>{home.solarAccent || 'work harder.'}</em></h2><p>{home.solarCopy || 'Solar is not just about panels. It is about designing a more dependable relationship with energy — one that fits the way you live and work.'}</p><button className="button button--gold" onClick={() => { if (services[1]) setActiveServiceId(services[1].id); scrollTo('services') }}>{home.solarButton || 'Explore solar solutions'} <Icon name="arrow" size={17} /></button></div><div className="solar-badge"><Icon name="sun" size={23} /><span>Clean energy<br /><strong>by design</strong></span></div></section>

      <section className="products-section section-pad" id="products"><div className="container"><div className="split-heading"><SectionHeading eyebrow={home.productsEyebrow || 'Catalogue / 02'} title={home.productsTitle || 'The right component matters.'} copy={home.productsCopy || 'A sample catalogue of equipment and accessories.'} /><button className="text-button" onClick={() => setModal('quote')}>Request product list <Icon name="arrow" size={17} /></button></div><div className="filter-row" role="tablist" aria-label="Product categories">{categories.map((category) => <button className={productFilter === category ? 'filter-chip filter-chip--active' : 'filter-chip'} key={category} onClick={() => setProductFilter(category)}>{category}</button>)}</div><div className="product-grid">{filteredProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt="" /><span>{product.availability}</span></div><div className="product-card-body"><span className="card-kicker">{product.category} · {product.brand}</span><h3>{product.name}</h3><p>{product.description}</p><button className="card-link" onClick={() => setModal('quote')}>Ask about this product <Icon name="arrow" size={15} /></button></div></article>)}</div></div></section>

      <section className="training-section" id="training"><div className="container training-grid"><div className="training-photo"><div className="training-photo-image" /><div className="photo-caption"><span>{home.trainingPhotoCaption || 'Practical knowledge'}</span><strong>{home.trainingPhotoAccent || 'is power in motion.'}</strong></div></div><div className="training-content"><SectionHeading light eyebrow={home.trainingEyebrow || 'The Bilatec workshop / 03'} title={home.trainingTitle || 'Learn by doing.'} copy={home.trainingCopy || 'Technical confidence is built through practice. Our sample programmes are designed for people who want useful skills, not just a certificate.'} /><div className="course-list">{courses.map((course) => <button className="course-row" key={course.id} onClick={() => setModal('training')}><span className="course-number">0{course.id}</span><span className="course-info"><strong>{course.title}</strong><small>{course.mode} · {course.duration}</small></span><Icon name="arrow" size={17} /></button>)}</div><button className="button button--gold" onClick={() => setModal('training')}>{home.trainingButton || 'Apply for a programme'} <Icon name="arrow" size={17} /></button></div></div></section>

      <section className="projects-section section-pad" id="projects"><div className="container"><div className="split-heading"><SectionHeading eyebrow={home.projectsEyebrow || 'Selected work / 04'} title={home.projectsTitle || 'A glimpse of what is possible.'} copy={home.projectsCopy || 'These are illustrative project records for the client build. Real project stories and photography can be added through the admin dashboard.'} /><button className="text-button" onClick={() => setModal('quote')}>Start a conversation <Icon name="arrow" size={17} /></button></div><div className="projects-grid">{projects.map((project, index) => <article className={`project-card project-card--${index + 1}`} key={project.id}><img src={project.image} alt="" /><div className="project-overlay"><span>{project.category}</span><h3>{project.title}</h3><small>{project.location}</small></div></article>)}</div></div></section>

      <section className="contact-section" id="contact"><div className="container contact-grid"><div><span className="eyebrow eyebrow--gold">{home.contactEyebrow || 'Let’s make it useful'}</span><h2>{home.contactTitle || 'Have a system'}<br /><em>{home.contactAccent || 'in mind?'}</em></h2><p>{home.contactCopy || 'Tell us where you are starting from. We’ll help you identify the next practical step.'}</p></div><div className="contact-card"><div className="contact-item"><span className="contact-icon"><Icon name="phone" size={18} /></span><div><small>Call us</small>{company.phones.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>)}</div></div><div className="contact-item"><span className="contact-icon"><Icon name="mail" size={18} /></span><div><small>Email us</small><a href={`mailto:${company.email}`}>{company.email}</a></div></div><div className="contact-item"><span className="contact-icon"><Icon name="pin" size={18} /></span><div><small>Find us</small><span>{company.location}</span></div></div><button className="button button--gold button--full" onClick={() => setModal('quote')}>Request a quote <Icon name="arrow" size={17} /></button></div></div></section>
    </main>

    <footer className="footer"><div className="container footer-top"><div><Logo /><p>{company.slogan}</p></div><div className="footer-links"><div><span>Explore</span><button onClick={() => scrollTo('about')}>About us</button><button onClick={() => scrollTo('services')}>Services</button><button onClick={() => scrollTo('projects')}>Projects</button></div><div><span>Connect</span><a href={`mailto:${company.email}`}>Email us</a>{company.phones[0] && <a href={`tel:${company.phones[0].replace(/\s/g, '')}`}>Call the team</a>}<button onClick={() => setModal('training')}>Training</button></div><div className="newsletter"><span>Notes from the workshop</span><p>{home.newsletterCopy || 'Occasional updates on power, projects, and practical skills.'}</p>{newsletterSent ? <small className="success-note">You’re on the list — thank you.</small> : <form onSubmit={submitNewsletter}><input name="email" type="email" placeholder="Your email address" aria-label="Your email address" required /><button aria-label="Subscribe"><Icon name="arrow" size={17} /></button></form>}{formError && <small role="alert" className="form-error">{formError}</small>}</div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {company.name}</span><span>{company.location}</span></div></footer>

    {modal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={closeModal} aria-label="Close"><Icon name="close" size={20} /></button>{submitted ? <div className="success-panel"><span className="success-icon"><Icon name="check" size={25} /></span><span className="eyebrow">Message received</span><h2>We’ll be in touch.</h2><p>Your enquiry has been sent to the Bilatec team.</p><button className="button button--navy" onClick={closeModal}>Back to website <Icon name="arrow" size={17} /></button></div> : <><span className="eyebrow">{modal === 'training' ? 'Training application' : 'Project enquiry'}</span><h2 id="modal-title">{modal === 'training' ? 'Start building your skills.' : 'Let’s talk about your project.'}</h2><p className="modal-intro">{modal === 'training' ? 'Share a few details and we’ll send you the next steps for the programme.' : 'Give us a little context and an engineer will help you find the right next step.'}</p><form className="modal-form" onSubmit={submitModalInquiry}><div className="form-row"><label>Name<input required name="name" minLength="2" maxLength="120" placeholder="Your name" /></label><label>Phone<input required name="phone" minLength="5" maxLength="40" placeholder="0800 000 0000" /></label></div><label>Email address<input required type="email" name="email" maxLength="254" placeholder="you@example.com" /></label>{modal === 'training' ? <label>Programme<select name="programme" defaultValue=""><option value="" disabled>Select a programme</option>{courses.map((course) => <option key={course.id}>{course.title}</option>)}</select></label> : <label>What can we help with?<select name="service" defaultValue=""><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.id}>{service.title}</option>)}<option>Product enquiry</option></select></label>}<label>Message<textarea required name="message" minLength="5" maxLength="5000" rows="4" placeholder={modal === 'training' ? 'Tell us about your goals...' : 'Tell us a little about what you need...'} /></label>{formError && <p role="alert" className="form-error">{formError}</p>}<button className="button button--navy button--full" type="submit">Send enquiry <Icon name="arrow" size={17} /></button></form></>}</div></div>}
  </div>
}

export default App
