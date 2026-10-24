#!/usr/bin/env python3
"""Downloads chosen Unsplash photos into assets/images/ and writes assets/images/CREDITS.md.
Run from the project folder:  python3 tools/fetch_unsplash.py   (needs internet)
Each entry: site slot -> (photo id from the Unsplash photo page URL, direct image id, photographer, profile).
The entries below were found in Unsplash search results but NOT visually confirmed: open each page link,
check the photo really shows that place, and replace or delete entries that don't. Add more slots the same way."""
import os, urllib.request
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "images")
PHOTOS = {
 "kyiv": ("sbPI02mZqxs", "photo-1639341267320-2d062b250c0d", "Glib Albovsky", "https://unsplash.com/@albovsky"),
 "lviv": ("UTkjKvI3d9Q", "photo-1557823651-79b93ace10db", "Nico Benedickt", "https://unsplash.com/@benedickt"),
 "lviv-market-square": ("7FkET2XzMJI", "photo-1603085610153-dec204fb3704", "Eugenia Pan'kiv", "https://unsplash.com/@eugenivy_now"),
}
lines = ["# Photo credits", "", "Photos from Unsplash (free to use under the Unsplash License; crediting is appreciated).", ""]
for slot, (pid, img, who, prof) in PHOTOS.items():
    url = "https://images.unsplash.com/%s?w=1600&q=75&auto=format&fit=crop" % img
    print(slot, "-> check:", "https://unsplash.com/photos/" + pid)
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "DiscoverUkraine/1.0"}), timeout=40).read()
        open(os.path.join(OUT, slot + ".jpg"), "wb").write(data)
        lines.append("- **%s.jpg**: photo by [%s](%s), https://unsplash.com/photos/%s" % (slot, who, prof, pid))
    except Exception as e:
        print("  FAILED:", e)
open(os.path.join(OUT, "CREDITS.md"), "w", encoding="utf8").write("\n".join(lines) + "\n")
