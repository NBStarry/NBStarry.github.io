/**
 * main.js — Initialization Orchestrator
 * Coordinates all modules and handles global setup.
 */
(function() {
  'use strict';

  window.App = window.App || {};

  document.addEventListener('DOMContentLoaded', function() {
    // I18n must init BEFORE typewriter to set correct language strings
    if (App.I18n) App.I18n.init();
    if (App.Particles) App.Particles.init('particle-canvas');
    if (App.Typewriter) App.Typewriter.init();
    if (App.ScrollReveal) App.ScrollReveal.init();
    if (App.Nav) App.Nav.init();
    if (App.Projects) App.Projects.init('projects-grid');
    if (App.BlogLoader) App.BlogLoader.init('blog-posts');
  });
})();
