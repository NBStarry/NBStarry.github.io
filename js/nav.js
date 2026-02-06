/**
 * nav.js — Navigation Controller
 * Handles sticky header, mobile menu, scroll spy, and smooth scroll offset.
 * Registers as App.Nav on the global namespace.
 */
(function() {
  'use strict';

  window.App = window.App || {};

  var navbar, toggle, mobileMenu, navLinks;
  var sections = [];
  var scrollSpyObserver;

  function initElements() {
    navbar = document.getElementById('navbar');
    toggle = document.getElementById('nav-toggle');
    mobileMenu = document.getElementById('mobile-menu');
    navLinks = document.querySelectorAll('#nav-links a, #mobile-menu a');
  }

  // Sticky nav background on scroll
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  // Mobile hamburger menu
  function initMobileMenu() {
    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', function() {
      var isOpen = mobileMenu.classList.toggle('active');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll spy — highlight active nav link
  function initScrollSpy() {
    var sectionIds = ['about', 'skills', 'projects', 'blog', 'hobbies', 'contact'];

    sectionIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) sections.push(el);
    });

    if (sections.length === 0) return;

    scrollSpyObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          setActiveLink(id);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '-40% 0px -55% 0px'
    });

    sections.forEach(function(section) {
      scrollSpyObserver.observe(section);
    });
  }

  function setActiveLink(id) {
    navLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === '#' + id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Smooth scroll with offset for fixed nav
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#hero') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var navHeight = navbar ? navbar.offsetHeight : 0;
          var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });
  }

  window.App.Nav = {
    init: function() {
      initElements();
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      initMobileMenu();
      initScrollSpy();
      initSmoothScroll();
    },

    destroy: function() {
      window.removeEventListener('scroll', handleScroll);
      if (scrollSpyObserver) scrollSpyObserver.disconnect();
    }
  };
})();
