/**
 * AccessibilityBanner — PwD accessibility validation highlight.
 *
 * Usage:
 *   <accessibility-banner></accessibility-banner>
 */
(function () {
  "use strict";

  const HIGHLIGHTS = [
    "Validated with students, faculty, and staff",
    "PwDs navigated independently on campus",
    "Practical indoor-navigation training delivered",
    "Less dependence on staff assistance",
  ];

  class AccessibilityBanner extends HTMLElement {
    connectedCallback() {
      this.render();
    }

    render() {
      this.classList.add("accessibility-banner");
      this.setAttribute("role", "region");
      this.setAttribute("aria-labelledby", "accessibility-banner-heading");

      const points = HIGHLIGHTS.map(function (item) {
        return (
          "<li>" +
          '<svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg>' +
          "<span>" +
          escapeHtml(item) +
          "</span>" +
          "</li>"
        );
      }).join("");

      this.innerHTML =
        '<div class="accessibility-banner__inner">' +
        '<div class="accessibility-banner__copy">' +
        '<p class="accessibility-banner__eyebrow">Independently validated</p>' +
        '<h2 class="accessibility-banner__heading" id="accessibility-banner-heading">' +
        "Built so Persons with Disabilities can find their way" +
        "</h2>" +
        '<blockquote class="accessibility-banner__quote">' +
        "<p>“Specially-abled persons/Persons with Disabilities (PwDs) were able to access and use the indoor navigation solution smoothly and independently for navigating within the premises.”</p>" +
        "</blockquote>" +
        '<p class="accessibility-banner__meta">' +
        "Adarsh Gyanodaya Vikas Samiti (Special Education T.T. College), Sawai Madhopur · Ref. 481/AGVS/SWM · 19 Sep 2026" +
        "</p>" +
        '<ul class="accessibility-banner__points">' +
        points +
        "</ul>" +
        '<a class="btn btn-secondary accessibility-banner__cta" href="assets/docs/pwd-accessibility-certificate.pdf" target="_blank" rel="noopener noreferrer">' +
        "Read the validation certificate" +
        '<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>' +
        "</a>" +
        "</div>" +
        '<a class="accessibility-banner__media" href="assets/docs/pwd-accessibility-certificate.pdf" target="_blank" rel="noopener noreferrer" aria-label="Open PwD accessibility certificate PDF">' +
        '<img src="assets/images/certifications/pwd-certificate.png" ' +
        'alt="Certificate of Training and Accessibility Validation issued to BootWay iNAAS Private Limited by Adarsh Gyanodaya Vikas Samiti" ' +
        'width="420" height="594" loading="lazy" />' +
        "</a>" +
        "</div>";
    }
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (!customElements.get("accessibility-banner")) {
    customElements.define("accessibility-banner", AccessibilityBanner);
  }
})();
