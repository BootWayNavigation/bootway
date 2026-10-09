/**
 * CertificationsGrid — compact visual certificate gallery + registry marks.
 *
 * Usage:
 *   <certifications-grid></certifications-grid>
 */
(function () {
  "use strict";

  /** @type {{ title: string, meta: string, image: string, alt: string, pdf: string }[]} */
  const FEATURED = [
    {
      title: "ISO 27001:2022",
      meta: "Information security · INQ/AN-23454/1/0926",
      image: "assets/images/certifications/iso-27001.png",
      alt: "ISO 27001:2022 Certificate of Compliance for BootWay iNAAS Private Limited",
      pdf: "assets/docs/iso-27001-certificate.pdf",
    },
    {
      title: "Startup India",
      meta: "DPIIT recognised · DIPP189212",
      image: "assets/images/certifications/dpiit-certificate.png",
      alt: "DPIIT Startup India Certificate of Recognition for BootWay iNAAS Private Limited",
      pdf: "assets/docs/dpiit-certificate.pdf",
    },
    {
      title: "PwD Validated",
      meta: "Accessibility · 481/AGVS/SWM",
      image: "assets/images/certifications/pwd-certificate.png",
      alt: "Certificate of Training and Accessibility Validation from Adarsh Gyanodaya Vikas Samiti",
      pdf: "assets/docs/pwd-accessibility-certificate.pdf",
    },
  ];

  /** @type {{ title: string, detail: string, icon: string, alt: string }[]} */
  const REGISTRY = [
    {
      title: "iStart Rajasthan",
      detail: "Bronze · 5F7F7E2",
      icon: "assets/images/certifications/registry/istart-mark.png",
      alt: "iStart Rajasthan logo",
    },
    {
      title: "MSME / Udyam",
      detail: "UDYAM-RJ-17-0413600",
      icon: "assets/images/certifications/registry/msme-mark.png",
      alt: "Ministry of Micro, Small and Medium Enterprises logo",
    },
    {
      title: "CIN",
      detail: "U63999RJ2024PTC097270",
      icon: "assets/images/certifications/registry/cin-mark.png",
      alt: "Emblem of India for company registration",
    },
    {
      title: "Trademark",
      detail: "IP India · Application filed",
      icon: "assets/images/certifications/registry/trademark-mark.png",
      alt: "Intellectual Property India mark",
    },
  ];

  class CertificationsGrid extends HTMLElement {
    connectedCallback() {
      this.render();
    }

    render() {
      this.classList.add("certifications-grid");
      this.setAttribute("role", "region");
      this.setAttribute("aria-label", "BootWay certificates");

      const cards = FEATURED.map(function (item) {
        return (
          '<a class="cert-tile" href="' +
          escapeAttr(item.pdf) +
          '" target="_blank" rel="noopener noreferrer">' +
          '<div class="cert-tile__frame">' +
          '<img src="' +
          escapeAttr(item.image) +
          '" alt="' +
          escapeAttr(item.alt) +
          '" width="420" height="560" loading="eager" />' +
          "</div>" +
          '<div class="cert-tile__caption">' +
          "<strong>" +
          escapeHtml(item.title) +
          "</strong>" +
          "<span>" +
          escapeHtml(item.meta) +
          "</span>" +
          "</div>" +
          "</a>"
        );
      }).join("");

      const registry = REGISTRY.map(function (item) {
        return (
          '<li class="cert-registry-item">' +
          '<span class="cert-registry-item__mark" aria-hidden="true">' +
          '<img src="' +
          escapeAttr(item.icon) +
          '" alt="" width="168" height="100" loading="lazy" decoding="async" />' +
          "</span>" +
          '<span class="cert-registry-item__copy">' +
          "<strong>" +
          escapeHtml(item.title) +
          "</strong>" +
          "<span>" +
          escapeHtml(item.detail) +
          "</span>" +
          "</span>" +
          "</li>"
        );
      }).join("");

      this.innerHTML =
        '<div class="cert-board">' +
        '<div class="cert-board__gallery">' +
        cards +
        "</div>" +
        '<div class="cert-board__registry-wrap">' +
        '<p class="cert-board__registry-label">Company registry</p>' +
        '<ul class="cert-board__registry" aria-label="Company registry">' +
        registry +
        "</ul>" +
        "</div>" +
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

  function escapeAttr(text) {
    return escapeHtml(text).replace(/'/g, "&#39;");
  }

  if (!customElements.get("certifications-grid")) {
    customElements.define("certifications-grid", CertificationsGrid);
  }
})();
