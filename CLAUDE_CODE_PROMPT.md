# LUMI — Claude Code Setup Prompt

Paste this entire prompt into Claude Code when you open the project.

---

## Project: Lumi — Personal Finance App

I'm building a mobile web app called Lumi. It's a Gen Z personal finance app where a blob mascot reacts emotionally to your spending. Every expense = days closer or further from your goal.

The main file is `lumi.html` — a single-file app (HTML + CSS + JS). No framework, no build step needed.

## Your first tasks (do all of these now):

### 1. Start a local server
Run this so I can test in the browser immediately:
```
npx serve . --listen 3000
```
Or if serve isn't available:
```
python3 -m http.server 3000
```
Tell me the URL to open.

### 2. Debug and fix these known issues
Open `lumi.html` and check for:
- Any JavaScript errors in the console
- The onboarding flow: ob1Next() → go('ob2') → ob2Finish() → go('home') — make sure each step works
- The `go()` function — ensure all screen IDs match: `s-ob1`, `s-ob2`, `s-home`, `s-add`, `s-new-goal`, `s-streak`
- `localStorage` save/load — verify `saveState()` and `loadState()` work correctly
- The `react()` function — verify Lumi's face changes when amounts are typed
- Budget bar: dailyBudget should equal dailySavings × 2 (NOT monthlySavings × 2)
- Icon mapping — "Car" goal should show car icon, not plane

### 3. Test the full user flow
Simulate a user going through:
1. Onboarding step 1: name="Sebastian", monthly savings=$300
2. Onboarding step 2: pick "Car", cost=$5000, saved=$500
3. Verify home screen shows correct days: ($5000-$500) ÷ ($300/30) = 450 days
4. Add expense: $50 → verify Lumi reacts, days update
5. Check streak screen renders correctly

Report any bugs found with exact line numbers.

### 4. Optimize
- Add smooth CSS transitions between screens (fade)
- Make Lumi face transition smooth (not instant)
- Ensure Google Fonts load (DM Serif Display + Nunito)
- Enter key submits forms
- Fix mobile viewport issues (test at 390px width)
- Add `touch-action: manipulation` to all buttons

### 5. Add a reset button for testing
Small subtle button (bottom-right corner of home screen) that clears localStorage and reloads. Label it "reset" in tiny gray text. Remove before final deploy.

## Design rules (never change these):
- Colors: `#FAF8F3` cream · `#7C9A7E` sage green · `#E8915A` amber · `#2D2D2D` dark
- Fonts: DM Serif Display for big titles/numbers · Nunito for everything else
- No gradients, no glassmorphism
- Blob animates with CSS keyframes morph + bob

## Key math (never change this):
- `dailySavings = monthlySavings / 30`
- `dailyBudget = dailySavings × 2`
- `daysAway = Math.ceil((goal.amount - goal.saved) / dailySavings)`
- Lumi reacts based on days lost relative to the user's personal savings rate

## After fixing everything, tell me:
1. All bugs found and fixed (with line numbers)
2. The localhost URL to open
3. Any recommendations before deploying to Vercel
