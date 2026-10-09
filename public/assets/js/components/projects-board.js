/**
 * ProjectsBoard — "Projects and prototypes" columns for the landing page.
 *
 * Edit PROJECT_GROUPS below to add, remove, or reorder projects.
 *
 * Usage:
 *   <projects-board></projects-board>
 */
(function () {
  "use strict";

  /** @type {{ title: string, badge: string, tone: "live"|"progress"|"delivered", items: { name: string, detail: string }[] }[]} */
  const PROJECT_GROUPS = [
    {
      title: "Completed",
      badge: "Live",
      tone: "live",
      items: [
        { name: "CK Birla Hospital (RBH)", detail: "Gopalpura, Jaipur" },
        {
          name: "Laghu Udyog Bharati Skill Development Centre",
          detail: "Sitapura, Jaipur",
        },
      ],
    },
    {
      title: "Ongoing",
      badge: "In progress",
      tone: "progress",
      items: [
        {
          name: "SMS Hospital, Dhanvantri OPD",
          detail: "With DoIT&C, Govt. of Rajasthan · LOI received",
        },
        { name: "Suresh Gyan Vihar University", detail: "Jaipur" },
      ],
    },
    {
      title: "Prototypes",
      badge: "Delivered",
      tone: "delivered",
      items: [
        {
          name: "Mahatma Gandhi Hospital (Outdoor)",
          detail: "Sitapura, Jaipur",
        },
        { name: "RUHS Hospital", detail: "Pratap Nagar, Jaipur" },
        {
          name: "Unique Builders (Unique Sanghi)",
          detail: "Durgapura, Jaipur · Certificate received",
        },
        {
          name: "IIHMR Startups",
          detail: "Sanganer, Jaipur · Certificate received",
        },
      ],
    },
  ];

  class ProjectsBoard extends HTMLElement {
    connectedCallback() {
      this.render();
    }

    render() {
      this.classList.add("projects-board");
      this.innerHTML =
        '<div class="section-head reveal">' +
        '<span class="eyebrow">Projects</span>' +
        '<h2 id="projects-heading">Projects and prototypes</h2>' +
        '<p class="lead">Live sites, active rollouts, and earlier prototypes that shaped the product.</p>' +
        "</div>" +
        '<div class="projects-board__grid" role="list">' +
        PROJECT_GROUPS.map(renderGroup).join("") +
        "</div>";
    }
  }

  function renderGroup(group, index) {
    const delayClass = index > 0 ? " reveal-" + index : "";
    const items = (group.items || [])
      .map(function (item) {
        return (
          "<li>" +
          '<p class="projects-board__name">' +
          escapeHtml(item.name) +
          "</p>" +
          '<p class="projects-board__detail">' +
          escapeHtml(item.detail) +
          "</p>" +
          "</li>"
        );
      })
      .join("");

    return (
      '<article class="projects-board__card reveal' +
      delayClass +
      '" role="listitem">' +
      '<header class="projects-board__card-head">' +
      "<h3>" +
      escapeHtml(group.title) +
      "</h3>" +
      '<span class="projects-board__badge is-' +
      escapeHtml(group.tone) +
      '">' +
      escapeHtml(group.badge) +
      "</span>" +
      "</header>" +
      '<ul class="projects-board__list">' +
      items +
      "</ul>" +
      "</article>"
    );
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (!customElements.get("projects-board")) {
    customElements.define("projects-board", ProjectsBoard);
  }
})();
