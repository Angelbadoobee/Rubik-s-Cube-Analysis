# Angel's Rubik's Cube Analytics Dashboard

![Rubik Cube Icon](rubik.png)

A futuristic, interactive web dashboard for analyzing Rubik's Cube solving performance. Upload your session data (CSV or XLSX) and gain insights into solve times, consistency, rolling averages, session comparisons, and performance trends.

---

## 🔹 Features

- **Data Upload**: Import your Rubik's Cube solve records in CSV or XLSX format.
- **Filter & Control**: Filter by date, cube type, or practice session.
- **Statistics Overview**:
  - Best time
  - Average time
  - Total solves
  - Consistency (coefficient of variation)
- **Interactive Charts**:
  - Solve Time Progression
  - Rolling Average Trend (MA-5, MA-10, MA-20)
  - Session Box Plots
  - Solve Distribution Histogram
  - Performance Heatmap
- **Insights Section**: Automated performance analysis with actionable recommendations.
- **Responsive Design**: Works on desktop and mobile devices.
- **Neon Cyberpunk Theme**: Animated grid and scanline background, glowing text, and cards.

---

##  Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/rubiks-analytics-dashboard.git
   cd rubiks-analytics-dashboard
   ```
2. **Open in browser:**
Simply open index.html in any modern browser (Chrome, Firefox, Edge).

3. **Upload your dataset:**

- CSV or XLSX file with columns:
  - Date (YYYY-MM-DD)
  - Solve Number
  - Cube Type (e.g., 3×3)
  - Time (mm:ss) or Time (s)
  - Session ID
  - Session Averages (optional)

Example CSV row:
```bash
Date,Solve Number,Cube Type,Time (mm:ss),Session ID,Session Averages
2026-02-01,1,3×3,12.45,Session 1,12.45
```

4. **View dashboard:**

- Once uploaded, filters and charts will appear automatically.
- Hover over charts for interactive data points.

## Technologies

- HTML5, CSS3, JavaScript (ES6)
- Plotly.js — Interactive visualizations
- PapaParse — CSV parsing
- Google Fonts: Orbitron & Share Tech Mono
- Responsive & Neon Cyberpunk UI
