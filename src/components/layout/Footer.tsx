'use client';

import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative z-10 overflow-hidden pt-20 lg:pt-[100px]"
      style={{ backgroundColor: '#090E34' }}
      role="contentinfo"
      aria-label="Site Footer"
    >
      {/* Decorative shape – top-left green glow (shape-1) */}
      <span className="absolute left-0 top-0 z-[-1] pointer-events-none select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/footer/shape-1.svg" alt="" aria-hidden="true" />
      </span>

      {/* Decorative shape – bottom-right blue glow (shape-3) */}
      <span className="absolute bottom-0 right-0 z-[-1] pointer-events-none select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/footer/shape-3.svg" alt="" aria-hidden="true" />
      </span>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap -mx-4">

          {/* ── Column 1: Brand ── */}
          <div className="w-full px-4 sm:w-1/2 lg:w-4/12 xl:w-3/12">
            <div className="mb-10">
              <Link href="/" className="mb-6 inline-block" aria-label="BootWay Home">
                <Image
                  src="/assets/images/logo/logo-b-re.png"
                  alt="BootWay Logo"
                  width={160}
                  height={40}
                  className="max-w-full"
                  loading="lazy"
                />
              </Link>
              <p className="mb-8 max-w-[270px] text-base leading-relaxed text-gray-400">
                We create smooth user experiences for indoor navigation at complex venues across India.
              </p>
              {/* LinkedIn */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/bootway"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BootWay on LinkedIn"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M18.8065 1.8335H3.16399C2.42474 1.8335 1.83334 2.42489 1.83334 3.16414V18.8362C1.83334 19.5459 2.42474 20.1668 3.16399 20.1668H18.7473C19.4866 20.1668 20.078 19.5754 20.078 18.8362V3.13457C20.1371 2.42489 19.5457 1.8335 18.8065 1.8335ZM7.24464 17.4168H4.55379V8.69371H7.24464V17.4168ZM5.88443 7.48135C4.99733 7.48135 4.31721 6.77167 4.31721 5.91414C4.31721 5.05661 5.0269 4.34694 5.88443 4.34694C6.74196 4.34694 7.45163 5.05661 7.45163 5.91414C7.45163 6.77167 6.8011 7.48135 5.88443 7.48135ZM17.4463 17.4168H14.7554V13.1883C14.7554 12.183 14.7258 10.8523 13.336 10.8523C11.9167 10.8523 11.7097 11.976 11.7097 13.0996V17.4168H9.01884V8.69371H11.6506V9.90608H11.6801C12.0645 9.1964 12.9221 8.48672 14.2527 8.48672C17.0027 8.48672 17.5054 10.2609 17.5054 12.6856V17.4168H17.4463Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ── Column 2: About Us (main site links) ── */}
          <div className="w-full px-4 sm:w-1/2 lg:w-2/12 xl:w-2/12">
            <div className="mb-10">
              <h4 className="mb-9 text-lg font-semibold text-white">About Us</h4>
              <ul className="space-y-1">
                {[
                  { label: 'Home', href: 'http://localhost:5500/#home' },
                  { label: 'Industries', href: 'http://localhost:5500/#features' },
                  { label: 'About', href: 'http://localhost:5500/#about' },
                  { label: 'Pricing', href: 'http://localhost:5500/#pricing' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="mb-3 inline-block text-base text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Column 3: Quick Links ── */}
          <div className="w-full px-4 sm:w-1/2 lg:w-3/12 xl:w-2/12">
            <div className="mb-10">
              <h4 className="mb-9 text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-1">
                {[
                  { label: 'Careers', href: '/' },
                  { label: 'My Applications', href: '/applications' },
                  { label: 'Privacy Policy', href: 'http://localhost:5500/policy.html' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="mb-3 inline-block text-base text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Column 4: Our Services ── */}
          <div className="w-full px-4 sm:w-1/2 lg:w-3/12 xl:w-2/12">
            <div className="mb-10">
              <h4 className="mb-9 text-lg font-semibold text-white">Our Services</h4>
              <ul className="space-y-1">
                {[
                  { label: 'Indoor Navigation', href: 'http://localhost:5500/#about' },
                  { label: 'Virtual Assistance', href: 'http://localhost:5500/#about' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="mb-3 inline-block text-base text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Column 5: Contact ── */}
          <div className="w-full px-4 sm:w-1/2 lg:w-3/12 xl:w-3/12">
            <div className="mb-10">
              <h4 className="mb-9 text-lg font-semibold text-white">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  {/* Map pin */}
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                  </svg>
                  <span className="text-sm text-gray-400 leading-relaxed">
                    3rd Floor, LUB Skill Hub<br />Sitapura Industrial Area, Jaipur
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  {/* Mail */}
                  <svg className="h-5 w-5 shrink-0 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <a href="mailto:support@bootway.in" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    support@bootway.in
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  {/* Phone */}
                  <svg className="h-5 w-5 shrink-0 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
                  </svg>
                  <a href="tel:+917976866822" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    +91 797 686 6822
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div
          className="py-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <p className="text-sm text-gray-500">
            © {year} BootWay iNaaS Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="http://localhost:5500/policy.html"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </a>
            <Link href="/admin/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              HR Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
