# Angel's Rubik's Cube Analytics Dashboard

![Rubik Cube Icon](rubik.png)

As I continue to practice my basic HTML, CSS, and JavaScript and try to meld that with my newfound love of Data Analytics, I find myself trying to create projects that mesh my interests with this endeavor and why not do a Rubik's cube project? Something that has been really important to my life for 10+ years. And thus, this site was born, a futuristic, interactive web dashboard for analyzing Rubik's Cube solving performance. Upload your session data (CSV or XLSX) and gain insights into solve times, consistency, rolling averages, session comparisons, and performance trends.

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
   git clone https://github.com/Angelbadoobee/Rubik-s-Cube-Analysis.git
   cd Rubik-s-Cube-Analysis
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

## Screenshots
<img width="1220" height="589" alt="image" src="https://github.com/user-attachments/assets/e250f41e-f7da-45a2-9c57-877bdf2c4c0a" />

<img width="1233" height="249" alt="image" src="https://github.com/user-attachments/assets/ee2c550a-76e9-4e7d-9e39-9cf8d03bece7" />

<img width="1225" height="615" alt="image" src="https://github.com/user-attachments/assets/b1318d7e-5a44-437a-a900-2dce768665be" />

<img width="1218" height="623" alt="image" src="https://github.com/user-attachments/assets/f8cc1509-179c-4e85-9916-32436c662b2a" />

<img width="1240" height="500" alt="image" src="https://github.com/user-attachments/assets/4b86806d-78f5-446a-a6d6-30f32d54366d" />
