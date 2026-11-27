# HisabSaathi

HisabSaathi is a small, voice-first bookkeeping prototype for shopkeepers. It runs in the browser and stores transaction data in that browser's LocalStorage; there is no server or API key.

## Run it in Chrome

1. Open `index.html` in Chrome. For the most reliable microphone access, use a local web server or a secure (`https://`) page; browsers may restrict microphone access on a file URL.
2. Allow microphone access if Chrome asks. Speech recognition requires an internet connection in Chrome and availability can vary by language, browser, and region.
3. Choose English, Telugu, or Hindi. Tap the microphone and speak, or type the same kind of sentence in the text box.
4. Review the recognized text and proposed transaction. Choose **Yes, save it** to record it or **Cancel** to discard it.

No dependency installation is needed. If you already have Python installed and want to serve the folder locally, open a terminal in this folder and run:

```powershell
py -m http.server 8000
```

Then visit `http://localhost:8000` in Chrome.

## Try the core flows

- Sale: `I sold groceries worth 500 rupees`
- Expense: `I spent 200 rupees today`
- Customer credit: `Ravi purchased groceries worth 300 rupees on credit`
- Sales question: `How much did I sell today?`
- Customer balance question: `How much does Ravi owe me?`

The page starts with sample entries (including a sale, expense, and Ravi's credit balance) so the dashboard is populated. **Reset demo data** restores these examples and replaces any entries saved in this browser.

## Notes

- Only confirmed entries are saved. An unclear intent, missing amount, or credit sale without a recognized customer name is rejected and asks for a repeat.
- Sales totals include credit sales. The customer credit total is the sum of credit entries, grouped by customer.
- Data stays in the current browser profile and device. Clearing site data or using another browser removes or won't show these entries.
- Speech recognition depends on browser support and may send audio to the browser provider's recognition service. Typed entry works as a fallback. Speech responses use the browser's speech synthesis voices, which may not be installed for every language.
