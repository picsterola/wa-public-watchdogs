# Portrait audit

Generated: 2026-05-21

Every portrait rendered on the site (Documented and Reported case pages only) is listed below with its license and source. Portraits without a documented gov-page or CC license should be pulled.

Right-of-publicity baseline: RCW 63.60. Government works (federal, state, county, municipal) and properly licensed Creative Commons / Wikimedia files are safe. News photos, campaign photos, and unsourced images are not.

## Portraits in use

| Slug | Name | Title | License | Source |
|------|------|-------|---------|--------|
| `dow-constantine` | Dow Constantine | CEO, Sound Transit | Wikimedia Commons | [link](https://en.wikipedia.org/wiki/Dow_Constantine) |
| `bob-ferguson` | Bob Ferguson | Governor of Washington | Wikimedia Commons CC BY-SA 4.0 | [link](https://en.wikipedia.org/wiki/Bob_Ferguson_(politician)) |
| `bruce-harrell` | Bruce Harrell | Former Mayor of Seattle | Wikimedia Commons | [link](https://en.wikipedia.org/wiki/Bruce_Harrell) |
| `kelly-kinnison` | Kelly Kinnison | CEO, KCRHA | Official agency portrait | [link](https://kcrha.org/about/leadership/) |
| `nick-brown` | Nick Brown | Washington State Attorney General | Wikimedia Commons / federal government work | [link](https://en.wikipedia.org/wiki/Nicholas_W._Brown_(lawyer)) |
| `reagan-dunn` | Reagan Dunn | King County Councilmember, District 9 | Wikimedia Commons | [link](https://en.wikipedia.org/wiki/Reagan_Dunn) |
| `rod-dembowski` | Rod Dembowski | King County Councilmember, District 1 | Official King County government portrait | [link](https://www.kingcounty.gov/en/dept/council/r-dembowski) |
| `sarah-perry` | Sarah Perry | King County Council Chair, District 3 | Wikimedia Commons | [link](https://en.wikipedia.org/wiki/Sarah_Perry_(politician)) |
| `steve-metruck` | Steve Metruck | Executive Director, Port of Seattle | Official Port of Seattle portrait | [link](https://www.portseattle.org/news/port-seattle-appoints-stephen-metruck-executive-director) |

## No-portrait entries (text-only fallback)

| Slug | Name | Title |
|------|------|-------|
| `adrian-diaz` | Adrian Diaz | Former Chief, Seattle Police Department |
| `brent-jones` | Brent Jones | Former Superintendent, Seattle Public Schools |
| `kymber-waltmunson` | Kymber Waltmunson | King County Auditor |
| `liza-rankin` | Liza Rankin | Director, Seattle Public Schools Board |
| `shon-barnes` | Shon Barnes | Chief, Seattle Police Department |
| `terri-mestas` | Terri Mestas | Deputy CEO Megaproject Delivery, Sound Transit |
| `victoria-baecher-wassmer` | Victoria Baecher Wassmer | Deputy CEO Finance, Sound Transit |
| `wayne-barnett` | Wayne Barnett | Executive Director, Seattle Ethics & Elections Commission |

## Reviewer checklist

For every portrait in use:

1. License is one of: Wikimedia Commons (any CC variant), federal/state/county/municipal government work, official agency portrait released for public use.
2. Source URL points to the canonical license page (Wikimedia file page, gov bio page).
3. The portrait file at `public/img/officials/<slug>.jpg` was downloaded from the documented `download_url` and is not a derivative work that strips attribution.
4. If any of the above fails: set `photo: null` in officials.json and let the page fall back to text-only.

Portraits are only rendered on Documented and Reported case pages, not on Alleged-tier pages (enforced in src/pages/cases/[slug].astro `shouldShowFaces()`).
