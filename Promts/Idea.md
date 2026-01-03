# Role
You are a Lead Product Manager and Senior Full-Stack Developer. I am hiring you to build a "Prop Firm Risk Simulator" (Monte Carlo Simulator).

# The Goal
Build a web-based tool that helps retail traders understand the probability of passing a "Proprietary Trading Firm Challenge" (like FTMO or TopStep) versus failing it due to hitting the maximum drawdown limit.

# The Problem
Traders often think a 50% win rate is safe. They don't realize that a string of bad luck (variance) can still cause them to lose their funded account. This tool must visualize that "luck" factor.

# Product Requirements (The "What")

## 1. User Interface (The Control Panel)
The user must be able to input their strategy metrics:
- **Starting Balance** (e.g., $100,000)
- **Win Rate %** (Probability of winning a trade)
- **Risk Per Trade %** (How much of the balance they lose on a loss)
- **Reward-to-Risk Ratio** (e.g., 2.0 means winning $2 for every $1 risked)
- **Max Drawdown Limit %** (The "Death Line" - e.g., 10%)
- **Number of Simulations** (How many "futures" to generate)

## 2. The Simulation Engine (The Logic)
You need to build a Monte Carlo simulation engine that:
- Runs multiple unique simulations (e.g., 50 different "futures").
- For each simulation, it executes a series of 100 random trades based on the user's Win Rate and R:R ratio.
- Tracks the equity curve (balance history) for each simulation.
- **Critical:** It must detect if the balance *ever* dips below the "Max Drawdown Limit" at any point. If it does, that specific simulation is marked as "FAILED".

## 3. Visualization (The Chart)
- Display a line chart showing all the simulation equity curves.
- **Visual Feedback:** Differentiate the "Safe" runs from the "Failed" runs (e.g., different colors or opacities).
- Plot a clear visual line indicating the Max Drawdown threshold so the user can see how close they came to blowing up.

## 4. Business Intelligence (The Stats)
After running the simulations, display clear statistics:
- **Probability of Ruin:** What % of the simulations failed?
- **Median Ending Balance:** What is the "expected" outcome?
- **Survival Rate:** How likely is the user to keep their account?

## 5. Monetization Hooks
The UI must have designated areas (placeholders) for affiliate marketing, specifically:
- A "Call to Action" if the user has a high failure rate (e.g., "Improve your Risk Management here").
- A "Call to Action" if the user has a high success rate (e.g., "Get Funded Now").

# Technical Constraints (The "How")
- **Hosting:** The final output must be deployable to **GitHub Pages** (static hosting).
- **Architecture:** You have full freedom to choose the best lightweight stack (e.g., pure HTML/JS, React, Vue), but it must require **zero backend servers** and **zero database costs**.
- **Performance:** It must be fast and responsive in the browser.

# Deliverable
Please produce the complete code structure required to launch this application.