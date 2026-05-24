<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS feed</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&amp;family=Fraunces:opsz,wght@9..144,500;9..144,700&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
        <style>
          :root {
            --night: #0f0e0b;
            --cream: #f6f2e9;
            --hero-accent: #d68b7d;
            --accent: #7a1f1f;
            --muted: #6b6657;
            --rule: rgba(15, 14, 11, 0.12);
          }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; }
          body {
            background: var(--cream);
            color: var(--night);
            font-family: 'Source Serif 4', Georgia, serif;
            font-size: 18px;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .wrap {
            max-width: 760px;
            margin: 0 auto;
            padding: 4rem 1.5rem 6rem;
          }
          .eyebrow {
            font-family: 'Inter', system-ui, sans-serif;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--accent);
            margin-bottom: 1rem;
          }
          h1 {
            font-family: 'Fraunces', Georgia, serif;
            font-weight: 700;
            font-size: clamp(2rem, 4vw, 3rem);
            line-height: 1.05;
            margin: 0 0 1rem;
            letter-spacing: -0.01em;
          }
          h1 em {
            font-style: italic;
            color: var(--accent);
          }
          .lede {
            font-size: 1.125rem;
            color: var(--night);
            opacity: 0.85;
            max-width: 60ch;
            margin: 0 0 2.5rem;
          }
          .panel {
            background: rgba(15, 14, 11, 0.04);
            border-left: 3px solid var(--hero-accent);
            padding: 1.25rem 1.5rem;
            margin: 0 0 3rem;
            border-radius: 0 4px 4px 0;
          }
          .panel-title {
            font-family: 'Inter', system-ui, sans-serif;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 0.5rem;
          }
          .panel code {
            font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.875rem;
            background: rgba(15, 14, 11, 0.06);
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
            word-break: break-all;
          }
          .panel p { margin: 0.5rem 0 0; font-size: 0.95rem; }
          .section-title {
            font-family: 'Inter', system-ui, sans-serif;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--muted);
            margin: 0 0 1.25rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--rule);
          }
          .item {
            padding: 1.5rem 0;
            border-bottom: 1px solid var(--rule);
          }
          .item:last-child { border-bottom: none; }
          .item-date {
            font-family: 'Inter', system-ui, sans-serif;
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 0.5rem;
          }
          .item-title {
            font-family: 'Fraunces', Georgia, serif;
            font-size: 1.25rem;
            font-weight: 600;
            line-height: 1.3;
            margin: 0 0 0.5rem;
          }
          .item-title a {
            color: var(--night);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.15s ease, color 0.15s ease;
          }
          .item-title a:hover {
            color: var(--accent);
            border-bottom-color: var(--accent);
          }
          .item-desc {
            font-size: 1rem;
            color: var(--night);
            opacity: 0.8;
            margin: 0;
          }
          .home {
            display: inline-block;
            margin-top: 3rem;
            font-family: 'Inter', system-ui, sans-serif;
            font-size: 0.875rem;
            color: var(--accent);
            text-decoration: none;
            border-bottom: 1px solid currentColor;
          }
          .home:hover { color: var(--night); }
        </style>
      </head>
      <body>
        <main class="wrap">
          <div class="eyebrow">RSS feed</div>
          <h1>Subscribe to the <em>registry</em>.</h1>
          <p class="lede">
            <xsl:value-of select="/rss/channel/description"/>
          </p>

          <div class="panel">
            <div class="panel-title">Feed URL</div>
            <code>
              <xsl:choose>
                <xsl:when test="/rss/channel/atom:link/@href">
                  <xsl:value-of select="/rss/channel/atom:link/@href"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="/rss/channel/link"/>
                  <xsl:text>/rss.xml</xsl:text>
                </xsl:otherwise>
              </xsl:choose>
            </code>
            <p>Copy that URL into NetNewsWire, Feedly, Inoreader, or any RSS reader to subscribe. New cases are pushed to the feed automatically when published.</p>
          </div>

          <div class="section-title">Latest entries</div>

          <xsl:for-each select="/rss/channel/item">
            <article class="item">
              <div class="item-date">
                <xsl:value-of select="substring(pubDate, 1, 16)"/>
              </div>
              <h2 class="item-title">
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <p class="item-desc">
                <xsl:value-of select="description"/>
              </p>
            </article>
          </xsl:for-each>

          <a class="home" href="/">← Back to the registry</a>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
