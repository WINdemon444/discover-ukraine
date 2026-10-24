#!/usr/bin/env python3
"""Downloads chosen Unsplash photos into assets/images/ and writes assets/images/CREDITS.md.
Run from the project folder:  python3 tools/fetch_unsplash.py   (needs internet)
Each entry: site slot -> (photo id from the Unsplash photo page URL, direct image id, photographer, profile).
The entries below were found in Unsplash search results but NOT visually confirmed: open each page link,
check the photo really shows that place, and replace or delete entries that don't. Add more slots the same way."""
import os, urllib.request
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "images")
PHOTOS = {
 'kyiv': dict(page="https://unsplash.com/photos/a-view-of-a-city-with-a-statue-in-the-middle-sbPI02mZqxs", img='photo-1639341267320-2d062b250c0d', who='Glib Albovsky', profile='https://unsplash.com/@albovsky', where='Kyiv, Ukraine', status='CONFIRMED on the photo page (location tag Kyiv, Ukraine; tags: maidan, city center, capital)'),
 'saint-sophia': dict(page="https://unsplash.com/photos/white-and-green-tower-during-night-time-z0j9Qf9jZ58", img='photo-1561542320-9a18cd340469', who='Eugene', profile='https://unsplash.com/@lifeinkyiv', where="Unknown (appeared in the Unsplash 'kyiv' search)", status='NOT CONFIRMED. May or may not show Saint Sophia; open the link and check'),
 'lviv': dict(page="https://unsplash.com/photos/assorted-color-houses-UTkjKvI3d9Q", img='photo-1557823651-79b93ace10db', who='Nico Benedickt', profile='https://unsplash.com/@benedickt', where="Unknown (appeared in the Unsplash 'lviv' search)", status='NOT CONFIRMED'),
 'lviv-market-square': dict(page="https://unsplash.com/photos/brown-brick-pathway-between-brown-concrete-building-during-daytime-7FkET2XzMJI", img='photo-1603085610153-dec204fb3704', who="Eugenia Pan'kiv", profile='https://unsplash.com/@eugenivy_now', where="Unknown (appeared in the Unsplash 'lviv' search)", status="NOT CONFIRMED; probably not Market Square, so replace if it isn't"),
}
lines = ["# Photo credits", "", "Photos from Unsplash (free to use under the Unsplash License; crediting is appreciated).", ""]
for slot, p in PHOTOS.items():
    url = "https://images.unsplash.com/%s?w=1600&q=75&auto=format&fit=crop" % p["img"]
    print(slot, "|", p["where"], "|", p["status"], "|", p["page"])
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "DiscoverUkraine/1.0"}), timeout=40).read()
        open(os.path.join(OUT, slot + ".jpg"), "wb").write(data)
        lines.append("- **%s.jpg**: photo by [%s](%s), %s" % (slot, p["who"], p["profile"], p["page"]))
    except Exception as e:
        print("  FAILED:", e)
open(os.path.join(OUT, "CREDITS.md"), "w", encoding="utf8").write("\n".join(lines) + "\n")
