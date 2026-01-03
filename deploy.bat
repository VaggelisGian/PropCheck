@echo off
echo Committing and deploying Prop Firm Risk Simulator...

git add index.html styles.css simulator.js
git commit -m "Complete Prop Firm Risk Simulator with Monte Carlo, Tilt Mode, and Golden Zone Heatmap"
git push origin main

echo.
echo Deployment complete!
echo Your site will be available at: https://[your-username].github.io/PropCheck
echo.
echo To enable GitHub Pages:
echo 1. Go to https://github.com/[your-username]/PropCheck/settings/pages
echo 2. Under "Source", select "main" branch
echo 3. Click Save
echo.
pause
