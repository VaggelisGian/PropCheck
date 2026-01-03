# Feature Request: Add "Tilt / Revenge Trading" Logic

I want to upgrade the existing Prop Firm Simulator with a new "Psychology" feature. 
We need to simulate "Tilt" (Revenge Trading), where a trader increases their risk after a loss to try and win it back.

# Requirements

## 1. UI Updates (HTML)
In the "Strategy Parameters" sidebar (inside `index.html`), add a new section called "Psychology Settings" below the existing inputs:
- **Checkbox:** "Enable Tilt Mode (Revenge Trading)"
- **Input:** "Tilt Multiplier" (Default: 2.0).
    * *Tooltip/Small text:* "Multiplies risk after every loss. Resets on win."

## 2. Logic Updates (JS - `simulator.js`)
Modify the `simulateSingleRun` function in `PropFirmSimulator` class:
- Check if "Enable Tilt Mode" is checked.
- **The Logic:**
    - Create a variable `currentRiskPercent` initialized to the user's base `riskPerTrade`.
    - Inside the trade loop:
        - Use `currentRiskPercent` to calculate the money risked.
        - If the trade is a **LOSS**: 
            - Multiply `currentRiskPercent` by the `Tilt Multiplier`. (e.g., 1% -> 2% -> 4%).
        - If the trade is a **WIN**:
            - Reset `currentRiskPercent` back to the original base `riskPerTrade`.
- **Safety:** Cap the max risk at 100% (balance cannot go below 0).

## 3. Visual Indication (Chart)
- If "Tilt Mode" is active, change the chart title to: "Equity Curves (Emotional Tilt Active)".
- Consider making the "Failed" lines (red) slightly thicker or more prominent in this mode to emphasize the danger.

# Goal
Update the code so I can demonstrate how quickly "doubling down" blows up a funded account compared to fixed risk.