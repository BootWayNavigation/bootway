#!/usr/bin/env python3
"""One-shot generator for BootWay guide HTML pages (same chrome as service pages)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public"
GUIDES = ROOT / "guides"

HEADER = '''  <header class="site-header is-scrolled" role="banner">
    <div class="header-inner">
      <a href="/" class="brand-link" aria-label="BootWay Home">
        <img src="../assets/images/logo/logo-w-re.png" alt="BootWay" width="150" height="40" />
      </a>
      <nav aria-label="Primary">
        <ul class="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/hospital-navigation">Hospitals</a></li>
          <li><a href="/universities">Campuses</a></li>
          <li><a href="/virtual-tours">Virtual tours</a></li>
          <li><a href="/guides" aria-current="page">Guides</a></li>
          <li><a href="/certifications">Certifications</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      </nav>
      <a class="btn btn-primary nav-cta" href="/contact">Talk to us</a>
      <button class="menu-toggle" id="menuToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobileNav" aria-label="Mobile">
      <a href="/">Home</a>
      <a href="/hospital-navigation">Hospitals</a>
      <a href="/universities">Campuses</a>
      <a href="/virtual-tours">Virtual tours</a>
      <a href="/guides" aria-current="page">Guides</a>
      <a href="/certifications">Certifications</a>
      <a href="/contact">Contact Us</a>
      <a class="btn btn-primary mobile-nav-cta" href="/contact">Talk to our team</a>
    </nav>
  </header>'''

FOOTER = '''  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" aria-label="BootWay Home">
            <img src="../assets/images/logo/logo-b-re.png" alt="BootWay" width="160" height="40" loading="lazy" />
          </a>
          <p>BootWay gives hospitals turn-by-turn indoor directions that open from a QR code: no app, no beacons, in the visitor's language.</p>
        </div>
        <div class="footer-col">
          <h4>About Us</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/hospital-navigation">Hospitals</a></li>
            <li><a href="/universities">Campuses</a></li>
            <li><a href="/virtual-tours">Virtual tours</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/guides">Guides</a></li>
            <li><a href="/press">Press</a></li>
            <li><a href="/certifications">Certifications</a></li>
            <li><a href="/research">Research</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/policy">Privacy policy</a></li>
            <li><a href="/terms">Terms of service</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="mailto:support@bootway.in">support@bootway.in</a></li>
            <li><a href="tel:+917976866822">+91 7976866822</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span><a href="/policy">Privacy</a> · <a href="/terms">Terms</a></span>
        <p>&copy; <span id="year"></span> BootWay iNaaS Private Limited</p>
      </div>
    </div>
  </footer>
  <script>
    document.getElementById("year").textContent = new Date().getFullYear();
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
    });
  </script>'''


def wrap(title, description, canonical, headline, body_html, date_modified="2026-11-13"):
    schema = f'''  {{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{headline}",
    "description": "{description}",
    "author": {{ "@type": "Organization", "name": "BootWay" }},
    "publisher": {{
      "@type": "Organization",
      "name": "BootWay",
      "url": "https://www.bootway.in/"
    }},
    "mainEntityOfPage": "{canonical}",
    "datePublished": "{date_modified}",
    "dateModified": "{date_modified}"
  }}'''
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="author" content="BootWay iNaaS Private Limited" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="BootWay" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:image" content="https://www.bootway.in/assets/images/product/app-navigate.png" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:locale" content="en_IN" />
  <link rel="icon" type="image/png" sizes="32x32" href="../assets/images/logo/favicon.png" />
  <link rel="apple-touch-icon" href="../assets/images/logo/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/site.css" />
  <script type="application/ld+json">
{schema}
  </script>
  <script src="../assets/js/clean-url.js"></script>
</head>
<body>
{HEADER}
  <main>
{body_html}
  </main>
{FOOTER}
</body>
</html>
'''


# --- Hub index (uses ../ assets too when served from /guides/index.html) ---
INDEX_HEADER = HEADER  # same

index_body = '''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Guides</span>
        <h1>Indoor navigation guides for hospitals and campuses</h1>
        <p class="lead">
          Practical articles on wayfinding in Indian hospitals and campuses — written for administrators,
          facilities teams, and patient-experience leads. Not sales blurbs: decisions, trade-offs, and checklists.
        </p>
      </div>
    </section>
    <section class="section" style="padding-top: 1rem;">
      <div class="container content-prose">
        <p>
          BootWay publishes these guides so teams can plan indoor navigation with clear criteria. For product details,
          see <a href="/hospital-navigation">hospital navigation</a>, <a href="/universities">campus navigation</a>,
          and <a href="/virtual-tours">virtual tours</a>. For cited studies, see <a href="/research">research</a>.
        </p>
        <article class="research-finding">
          <h2><a href="/guides/hospital-wayfinding-india">Hospital wayfinding in India: why patients get lost</a></h2>
          <p>How multi-floor OPDs, language mix, and changing layouts create confusion — and what administrators can measure before buying technology.</p>
        </article>
        <article class="research-finding">
          <h2><a href="/guides/qr-vs-beacon-navigation">QR browser navigation vs beacons and apps</a></h2>
          <p>A practical comparison of hardware, maintenance, visitor friction, and update speed for Indian facilities.</p>
        </article>
        <article class="research-finding">
          <h2><a href="/guides/campus-navigation-open-days">Campus navigation for open days and new students</a></h2>
          <p>How universities and medical colleges reduce “where is the hall?” questions during admissions and events.</p>
        </article>
        <article class="research-finding">
          <h2><a href="/guides/accessible-indoor-navigation">Accessible indoor navigation and PwD-friendly routes</a></h2>
          <p>What step-free routing, lifts, and plain-language destinations mean for inclusive hospital and campus visits.</p>
        </article>
        <article class="research-finding">
          <h2><a href="/guides/virtual-tour-for-hospitals">When hospitals need a 360° virtual tour</a></h2>
          <p>Use cases for admissions, orientation, and remote familiarisation — and how tours complement live wayfinding.</p>
        </article>
        <div class="cta-row">
          <a class="btn btn-primary" href="/contact">Talk to BootWay</a>
          <a class="btn btn-secondary" href="/research">Research summary</a>
        </div>
      </div>
    </section>'''

(GUIDES / "index.html").write_text(
    wrap(
        "Indoor Navigation Guides | BootWay",
        "Practical guides on hospital and campus wayfinding in India: QR vs beacons, accessibility, open days, and virtual tours.",
        "https://www.bootway.in/guides",
        "Indoor navigation guides for hospitals and campuses",
        index_body,
    ).replace('"@type": "Article"', '"@type": "CollectionPage"'),
    encoding="utf-8",
)

articles = []

articles.append((
    "hospital-wayfinding-india.html",
    "Hospital Wayfinding in India: Why Patients Get Lost | BootWay",
    "Why patients and attendants get lost in Indian hospitals, what to audit before buying digital navigation, and how QR-based routes help.",
    "https://www.bootway.in/guides/hospital-wayfinding-india",
    "Hospital wayfinding in India: why patients get lost",
    '''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Guide · Hospitals</span>
        <h1>Hospital wayfinding in India: why patients get lost</h1>
        <p class="lead">A practical look at multi-floor OPDs, language mix, and changing layouts — written for administrators planning digital indoor navigation.</p>
      </div>
    </section>
    <section class="section" style="padding-top: 1rem;">
      <div class="container content-prose">
        <p>Ask any Indian hospital receptionist what they repeat most often and you will hear directions: “Third floor, left after the lift, past the pharmacy.” Getting lost is not a soft complaint. It raises anxiety for patients and attendants, delays appointments, and pulls clinical and support staff into unpaid tour-guide work. This guide explains why the problem is structural in many Indian hospitals, what to measure before you buy a system, and how <a href="/hospital-navigation">QR-based hospital navigation</a> fits beside signage.</p>

        <h2>Why Indian hospitals are hard to navigate</h2>
        <p>Public and private hospitals in India often grow by accretion. New wings, temporary OPDs, and rebranded departments appear faster than directories can be reprinted. Corridors look similar across floors. Landmarks that staff use (“near the old canteen”) mean nothing to a first-time attendant from another district. Elevators dump visitors into lobbies that do not match the map they were given at the gate.</p>
        <p>Language compounds the issue. English-only boards exclude many visitors. Hindi helps in North India but not every patient reads Devanagari comfortably, and specialist names (nephrology, endoscopy) are jargon even when transliterated. Elderly patients and people with low literacy need plain destination names and fewer decision points.</p>
        <p>Volume matters. Peak OPD hours concentrate thousands of people into the same choke points. When someone hesitates at a junction, the queue behind them grows. Staff interruptions for directions are a recurring cost that rarely appears on a budget line — but every nurse and security guard feels it.</p>

        <h2>What research and experience already show</h2>
        <p>Published work on hospital signage and visitor navigation (summarised on our <a href="/research">research page</a>) points to the same pattern: unclear signs increase confusion; patients and visitors have different needs; digital wayfinding updates faster than boards when layouts change. For Indian administrators, the takeaway is not “replace every sign.” It is “treat wayfinding as a patient-experience and operations metric,” then choose tools that match how people actually arrive — often with a smartphone, often without wanting another app.</p>

        <h2>A wayfinding audit you can run this month</h2>
        <ol>
          <li><strong>Pick five high-volume destinations</strong> — for example registration, a flagship OPD, labs, pharmacy, and a ward block.</li>
          <li><strong>Walk from the main gate with a first-time visitor mindset</strong> — note every decision point where someone must choose left, right, lift, or stairs.</li>
          <li><strong>Count language gaps</strong> — how many signs are English-only? Are department names consistent with what is printed on appointments?</li>
          <li><strong>Time the journey</strong> — gate to destination at a quiet hour and at peak OPD. Include wrong turns if they happen.</li>
          <li><strong>Interview front-desk and security</strong> — which destinations generate the most “where is…?” questions each day?</li>
          <li><strong>Check accessibility</strong> — is there a documented step-free path, or only the shortest stair-heavy route?</li>
        </ol>
        <p>Write the findings down. A short audit gives you a baseline for vendors and for internal facilities planning. It also prevents buying technology that only solves the corridors you already understand.</p>

        <h2>Signage, apps, beacons, or QR in the browser?</h2>
        <p>Static signage remains essential for orientation and branding. It is not enough alone when floors change monthly. Native apps add download friction for one-off visits. Beacon-based systems can work indoors but introduce hardware maintenance, battery replacement, and RF planning. QR codes that open turn-by-turn directions in the browser sit in a different category: low visitor friction, no beacon fleet, and routes you can update when a department moves. BootWay’s approach is built for that model — see also our guide on <a href="/guides/qr-vs-beacon-navigation">QR vs beacon navigation</a>.</p>

        <h2>What “good” looks like for patients</h2>
        <ul>
          <li>Destination names match appointment slips and local language preferences.</li>
          <li>Routes state distance and approximate time so attendants can plan rests.</li>
          <li>Lift vs stairs is a choice, not a surprise.</li>
          <li>Accessible options exist where the building allows — see <a href="/guides/accessible-indoor-navigation">accessible indoor navigation</a>.</li>
          <li>Staff still know how to help; digital routes reduce — not eliminate — human care.</li>
        </ul>

        <h2>Next steps</h2>
        <p>If you manage a multi-floor hospital in India, start with the audit above. Then decide whether your biggest gap is reprinting signs, training volunteers, or publishing live routes from QR codes at gates and desks. When you are ready to discuss a mapped deployment, <a href="/contact">contact BootWay</a> with floor count and peak OPD destinations.</p>

        <div class="cta-row">
          <a class="btn btn-primary" href="/contact">Talk to BootWay</a>
          <a class="btn btn-secondary" href="/hospital-navigation">Hospital navigation</a>
          <a class="btn btn-secondary" href="/guides">All guides</a>
        </div>
      </div>
    </section>'''
))

articles.append((
    "qr-vs-beacon-navigation.html",
    "QR vs Beacon Indoor Navigation | BootWay Guide",
    "Compare QR browser indoor navigation with Bluetooth beacons and apps: hardware, maintenance, visitor friction, and updates for Indian hospitals and campuses.",
    "https://www.bootway.in/guides/qr-vs-beacon-navigation",
    "QR browser navigation vs beacons and apps",
    '''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Guide · Technology</span>
        <h1>QR browser navigation vs beacons and apps</h1>
        <p class="lead">A side-by-side view of visitor friction, hardware, maintenance, and update speed — so facilities teams can choose deliberately.</p>
      </div>
    </section>
    <section class="section" style="padding-top: 1rem;">
      <div class="container content-prose">
        <p>Indoor navigation vendors often bundle three different ideas: a smartphone app, Bluetooth beacons (or similar radio hardware), and digital maps. Indian hospitals and campuses care about outcomes — fewer lost visitors, less desk interruption — not about radio protocols. This guide separates the options so you can ask better questions in demos.</p>

        <h2>What each approach actually requires</h2>
        <h3>Native mobile apps</h3>
        <p>Visitors download an app, grant permissions, and learn a UI they may use once. For elective international airports that may be acceptable. For a parent bringing a child to OPD, download friction is high. App stores, OS versions, storage, and trust (“why does this hospital need an app?”) all become barriers. Apps can be powerful for staff workflows; they are a weak default for occasional visitors.</p>

        <h3>Beacon / hardware-assisted positioning</h3>
        <p>Beacons (and related indoor positioning hardware) help a device estimate location inside a building. Done well, they can support continuous positioning. Done poorly, they create a maintenance estate: batteries, mounting, RF interference, and recalibration when walls change. Procurement must include lifecycle cost, not only installation day cost. Security and biomedical teams may also have questions about devices placed throughout clinical areas.</p>

        <h3>QR codes opening browser routes</h3>
        <p>QR codes at known points (gate, lift lobby, desk) open a browser experience that already knows a starting landmark. The visitor chooses a destination and follows turn-by-turn guidance. Positioning is landmark- and instruction-based rather than continuous radio tracking. The trade-off is clear: you do not get free-roam “blue dot” everywhere, but you avoid app installs and beacon fleets. BootWay’s <a href="/hospital-navigation">hospital navigation</a> is built on this model — no app, no beacons.</p>

        <h2>Comparison table</h2>
        <table>
          <thead>
            <tr>
              <th>Factor</th>
              <th>App + beacons</th>
              <th>QR + browser routes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Visitor start</td>
              <td>Install / update app, permissions</td>
              <td>Scan QR, opens in browser</td>
            </tr>
            <tr>
              <td>Hardware in corridors</td>
              <td>Beacons or similar devices</td>
              <td>Printed or displayed QR codes</td>
            </tr>
            <tr>
              <td>Maintenance</td>
              <td>Batteries, RF, firmware, app releases</td>
              <td>Map updates + QR placement checks</td>
            </tr>
            <tr>
              <td>Layout change</td>
              <td>Map + possible beacon replan</td>
              <td>Update digital routes; reprint QR only if locations move</td>
            </tr>
            <tr>
              <td>Language support</td>
              <td>Depends on app build</td>
              <td>Deliverable in visitor languages in the web UI</td>
            </tr>
            <tr>
              <td>Best fit</td>
              <td>Staff tools, continuous tracking needs</td>
              <td>Patient/visitor wayfinding at scale</td>
            </tr>
          </tbody>
        </table>

        <h2>Questions to ask every vendor</h2>
        <ul>
          <li>Who updates the map when an OPD moves, and how long does it take?</li>
          <li>What does year-two hardware maintenance cost?</li>
          <li>Does the visitor need an account?</li>
          <li>How are accessible (step-free) routes selected?</li>
          <li>What offline or low-connectivity behaviour exists?</li>
          <li>Who owns the map data if the contract ends?</li>
        </ul>

        <h2>When beacons still make sense</h2>
        <p>If you need continuous indoor positioning for asset tracking, staff workflows, or analytics that depend on fine-grained location streams, beacon or alternative IPS hardware may be justified. That is a different project from “help attendants find Lab 2.” Mixing the two goals in one RFP often produces an expensive system that patients still will not download.</p>

        <h2>A practical recommendation for Indian visitor wayfinding</h2>
        <p>Keep physical signage for orientation. Use QR-opened browser navigation for turn-by-turn help at high-friction journeys. Reserve apps and beacons for cases that truly need them. For a deeper look at the patient problem, read <a href="/guides/hospital-wayfinding-india">hospital wayfinding in India</a>. To see BootWay’s product framing, visit <a href="/hospital-navigation">hospital navigation</a> or <a href="/contact">contact the team</a>.</p>

        <div class="cta-row">
          <a class="btn btn-primary" href="/contact">Request a comparison call</a>
          <a class="btn btn-secondary" href="/guides">All guides</a>
        </div>
      </div>
    </section>'''
))

articles.append((
    "campus-navigation-open-days.html",
    "Campus Navigation for Open Days and New Students | BootWay",
    "How universities and medical colleges use indoor navigation for open days, admissions, and first-week orientation without forcing another app.",
    "https://www.bootway.in/guides/campus-navigation-open-days",
    "Campus navigation for open days and new students",
    '''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Guide · Campuses</span>
        <h1>Campus navigation for open days and new students</h1>
        <p class="lead">Reduce “where is the auditorium?” chaos during admissions, counselling, and the first weeks of term.</p>
      </div>
    </section>
    <section class="section" style="padding-top: 1rem;">
      <div class="container content-prose">
        <p>Universities and medical colleges in India concentrate strangers on campus on the same days: entrance counselling, open days, convocations, and hostel allotment. Signboards and student volunteers help, but peak hours still create clusters of lost families around admin blocks and exam halls. This guide focuses on visitor journeys — parents, applicants, and new students — not staff logistics.</p>

        <h2>Where campus wayfinding breaks</h2>
        <p>Campuses are often larger than a single hospital wing and more fragmented. Academic blocks, hostels, sports grounds, and admin offices may sit across roads that feel obvious to faculty and confusing to visitors. Temporary rooms for counselling change every season. Printed maps fold poorly, go out of date, and rarely match the language mix of arriving families.</p>
        <p>Open days amplify the problem. Multiple parallel sessions mean people must move between halls on a tight clock. A ten-minute wrong turn can mean missing a counselling slot. Volunteers burn out answering the same corridor question hundreds of times.</p>

        <h2>Design journeys, not just maps</h2>
        <p>List the journeys that matter for your next peak event:</p>
        <ul>
          <li>Main gate → registration / document verification</li>
          <li>Registration → counselling hall or exam room</li>
          <li>Hall → fee counter or bank desk</li>
          <li>Gate → hostel allotment / warden office</li>
          <li>Parking or drop-off → auditorium for orientation</li>
        </ul>
        <p>For each journey, note language needs, accessibility, and whether the destination name on the appointment SMS matches the sign on the door. Inconsistent naming is one of the most common hidden causes of lost visitors.</p>

        <h2>What works on open day</h2>
        <ol>
          <li><strong>QR at the gate and at bus drop zones</strong> — open a browser route without installing an app.</li>
          <li><strong>Destinations named the way SMS and emails name them</strong> — not only official building codes.</li>
          <li><strong>Volunteer scripts that point to the QR first</strong> — humans remain for exceptions; digital handles volume.</li>
          <li><strong>Accessible options for parents with mobility needs</strong> — see <a href="/guides/accessible-indoor-navigation">accessible indoor navigation</a>.</li>
          <li><strong>A short virtual preview before arrival</strong> — optional <a href="/virtual-tours">360° tour</a> of key blocks so families recognise façades.</li>
        </ol>

        <h2>After admissions week</h2>
        <p>The same system should serve quieter days: new faculty, patients visiting a medical college hospital attached to campus, conference guests, and alumni events. If navigation only exists as a PDF for one weekend, you will rebuild the work every year. Treat campus navigation as ongoing infrastructure — the same mindset as <a href="/universities">BootWay campus navigation</a>.</p>

        <h2>Checklist for facilities and student affairs</h2>
        <ul>
          <li>Agree a single destination glossary with academic and admin teams.</li>
          <li>Place QR codes where people already stop (gates, help desks), not only on a website.</li>
          <li>Test routes on mid-range Android phones with average connectivity.</li>
          <li>Update maps when temporary counselling rooms move.</li>
          <li>Measure desk questions before and after deployment for one peak event.</li>
        </ul>

        <p>Ready to map a campus journey set? <a href="/contact">Contact BootWay</a> with your next open-day date and the five destinations that generate the most confusion.</p>

        <div class="cta-row">
          <a class="btn btn-primary" href="/contact">Plan a campus demo</a>
          <a class="btn btn-secondary" href="/universities">Campus navigation</a>
          <a class="btn btn-secondary" href="/guides">All guides</a>
        </div>
      </div>
    </section>'''
))

articles.append((
    "accessible-indoor-navigation.html",
    "Accessible Indoor Navigation and PwD-Friendly Routes | BootWay",
    "How to plan step-free and lift-aware indoor navigation for hospitals and campuses, and what PwD-friendly wayfinding means in practice.",
    "https://www.bootway.in/guides/accessible-indoor-navigation",
    "Accessible indoor navigation and PwD-friendly routes",
    '''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Guide · Accessibility</span>
        <h1>Accessible indoor navigation and PwD-friendly routes</h1>
        <p class="lead">Inclusive wayfinding is more than an icon on a map. It is route choice, language, and honest information about lifts and barriers.</p>
      </div>
    </section>
    <section class="section" style="padding-top: 1rem;">
      <div class="container content-prose">
        <p>Many hospitals publish a wheelchair symbol near the entrance and assume the job is done. Visitors who use wheelchairs, walkers, or who cannot climb stairs still get sent up staircases by default “shortest path” thinking. Attendants carrying patients on stretchers face the same trap. Accessible indoor navigation means the digital route prefers paths that the person can actually use.</p>

        <h2>What accessibility means for indoor routes</h2>
        <ul>
          <li><strong>Step-free paths</strong> — avoid stairs when a lift or ramp alternative exists.</li>
          <li><strong>Lift-aware guidance</strong> — tell people which lift bank serves which floors, and when a lift is the required link.</li>
          <li><strong>Honest gaps</strong> — if a destination has no step-free access, say so early rather than stranding someone mid-route.</li>
          <li><strong>Readable language</strong> — plain destination names help people with cognitive load, low literacy, or stress.</li>
          <li><strong>Rest and distance cues</strong> — approximate time and distance help people who fatigue quickly.</li>
        </ul>

        <h2>Building survey habits that include accessibility</h2>
        <p>When mapping a facility, treat accessibility as first-class data, not a filter bolted on later. Surveyors should note stair-only connectors, lift locations, ramp gradients where relevant, and doors that are routinely locked. Facilities teams should confirm which lifts are public versus staff-only. A beautiful map that routes wheelchair users through a staff stairwell is worse than no map.</p>

        <h2>Policy and trust signals</h2>
        <p>Indian hospitals increasingly treat inclusion as part of patient experience and compliance culture. BootWay’s routing practices have been validated in accessibility training contexts; see our <a href="/certifications">PwD accessibility validation</a> alongside ISO 27001 and DPIIT recognition. Certification does not replace a site-specific survey — every building is different — but it signals that inclusive routing is part of the product design, not an afterthought.</p>

        <h2>Operational tips for administrators</h2>
        <ol>
          <li>Offer an explicit “accessible route” choice in the visitor UI, not only a hidden default.</li>
          <li>Align digital routes with physical accessible signage and lift directories.</li>
          <li>Train security not to override accessible routes with “faster” stair shortcuts.</li>
          <li>Re-check routes after renovations — accessibility breaks silently when a ramp is blocked.</li>
          <li>Collect feedback from disability advocacy groups or patient advisory panels after pilot.</li>
        </ol>

        <h2>How this ties to BootWay</h2>
        <p>BootWay’s indoor navigation supports accessible routing options such as step-free and lift-aware paths where the building allows. Combined with multilingual directions and QR entry without an app, the goal is that more visitors can complete the journey independently. Learn more on <a href="/hospital-navigation">hospital navigation</a> or read the broader patient problem in <a href="/guides/hospital-wayfinding-india">hospital wayfinding in India</a>.</p>

        <div class="cta-row">
          <a class="btn btn-primary" href="/contact">Discuss accessible routing</a>
          <a class="btn btn-secondary" href="/certifications">Certifications</a>
          <a class="btn btn-secondary" href="/guides">All guides</a>
        </div>
      </div>
    </section>'''
))

articles.append((
    "virtual-tour-for-hospitals.html",
    "When Hospitals Need a 360° Virtual Tour | BootWay Guide",
    "When a 360° virtual tour helps hospital admissions and orientation, how it differs from live indoor navigation, and how to scope a useful tour.",
    "https://www.bootway.in/guides/virtual-tour-for-hospitals",
    "When hospitals need a 360° virtual tour",
    '''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Guide · Virtual tours</span>
        <h1>When hospitals need a 360° virtual tour</h1>
        <p class="lead">Tours help people recognise a place before they arrive. Live navigation helps them walk there. Use each for the job it is good at.</p>
      </div>
    </section>
    <section class="section" style="padding-top: 1rem;">
      <div class="container content-prose">
        <p>Hospital marketers sometimes ask for a “virtual tour” when the real pain is lost attendants on OPD day. Those are related but different tools. A 360° tour is a guided visual exploration of spaces — useful for familiarity, trust, and remote orientation. Turn-by-turn indoor navigation is an operational system for people already on site. This guide helps you decide when a tour is worth commissioning and how it should sit beside <a href="/hospital-navigation">live wayfinding</a>.</p>

        <h2>Problems a virtual tour solves well</h2>
        <ul>
          <li><strong>Admissions and elective planning</strong> — families want to see wards, waiting areas, or birthing suites before choosing a hospital.</li>
          <li><strong>International or out-of-city patients</strong> — reduce anxiety by previewing the campus online.</li>
          <li><strong>Staff and student onboarding</strong> — medical colleges and large hospital groups can orient new joiners before day one.</li>
          <li><strong>Donor and board communication</strong> — show renovated wings without a physical walkthrough for every stakeholder.</li>
          <li><strong>Open-day style campus events</strong> — pair with <a href="/guides/campus-navigation-open-days">campus navigation</a> so visitors recognise buildings on arrival.</li>
        </ul>

        <h2>Problems a tour does not solve alone</h2>
        <p>A tour will not tell today’s patient how to walk from Gate 2 to Nephrology when the lift on Block B is under maintenance. It will not update every week as OPDs shift. If your primary KPI is “fewer people asking security for directions,” prioritise live QR navigation first, then add a tour for marketing and orientation.</p>

        <h2>What makes a hospital tour useful (not just pretty)</h2>
        <ol>
          <li><strong>Searchable destinations</strong> — jump to OPD, pharmacy, or ICU lobby without scrubbing through every panorama.</li>
          <li><strong>Hotspots with plain labels</strong> — match the names used on appointment messages.</li>
          <li><strong>Floor context</strong> — a mini-map or floor switch so viewers understand vertical structure.</li>
          <li><strong>Mobile performance</strong> — most viewers are on phones with uneven connectivity.</li>
          <li><strong>Update path</strong> — agree how renovations get re-shot so the tour does not become fiction.</li>
        </ol>
        <p>BootWay’s <a href="/virtual-tours">360° virtual tours</a> are designed around search, hotspots, and floor mini-maps — see also the live demo style experience at LUB Skill Hub linked from our press and tour pages.</p>

        <h2>Scoping questions before you commission</h2>
        <ul>
          <li>Who is the audience: patients, students, donors, or all three?</li>
          <li>Which ten spaces must be included for the tour to be honest?</li>
          <li>Will the tour live on the hospital website, WhatsApp, or kiosks?</li>
          <li>Do we also need on-site QR navigation for the same destinations?</li>
          <li>Who approves clinical areas that cannot be photographed?</li>
        </ul>

        <h2>Combining tours and navigation</h2>
        <p>A strong pattern is: tour for pre-visit familiarity, QR navigation for on-site movement. Marketing links the tour; facilities maintains the routes. Both should share destination naming. When you are ready to scope either or both, <a href="/contact">contact BootWay</a> with your primary audience and the buildings involved.</p>

        <div class="cta-row">
          <a class="btn btn-primary" href="/contact">Scope a tour or navigation project</a>
          <a class="btn btn-secondary" href="/virtual-tours">Virtual tours</a>
          <a class="btn btn-secondary" href="/guides">All guides</a>
        </div>
      </div>
    </section>'''
))

for filename, title, desc, canonical, headline, body in articles:
    (GUIDES / filename).write_text(wrap(title, desc, canonical, headline, body), encoding="utf-8")
    print("wrote", filename)

print("wrote index.html")
print("done")
