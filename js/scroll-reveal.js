/**
 * scroll-reveal.js — Intersection Observer Scroll Animations
 * Adds 'revealed' class to elements with 'reveal' class when they enter viewport.
 * Registers as App.ScrollReveal on the global namespace.
 */
(function() {
  'use strict';

  window.App = window.App || {};

  var observer;
  var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    var elements = document.querySelectorAll('.reveal');
    elements.forEach(function(el) {
      el.classList.add('revealed');
    });
  }

  function createObserver() {
    observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
  }

  function observeElements() {
    var elements = document.querySelectorAll('.reveal');
    elements.forEach(function(el) {
      observer.observe(el);
    });
  }

  window.App.ScrollReveal = {
    init: function() {
      if (isReducedMotion) {
        revealAll();
        return;
      }

      createObserver();
      observeElements();
    },

    // Allow re-observing dynamically added elements
    observe: function(el) {
      if (observer && !isReducedMotion) {
        observer.observe(el);
      } else {
        el.classList.add('revealed');
      }
    },

    destroy: function() {
      if (observer) {
        observer.disconnect();
      }
    }
  };
})();
