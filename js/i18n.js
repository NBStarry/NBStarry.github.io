/**
 * i18n.js — Bilingual (EN/ZH) Language Switching
 * Uses data-i18n attributes to swap text content.
 * Persists preference in localStorage.
 * Registers as App.I18n on the global namespace.
 */
(function() {
  'use strict';

  window.App = window.App || {};

  var STORAGE_KEY = 'nbstarry_lang';
  var currentLang = 'en';

  var translations = {
    en: {
      // Navigation
      'nav.about':    'About',
      'nav.skills':   'Skills',
      'nav.projects': 'Projects',
      'nav.blog':     'Blog',
      'nav.hobbies':  'Hobbies',
      'nav.contact':  'Contact',

      // Hero
      'hero.greeting':    'Hello, I\'m',
      'hero.cta.work':    'View My Work',
      'hero.cta.contact': 'Get In Touch',
      'hero.scroll':      'Scroll to explore',

      // About
      'about.title': 'About Me',
      'about.p1':    'I\'m <strong>Starry Bei</strong>, a developer and researcher who <strong>graduated from Shanghai Jiao Tong University</strong>, working at the intersection of game development, artificial intelligence, and biology.',
      'about.p2':    'My work spans AI, gaming, and biology. I believe the most interesting discoveries happen when different fields collide.',
      'about.tag.school': 'SJTU',
      'about.tag.loc':    'Shanghai, China',
      'about.tag.field':  'AI + Game + Biology',

      // Skills
      'skills.title':    'Skills & Technologies',
      'skills.cat.ai':   'AI',
      'skills.cat.game': 'Game Development',
      'skills.cat.web':  'Web & Tools',

      // Projects
      'projects.title':    'Projects',
      'projects.view_all': 'View All on GitHub →',

      // Blog
      'blog.title':    'Latest Posts',
      'blog.view_all': 'View All Posts →',

      // Hobbies
      'hobbies.title':         'Interests & Hobbies',
      'hobbies.gaming.title':  'Gaming',
      'hobbies.gaming.desc':   'Passionate about game design and interactive storytelling. Games are where art meets technology.',
      'hobbies.ai.title':      'Artificial Intelligence',
      'hobbies.ai.desc':       'Fascinated by how machines learn. From graph neural networks to generative models, AI is reshaping every field I care about.',
      'hobbies.bio.title':     'Biology & Bioinformatics',
      'hobbies.bio.desc':      'Understanding life at the molecular level. Applying computational methods to decode the complexity of biological systems.',

      // Contact / Footer
      'contact.title':    'Get In Touch',
      'contact.subtitle': 'Interested in collaborating or just want to say hi?',
      'footer.copyright': '© 2024 — 2026 Starry Bei. Built with vanilla HTML, CSS & JS.',

      // 404
      '404.message':  'Page not found in this universe.',
      '404.back':     'Back to Homepage',

      // Blog pages
      'blog.index.title':    'All Posts',
      'blog.index.subtitle': 'Thoughts on game development, AI, biology, and everything in between.',
      'blog.back_all':       '← Back to all posts',
      'blog.back_home':      '← Back to homepage'
    },
    zh: {
      // Navigation
      'nav.about':    '关于',
      'nav.skills':   '技能',
      'nav.projects': '项目',
      'nav.blog':     '博客',
      'nav.hobbies':  '兴趣',
      'nav.contact':  '联系',

      // Hero
      'hero.greeting':    '你好，我是',
      'hero.cta.work':    '查看作品',
      'hero.cta.contact': '联系我',
      'hero.scroll':      '向下滚动探索',

      // About
      'about.title': '关于我',
      'about.p1':    '我是\ <strong> Starry Bei</strong>，专注于游戏开发、人工智能与生物学的交叉领域。',
      'about.p2':    '我的工作涵盖了AI、游戏和生物学。我相信最有趣的发现总是出现在不同学科碰撞的地方。',
      'about.tag.school': 'ECNU & SJTU',
      'about.tag.loc':    '中国·上海',
      'about.tag.field':  'AI + Game + Biology',

      // Skills
      'skills.title':    '技能 & 技术',
      'skills.cat.ai':   'AI',
      'skills.cat.game': '游戏开发',
      'skills.cat.web':  'Web & 工具',

      // Projects
      'projects.title':    '项目',
      'projects.view_all': '在 GitHub 查看全部 →',

      // Blog
      'blog.title':    '最新文章',
      'blog.view_all': '查看全部文章 →',

      // Hobbies
      'hobbies.title':         '兴趣爱好',
      'hobbies.gaming.title':  '游戏',
      'hobbies.gaming.desc':   '热爱游戏设计与互动叙事，游戏是艺术与技术的完美融合。',
      'hobbies.ai.title':      '人工智能',
      'hobbies.ai.desc':       '着迷于机器学习的奥秘。从图神经网络到生成式模型，AI 正在重塑我关注的每一个领域。',
      'hobbies.bio.title':     '生物学 & 生物信息学',
      'hobbies.bio.desc':      '在分子层面理解生命。用计算方法解码生物系统的复杂性。',

      // Contact / Footer
      'contact.title':    '联系我',
      'contact.subtitle': '有合作想法，或者只是想打个招呼？',
      'footer.copyright': '© 2024 — 2026 Starry Bei. 使用原生 HTML、CSS 和 JS 构建。',

      // 404
      '404.message':  '这个页面不在此宇宙中。',
      '404.back':     '返回主页',

      // Blog pages
      'blog.index.title':    '全部文章',
      'blog.index.subtitle': '关于游戏开发、AI、生物学以及其他一切的思考。',
      'blog.back_all':       '← 返回文章列表',
      'blog.back_home':      '← 返回主页'
    }
  };

  // Typewriter strings per language
  var typewriterStrings = {
    en: 'Game Player & AI Partner|Building at the edge of code and creativity',
    zh: '玩家 & AI 的伙伴|在代码与创造力的边界探索'
  };

  function detectLanguage() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'en' || saved === 'zh')) return saved;

    var browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  }

  function applyTranslations(lang) {
    var dict = translations[lang];
    if (!dict) return;

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        // Use innerHTML for keys that contain <strong> tags
        if (dict[key].indexOf('<') !== -1) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Update toggle button text
    var toggleBtns = document.querySelectorAll('.lang-toggle__label');
    toggleBtns.forEach(function(btn) {
      btn.textContent = lang === 'zh' ? 'EN' : '中';
    });
  }

  function updateTypewriter(lang) {
    var el = document.querySelector('[data-typewriter]');
    if (!el) return;

    var newStrings = typewriterStrings[lang] || typewriterStrings.en;
    el.setAttribute('data-typewriter', newStrings);

    // Restart typewriter if it exists
    if (App.Typewriter) {
      App.Typewriter.destroy();
      App.Typewriter.init();
    }
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
    updateTypewriter(lang);
  }

  window.App.I18n = {
    init: function() {
      currentLang = detectLanguage();
      applyTranslations(currentLang);

      // Set typewriter initial strings based on language
      var el = document.querySelector('[data-typewriter]');
      if (el) {
        el.setAttribute('data-typewriter', typewriterStrings[currentLang] || typewriterStrings.en);
      }

      // Bind toggle buttons
      document.querySelectorAll('.lang-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var newLang = currentLang === 'en' ? 'zh' : 'en';
          setLang(newLang);
        });
      });
    },

    getLang: function() {
      return currentLang;
    },

    setLang: setLang,

    t: function(key) {
      var dict = translations[currentLang] || translations.en;
      return dict[key] || key;
    }
  };
})();
