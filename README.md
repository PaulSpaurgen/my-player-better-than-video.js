## Graph Plotter – MyVideoPlayer vs Video.js GPU Usage

This repo visualizes GPU usage over time for two players using Chart.js and your provided datasets. It renders two side‑by‑side line charts (scrollable width) for a like‑for‑like comparison:

- GPU GT Usage (%) vs Time (ms)
- GPU D3D Usage (%) vs Time (ms)

### Why MyVideoPlayer performs better than Video.js

- Lower GT usage spikes: MyVideoPlayer shows fewer and shorter GT spikes, indicating steadier load on the graphics cores during playback.
- Lower D3D overhead: MyVideoPlayer generally exhibits lower Direct3D (presentation/render) usage, implying less rendering overhead and smoother frame delivery.
- More stable baseline: Flatter usage lines translate to fewer jank risks and better power characteristics over time.

These conclusions come from plotting the exact same timeline for both players using the attached datasets:

- `public/researchData/myVideoPlayerPerformance.json`
- `public/researchData/videoJsPerformance.json`

Each dataset is mapped to time‑series points where `time = index * 200` ms, so ~200 samples ≈ 40 seconds. We plot both series on the same axes for an apples‑to‑apples comparison.

### How to run

```bash
npm install
npm run dev
```

Then open the printed local URL (e.g., `http://localhost:5173`). The charts are rendered at `200vw` with horizontal scroll so you can see the full timeline.

### What the charts show

- GPU GT Usage: Utilization of GPU graphics cores. Lower values/spikes suggest more efficient use of GPU compute for video work.
- GPU D3D Usage: Direct3D rendering/presentation work. Lower values indicate less overhead pushing frames to the screen.

Both metrics are critical when comparing players on real systems: they correlate with smooth playback, device thermals, and battery life.

### Data and methodology

- Source data: the two JSON files above under `public/researchData/`.
- Transformation: each record is mapped to `{ time: index*200, GPU_GT_Usage_Percentage }` and `{ time: index*200, GPU_D3D_Usage_Percentage }`.
- Rendering: Chart.js line charts with tooltips enabled and non‑intersect interaction for easier inspection.
- Layout: Each chart is inside a scrollable container (`overflow-x: auto`) sized to `200vw` for comfortable scanning of ~200 samples.

### Replace with your own runs

Drop new captures into `public/researchData/` with the same field names. Reload the app to compare new sessions. Keep the 200 ms cadence for consistent time axes.

### [Live Demo Link](https://my-player-better-than-video-js.vercel.app/)

- GPU GT Usage Over Time – MyVideoPlayer (red) vs Video.js (blue)
- GPU D3D Usage Over Time – MyVideoPlayer (red) vs Video.js (blue)

> Note: Colors match the app: MyVideoPlayer = red, Video.js = blue.

