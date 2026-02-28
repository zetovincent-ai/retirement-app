Project Reference: Sunflower Retirement
1. Project Synopsis & Architecture
Overview
"Sunflower Retirement" is a personal finance and retirement forecasting web application. It is designed to track current net worth while providing detailed, long-term cash flow forecasting (up to 30 years). It distinguishes itself from standard budgeting apps by focusing on future account balance projections based on recurring income and expense schedules.

Tech Stack

Frontend: Vanilla HTML, CSS, and JavaScript (using ES6 Modules). No frameworks like React or Vue.

Backend/Database: Supabase (PostgreSQL) for authentication and data storage.

Libraries: Chart.js for visualizations.

Core Features

Dashboard (The Command Center): A collapsible sidebar containing high-level summaries. Features a "Liquid Cash" widget that lists selected bank accounts with their Current Balance and a calculated End-of-Month Forecast.

Forecasting Grid (The "Excel" View): A dynamic table view showing months horizontally (2-month, 6-month, or Yearly views). It projects future daily balances by iterating through recurring income/expense items and applying them to account starting balances.

Data Modules: Tracks Incomes, Expenses, Checking/Savings, Investments, Credit Cards, and Loans. Includes "Smart Linking" (expenses linked to specific accounts to track payoffs) and a manual Reconciliation log.

Charts & Visuals: Expense Pie Chart (with drill-down capability) and Loan Amortization line charts projecting payoffs over 10-30 years.

2. Local Development Guide
To test the application on your computer, you need to start a local web server.

Start the Localhost:

Open your Terminal in VS Code (Ctrl + ~).

Run the following command:

Bash
npx http-server
Open your web browser and navigate to: http://127.0.0.1:8080

3. Git Workflow: Pushing Updates (Dev -> Main)
This is the standard process for saving your work on your development branch, merging it into the production (main) branch, and pushing it to GitHub.

Step 1: Save Your Work on the Dev Branch
Ensure you are on your development branch (git branch to check) and save all modified files.

Bash
git add .
git commit -m "Brief description of the changes you made"
Step 2: Switch to the Main Branch

Bash
git checkout main
Step 3: Pull the Latest Main (Best Practice)
Ensure your local main branch is up to date with GitHub before merging.

Bash
git pull origin main
Step 4: Merge Dev into Main
Bring the changes from your dev branch into main. (Note: Replace dev with your actual branch name, e.g., develop, if it is different).

Bash
git merge dev
Step 5: Push the Updates to GitHub
Send your freshly merged main branch to your online repository.

Bash
git push origin main
Step 6: Switch Back to Dev
Switch back to your development branch so you are ready to start coding your next feature.

Bash
git checkout dev
4. Troubleshooting: Authentication Failures
If the git push command fails with a "Permission Denied" or authentication error, your token has likely expired or VS Code is trying to use the wrong GitHub account.

When prompted for a password in the terminal, you MUST use a Personal Access Token (PAT), not your GitHub account password.

Go to GitHub.com > Settings > Developer Settings > Personal access tokens > Tokens (classic).

Click Generate new token (classic).

Check the box for repo permissions.

Generate the token and copy the long string (starts with ghp_...).

Paste this token into the VS Code terminal when it asks for your password. (Note: The terminal will remain completely blank while you paste it. Just paste and hit Enter).