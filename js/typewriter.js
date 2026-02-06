/**
 * typewriter.js — Terminal-Style Typewriter Effect
 * Reads configuration from data-typewriter attributes and cycles through strings.
 * Registers as App.Typewriter on the global namespace.
 */
(function() {
  'use strict';

  window.App = window.App || {};

  function TypewriterInstance(el) {
    this.el = el;
    this.strings = (el.getAttribute('data-typewriter') || '').split('|');
    this.speed = parseInt(el.getAttribute('data-typewriter-speed'), 10) || 70;
    this.pause = parseInt(el.getAttribute('data-typewriter-pause'), 10) || 2500;
    this.loop = el.getAttribute('data-typewriter-loop') !== 'false';
    this.deleteSpeed = 40;
    this.currentIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    this.timeout = null;
    this.started = false;
  }

  TypewriterInstance.prototype.start = function() {
    if (this.started || this.strings.length === 0) return;
    this.started = true;
    this.tick();
  };

  TypewriterInstance.prototype.tick = function() {
    var self = this;
    var fullText = this.strings[this.currentIndex];

    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }

    this.el.textContent = this.currentText;

    var delay = this.isDeleting ? this.deleteSpeed : this.speed;

    // Finished typing current string
    if (!this.isDeleting && this.currentText === fullText) {
      if (!this.loop && this.currentIndex === this.strings.length - 1) {
        return; // Stop at the end
      }
      delay = this.pause;
      this.isDeleting = true;
    }
    // Finished deleting
    else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.strings.length;
      delay = 500; // Brief pause before next string
    }

    this.timeout = setTimeout(function() {
      self.tick();
    }, delay);
  };

  TypewriterInstance.prototype.destroy = function() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  var instances = [];

  window.App.Typewriter = {
    init: function() {
      var elements = document.querySelectorAll('[data-typewriter]');

      elements.forEach(function(el) {
        var instance = new TypewriterInstance(el);
        instances.push(instance);

        // Start when element enters viewport
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              instance.start();
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });

        observer.observe(el);
      });
    },

    destroy: function() {
      instances.forEach(function(instance) {
        instance.destroy();
      });
      instances = [];
    }
  };
})();
