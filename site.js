/* Scroll reveal (2026-10-21, Camille): each .reveal block fades up as it scrolls into view, once.
   The inline snippet in every page's <head> adds html.js so .reveal starts hidden before first paint;
   if this file never runs, that snippet shows everything again after 2.5s. Reduced-motion users
   and browsers without IntersectionObserver just see the page normally. */
(function () {
  var root = document.documentElement;
  window.hbReveal = true;
  var blocks = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.remove('js');
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    var shown = entries.filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) { return (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left); });
    shown.forEach(function (entry, i) {
      entry.target.style.transitionDelay = Math.min(i, 5) * 0.09 + 's';
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  Array.prototype.forEach.call(blocks, function (el) { observer.observe(el); });

  // Safety net: if someone jumps down the page (fast fling, link, restored scroll),
  // anything already scrolled past is shown at once so nothing stays hidden above them.
  var pending = false;
  function catchUp() {
    pending = false;
    Array.prototype.forEach.call(document.querySelectorAll('.reveal:not(.in)'), function (el) {
      if (el.getBoundingClientRect().bottom < 0) {
        el.style.transitionDelay = '0s';
        el.classList.add('in');
        observer.unobserve(el);
      }
    });
  }
  window.addEventListener('scroll', function () {
    if (!pending) { pending = true; window.requestAnimationFrame(catchUp); }
  }, { passive: true });
})();
