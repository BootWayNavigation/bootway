/**
 * Keep the address bar free of #hashes and ?go= section params.
 * Section deep-links use /?go=contact (etc.) so # never appears in the URL.
 *
 * Page paths like /hospital-navigation stay visible on purpose: masking them to /
 * breaks Home navigation, shared links, and SEO.
 */
(function () {
  "use strict";

  var showRoot = function () {
    if (!history.replaceState) return;
    history.replaceState(null, "", "/");
  };

  var cleanToPath = function () {
    if (!history.replaceState) return;
    var path = window.location.pathname || "/";
    history.replaceState(null, "", path);
  };

  var scrollToId = function (id) {
    if (!id) return false;
    var el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  };

  var params = new URLSearchParams(window.location.search);
  var go = params.get("go");
  var hashId =
    window.location.hash && window.location.hash.length > 1
      ? window.location.hash.slice(1)
      : "";

  var afterDom = function () {
    // Homepage: /?go=contact → scroll, then show only /
    if (go) {
      scrollToId(go);
      showRoot();
      return;
    }

    if ((window.location.pathname || "/") === "/" && window.location.search) {
      showRoot();
    }

    // Legacy /#contact bookmarks → scroll, then strip hash
    if (hashId) {
      scrollToId(hashId);
      if ((window.location.pathname || "/") === "/") {
        showRoot();
      } else {
        cleanToPath();
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", afterDom);
  } else {
    afterDom();
  }

  // Same-page #anchors: scroll without leaving # in the bar
  document.addEventListener(
    "click",
    function (event) {
      var anchor = event.target.closest && event.target.closest('a[href^="#"]');
      if (!anchor) return;
      var href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      var id = href.slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if ((window.location.pathname || "/") === "/") {
        showRoot();
      } else {
        cleanToPath();
      }
    },
    true
  );
})();
