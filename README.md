## confluence-website

### install it

- with **npm**

```bash
npm install @labset/confluence-website --save-dev
```

- with **yarn**

```bash
yarn add @labset/confluence-website -D
```

### configure your site

```bash
./node_modules/.bin/confluence-website init-env
```

it creates a `.env` file with the following properties

- `CONFLUENCE_SITE_NAME` : the Confluence cloud instance you want to generate a site from (**name**.atlassian.net)
- `CONFLUENCE_USERNAME` : the username to use to consume Confluence APIs
- `CONFLUENCE_API_TOKEN` : the user personal access token to consume Confluence APIs
- `TARGET_SITE` : the domain name of where your generated site will be hosted
- `GOOGLE_ANALYTICS_TRACKING_ID`: Google Analytics tracking id

```bash
./node_modules/.bin/confluence-website init-site
```

it creates a `.confluence-website.json` file with the following configuration

```json
{
  "title": "confluence-website",
  "iconUrl": "",
  "name": "space name",
  "theme": {
    "name": "confluence-website",
    "backgroundColor": "rgb(0, 102, 68)",
    "highlightColor": "#FFFFFF"
  }
}
```

### extract your site content

```bash
./node_modules/.bin/confluence-website extract-space <spaceKey>
```

### build your site

```bash
./node_modules/.bin/confluence-website build-space <spaceKey>
```
