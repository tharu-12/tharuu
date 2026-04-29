/**
 * Count-Up Animation with Intersection Observer
 * Numbers animate from 0 to their target when scrolling into view.
 */
(function () {
  'use strict';

  /* ── Easing: ease-out-expo ── */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /* ── Format a number with commas ── */
  function formatNumber(n, decimals) {
    const parts = n.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  /* ── Animate a single number element ── */
  function animateNumber(el) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target   = parseFloat(el.dataset.target)   || 0;
    const decimals = parseInt(el.dataset.decimals, 10) || 0;
    const duration = parseInt(el.dataset.duration, 10) || 2000;
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';

    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutExpo(progress);
      const current  = eased * target;

      el.textContent = prefix + formatNumber(current, decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* ── Animate progress bar fill ── */
  function animateBar(card) {
    const fill = card.querySelector('.stat-bar-fill');
    if (!fill) return;
    const targetWidth = fill.dataset.width || 0;
    fill.style.width = targetWidth + '%';
  }

  /* ── Intersection Observer for cards & pills ── */
  function initObserver() {
    const options = { threshold: 0.25 };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('in-view');

        // Animate number inside the card / pill
        const numEl = el.querySelector('.stat-number, .pill-number');
        if (numEl) animateNumber(numEl);

        // Animate bar
        animateBar(el);

        // Stop observing
        observer.unobserve(el);
      });
    }, options);

    // Observe all stat cards & pills
    document.querySelectorAll('.stat-card, .stat-pill').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }
})();
