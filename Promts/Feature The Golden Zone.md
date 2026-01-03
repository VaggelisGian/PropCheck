# Feature Request: The "Golden Zone" Strategy Heatmap

# The Challenge
We are transforming this tool from a simple "calculator" into a "Quant Research Engine."
Currently, the user has to guess their risk settings and run the simulation manually over and over. I want to automate this.

# The New Feature: "Optimization Heatmap"
I need you to build a sophisticated 2D Data Visualization that finds the mathematical "Sweet Spot" for passing a prop firm challenge.

# Functional Requirements

## 1. The Matrix Logic
Instead of running a simulation for just *one* win rate and *one* risk setting, the engine must simulate a massive grid of scenarios instantly:
- **Variable A (X-Axis):** A range of Win Rates (e.g., from 30% to 70%).
- **Variable B (Y-Axis):** A range of Risk Per Trade (e.g., from 0.25% to 3.0%).
- **Constant:** The Reward-to-Risk Ratio and Max Drawdown remain fixed based on user input.

For **every single intersection** of these two variables (every pixel of the grid), the engine must run a batch of Monte Carlo simulations to calculate the "Survival Probability" (0% to 100%).

## 2. The Visualization (The Heatmap)
- Render a high-performance visual Heatmap.
- **Visual Language:**
    - **Safe Zone (Green):** Combinations where the Survival Rate is near 100%.
    - **Danger Zone (Red/Black):** Combinations where the trader almost certainly fails.
    - **Transition Zone (Yellow/Orange):** The risky middle ground.
- **Interactivity:** The user should be able to hover their mouse over any spot on the map to see a tooltip with the exact stats for that specific Win Rate/Risk combination.

## 3. User Experience
- Add a toggle or tab to switch between the standard "Single Sim Chart" and this new "Optimization Heatmap."
- When in "Heatmap Mode," the sidebar inputs for specific "Win Rate" and "Risk" should be disabled or hidden, as these are now being visualized across a range.

# Performance Note
This feature requires running thousands of calculations per second. You have full autonomy to architect this for maximum speed and responsiveness (e.g., preventing the browser from freezing during calculation).

# Goal
The user should essentially see a "map" where they can find the highest possible risk they can take (to pass the challenge fast) without entering the "Red Zone" of failure.