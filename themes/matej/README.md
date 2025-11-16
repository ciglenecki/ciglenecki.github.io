# Matej Theme for Hugo

A minimalistic Hugo theme with grouped content layout, featuring:
- Profile sidebar with photo and links
- Grouped blog posts with thumbnails
- Bookmarks page with grouped links
- Videos gallery with YouTube/Google Drive support
- Roboto font
- Responsive design (mobile-friendly)

## Features

### Header Navigation
The header contains three main sections:
- **archive**: Main page showing all blog posts
- **bookmarks**: Grouped bookmarks
- **videos**: Video gallery

### Main Page Layout
- **Left sidebar** (15% width): Profile section with photo, name, and social links
- **Right side** (85% width): Grouped blog posts displayed in a responsive grid

### Blog Posts
Each blog post supports:
- `group`: Category/group name (required for grouping)
- `thumbnail`: Small preview image
- `date`: Publication date (displayed as YYYY-MM-DD)

Example post front matter:
```yaml
---
title: "My Blog Post"
date: 2024-11-16
group: "web development"
thumbnail: "/images/post-thumbnail.jpg"
---
```

### Bookmarks
Bookmarks are defined in `data/bookmarks.json`:
```json
[
  {
    "group": "development",
    "date": "2024-11-15",
    "description": "Hugo Documentation",
    "url": "https://gohugo.io/documentation/",
    "icon": "https://gohugo.io/favicon.ico"
  }
]
```

### Videos
Videos are defined in `data/videos.json`:
```json
[
  {
    "title": "Video Title",
    "description": "Video description",
    "youtube": "VIDEO_ID"
  }
]
```

Supported video types:
- **YouTube**: Use `"youtube": "VIDEO_ID"`
- **Google Drive**: Use `"gdrive": "FILE_ID"`
- **Custom Embed**: Use `"embed": "<iframe>...</iframe>"`

## Configuration

Update `hugo.toml` in your site root:

```toml
baseURL = 'https://yourdomain.com/'
languageCode = 'en-us'
title = 'Your Name'
theme = 'matej'

[params]
  [params.profile]
    name = "Your Name"
    photo = "/images/profile.jpg"
    
    [[params.profile.links]]
      name = "GitHub"
      url = "https://github.com/username"
      external = true
      
    [[params.profile.links]]
      name = "Email"
      url = "mailto:your.email@example.com"
      external = false
```

## Directory Structure

```
content/
  posts/              # Blog posts
  bookmarks/          # Bookmarks page
  videos/             # Videos page
data/
  bookmarks.json      # Bookmark data
  videos.json         # Video data
static/
  images/
    profile.jpg       # Your profile photo
```

## Responsive Design

- **Desktop**: Groups displayed in 3 columns
- **Tablet**: Groups displayed in 2 columns
- **Mobile**: Groups displayed in 1 column, profile sidebar moves to top

## Styling

The theme uses:
- **Font**: Roboto (loaded from Google Fonts)
- **Accent color**: #3498db (can be customized in CSS)
- **Design**: Minimalistic, clean, dense
- **Layout**: Grid-based, responsive

## Customization

To customize the accent color, edit `themes/matej/static/css/main.css`:
```css
:root {
  --accent-color: #3498db;  /* Change this */
  --accent-hover: #2980b9;  /* And this */
}
```

## License

MIT
