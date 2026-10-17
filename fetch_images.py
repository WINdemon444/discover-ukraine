#!/usr/bin/env python3
"""Downloads one openly licensed photo per site image from Wikimedia Commons into assets/images/
and writes assets/images/CREDITS.md. Run from the project folder: python3 tools/fetch_images.py
Needs internet. REVIEW every photo afterwards; delete any you dislike and re-run with a new query."""
import json, os, re, time, urllib.parse, urllib.request
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "images")
UA = {"User-Agent": "DiscoverUkraineSite/1.0 (student project)"}
QUERIES = {
 "kyiv": "Kyiv skyline panorama Dnipro",
 "lviv": "Lviv old town street",
 "lviv-market-square": "Lviv Rynok Square town hall",
 "odesa": "Odesa Potemkin Stairs Primorsky Boulevard",
 "odesa-opera-house": "Odesa Opera House",
 "kharkiv": "Kharkiv Freedom Square Derzhprom",
 "dnipro": "Dnipro embankment river panorama",
 "zaporizhzhia": "Zaporizhzhia Dnieper Khortytsia panorama",
 "khortytsia": "Khortytsia island",
 "carpathians": "Carpathian Mountains Ukraine landscape",
 "kamianets": "Kamianets-Podilskyi castle",
 "saint-sophia": "Saint Sophia Cathedral Kyiv",
}
OK = ("cc by", "cc0", "public domain", "pd")
def get(url): return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()
used, credits = set(), ["# Photo credits", "", "Photos from Wikimedia Commons. Check each licence for attribution rules.", ""]
for name, q in QUERIES.items():
    api = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({"action":"query","format":"json","generator":"search","gsrnamespace":6,"gsrsearch":q+" filetype:bitmap","gsrlimit":15,"prop":"imageinfo","iiprop":"url|extmetadata|size|mime","iiurlwidth":1200})
    pages = json.loads(get(api)).get("query", {}).get("pages", {}).values()
    for p in sorted(pages, key=lambda x: x.get("index", 99)):
        i = p["imageinfo"][0]; m = i.get("extmetadata", {}); lic = m.get("LicenseShortName", {}).get("value", "")
        if p["title"] in used or i["mime"] != "image/jpeg" or i["width"] < 1600 or i["width"] < i["height"]: continue
        if "nc" in lic.lower().split() or not lic.lower().startswith(OK): continue
        open(os.path.join(OUT, name + ".jpg"), "wb").write(get(i["thumburl"]))
        author = re.sub("<[^>]+>", "", m.get("Artist", {}).get("value", "Unknown"))
        credits.append("- **%s.jpg**: %s by %s, %s. %s" % (name, p["title"], author, lic, i["descriptionurl"]))
        used.add(p["title"]); print("OK", name, p["title"]); break
    else: print("NO MATCH for", name, "(site keeps the illustration)")
    time.sleep(1)
open(os.path.join(OUT, "CREDITS.md"), "w", encoding="utf8").write("\n".join(credits) + "\n")
