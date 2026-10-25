# 🏏 KASHMIRI XI - Professional Offline Cricket Scoreboard Web Application

> **App Developed by Abubakar Dar**

A responsive, intuitive, and modern **Cricket Scoreboard Web Application** designed for live match scoring, club cricket, school tournaments, and casual street matches. Built to **work 100% offline** as an installable Progressive Web App (PWA) with zero external runtime dependencies. Featuring a clean White Background & Blue Borders aesthetic, full 1st & 2nd innings control with dedicated `NEXT INNING` and `MATCH END` actions, and comprehensive side-by-side post-match scorecards.

---

## 🌟 Key Features

### 1. Match Setup & Configuration
- **Formats Supported:** T20 (20 ov, max 4/bowler), ODI (50 ov, max 10/bowler), Test Match (unlimited overs), or Custom Overs (1–50 overs with customizable max overs per bowler).
- **Squad Builder:** Input Team A & Team B names, 3–4 letter short codes, and full squad rosters (default 11 players per side).
- **Duplicate Player Names Support:** Multiple players in the same squad can have the exact same name (e.g., father & son, cousins, or common street cricket names like multiple "Rahul", "Ali", or "John"). CricScore PRO assigns internal unique IDs and offers customizable disambiguation modes:
  - **Auto-Number:** E.g. `Rahul (#1)`, `Rahul (#7)` based on squad batting order.
  - **Alpha Suffix:** E.g. `Rahul (A)`, `Rahul (B)`.
  - **Keep Exact Name:** Displays identical names while ensuring unambiguous dropdown selections (`#1. Rahul`, `#2. Rahul`).
- **Quick Match Presets:** Instant 1-click presets for *India vs Australia (T20)*, *England vs South Africa (ODI)*, *Club Blitz (10 Overs)*, and *Same Names Demo (Rahul vs John)*.
- **Incoming Player Management (Change, Add, Remove, Edit):** Full flexibility during live play:
  - **Change:** Pick or swap any incoming or active on-field batsman.
  - **Add:** Add a brand-new player to the team squad on the fly.
  - **Remove:** Remove an unbatted player from the squad if absent/unable to play.
  - **Edit Name:** Correct typos or update player names anytime, automatically updating scorecards, fall-of-wickets, and commentary.
- **Toss System:** Select toss winner and decision (Bat or Bowl).
- **Innings Tracking:** Full lifecycle support across 1st Innings, Innings Break, 2nd Innings Target Chase, and Match Conclusion.

### 2. Live Scoring Controls Pad
- **Quick Runs:** `0` (Dot), `1` (Single), `2` (Double), `3` (Three), `4` (FOUR!), and `6` (SIX!).
- **Extras Support:** Wide (`wd`), No-Ball (`nb`), Bye (`b`), Leg-Bye (`lb`), and Penalty (`+5 pen`).
- **Wicket Dismissals:** Bowled, Caught, LBW, Stumped, Run Out (with striker/non-striker selection & crossing toggle), Hit Wicket, and Retired Hurt.
- **Delivery Combinations & Adjustments:** Combo dialog for No-Ball + runs off the bat, Wide + running extras, or Free Hit situations.
- **Deep Multi-Level Undo:** Instant undo (`Ctrl+Z` or Undo button) reverting ball-by-ball score, bowler stats, striker positions, and over counts without data loss.

### 3. Match Logic & State Engine
- **Strike Rotation:** Automatic strike rotation on odd runs (1, 3, 5) and at the completion of each 6-ball over.
- **Batter Management:** Automatic strike indicator (`*`), real-time strike rate calculations, boundary trackers, and prompts to bring in new batters from the squad when a wicket falls.
- **Bowler Restrictions:** Automatic over counter (`4.1`, `4.2` ... `5.0`), maiden over detection, economy rate calculation, and enforcement of cricket laws preventing a bowler from bowling back-to-back consecutive overs or exceeding format limits.
- **Target & Chase Engine:** 
  - When the required overs end (e.g. 20.0 in T20, 50.0 in ODI, or custom overs) or upon all-out, the app **directly shifts to the next team** and presents a broadcast Innings Break summary showing the **Total Runs to Chase**.
  - In the 2nd innings, a high-visibility live chase banner displays the **Target to Chase**, remaining runs needed, remaining balls, and Required Run Rate (RRR) alongside the 1st innings defense summary.
  - Quick action button `🏁 End 1st Innings` allows declaring/ending the 1st innings early at any point.
- **Free Hit Indicator:** Automatically flags free-hit deliveries following front-foot no-balls.

### 4. Audio & Aesthetics
- **Synthesized Web Audio API:** Zero-latency sound feedback for bat cracks, boundary 4s fanfare, six celebration chord, wicket buzzer, and umpire whistles — operates 100% offline without needing audio media files.
- **Stadium Broadcast Design:** Deep night stadium glassmorphism, glowing LED score numbers, vibrant outcome badges (dots, emerald runs, electric cyan 4s, gold 6s, ruby wickets).
- **Tabbed Analytics:** Full Scorecard, Ball-by-ball Commentary timeline, Fall of Wickets table, and Extras breakdown.

### 5. Offline & Persistence
- **100% Offline Capability:** Registered Service Worker (`sw.js`) and PWA `manifest.json`.
- **Automatic State Persistence:** Saves to `localStorage` on every single ball. Refreshing or accidentally closing the tab preserves match state seamlessly.
- **Export & Import:** Export matches to `.json` files or browse past saved matches in the History drawer.

---

## ⌨️ Keyboard Shortcuts for Rapid Scoring

| Key | Action |
| :--- | :--- |
| `0` | Dot ball |
| `1` | 1 Run (strike rotates) |
| `2` | 2 Runs |
| `3` | 3 Runs (strike rotates) |
| `4` | Boundary FOUR |
| `6` | Maximum SIX |
| `W` | Wide delivery (+1 extra) |
| `N` | No Ball (+1 extra + Free Hit) |
| `Ctrl + Z` / `Cmd + Z` | Undo last ball |

---

## 🚀 How to Run

### Method 1: Direct File Open (Offline)
Simply open [`index.html`](file:///c:/Users/darmu/Desktop/SCORE%20BOARD/index.html) in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Method 2: Local Web Server (For PWA Installation)
You can serve the app using Python or Node:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Open `http://localhost:8080` in your browser. To install as a desktop or mobile application, click the **Install App** icon in the browser address bar.
