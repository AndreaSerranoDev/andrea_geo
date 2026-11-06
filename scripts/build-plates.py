"""Bundle Plate Quest into one HTML file that also works from file://."""
from pathlib import Path
import json
import re
root = Path(__file__).resolve().parent.parent
page = (root / 'plates.html').read_text()
css = (root / 'plates.css').read_text()
js = (root / 'plates.js').read_text()
data = [json.loads((root / 'data' / name).read_text()) for name in ['plates.geojson', 'land.geojson']]
start = "const responses=await Promise.all(['data/plates.geojson','data/land.geojson'].map(u=>fetch(u)));if(responses.some(r=>!r.ok))throw new Error('Map files unavailable');const [boundaries,land]=await Promise.all(responses.map(r=>r.json()));"
assert start in js
js = js.replace(start, 'const [boundaries,land]=' + json.dumps(data, separators=(',', ':')) + ';')
js = js.replace('The map could not load. Open this page using Live Server in VS Code (not by double-clicking the HTML file), and check that the data folder is present.', 'The map could not load. Please download the complete plates.html file again.')
page = re.sub(r'<link rel="stylesheet" href="plates.css">|<style id="bundled-style">.*?</style>', lambda _: '<style id="bundled-style">' + css + '</style>', page, flags=re.S)
js = js.replace('</script', '<\\/script')
page = re.sub(r'<script type="module" src="plates.js"></script>|<script id="bundled-game">.*?</script>', lambda _: '<script id="bundled-game">' + js + '</script>', page, flags=re.S)
(root / 'plates.html').write_text(page)
print('Built self-contained plates.html')
