# NBStarry.github.io

Starry Bei 的个人主页，使用原生 HTML/CSS/JS 构建，托管在 GitHub Pages。

**在线访问**: [nbstarry.github.io](https://nbstarry.github.io)

## 技术栈

- 纯 HTML5 + CSS3 + Vanilla JavaScript（零构建步骤）
- Canvas 粒子星空动画
- GitHub API 实时项目展示
- marked.js 客户端 Markdown 渲染
- 中英双语支持（`localStorage` 持久化偏好）

## 项目结构

```
├── index.html              # 主页
├── 404.html                # 自定义 404 页面
├── css/
│   ├── variables.css       # 设计系统（颜色、字体、间距）
│   ├── reset.css           # CSS 重置
│   ├── layout.css          # 布局 + 响应式
│   ├── components.css      # 组件样式
│   ├── animations.css      # 动画
│   └── blog.css            # 博客样式
├── js/
│   ├── i18n.js             # 中英双语翻译
│   ├── particles.js        # 粒子动画
│   ├── typewriter.js       # 打字机效果
│   ├── scroll-reveal.js    # 滚动渐入
│   ├── nav.js              # 导航栏
│   ├── projects.js         # GitHub 项目展示
│   ├── blog-loader.js      # 博客加载/渲染
│   └── main.js             # 初始化
└── blog/
    ├── index.html          # 博客列表页
    ├── post.html           # 文章渲染页
    ├── posts.json          # 文章索引
    └── posts/              # Markdown 文章
        ├── hello-world.md      # 英文版
        └── hello-world.zh.md   # 中文版
```

## 内容修改指南

### 修改个人信息 / 页面文案

编辑 `js/i18n.js`，所有中英文文本集中在 `translations` 对象中：

| 想改什么 | 对应 key |
|---------|----------|
| Hero 打字机标语 | 文件底部 `typewriterStrings` 对象 |
| 关于我介绍 | `about.p1` / `about.p2` |
| 标签（学校/城市） | `about.tag.school` / `about.tag.loc` / `about.tag.field` |
| 兴趣爱好描述 | `hobbies.gaming.desc` / `hobbies.ai.desc` / `hobbies.bio.desc` |
| 联系我副标题 | `contact.subtitle` |

### 修改技能标签

直接编辑 `index.html` 中 Skills 区域的 `<span class="skill-badge">` 元素（约第 160-187 行）。技能名称是技术术语，不走翻译系统。

### 修改社交链接 / 邮箱

编辑 `index.html` 底部 Contact/Footer 区域（约第 290 行）。

### 修改主题颜色

编辑 `css/variables.css`，所有颜色定义在 `:root` 中，改这一个文件即可换主题。

### 修改 GitHub 项目降级数据

编辑 `js/projects.js` 中的 `FALLBACK_REPOS` 数组。正常情况下项目从 GitHub API 动态加载，此数据仅在 API 不可用时显示。

## 发布博客文章

### 1. 创建文章文件

```
blog/posts/my-new-post.md       # 英文版
blog/posts/my-new-post.zh.md    # 中文版（可选）
```

### 2. 更新文章索引

编辑 `blog/posts.json`，添加新条目：

```json
{
  "title": "My New Post",
  "title_zh": "我的新文章",
  "slug": "my-new-post",
  "date": "2026-03-01",
  "tags": ["AI", "Tutorial"],
  "excerpt": "English excerpt...",
  "excerpt_zh": "中文摘要..."
}
```

- `title_zh` / `excerpt_zh` 是可选的，缺少时自动使用英文版
- 中文版 `.zh.md` 也是可选的，缺少时自动降级显示英文版

### 3. 推送部署

```bash
git add .
git commit -m "post: add my-new-post"
git push
```

GitHub Pages 会自动部署，几分钟后在线可见。

## 本地预览

```bash
cd NBStarry.github.io
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## License

MIT
