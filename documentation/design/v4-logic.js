const IMG = 'public/assets/img/';
const pairs = (v) => (v || '').split('|').map(s => s.trim()).filter(Boolean).map(it => { const [l, ...r] = it.split('::'); return { label: l.trim(), value: r.join('::').trim() }; });
const webp = (p) => /^https?:/.test(p) ? p : encodeURI(IMG + p.replace(/^assets\/img\//, '').replace(/\.(png|jpe?g)$/i, '.webp'));

const slug = (t) => 'project-' + t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const NAV = [['home','Home'],['about','About'],['projects','Projects'],['services','Services'],['contact','Contact']];
const SOCIALS = [
  { label: 'Twitter', href: 'https://twitter.com/AyushBM1', icon_class: 'ri-twitter-fill' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ayush-bm/', icon_class: 'ri-linkedin-box-fill' },
  { label: 'GitHub', href: 'https://github.com/ayush-sleeping', icon_class: 'ri-github-fill' },
  { label: 'Email', href: 'mailto:ayushbm84@gmail.com', icon_class: 'ri-mail-fill' }
];
const MARQUEE = ['Software Developer','Full Stack Web Developer','Backend Laravel Developer','Backend Developer'];
const INFO = 'Interest::Software Engineering and Fullstack Web Development | Skilled::Laravel + PHP + MySQL + JavaScript + React | Focusing On::Python + Django + Next.js | Experience::2+ YOE in Backend & Full Stack Web Development | Education::Bachelor of Science in Computer Science (2020 - 2023) | EMAIL::ayushbm84@gmail.com | ADDRESS::Mumbai, Maharashtra, India';
const EXPERIENCE = [
  { date_label: 'Oct 2025 - Present', title: 'Backend Developer', company: 'Leapswitch Networks', location: 'India', duration_label: 'Present | Onsite', description: 'Building and maintaining backend services and REST APIs, focused on scalable, performant server-side systems and database design. Claude is part of the daily workflow for code review, debugging and documentation, with every change reviewed and tested before it ships.', details: 'Backend::Laravel + PHP + Python + Django + MySQL | Frontend::JavaScript, React, Next.js, Bootstrap, HTML, CSS | Others::REST APIs, MVC, Git, AWS | AI tools::Claude, Claude Code' },
  { date_label: 'July 2025 - Oct 2025', title: 'FullStack Web Application Developer', company: 'SkillLogic Technologies', location: 'India', duration_label: '3.5 Months | Remote', description: 'Worked on various projects using Reactjs, Laravel and MySQL.', details: 'Backend::Laravel + MySQL | Frontend::Reactjs, TypeScript, JavaScript, TailWind CSS, HTML, CSS, Bootstrap | Others::MVC, Git, AWS, API, Basic UI/UX | AI tools::ChatGPT Plus' },
  { date_label: 'Oct 2023 - Oct 2024', title: 'Junior FullStack Web Developer', company: 'Technicul Cloud LLP', location: 'Mumbai, India', duration_label: '1 Year | Onsite', description: 'Developed Laravel-based REST APIs for real-world applications. Worked with Laravel Framework, MySQL Database, JavaScript, Bootstrap, HTML, CSS across multiple projects focusing on performance and UI consistency.', details: 'Backend::Laravel + MySQL | Frontend::JavaScript, HTML, CSS, Bootstrap | Others::MVC, Git, AWS, API, Basic UI/UX | AI tools::GitHub Copilot' },
  { date_label: 'Jun 2023 - Sept 2024', title: 'Java Fullstack Development', company: 'Anudip Foundation', location: 'Mumbai, India', duration_label: 'Paid Training Course | Hybrid', description: 'Hands-on training in Spring Boot, Hibernate, Angular, and Git. Built practice apps using REST APIs and MVC design pattern for enterprise-level applications.', details: 'Backend::Core Java, Spring Boot, MySQL, Hibernate | Frontend::Angular, HTML, CSS, JavaScript, Bootstrap | Others::Git, AWS - Practical hands-on experience through daily assignments' },
  { date_label: 'Aug 2022 - Sept 2022', title: 'Youth Employability Program', company: 'TNS India Foundation', location: 'Mumbai, India', duration_label: 'Training Program | Onsite', description: 'Completed training on soft skills, communication, and professional readiness.', details: '' }
];
const EDUCATION = [
  { date_label: 'Jul 2020 - Jul 2023', title: 'Bachelor of Science in Computer Science', company: 'Shankar Narayan College of Arts & Commerce', location: 'Bhayander, Maharashtra, India', duration_label: '3 Years | CGPA: 9.23/10', description: 'Affiliated to the University of Mumbai. Completed Bachelor of Science in Computer Science with excellent academic performance.', details: 'Relevant Courses::USCS204: Data Structures, USCS303: Operating System, USCS304: Database Management Systems, USCS401: Fundamentals of Algorithm, USCS403: Computer Networks, USCS404: Software Engineering, USCS501: Artificial Intelligence, USCS602: Cloud Computing', institution_url: 'https://sncollege.com/' },
  { date_label: 'Jun 2016 - Jul 2020', title: 'Higher Secondary School', company: 'Divine Providence High School & Jr. College', location: 'Mumbai, India', duration_label: 'Maharashtra State Board | India', description: 'Completed schooling with comprehensive education in Science & Information Technology stream.', details: 'Major Subjects::Science, Mathematics & Information Technology', institution_url: 'https://www.rahuleducation.com/divinejne.html' }
];
const CERTS = [
  ['certificate/Anudip Foundation JavaFullstack.png','Advanced Program on Java Full Stack Development using Angular','Anudip Foundation / Mettl','2024',''],
  ['certificate/TNSFoundation.jpg','Campus to Digital Careers Program (C2DC)','TNS India Foundation / Accenture','2023',''],
  ['certificate/collegeRank.png','Late Pravin Rohidas Patil Award — 2nd Rank (S.Y.C.S.)','Shankar Narayan College','2022',''],
  ['certificate/gwoc.png','GirlScript Winter of Contributing 2021 — Achievement','GirlScript Foundation','2021',''],
  ['certificate/gwoc2.png','GirlScript Winter of Contributing 2021 — Participation','GirlScript Foundation','2021',''],
  ['certificate/jwoc.png','JGEC Winter of Code 2K22 — Mentee','JGEC','2022',''],
  ['certificate/crido_program.jpeg','Crio Winter of Doing 2021 — Web Developer Essentials','Crio.Do','2021',''],
  ['https://udemy-certificate.s3.amazonaws.com/image/UC-0382127f-523a-4c7f-b966-ba33426153be.jpg','Udemy Certificate 1','Udemy','','https://udemy-certificate.s3.amazonaws.com/image/UC-0382127f-523a-4c7f-b966-ba33426153be.jpg'],
  ['https://udemy-certificate.s3.amazonaws.com/image/UC-51b13cf3-54d4-476a-8922-6841ffb80420.jpg','Udemy Certificate 2','Udemy','','https://udemy-certificate.s3.amazonaws.com/image/UC-51b13cf3-54d4-476a-8922-6841ffb80420.jpg'],
  ['https://udemy-certificate.s3.amazonaws.com/image/UC-f44a31cf-9b88-41aa-b599-a625953ef12e.jpg','Udemy Certificate 3','Udemy','','https://udemy-certificate.s3.amazonaws.com/image/UC-f44a31cf-9b88-41aa-b599-a625953ef12e.jpg']
];
const INFO_ICONS = { 'Interest': 'fa-solid fa-lightbulb', 'Skilled': 'fa-solid fa-code', 'Focusing On': 'fa-solid fa-seedling', 'Experience': 'fa-solid fa-briefcase', 'Education': 'fa-solid fa-graduation-cap', 'EMAIL': 'fa-solid fa-envelope', 'ADDRESS': 'fa-solid fa-location-dot' };
const SKILL_ICONS = { Backend: 'fa-solid fa-server', Database: 'fa-solid fa-database', Frontend: 'fa-solid fa-window-maximize', Others: 'fa-solid fa-toolbox', Language: 'fa-solid fa-code', 'AI tools': 'fa-solid fa-microchip' };
const titleCase = (s) => s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s;
const SKILLS_EST = [['Backend','Laravel, PHP'],['Database','MySQL'],['Frontend','JavaScript, ReactJS, Bootstrap, HTML, CSS'],['Others','REST APIs, Git, AWS, Core Java'],['AI tools','Claude Code, ChatGPT, GitHub Copilot']];
const SKILLS_FOCUS = [['Language','Python'],['Backend','Django'],['Frontend','Next.js']];
const PROJECTS = [
  { title: 'LaraBaseX', summary: 'What LaraBaseX Is ? <br> A starter kit for developers who want to skip repetitive setup work and start building features right away.', tech_stack: 'Laravel 12, ReactJS (Vite + Axios), Shadcn UI, MySQL, Tailwind CSS', image_url: 'larabasex.png', github_url: 'https://github.com/ayush-sleeping/LaraBaseX', live_url: '', category: 'Frontend + Backend Development', year: 'Aug 2025' },
  { title: 'WriteOn', summary: 'Create, update, and explore blog posts with a beautiful, responsive UI, rich text editing, and seamless navigation with the power of Firebase.', tech_stack: 'ReactJS, Vite, Firebase, JavaScript, Tailwind CSS, HTML', image_url: 'write_on.png', github_url: 'https://github.com/ayush-sleeping/WriteOn', live_url: 'https://ayush-sleeping.github.io/WriteOn/', category: 'Frontend + Firebase Database', year: 'July 2025' },
  { title: 'DailyBuzz', summary: 'A visually rich, modular news web app built with React and Vite, fetching live news from NewsAPI.org.', tech_stack: 'ReactJS, Vite, NewsAPI, JavaScript, CSS, HTML', image_url: 'daily_buzz.png', github_url: 'https://github.com/ayush-sleeping/DailyBuzz', live_url: '', category: 'Frontend Development', year: 'July 2025' },
  { title: 'Personal Portfolio', summary: 'A responsive portfolio website to showcase my skills and projects as a web developer. Built with modern web technologies and optimized for all devices.', tech_stack: 'JavaScript, CSS, HTML, Bootstrap', image_url: 'portfolio project.png', github_url: 'https://github.com/ayush-sleeping/Personal-Portfolio', live_url: 'https://ayush-sleeping.github.io/Personal-Portfolio/', category: 'Frontend Development', year: 'Jun 2025' },
  { title: 'NFT Ecommerce', summary: 'Complete ecommerce platform offering user authentication, product listings, shopping cart management and order tracking for users, while providing sellers with product management tools.', tech_stack: 'JavaScript, Angular, Bootstrap, CSS, HTML', image_url: '1.2 User homepage.png', github_url: 'https://github.com/ayush-sleeping/NFT-Ecommerce', live_url: '', category: 'Angular CRUD Project', year: 'Oct 2023' },
  { title: 'Brija Stream', summary: 'Streaming platform that combines the best features inspired by Disney+, Prime, Netflix, Hulu, and AppleTV+ with advanced search functionality.', tech_stack: 'JavaScript, CSS, HTML', image_url: '2 .png', github_url: 'https://github.com/ayush-sleeping/Brija-Stream', live_url: 'https://ayush-sleeping.github.io/Brija-Stream/', category: 'Frontend + Search API', year: 'Sep 2023' },
  { title: 'JaBri Travel', summary: 'A beautiful and responsive tour and travel booking website with modern design and smooth user experience for travel enthusiasts.', tech_stack: 'JavaScript, CSS, HTML', image_url: 'jabritravelss.png', github_url: 'https://github.com/ayush-sleeping/JaBri-Travel', live_url: 'https://jabri-travel.netlify.app', category: 'Frontend Development', year: 'Jun 2022' }
];
const SIDE_LIST = () => [
  { id: 'about', label: 'About me' },
  { id: 'career', href: 'experience', label: 'Career', children: [['experience','Experience'],['education','Education'],['certifications','Certifications'],['skills','Skills & Technologies']] },
  { id: 'projects', label: 'Projects', children: PROJECTS.map(p => [slug(p.title), p.title]) },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
  { id: 'faq', label: 'FAQ' }
];
const SPY = () => ['home', ...SIDE_LIST().flatMap(i => i.children ? (i.id === 'projects' ? ['projects', ...i.children.map(c => c[0])] : i.children.map(c => c[0])) : [i.id])];
const SERVICES = [
  ['Full Stack Web Development','fas fa-code','End-to-End Web Applications::From database design to user interface: Laravel + React in production, Django + Next.js for new builds. | Production Experience::2+ years building real-world applications with proper version control and deployment workflows.'],
  ['Current Focus: Django + Next.js','fas fa-seedling',"Python & Django::Building backends with Django's ORM, class-based views, and REST APIs, bringing the same discipline I use in Laravel. | Next.js::Server-side rendering, file-based routing, and faster first loads for React frontends."],
  ['Backend Development','fas fa-server','Laravel & PHP::MVC architecture, Eloquent ORM, and middleware for robust server-side applications in production. | RESTful API Development::Creating scalable APIs with proper authentication, validation, and error handling.'],
  ['Frontend Development','fas fa-palette','Responsive Design::Mobile-first approach ensuring optimal user experience across all devices and screen sizes. | Interactive JavaScript & React::Dynamic user interfaces with React and modern ES6+ features.'],
  ['Backend System Design & AI-Assisted Development','fas fa-sitemap','System Design::Planning architecture, data models, and API contracts before writing code, so the system scales and stays maintainable. | AI-Assisted Development::Using Claude Code to speed up implementation, with every change reviewed, tested, and understood before it ships.'],
  ['Production & Team Skills','fas fa-tools','Git Workflows & Collaboration::Experience with branching strategies, code reviews, and team-based development. | AWS Deployment & Debugging::Cloud hosting, server management, and real-time troubleshooting for production apps.']
];
const FAQS = [
  ['What technologies do you specialize in?','I specialize in full-stack web development with <strong>Laravel</strong> for backend, <strong>JavaScript/ReactJS</strong> for frontend, and <strong>MySQL</strong> for databases. I also have experience with Git, AWS, Bootstrap, and modern web development practices.'],
  ['How long does a typical project take?','Project timelines vary based on complexity. A simple website takes <strong>1-2 weeks</strong>, while complex web applications can take <strong>4-8 weeks</strong>. I always provide detailed timelines during project planning and keep you updated throughout development.'],
  ['Do you work on both frontend and backend?',"Yes! I'm a <strong>full-stack developer</strong> with 2+ years of production experience. I can handle everything from database design and API development to responsive UI/UX implementation, giving you a complete solution from a single developer."],
  ["What's your development process like?",'I follow a structured approach: <strong>1) Requirements gathering</strong>, <strong>2) Planning & design</strong>, <strong>3) Development with regular updates</strong>, <strong>4) Testing & debugging</strong>, and <strong>5) Deployment & support</strong>. I use Git for version control and provide regular progress updates.'],
  ['Are you available for remote work?',"Absolutely! I'm based in <strong>Mumbai, India</strong> and work with clients globally. I'm comfortable with remote collaboration using tools like Slack, Zoom, and project management platforms. I can adapt to different time zones for meetings and communication."],
  ['Do you provide ongoing support after project completion?','Yes, I provide <strong>post-deployment support</strong> including bug fixes, minor updates, and guidance on using your new application. I also offer ongoing maintenance packages for regular updates, security patches, and feature enhancements.']
];
const FOOTER_TECH = [['Laravel Php Framework','fab fa-laravel'],['JavaScript','fab fa-js'],['ReactJS Library','fab fa-react'],['MySQL Database','fa-solid fa-database'],['Tailwind CSS','fa-solid fa-wind'],['Bootstrap','fab fa-bootstrap'],['HTML5','fab fa-html5'],['CSS3','fab fa-css3-alt'],['PHP','fab fa-php'],['Git','fab fa-git-alt'],['Python','fab fa-python']];

class Component extends DCLogic {
  state = { menuOpen: false, scrolled: false, active: 'home', activeItem: 'home', open: {}, openFaq: -1, certIdx: -1, drawer: false, toTop: false, kOpen: false, kQuery: '', kSel: 0, toast: '', status: { text: '', cls: '' } };

  certRef = React.createRef();
  componentDidMount() {
    this._onKey = (e) => {
      const key = (e.key || '').toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === 'k') { e.preventDefault(); this.state.kOpen ? this.closeK() : this.openK(); return; }
      const typing = /input|textarea|select/i.test(e.target.tagName || '') || e.target.isContentEditable;
      if (!this.state.kOpen && e.key === '/' && !typing) { e.preventDefault(); this.openK(); return; }
      if (this.state.kOpen) {
        const n = this._kFiltered().length;
        if (e.key === 'Escape') { e.preventDefault(); this.closeK(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); this.setState(s => ({ kSel: n ? (s.kSel + 1) % n : 0 })); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); this.setState(s => ({ kSel: n ? (s.kSel - 1 + n) % n : 0 })); }
        else if (e.key === 'Enter') { const it = this._kFiltered()[this.state.kSel]; if (it) { e.preventDefault(); this.runK(it); } }
        return;
      }
      if (e.key === 'Escape' && this.state.drawer) { this.setDrawer(false); return; }
      if (this.state.certIdx < 0) return;
      if (e.key === 'Escape') this.setCert(-1);
      else if (e.key === 'ArrowRight') this.stepCert(1);
      else if (e.key === 'ArrowLeft') this.stepCert(-1);
    };
    window.addEventListener('keydown', this._onKey);
    this._onDocClick = (e) => { const t = e.target.closest && e.target.closest('[data-h2]'); if (!t) return; const sec = t.closest('section[id]'); if (!sec) return;
      try { history.replaceState(null, '', '#' + sec.id); } catch (_) {}
      this._copy(location.href.split('#')[0] + '#' + sec.id, 'Link to section copied'); };
    document.addEventListener('click', this._onDocClick);
    if (!window.__aySaid) { window.__aySaid = true; console.log('%c ayushSleeping ', 'background:#5B78F6;color:#fff;font:700 13px monospace;padding:4px 8px;border-radius:4px', '\n\nHey, fellow developer. Thanks for looking under the hood.\nPress ⌘K / Ctrl K on the page to search everything.\n\nCode   → https://github.com/ayush-sleeping\nEmail  → ayushbm84@gmail.com'); }
    this._initMotion();
    this._mq = window.matchMedia('(min-width: 1024px)');
    this._onMq = () => { if (this._mq.matches && this.state.drawer) this.setDrawer(false); };
    this._mq.addEventListener('change', this._onMq);
    this._onScroll = () => {
      const scrolled = window.scrollY > 0;
      let active = 'home';
      for (const [id] of NAV) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= 120) active = id; }
      let activeItem = 'home';
      const spy = SPY();
      for (const id of spy) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= 140) activeItem = id; }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) activeItem = spy[spy.length - 1];
      if (scrolled !== this.state.scrolled || active !== this.state.active || activeItem !== this.state.activeItem) this.setState({ scrolled, active, activeItem });
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();

  }
  _initMotion() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bar = document.querySelector('[data-progress]');
    const ring = document.querySelector('[data-ring]');
    this._onProg = () => { const max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, scrollY / max) : 0;
      if (bar) bar.style.transform = 'scaleX(' + p + ')';
      if (ring) ring.style.strokeDashoffset = String(150.8 * (1 - p));
      const show = scrollY > innerHeight * 0.6; if (show !== this.state.toTop) this.setState({ toTop: show }); };
    window.addEventListener('scroll', this._onProg, { passive: true }); this._onProg();
    this._onMove = (e) => { const c = e.target.closest && e.target.closest('[data-card]'); if (!c) return; const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); };
    document.addEventListener('pointermove', this._onMove, { passive: true });
    this._placeInd();
    this._onResize = () => this._placeInd(); window.addEventListener('resize', this._onResize);
    if (reduce || !('IntersectionObserver' in window)) return;
    const count = (el) => { const m = el.textContent.match(/^(\d+)(\+?)$/); if (!m) return; const end = +m[1], pad = m[1].length, t0 = performance.now(), dur = 1200;
      const step = (t) => { const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3))); el.textContent = String(v).padStart(pad, '0') + m[2]; if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]=+*#';
    const scramble = (t) => { if (t.children.length || t.hasAttribute('data-sx')) return; t.setAttribute('data-sx', ''); const fin = t.textContent, L = fin.length, t0 = performance.now(), dur = 650;
      const step = (now) => { const p = Math.min(1, (now - t0) / dur), n = Math.floor(p * L); let s = fin.slice(0, n); for (let i = n; i < L; i++) s += fin[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]; t.textContent = p < 1 ? s : fin; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); };
    const show = (el) => { if (el.hasAttribute('data-in')) return; el.setAttribute('data-in', ''); if (this._io) this._io.unobserve(el);
      const hh = el.querySelector && el.querySelector('[data-h2]'); if (hh) scramble(hh);
      if (el.hasAttribute('data-stats')) el.querySelectorAll('span').forEach(s => { if (/^\d+\+?$/.test(s.textContent.trim())) count(s); }); };
    this._io = new IntersectionObserver((ents) => { this._ioFired = true; ents.forEach(en => { if (en.isIntersecting) show(en.target); }); }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    const pending = () => document.querySelectorAll('[data-reveal]:not([data-in]), [data-exp-row]:not([data-in])');
    this._onRevealCheck = () => { const vh = innerHeight; pending().forEach(el => { const r = el.getBoundingClientRect(); if (r.top < vh - 40 && r.bottom > 0) show(el); }); };
    const tag = (el, d) => { if (el.hasAttribute('data-reveal')) return; el.setAttribute('data-reveal', ''); if (d) el.style.setProperty('--d', d + 'ms'); this._io.observe(el); };
    document.querySelectorAll('[data-bento-wrap] > div > *').forEach((el, i) => tag(el, 120 + i * 60));
    document.querySelectorAll('[data-doc] > div').forEach(el => tag(el, 0));
    document.querySelectorAll('[data-exp-row]').forEach(el => this._io.observe(el));
    document.querySelectorAll('main [data-reveal]').forEach(sec => { let i = 0; sec.querySelectorAll('span').forEach(s => { const st = s.style; if (st.borderRadius === '999px' && !s.closest('[data-stats]') && !s.querySelector('span')) { s.setAttribute('data-chip', ''); st.transitionDelay = Math.min(i++ * 30, 600) + 200 + 'ms'; } }); });
    this._onRevealCheck();
    window.addEventListener('scroll', this._onRevealCheck, { passive: true });
    window.addEventListener('resize', this._onRevealCheck);
    this._rv = setTimeout(() => { if (!this._ioFired) pending().forEach(show); }, 2500);
    const tgt = document.querySelector('[data-type]');
    if (tgt) { const full = tgt.textContent; tgt.textContent = ''; let k = 0; const tick = () => { tgt.textContent = full.slice(0, ++k); if (k < full.length) this._tt = setTimeout(tick, full[k - 1] === ' ' ? 70 : 38); }; this._tt = setTimeout(tick, 650); }
  }
  _placeInd() {
    const aside = document.querySelector('aside[data-i~="side"]'); if (!aside) return;
    const row = aside.querySelector('[data-row][data-active="true"]');
    const sc = (row && row.closest('[data-scroll]')) || (row && row.parentElement && row.parentElement.closest('nav')) || aside;
    if (getComputedStyle(sc).position === 'static') sc.style.position = 'relative';
    let ind = sc.querySelector(':scope > [data-ind]');
    if (!ind) { ind = document.createElement('div'); ind.setAttribute('data-ind', ''); sc.prepend(ind); aside.setAttribute('data-has-ind', ''); }
    aside.querySelectorAll('[data-ind]').forEach(o => { if (o !== ind) o.style.opacity = '0'; });
    if (!row) { ind.style.opacity = '0'; return; }
    const top = row.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
    const pl = row.getBoundingClientRect().left - sc.getBoundingClientRect().left;
    ind.style.opacity = '1'; ind.style.left = pl + 'px'; ind.style.right = 'auto'; ind.style.width = row.offsetWidth + 'px';
    ind.style.height = row.offsetHeight + 'px'; ind.style.transform = 'translateY(' + top + 'px)'; ind.style.top = '0';
  }
  componentDidUpdate() { this._kScroll(); this._placeInd(); clearTimeout(this._pi); this._pi = setTimeout(() => this._placeInd(), 220); }
  _kAll() {
    const sec = [['home','Overview'],['about','About me'],['experience','Experience'],['education','Education'],['certifications','Certifications'],['skills','Skills & Technologies'],['projects','Projects'],['services','Services'],['contact','Contact'],['faq','FAQ']];
    const go = (id) => () => { const el = document.getElementById(id); if (!el) return; const off = parseFloat(getComputedStyle(el).scrollMarginTop) || 0; const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - off, behavior: reduce ? 'auto' : 'smooth' }); };
    const open = (u) => () => window.open(u, '_blank', 'noopener');
    return [
      ...sec.map(([id, label]) => ({ group: 'Sections', label, hint: '#' + id, icon: 'fa-solid fa-hashtag', act: go(id) })),
      ...PROJECTS.map(p => ({ group: 'Projects', label: p.title, hint: p.category, icon: 'fa-regular fa-folder', act: go(slug(p.title)) })),
      { group: 'Actions', label: 'Copy email address', hint: 'ayushbm84@gmail.com', icon: 'fa-regular fa-copy', act: () => this._copy('ayushbm84@gmail.com', 'Email copied') },
      { group: 'Actions', label: 'Download resume', hint: 'PDF', icon: 'fa-solid fa-file-arrow-down', act: () => window.print() },
      { group: 'Actions', label: 'Open GitHub', hint: 'ayush-sleeping', icon: 'fa-brands fa-github', act: open('https://github.com/ayush-sleeping') },
      { group: 'Actions', label: 'Open LinkedIn', hint: 'ayush-bm', icon: 'fa-brands fa-linkedin-in', act: open('https://www.linkedin.com/in/ayush-bm/') },
      { group: 'Actions', label: 'Open Twitter / X', hint: '@AyushBM1', icon: 'fa-brands fa-x-twitter', act: open('https://twitter.com/AyushBM1') }
    ];
  }
  _kFiltered() { const q = this.state.kQuery.trim().toLowerCase(); const all = this._kAll(); if (!q) return all; return all.filter(i => (i.label + ' ' + i.hint + ' ' + i.group).toLowerCase().includes(q)); }
  openK() { this.setState({ kOpen: true, kQuery: '', kSel: 0, drawer: false }); document.body.style.overflow = 'hidden'; }
  closeK() { this.setState({ kOpen: false }); document.body.style.overflow = ''; }
  runK(it) { this.closeK(); setTimeout(it.act, 40); }
  _toast(msg) { this.setState({ toast: msg }); clearTimeout(this._tst); this._tst = setTimeout(() => this.setState({ toast: '' }), 1800); }
  _copy(text, msg) {
    const done = () => this._toast(msg);
    const fallback = () => { const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (_) { this._toast(text); } ta.remove(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }
  _kScroll() { if (!this.state.kOpen) return; const list = document.querySelector('[data-k-list]'); const sel = list && list.querySelector('[data-k-item][data-sel="true"]'); if (!sel) return;
    const t = sel.offsetTop, b = t + sel.offsetHeight; if (t < list.scrollTop + 8) list.scrollTop = t - 36; else if (b > list.scrollTop + list.clientHeight - 8) list.scrollTop = b - list.clientHeight + 8; }
  setDrawer(v) { this.setState({ drawer: v }); document.body.style.overflow = v ? 'hidden' : ''; }
  setCert(i) { this.setState({ certIdx: i }); document.body.style.overflow = i < 0 ? '' : 'hidden'; }
  stepCert(d) { const n = CERTS.length; this.setCert((this.state.certIdx + d + n) % n); }
  componentWillUnmount() { document.removeEventListener('click', this._onDocClick); clearTimeout(this._tst); clearTimeout(this._rv); if (this._onRevealCheck) { window.removeEventListener('scroll', this._onRevealCheck); window.removeEventListener('resize', this._onRevealCheck); } window.removeEventListener('scroll', this._onProg); window.removeEventListener('resize', this._onResize); document.removeEventListener('pointermove', this._onMove); if (this._io) this._io.disconnect(); clearTimeout(this._tt); clearTimeout(this._pi); if (this._mq) this._mq.removeEventListener('change', this._onMq); window.removeEventListener('keydown', this._onKey); document.body.style.overflow = ''; window.removeEventListener('scroll', this._onScroll); clearTimeout(this._t); clearTimeout(this._st); }

  renderVals() {
    const s = this.state;
    return {
      menuCls: s.menuOpen ? 'open' : '',
      hamCls: s.menuOpen ? 'is-active' : '',
      headerCls: s.scrolled ? 'active' : '',
      toggleMenu: () => this.setState(p => ({ menuOpen: !p.menuOpen })),
      onMenuClick: (e) => { if (e.target.closest && e.target.closest("a[href^='#']")) this.setState({ menuOpen: false }); },
      nav: NAV.map(([id, label]) => ({ href: '#' + id, label, cls: id === s.active ? 'active' : '' })),
      socials: SOCIALS,
      overviewActive: String(s.activeItem === 'home'),
      sideList: SIDE_LIST().map(it => {
        const kids = it.children || [];
        const inside = kids.some(c => c[0] === s.activeItem) || (it.id === 'projects' && s.activeItem === 'projects');
        const open = kids.length ? (s.open[it.id] ?? true) : false;
        return {
          label: it.label, href: '#' + (it.href || it.id), hasChildren: kids.length > 0, count: kids.length ? String(kids.length) : '', open,
          active: kids.length ? (inside ? 'parent' : 'false') : String(s.activeItem === it.id),
          toggle: kids.length ? (e) => { e.preventDefault(); e.stopPropagation(); this.setState(p => ({ open: { ...p.open, [it.id]: !open } })); } : undefined,
          children: kids.map(([id, label]) => ({ href: '#' + id, label, active: String(s.activeItem === id) }))
        };
      }),
      marquee: [...MARQUEE, ...MARQUEE],
      infoItems: pairs(INFO).map(r => ({ label: titleCase(r.label), value: r.value, icon: INFO_ICONS[r.label] || 'fa-solid fa-circle-info' })),
      training: EXPERIENCE.slice(3).map(e => ({ ...e, stack: pairs(e.details).flatMap(d => d.value.split(' - ')[0].split(/\s*[,+]\s*/)).filter(Boolean).join(' · ') })),
      experience: EXPERIENCE.slice(0, 3).map((e, i) => ({ ...e, current: i === 0, hasDetails: !!e.details, groups: pairs(e.details).map(d => ({ label: d.label, chips: d.value.split(' - ')[0].split(/\s*[,+]\s*/).filter(Boolean) })) })),
      education: EDUCATION.map(e => ({ ...e, details: pairs(e.details).map(d => ({ ...d, items: d.value.split(/\s*,\s*|\s+&\s+/).filter(Boolean).map(x => { const m = x.match(/^([A-Z]{2,}\d+)\s*:\s*(.+)$/); return m ? { code: m[1], name: m[2] } : { code: '', name: x }; }) })) })),
      certs: CERTS.map(([img, title, issuer, year, href], i) => ({ img: webp(img), alt: title, title, meta: year ? issuer + ' · ' + year : issuer, href: href || webp(img), open: (e) => { e.preventDefault(); this.setCert(i); } })),
      certOpen: this.state.certIdx >= 0,
      certImgRef: (el) => { const c = CERTS[this.state.certIdx]; if (el && c) { const u = webp(c[0]); if (el.getAttribute('src') !== u) el.setAttribute('src', u); } },
      kOpen: this.state.kOpen,
      kQuery: this.state.kQuery,
      kbdHint: /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K',
      openK: () => this.openK(),
      closeK: () => this.closeK(),
      onKQuery: (e) => this.setState({ kQuery: e.target.value, kSel: 0 }),
      kInputRef: (el) => { if (el && document.activeElement !== el) setTimeout(() => el.focus(), 0); },
      ...(() => { const f = this._kFiltered(); const groups = []; f.forEach((it, i) => { let g = groups.find(x => x.label === it.group); if (!g) { g = { label: it.group, items: [] }; groups.push(g); }
        g.items.push({ label: it.label, hint: it.hint, icon: it.icon, sel: String(i === this.state.kSel), run: () => this.runK(it), hover: () => { if (this.state.kSel !== i) this.setState({ kSel: i }); } }); });
        return { kGroups: groups, kEmpty: f.length === 0 }; })(),
      toTopShow: String(!!this.state.toTop && !this.state.drawer),
      toTop: () => { const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {} },
      toastOn: !!this.state.toast,
      toastText: this.state.toast,
      drawerOpenStr: String(this.state.drawer),
      drawerIcon: this.state.drawer ? 'fa-solid fa-xmark' : 'fa-solid fa-bars',
      toggleDrawer: () => this.setDrawer(!this.state.drawer),
      closeDrawer: () => this.setDrawer(false),
      onDrawerClick: (e) => { const a = e.target.closest && e.target.closest('a[href]'); if (a && this.state.drawer && !a.hasAttribute('data-keep')) this.setDrawer(false); },
      cert: (() => { const c = CERTS[this.state.certIdx]; if (!c) return {}; const [img, title, issuer, year] = c; return { img: webp(img), alt: title, title, meta: year ? issuer + ' · ' + year : issuer }; })(),
      certPos: (this.state.certIdx + 1) + ' / ' + CERTS.length,
      closeCert: () => this.setCert(-1),
      stop: (e) => e.stopPropagation(),
      certPrevOne: () => this.stepCert(-1),
      certNextOne: () => this.stepCert(1),
      certPrev: () => { const el = this.certRef.current; if (el) el.scrollBy({ left: -el.clientWidth * 0.8, behavior: 'smooth' }); },
      certNext: () => { const el = this.certRef.current; if (el) el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' }); },
      certRef: this.certRef,
      skillsEst: SKILLS_EST.map(([category, name]) => ({ category, name, icon: SKILL_ICONS[category] })),
      skillsFocus: SKILLS_FOCUS.map(([category, name]) => ({ category, name, icon: SKILL_ICONS[category] })),
      projects: PROJECTS.map(p => ({ ...p, anchor: slug(p.title), img: webp(p.image_url), summaryText: p.summary.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim(), tags: p.tech_stack.split(',').map(t => t.trim()), live_url: p.live_url || '' })),
      footerProjects: PROJECTS.slice(0, 5).map(p => ({ title: p.title, href: '#' + slug(p.title) })),
      services: SERVICES.map(([title, icon, bp]) => ({ title, icon, features: pairs(bp) })),
      contactItems: [
        { label: 'Email', value: 'ayushbm84@gmail.com', icon: 'fa-solid fa-envelope', href: 'mailto:ayushbm84@gmail.com', target: '_self' },
        { label: 'Location', value: 'Mumbai, Maharashtra, India', icon: 'fa-solid fa-location-dot', href: '#contact', target: '_self' },
        { label: 'GitHub', value: 'github.com/ayush-sleeping', icon: 'fab fa-github', href: 'https://github.com/ayush-sleeping', target: '_blank' },
        { label: 'LinkedIn', value: 'linkedin.com/in/ayush-bm', icon: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/in/ayush-bm/', target: '_blank' },
        { label: 'Twitter', value: '@AyushBM1', icon: 'fab fa-twitter', href: 'https://twitter.com/AyushBM1', target: '_blank' }
      ],
      faqs: FAQS.map(([question, answer], i) => ({
        question,
        isOpen: s.openFaq === i,
        expanded: String(s.openFaq === i),
        toggle: () => this.setState(p => ({ openFaq: p.openFaq === i ? -1 : i })),
        answerEl: React.createElement('p', { style: { margin: 0, fontFamily: "'Roboto', sans-serif" }, dangerouslySetInnerHTML: { __html: answer } })
      })),
      footerTech: FOOTER_TECH.map(([tooltip, icon_class]) => ({ tooltip, icon_class })),
      statusText: s.status.text,
      statusCls: s.status.cls,
      statusColor: s.status.cls === 'color-dark' ? '#f87171' : s.status.cls === 'color-light' ? '#4ade80' : '#8a8a8a',
      printResume: (e) => { if (e && e.preventDefault) e.preventDefault(); window.print(); },
      onSubmit: (e) => {
        e.preventDefault();
        const f = e.currentTarget;
        if (!f.name.value || !f.email.value || !f.message.value) { this.setState({ status: { text: 'Please fill in all fields.', cls: 'color-dark' } }); return; }
        this.setState({ status: { text: 'Message successfully sent ✔', cls: 'color-light' } });
        f.reset();
        clearTimeout(this._st);
        this._st = setTimeout(() => this.setState({ status: { text: '', cls: '' } }), 5000);
      }
    };
  }
}
