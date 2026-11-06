# Andrea Geo

An interactive, dependency-free soil profile and introductory seismic calculation studio.

## Run

Requires Python 3 and Node.js 18+ for tests. From this directory:

```sh
npm start
```

Open the app on port 3000. Run `npm test` for analytical calculation checks. No installation, API keys, or external services are required. Fonts are optional and fall back to system fonts.

## First version

- Add or remove clay, sand, gravel, and rock layers; edit thickness, density, and shear-wave velocity.
- View the layered cross-section and small-strain shear modulus.
- Compute one-way travel time, harmonic average Vs, Vs30 for profiles at least 30 m deep, and an approximate quarter-wave period.
- Animate a schematic downward pulse with layer-dependent speed, slowed for visibility.
- Export inputs/results as JSON or print a summary (including browser PDF printing).

Example values are illustrative. Vs30 does not extrapolate beyond the provided profile. The quarter-wave estimate assumes a strong impedance contrast at the base; no half-space is modeled. The pulse does not model reflections, attenuation, or amplification. This is an educational exploration tool, not validated site-response analysis or a design recommendation.

Ground-motion time histories, validated site-response methods, and full engineering report generation are future work. Inputs currently remain in memory until exported; refreshing resets the profile.

## Plate Quest

Open `plates.html` through Live Server or the development server to play a 12-plate name-to-map matching game. Choose a name, then click its map region. Numbered regions are keyboard accessible (Tab, Enter/Space). Hints highlight the selected region; reset reshuffles the names. The local `data` folder contains attributed PB2002 boundaries and Natural Earth land outlines; no API keys or external map service are needed. See `data/README.md` for sources and licensing.

### Easiest way to open Plate Quest

Download `plates.html` and double-click it to open in a browser. Styling, game code, and map data are bundled into this single file; no server is required. To rebuild it after editing `plates.css`, `plates.js`, or map data, run `python3 scripts/build-plates.py`.
