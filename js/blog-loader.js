/**
 * blog-loader.js — Blog Post Loading & Rendering
 * Supports bilingual posts: loads slug.md (EN) or slug.zh.md (ZH).
 * Falls back to the other language if preferred version is missing.
 * Registers as App.BlogLoader on the global namespace.
 */
(function() {
  'use strict';

  window.App = window.App || {};

  var POSTS_JSON = '/blog/posts.json';
  var HOMEPAGE_MAX_POSTS = 3;

  function getLang() {
    return (App.I18n && App.I18n.getLang) ? App.I18n.getLang() : 'en';
  }

  function formatDate(dateStr) {
    var date = new Date(dateStr + 'T00:00:00');
    var lang = getLang();
    if (lang === 'zh') {
      return date.getFullYear() + ' 年 ' + (date.getMonth() + 1) + ' 月 ' + date.getDate() + ' 日';
    }
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  // Get localized field from post: tries post.title_zh / post.title based on lang
  function localize(post, field) {
    var lang = getLang();
    if (lang === 'zh' && post[field + '_zh']) return post[field + '_zh'];
    return post[field] || '';
  }

  function createBlogCard(post) {
    var card = document.createElement('a');
    card.href = '/blog/post.html?slug=' + post.slug;
    card.className = 'blog-card reveal';

    var title = localize(post, 'title');
    var excerpt = localize(post, 'excerpt');

    var tagsHtml = '';
    if (post.tags && post.tags.length > 0) {
      tagsHtml = '<div class="blog-card__tags">';
      post.tags.forEach(function(tag) {
        tagsHtml += '<span class="tag">' + tag + '</span>';
      });
      tagsHtml += '</div>';
    }

    card.innerHTML =
      '<time class="blog-card__date">' + formatDate(post.date) + '</time>' +
      '<h3 class="blog-card__title">' + title + '</h3>' +
      '<p class="blog-card__excerpt">' + excerpt + '</p>' +
      tagsHtml;

    return card;
  }

  function renderHomepagePosts(container, posts) {
    container.innerHTML = '';

    if (!posts || posts.length === 0) {
      container.innerHTML = '<p class="empty-state">Blog posts coming soon. Stay tuned!</p>';
      return;
    }

    var sorted = posts.slice().sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    var limit = Math.min(sorted.length, HOMEPAGE_MAX_POSTS);
    for (var i = 0; i < limit; i++) {
      var card = createBlogCard(sorted[i]);
      container.appendChild(card);
      if (App.ScrollReveal) App.ScrollReveal.observe(card);
    }
  }

  function renderBlogIndex(container, posts) {
    container.innerHTML = '';

    if (!posts || posts.length === 0) {
      container.innerHTML = '<p class="empty-state">No posts yet. Stay tuned!</p>';
      return;
    }

    var sorted = posts.slice().sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    sorted.forEach(function(post) {
      var card = createBlogCard(post);
      container.appendChild(card);
      if (App.ScrollReveal) App.ScrollReveal.observe(card);
    });
  }

  // Fetch markdown with language fallback:
  // Try slug.zh.md first if zh, fall back to slug.md, and vice versa
  function fetchMarkdown(slug) {
    var lang = getLang();
    var primary = lang === 'zh'
      ? '/blog/posts/' + slug + '.zh.md'
      : '/blog/posts/' + slug + '.md';
    var fallback = lang === 'zh'
      ? '/blog/posts/' + slug + '.md'
      : '/blog/posts/' + slug + '.zh.md';

    return fetch(primary).then(function(res) {
      if (res.ok) return res.text();
      // Try fallback
      return fetch(fallback).then(function(res2) {
        if (res2.ok) return res2.text();
        throw new Error('No markdown found');
      });
    });
  }

  function loadMarkdownPost(slug, posts) {
    var post = posts.find(function(p) { return p.slug === slug; });
    if (!post) {
      document.getElementById('post-title').textContent = 'Post Not Found';
      document.getElementById('post-content').innerHTML =
        '<p>The requested post could not be found. <a href="/blog/">Back to blog</a></p>';
      return;
    }

    // Set page metadata with localized title
    var title = localize(post, 'title');
    document.title = title + ' — Starry Bei';
    document.getElementById('post-title').textContent = title;
    document.getElementById('post-date').textContent = formatDate(post.date);

    // Render tags
    var tagsContainer = document.getElementById('post-tags');
    if (tagsContainer && post.tags) {
      tagsContainer.innerHTML = '';
      post.tags.forEach(function(tag) {
        var span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });
    }

    // Fetch and render Markdown with language support
    fetchMarkdown(slug)
      .then(function(md) {
        if (typeof marked !== 'undefined') {
          marked.setOptions({ gfm: true, breaks: true });
          document.getElementById('post-content').innerHTML = marked.parse(md);
        } else {
          document.getElementById('post-content').innerHTML =
            '<pre style="white-space:pre-wrap">' + md + '</pre>';
        }
      })
      .catch(function() {
        document.getElementById('post-content').innerHTML =
          '<p>Failed to load post content. <a href="/blog/">Back to blog</a></p>';
      });
  }

  window.App.BlogLoader = {
    init: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      fetch(POSTS_JSON)
        .then(function(res) {
          if (!res.ok) throw new Error('Failed to load posts.json');
          return res.json();
        })
        .then(function(data) {
          renderHomepagePosts(container, data.posts);
        })
        .catch(function() {
          container.innerHTML = '<p class="empty-state">Blog posts coming soon. Stay tuned!</p>';
        });
    },

    initIndex: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      fetch(POSTS_JSON)
        .then(function(res) {
          if (!res.ok) throw new Error('Failed to load posts.json');
          return res.json();
        })
        .then(function(data) {
          renderBlogIndex(container, data.posts);
        })
        .catch(function() {
          container.innerHTML = '<p class="empty-state">Failed to load posts.</p>';
        });
    },

    initPost: function() {
      var params = new URLSearchParams(window.location.search);
      var slug = params.get('slug');
      if (!slug) {
        document.getElementById('post-title').textContent = 'No Post Specified';
        return;
      }

      fetch(POSTS_JSON)
        .then(function(res) {
          if (!res.ok) throw new Error('Failed to load posts.json');
          return res.json();
        })
        .then(function(data) {
          loadMarkdownPost(slug, data.posts);
        })
        .catch(function() {
          document.getElementById('post-content').innerHTML =
            '<p>Failed to load post. <a href="/blog/">Back to blog</a></p>';
        });
    }
  };
})();
