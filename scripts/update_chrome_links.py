#!/usr/bin/env python3
"""Update nav/footer links on existing marketing HTML pages (keep layout)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "public"

STANDARD_FOOTER_INNER = '''    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" aria-label="BootWay Home">
            <img src="assets/images/logo/logo-b-re.png" alt="BootWay" width="160" height="40" loading="lazy" />
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
    </div>'''

NAV_DESKTOP = '''        <ul class="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/hospital-navigation">Hospitals</a></li>
          <li><a href="/universities">Campuses</a></li>
          <li><a href="/virtual-tours">Virtual tours</a></li>
          <li><a href="/guides">Guides</a></li>
          <li><a href="/certifications">Certifications</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>'''

NAV_MOBILE = '''      <a href="/">Home</a>
      <a href="/hospital-navigation">Hospitals</a>
      <a href="/universities">Campuses</a>
      <a href="/virtual-tours">Virtual tours</a>
      <a href="/guides">Guides</a>
      <a href="/certifications">Certifications</a>
      <a href="/contact">Contact Us</a>
      <a class="btn btn-primary mobile-nav-cta" href="/contact">Talk to our team</a>'''

FILES = [
    "hospital-navigation.html",
    "universities.html",
    "virtual-tours.html",
    "press.html",
    "certifications.html",
    "research.html",
]

nav_links_re = re.compile(r'<ul class="nav-links">.*?</ul>', re.S)
mobile_nav_re = re.compile(
    r'(<nav class="mobile-nav" id="mobileNav"[^>]*>)(.*?)(</nav>)',
    re.S,
)
footer_grid_re = re.compile(
    r'(<footer class="site-footer"[^>]*>)\s*(?:<span class="footer-shape.*?</span>\s*)*(?:<span class="footer-shape.*?</span>\s*)?<div class="container">.*?</div>\s*(</footer>)',
    re.S,
)
# Simpler: replace from <div class="footer-grid"> through footer-bottom's parent container end — use footer container block
footer_container_re = re.compile(
    r'<footer class="site-footer"[^>]*>\s*<div class="container">.*?</div>\s*</footer>',
    re.S,
)

for name in FILES:
    path = ROOT / name
    text = path.read_text(encoding="utf-8")
    text = nav_links_re.sub(NAV_DESKTOP, text, count=1)

    def repl_mobile(m):
        return m.group(1) + "\n" + NAV_MOBILE + "\n    " + m.group(3)

    text2, n = mobile_nav_re.subn(repl_mobile, text, count=1)
    if n != 1:
        print("WARN mobile nav", name, n)
    else:
        text = text2

    text = text.replace('href="/?go=contact"', 'href="/contact"')
    text = text.replace('class="btn btn-primary nav-cta" href="/contact"', 'class="btn btn-primary nav-cta" href="/contact"')

    # Ensure nav CTA points to /contact
    text = re.sub(
        r'(class="btn btn-primary nav-cta" href=")[^"]+(")',
        r'\1/contact\2',
        text,
        count=1,
    )

    new_footer = f'<footer class="site-footer" role="contentinfo">\n{STANDARD_FOOTER_INNER}\n  </footer>'
    text3, n = footer_container_re.subn(new_footer, text, count=1)
    if n != 1:
        print("WARN footer", name, n)
    else:
        text = text3

    # certifications page has aria-current on certifications — restore
    if name == "certifications.html":
        text = text.replace(
            '<li><a href="/certifications">Certifications</a></li>',
            '<li><a href="/certifications" aria-current="page">Certifications</a></li>',
        )
        text = text.replace(
            '<a href="/certifications">Certifications</a>\n      <a href="/contact">Contact Us</a>',
            '<a href="/certifications" aria-current="page">Certifications</a>\n      <a href="/contact">Contact Us</a>',
        )

    path.write_text(text, encoding="utf-8")
    print("updated", name)

# Landing footer + quick links
landing = ROOT / "landing.html"
lt = landing.read_text(encoding="utf-8")

# Update footer About / Quick / bottom on landing carefully
lt = lt.replace(
    """        <div class="footer-col">
          <h4>About Us</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#accredited">Certifications</a></li>
            <li><a href="/press">Media coverage</a></li>
          </ul>
        </div>""",
    """        <div class="footer-col">
          <h4>About Us</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="/certifications">Certifications</a></li>
            <li><a href="/press">Media coverage</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>""",
)

lt = lt.replace(
    """        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/hospital-navigation">Hospital navigation</a></li>
            <li><a href="/universities">Campus navigation</a></li>
            <li><a href="/virtual-tours">Virtual tours</a></li>
            <li><a href="/press">Press</a></li>
            <li><a href="/certifications">Certifications</a></li>
            <li><a href="/research">Research</a></li>
            <li><a href="/policy">Privacy policy</a></li>
          </ul>
        </div>""",
    """        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/hospital-navigation">Hospital navigation</a></li>
            <li><a href="/universities">Campus navigation</a></li>
            <li><a href="/virtual-tours">Virtual tours</a></li>
            <li><a href="/guides">Guides</a></li>
            <li><a href="/press">Press</a></li>
            <li><a href="/certifications">Certifications</a></li>
            <li><a href="/research">Research</a></li>
            <li><a href="/policy">Privacy policy</a></li>
            <li><a href="/terms">Terms of service</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>""",
)

lt = lt.replace(
    """      <div class="footer-bottom">
        <a href="/policy">Privacy policy</a>
        <p>
          Designed and Developed by
          <a href="/" style="color: var(--ink); font-weight: 600;">BootWay iNaaS Private Limited</a>
        </p>
      </div>""",
    """      <div class="footer-bottom">
        <span><a href="/policy">Privacy</a> · <a href="/terms">Terms</a></span>
        <p>
          Designed and Developed by
          <a href="/" style="color: var(--ink); font-weight: 600;">BootWay iNaaS Private Limited</a>
        </p>
      </div>""",
)

# Add Guides to landing header nav if missing
if 'href="/guides"' not in lt.split("site-header", 1)[1].split("</header>", 1)[0]:
    lt = lt.replace(
        '<li><a href="/certifications">Certifications</a></li>\n          <li><a class="ud-menu-scroll" href="#contact">Contact Us</a></li>',
        '<li><a href="/guides">Guides</a></li>\n          <li><a href="/certifications">Certifications</a></li>\n          <li><a class="ud-menu-scroll" href="#contact">Contact Us</a></li>',
    )
    # mobile
    lt = lt.replace(
        '<a href="/certifications">Certifications</a>\n      <a href="#contact">Contact Us</a>',
        '<a href="/guides">Guides</a>\n      <a href="/certifications">Certifications</a>\n      <a href="#contact">Contact Us</a>',
    )

landing.write_text(lt, encoding="utf-8")
print("updated landing.html")

# Remove test.txt
test = ROOT / "test.txt"
if test.exists():
    test.unlink()
    print("deleted test.txt")

print("done")
