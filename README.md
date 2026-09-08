# Personal Portfolio

[**➥ Live Demo**](https://ayush-sleeping.github.io/Personal-Portfolio/)

<br>

## Table of Contents
- [About the Project](#about-the-project)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Design Inspiration & UI](#design-inspiration--ui)
- [Color Palette](#color-palette)
- [What I Learned](#what-i-learned)
- [License](#license)

<br>

## About the Project

This is a personal portfolio website to showcase my background, skills, projects, and resume. It serves as my online identity and demonstrates my expertise as a FullStack Web Developer — currently working as a **Backend Developer at Leapswitch Networks**, with 2+ years of experience building scalable web applications and REST APIs using Laravel, PHP, and MySQL, and actively working with **Python, Django, and Next.js**.

Visitors can explore my work, view my professional resume, browse the services I offer, and contact me directly through the site.

<div align="right">
  <a href="#personal-portfolio"><strong>↗️ Tap to top</strong></a>
</div>

<br>

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — hero intro, role marquee, quick stats, and navigation cards |
| `about.html` | About — bio, experience timeline, education, skills, and certifications |
| `resume.html` | Resume — condensed experience, education, and skills (print-friendly) |
| `project.html` | Projects — showcase grid of selected work |
| `services.html` | Services — full-stack, backend, frontend, and production offerings |
| `contact.html` | Contact — EmailJS-powered form, contact details, and FAQ |

<div align="right">
  <a href="#personal-portfolio"><strong>↗️ Tap to top</strong></a>
</div>

<br>

## Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript** (vanilla ES6+)
- **Bootstrap 5**
- **EmailJS** (contact form handling)
- **GitHub Pages** (hosting)

<div align="right">
  <a href="#personal-portfolio"><strong>↗️ Tap to top</strong></a>
</div>

<br>

## Features

- **Glassmorphic dark UI** with gradient accents and layered shadows
- **Fully responsive** — mobile-first, with a slide-in side navigation
- **Animated preloader**, slide-reveal page transitions, and scroll-triggered animations
- **Interactive cards** with a mouse-tracking spotlight effect and a looping role marquee
- **EmailJS-powered contact form** with client-side validation
- **SEO-optimized** — meta tags, Open Graph, Twitter cards, and JSON-LD structured data

<div align="right">
  <a href="#personal-portfolio"><strong>↗️ Tap to top</strong></a>
</div>

<br>

## Folder Structure

```
Personal-Portfolio/
│
├── about.html
├── contact.html
├── index.html
├── project.html
├── resume.html
├── services.html
├── README.md
│
├── documentation/
│   ├── docx.md
│   └── improvements-and-system-design.md
│
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── img/
│   │   └── [all images and icons]
│   └── js/
│       ├── contactform.js
│       ├── main.js
│       ├── preloader.js
│       └── scroll-animations.js
```

- **HTML files**: Each main section/page of the portfolio.
- **assets/css/style.css**: All custom styles and responsive design.
- **assets/js/**: JavaScript for interactivity, animations, and form handling.
- **assets/img/**: All images, icons, and graphics.

<div align="right">
  <a href="#personal-portfolio"><strong>↗️ Tap to top</strong></a>
</div>

<br>

## Design Inspiration & UI

The primary card design and overall layout are inspired by the [GridX Portfolio Template](https://wpriverthemes.com/gridx/).
I focused on a clean, modern, and classic look with glassmorphism effects, subtle gradients, and smooth animations.
The project features:
- **Primary card system** for sections and projects
- **Responsive design** for all devices
- **Minimal, elegant navigation**
- **Animated scroll effects** for engaging user experience

<div align="right">
  <a href="#personal-portfolio"><strong>↗️ Tap to top</strong></a>
</div>

<br>

## Color Palette

| Color Name      | Hex       | Usage                        |
|-----------------|-----------|------------------------------|
| Primary Blue    | `#5B78F6` | Buttons, highlights, links   |
| Deep Purple     | `#9333EA` | Gradients, accents           |
| Dark Background | `#0F0F0F` | Main background              |
| Card BG         | `#1a1a1a` | Card backgrounds             |
| Light Gray      | `#BCBCBC` | Text, icons                  |
| Accent Gray     | `#9CA3AF` | Subtext, muted elements      |

<div align="right">
  <a href="#personal-portfolio"><strong>↗️ Tap to top</strong></a>
</div>

<br>

## What I Learned

Working on this project helped me:
- Deepen my understanding of **responsive web design**
- Master **CSS animations** and **glassmorphism** effects
- Implement **Intersection Observer** for scroll-based animations
- Optimize for **performance** and **mobile UX**
- Integrate **EmailJS** for contact form handling
- Structure a real-world project for scalability and maintainability

<div align="right">
  <a href="#personal-portfolio"><strong>↗️ Tap to top</strong></a>
</div>

<br>

## License

This project is for personal use and inspiration.
**No external contributions are accepted.**

<div align="right">
  <a href="#personal-portfolio"><strong>↗️ Tap to top</strong></a>
</div>

<br>

> _Designed & developed by Ayush Mishra_
> _Inspired by GridX Portfolio Template_

## Updating content (Google Sheets CMS)

Most page content — projects, experience, education, skills, certifications,
services, FAQs — is no longer hardcoded in the HTML. It lives in a Google Sheet
named `portfolio-cms` and reaches the site as JSON in `assets/data/`.

**To change content:** edit the cell in the sheet, then either wait up to 6
hours for the cron, or click **Actions → "Refresh content from Google Sheet" →
Run workflow** for an immediate update. No code change, no deploy.

The browser never calls Google. A GitHub Action reads the sheet, validates it,
and commits plain JSON that ships on the Pages CDN — so page loads stay as fast
as a static site, there is no API quota to hit, and no key is exposed.

Setup instructions: [`sheets/SETUP.md`](sheets/SETUP.md).
Design rationale: [`documentation/improvements-and-system-design.md`](documentation/improvements-and-system-design.md) §B9–B22.
