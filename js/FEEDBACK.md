# 🌻 Sunflower App - Feedback & Roadmap

## 🔴 High Priority / Bugs
* [ ] (Issue description here)

## 🟡 Enhancements & Tweaks
* [ ] **Liabilities Architecture Refactor:**
    * [ ] Rename "Credit Cards" section to **"Liabilities"**.
    * [ ] **The "Bucket" (Obligation):** Create a "Loan Account" type (negative balance) to track total debt (Mortgage, Car, etc.).
    * [ ] **The "Feeder" (Actions):** Allow multiple recurring Expenses/Transfers to "pay into" this bucket.
    * [ ] **Math:** Ensure interest amortization is applied to the Liability Balance automatically.
    * [ ] **Dashboard:** Calculate Net Worth as (Assets - Liabilities).
* [ ] **Bank Balance Projection (Cash Flow Forecast):**
    * [ ] **New Widget:** Add a section at the top of the Dashboard Column.
    * [ ] **Logic:** Start with current Bank Account totals -> Add (Monthly Income - Monthly Expenses) for each future month.
    * [ ] **Goal:** Visualize the "Running Balance" of liquid cash over time.
* [ ] **Smart Loan Calculator (Bi-Directional):**
    * [ ] Allow inputs to work in two directions ("Solve for X").
    * [ ] **Logic:** Payment Amount overrides Term; Term calculates Payment if Amount is blank.
* [ ] **Trip Integration:** Link expenses in the Financial App to specific Trips.
* [ ] **Data Import:** Investigate CSV imports.

## 🟢 UI / UX Polish
* [ ] **Grid Scrollbar:** Attempt to move the horizontal scrollbar to the top of the grid container (Revisit: Try "Dummy Scrollbar" sync method).
* [ ] **Dashboard Layout - Collapsible Sections:**
    * [ ] Move the new "Bank Projection" to the top.
    * [ ] Make existing widgets (Yearly Forecast, 10-Year Summary) collapsible ("rolled up") by default.
* [ ] **Mobile Layout:** Check "Add Expense" button sizing.
* [ ] **Dashboard:** Add a "Net Worth" trend line chart.

## 🔵 "Blue Sky" Ideas (Future V2)
* [ ] **Receipt Scanning:** OCR for receipts.
* [ ] **Multiple Users:** Shared login access.

---

## ✅ Completed History
* [x] **Database Clean Slate:** Truncated all tables for fresh Jan 2026 start.
* [x] **Trip Planner:** Built "Live Purchasing Power" engine.
* [x] **Currencies:** Added dynamic list of 30+ currencies.