/**
 * projects.js — GitHub Projects Display
 * Fetches repos from GitHub API and renders project cards.
 * Falls back to static data if API fails.
 * Registers as App.Projects on the global namespace.
 */
(function() {
  'use strict';

  window.App = window.App || {};

  var GITHUB_USERNAME = 'NBStarry';
  var CACHE_KEY = 'nbstarry_repos';
  var MAX_REPOS = 6;

  // Language colors from GitHub
  var LANG_COLORS = {
    'Python':           '#3572A5',
    'Jupyter Notebook': '#DA5B0B',
    'C++':              '#f34b7d',
    'C#':               '#178600',
    'JavaScript':       '#f1e05a',
    'TypeScript':       '#3178c6',
    'Shell':            '#89e051',
    'CSS':              '#563d7c',
    'HTML':             '#e34c26',
    'Rust':             '#dea584',
    'Go':               '#00ADD8'
  };

  // Static fallback data
  var FALLBACK_REPOS = [
    {
      name: 'CGMega',
      description: 'Dissecting cancer gene module with explainable graph attention network',
      html_url: 'https://github.com/NBStarry/CGMega',
      language: 'Python',
      stargazers_count: 19,
      forks_count: 3
    },
    {
      name: 'Multi-PPI-Transformer',
      description: 'Multi-protein-protein interaction prediction with Transformer architecture',
      html_url: 'https://github.com/NBStarry/Multi-PPI-Transformer',
      language: 'Jupyter Notebook',
      stargazers_count: 0,
      forks_count: 0
    },
    {
      name: 'CppPrimerPlus',
      description: 'C++ Primer Plus learning exercises and practice code',
      html_url: 'https://github.com/NBStarry/CppPrimerPlus',
      language: 'C++',
      stargazers_count: 0,
      forks_count: 0
    },
    {
      name: 'my-claude-code',
      description: 'Personal Claude Code configuration repository',
      html_url: 'https://github.com/NBStarry/my-claude-code',
      language: 'Shell',
      stargazers_count: 0,
      forks_count: 0
    }
  ];

  function fetchRepos() {
    // Check sessionStorage cache first
    var cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        return Promise.resolve(JSON.parse(cached));
      } catch (e) { /* fall through */ }
    }

    return fetch('https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=pushed&per_page=' + MAX_REPOS)
      .then(function(res) {
        if (!res.ok) throw new Error('GitHub API error: ' + res.status);
        return res.json();
      })
      .then(function(repos) {
        // Filter out .github.io repo itself and forks
        var filtered = repos.filter(function(r) {
          return !r.fork && r.name !== GITHUB_USERNAME + '.github.io';
        });
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
        return filtered;
      });
  }

  function createCard(repo) {
    var langColor = LANG_COLORS[repo.language] || '#8b8b8b';

    var card = document.createElement('article');
    card.className = 'project-card reveal';

    var stars = repo.stargazers_count > 0
      ? '<span class="project-card__stars">★ ' + repo.stargazers_count + '</span>'
      : '';
    var forks = repo.forks_count > 0
      ? '<span class="project-card__forks">⑂ ' + repo.forks_count + '</span>'
      : '';
    var language = repo.language
      ? '<span class="project-card__language"><span class="language-dot" style="background:' + langColor + '"></span>' + repo.language + '</span>'
      : '';

    card.innerHTML =
      '<div class="project-card__header">' +
        '<h3 class="project-card__title">' + repo.name + '</h3>' +
        '<a href="' + repo.html_url + '" class="project-card__link" target="_blank" rel="noopener" aria-label="View on GitHub">' +
          '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>' +
        '</a>' +
      '</div>' +
      '<p class="project-card__description">' + (repo.description || 'No description available') + '</p>' +
      '<div class="project-card__meta">' +
        language + stars + forks +
      '</div>';

    return card;
  }

  function render(container, repos) {
    container.innerHTML = '';
    repos.forEach(function(repo) {
      var card = createCard(repo);
      container.appendChild(card);
      // Re-observe for scroll reveal
      if (App.ScrollReveal) App.ScrollReveal.observe(card);
    });
  }

  window.App.Projects = {
    init: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      fetchRepos()
        .then(function(repos) {
          render(container, repos);
        })
        .catch(function() {
          // Fallback to static data
          render(container, FALLBACK_REPOS);
        });
    }
  };
})();
