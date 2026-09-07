# Roadmap

## Done

- [x] 3D city walkthrough driven entirely by clicks, with no autoplay
- [x] The uploaded low-poly city is the only city geometry; the primitive
      boxes, cones, cylinders, spheres and torus stand-ins are gone
- [x] Microsoft Store packet model carried along an arced route per leg
- [x] Model fit measured from the built-up area rather than the raw bounding
      box, so the ground plate no longer skews the framing
- [x] Deck consolidated from 42 slides to 23, with no point made twice
- [x] Six interactive slides: metaphor map, hierarchy, hub & spoke, RBAC scope,
      policy effects, operating model, roadmap
- [x] Full Microsoft design system: Segoe UI, Fluent neutrals, brand palette,
      four-square logo mark
- [x] Every Lovable reference removed from the codebase
- [x] Models loaded through bundler imports (`public/` was not served in preview)

## Next

- [x] Presenter notes written for all 23 slides in a separate local guide
- [ ] Marker positions tuned against the city's actual road network
- [ ] Export to PDF for handout use
- [ ] Code-split three.js so the initial bundle drops below 1 MB
