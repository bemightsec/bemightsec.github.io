# BeMight Security Portfolio

This repository contains the static GitHub Pages website for **BeMight Security**, the cybersecurity proof-of-work portfolio of Prince Awuku Anobaah.

The site documents practical blue team learning, defensive security labs, cybersecurity awareness work, tools practice, learning notes, and professional contact information.

## File structure

- `index.html` - Homepage
- `about.html` - Professional story and direction
- `projects.html` - Project and lab overview
- `tools.html` - Tools and skills practiced
- `certifications.html` - Learning path and milestones
- `news.html` - RSS-powered global cybersecurity and Ghana tech updates
- `contact.html` - Contact and opportunity page
- `project-network-traffic-analysis.html` - Network traffic analysis case study
- `project-phishing-awareness.html` - Phishing awareness case study
- `project-dns-enumeration.html` - DNS enumeration case study
- `site.css` - Shared design system and responsive styles
- `site.js` - Navigation, dropdowns, filters, contact form, and news rendering
- `data/news.json` - Static news data used by the frontend
- `scripts/fetch-rss.js` - Node.js RSS fetcher for news updates
- `.github/workflows/update-news.yml` - GitHub Action for scheduled RSS updates

## Run locally

Because this is a static site, you can open `index.html` directly in a browser. For the best test of `data/news.json` fetching, run a local static server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Updating news manually

Edit `data/news.json` using this format:

```json
[
  {
    "title": "Article title",
    "excerpt": "Short summary",
    "url": "https://example.com/article",
    "source": "Source Name",
    "category": "Global News",
    "published": "2026-04-30T17:24:09.000Z",
    "external": true,
    "image": "https://example.com/image.webp"
  }
]
```

The news page currently uses two categories: `Global News` and `Ghana Tech News`.

## RSS updates

The RSS workflow is intentionally static-site friendly. GitHub Actions runs `scripts/fetch-rss.js` every hour, writes normalized results into `data/news.json`, and commits the file back to the repository when it changes.

Current sources:

- Global News: `https://cybersecuritynews.com/feed/`
- Ghana News (Local News): `https://3news.com/tag/tech/feed.xml`

To refresh locally:

1. Run `npm install` once to install `rss-parser`.
2. Run `npm run update-news`.
3. Commit `data/news.json` if the feed output changed.

## Social and contact links

Update shared links in the HTML footer and contact page:

- LinkedIn: `https://www.linkedin.com/in/bemight/`
- GitHub: `https://github.com/bemightsec`
- Portfolio: `https://bemightsec.github.io/`
- Add a public email address when ready.
- Add the WhatsApp Channel URL when available.

## Deploy to GitHub Pages

1. Push these files to the GitHub repository used for `bemightsec.github.io`.
2. In GitHub, open **Settings > Pages**.
3. Select the branch and root folder that contain `index.html`.
4. Save the settings.
5. Visit `https://bemightsec.github.io/` after deployment finishes.
