/**
 * StatCard — reusable figure + label tile for the landing About section.
 *
 * Usage:
 *   <stat-card icon="i-area" value="18+ lakh" description="sq ft of indoor navigation built"></stat-card>
 */
(function () {
  "use strict";

  class StatCard extends HTMLElement {
    static get observedAttributes() {
      return ["value", "description", "icon"];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    render() {
      const value = this.getAttribute("value") || "";
      const description = this.getAttribute("description") || "";
      const icon = this.getAttribute("icon") || "";

      this.classList.add("stat-card");
      this.setAttribute("role", "listitem");

      const iconHtml = icon
        ? '<span class="stat-card__icon" aria-hidden="true">' +
          '<svg class="icon"><use href="#' +
          escapeAttr(icon) +
          '" /></svg>' +
          "</span>"
        : "";

      this.innerHTML =
        iconHtml +
        '<div class="stat-card__copy">' +
        '<p class="stat-card__value">' +
        escapeHtml(value) +
        "</p>" +
        '<p class="stat-card__description">' +
        escapeHtml(description) +
        "</p>" +
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

  if (!customElements.get("stat-card")) {
    customElements.define("stat-card", StatCard);
  }
})();
