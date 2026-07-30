# Tag, You're It!

A client-side fiducial marker generator. Select a marker type, configure parameters, see a live preview, and download in SVG, PNG, or PDF.

## Marker types

| Type | Dictionaries / Families |
|------|------------------------|
| **ArUco** | `DICT_4X4_50/100`, `5X5_50/100`, `6X6_50/100`, `7X7_50/100`, `ORIGINAL` |
| **AprilTag** | `tag36h11`, `tag25h9`, `tag16h5` |
| **ChArUco board** | Any ArUco dictionary, configurable grid size and marker ratio |
| **Chessboard** | Configurable grid, optional white border |

Single marker or batch sheet mode for ArUco and AprilTag. Sheet mode tiles multiple IDs with configurable columns and gap.

## Download formats

- **SVG** — vector, scales to any print size
- **PNG** — raster with a configurable DPI; a `pHYs` chunk is injected so the file prints at the correct physical size without manual scaling
- **PDF** — page dimensions match the physical size inputs (mm) exactly

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Data sources

Dictionary bit patterns are taken directly from the canonical upstream sources:

- ArUco — [opencv/opencv](https://github.com/opencv/opencv) `predefined_dictionaries.hpp`
- AprilTag — [AprilRobotics/apriltag](https://github.com/AprilRobotics/apriltag) `tag16h5.c`, `tag25h9.c`, `tag36h11.c`

## Tech stack

Vite · React 18 · Tailwind CSS v3 · jsPDF · Lucide React

## License

MIT — see [LICENSE](LICENSE).
