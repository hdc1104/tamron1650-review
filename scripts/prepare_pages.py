"""Package only images selected in index.html for GitHub Pages."""
import json
import re
import shutil
from pathlib import Path

root = Path(__file__).resolve().parents[1]
output = root / 'dist'
output.mkdir(exist_ok=True)
html = (root / 'index.html').read_text()
match = re.search(r'<script id="photo-data" type="application/json">(.*?)</script>', html, re.S)
photos = json.loads(match.group(1))
files = {'index.html', 'style.css', 'script.js'}
for photo in photos:
    files.update((photo['src'], 'pictures/' + photo['file']))
for source in re.findall(r'<img[^>]+src="([^"]+)"', html):
    files.add(source)
for relative in sorted(files):
    source = root / relative
    if not source.is_file():
        raise FileNotFoundError(relative)
    target = output / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
(output / '.nojekyll').touch()
print(f'Prepared {len(photos)} selected photos and {len(files)} files in dist/')
