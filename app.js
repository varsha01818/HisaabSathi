"use strict";

const STORAGE_KEY = "hisabsaathi.transactions.v1";
const recognitionSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

const messages = {
  "en-IN": {
    today: "YOUR SHOP AT A GLANCE", welcome: "Good day, shopkeeper", subtitle: "A clearer picture of your business, one entry at a time.",
    sales: "Today's sales", salesNote: "Money earned today", expenses: "Today's expenses", expensesNote: "Money spent today", credit: "Customer credit", creditNote: "Still to be collected",
    voiceEyebrow: "YOUR VOICE ASSISTANT", voiceTitle: "What happened in your shop?", privacy: "Saved on this device",
    voiceHint: "Tap the microphone and speak naturally. I’ll check the details with you before saving.", mic: "Tap to speak", listening: "Listening… speak now", processing: "Checking what you said…",
    manualDivider: "OR TYPE WHAT HAPPENED", placeholder: "e.g. I sold groceries worth 500 rupees", transcript: "I heard",
    confirmation: "Please confirm this entry", save: "Yes, save it", cancel: "Cancel",
    tryEyebrow: "A FEW EXAMPLES", tryTitle: "Try saying", saleTitle: "Record a sale", saleCopy: "“I sold groceries worth 500 rupees”",
    expenseTitle: "Add an expense", expenseCopy: "“I spent 200 rupees today”", creditTitle: "Track customer credit", creditCopy: "“Ravi purchased 300 rupees on credit”",
    tip: "You’re always in control. Nothing is saved until you confirm it.",
    historyEyebrow: "YOUR LATEST ENTRIES", historyTitle: "Transaction history", entries: "entries",
    customersEyebrow: "MONEY TO COLLECT", customersTitle: "Customer credit", historyEmpty: "Your entries will show up here.", customersEmpty: "Customer balances will appear here.",
    footer: "Simple hisaab. More time for your business.", reset: "Reset demo data",
    type: { sale: "Sale", expense: "Expense", credit: "Credit sale" },
    saved: "Entry saved. Your totals are updated.", cancelled: "Entry cancelled. Nothing was saved.",
    unclear: "I couldn’t confidently identify that. Please say the sale, expense, or customer credit and include the amount.",
    missingAmount: "I understood the type, but couldn’t find a clear amount. Please try again and say the amount in rupees.",
    missingCustomer: "I found a credit sale, but not the customer’s name. Please say their name and the amount.",
    duplicate: "That exact entry was just saved. I didn’t add it again.",
    micUnsupported: "Speech recognition is not available in this browser. You can type your entry instead.",
    micPermission: "Microphone access was blocked. Allow it in your browser settings, or type your entry instead.",
    micError: "I couldn’t hear that clearly. Please try again or type your entry.",
    noSpeech: "I didn’t hear anything. Please try again in a quieter place or type your entry.",
    questionUnknown: "I’m not sure what you’re asking. Try asking about today's sales or what a customer owes.",
    salesAnswer: "Today's sales are", owesAnswer: "owes you", noDebt: "doesn’t have an outstanding balance.",
    resetConfirm: "Reset the demo data? This replaces all saved entries with the original examples.",
    resetDone: "Demo data restored.", listeningButton: "Stop listening", idleButton: "Tap to speak",
    askRepeat: "Please try saying that again.", permissionDenied: "Microphone permission was denied.",
    customerCount: "customers", outstanding: "outstanding", noTransactions: "No entries yet"
  },
  "hi-IN": {
    today: "आपकी दुकान का हाल", welcome: "नमस्ते, दुकानदार", subtitle: "हर एंट्री के साथ अपने कारोबार का हिसाब रखें।",
    sales: "आज की बिक्री", salesNote: "आज की कमाई", expenses: "आज का खर्च", expensesNote: "आज खर्च हुए पैसे", credit: "ग्राहक का उधार", creditNote: "अभी वसूल करना है",
    voiceEyebrow: "आपका वॉइस सहायक", voiceTitle: "आपकी दुकान में क्या हुआ?", privacy: "इस डिवाइस पर सेव",
    voiceHint: "माइक दबाकर स्वाभाविक रूप से बोलें। सेव करने से पहले मैं जानकारी की पुष्टि करूँगा।", mic: "बोलने के लिए दबाएँ", listening: "सुन रहा हूँ… अब बोलें", processing: "आपकी बात समझ रहा हूँ…",
    manualDivider: "या यहाँ लिखें", placeholder: "जैसे: आज 500 रुपये का सामान बेचा", transcript: "मैंने सुना",
    confirmation: "कृपया इस एंट्री की पुष्टि करें", save: "हाँ, सेव करें", cancel: "रद्द करें",
    tryEyebrow: "कुछ उदाहरण", tryTitle: "ऐसे बोलें", saleTitle: "बिक्री दर्ज करें", saleCopy: "“आज 500 रुपये का सामान बेचा”",
    expenseTitle: "खर्च जोड़ें", expenseCopy: "“आज 200 रुपये खर्च किए”", creditTitle: "ग्राहक का उधार दर्ज करें", creditCopy: "“रवि ने 300 रुपये का उधार लिया”",
    tip: "आपका पूरा नियंत्रण है। पुष्टि के बिना कुछ भी सेव नहीं होगा।",
    historyEyebrow: "हाल की एंट्री", historyTitle: "लेन-देन का इतिहास", entries: "एंट्री",
    customersEyebrow: "वसूल की जाने वाली राशि", customersTitle: "ग्राहक का उधार", historyEmpty: "आपकी एंट्री यहाँ दिखेंगी।", customersEmpty: "ग्राहक का बकाया यहाँ दिखेगा।",
    footer: "आसान हिसाब। कारोबार के लिए ज़्यादा समय।", reset: "डेमो डेटा रीसेट करें",
    type: { sale: "बिक्री", expense: "खर्च", credit: "उधार बिक्री" },
    saved: "एंट्री सेव हो गई। कुल राशि अपडेट हो गई है।", cancelled: "एंट्री रद्द हुई। कुछ भी सेव नहीं किया गया।",
    unclear: "मैं इसे ठीक से समझ नहीं पाया। कृपया बिक्री, खर्च या ग्राहक का उधार और राशि बताएं।",
    missingAmount: "मैंने लेन-देन का प्रकार समझा, लेकिन राशि नहीं। कृपया रुपये में राशि दोहराएँ।",
    missingCustomer: "उधार बिक्री समझ आया, लेकिन ग्राहक का नाम नहीं। कृपया नाम और राशि बताएं।",
    duplicate: "यह एंट्री अभी सेव की गई है। इसे दोबारा नहीं जोड़ा।",
    micUnsupported: "इस ब्राउज़र में वॉइस पहचान उपलब्ध नहीं है। आप एंट्री लिख सकते हैं।",
    micPermission: "माइक्रोफ़ोन की अनुमति नहीं मिली। ब्राउज़र सेटिंग में अनुमति दें या लिखकर दर्ज करें।",
    micError: "मैं साफ़ नहीं सुन पाया। फिर से बोलें या लिखकर दर्ज करें।",
    noSpeech: "कुछ सुनाई नहीं दिया। शांत जगह पर फिर कोशिश करें या लिखकर दर्ज करें।",
    questionUnknown: "मैं समझ नहीं पाया। आज की बिक्री या ग्राहक के बकाये के बारे में पूछें।",
    salesAnswer: "आज की बिक्री है", owesAnswer: "का बकाया है", noDebt: "का कोई बकाया नहीं है।",
    resetConfirm: "डेमो डेटा रीसेट करें? सभी एंट्री मूल उदाहरणों से बदल जाएँगी।",
    resetDone: "डेमो डेटा वापस आ गया।", listeningButton: "सुनना बंद करें", idleButton: "बोलने के लिए दबाएँ",
    askRepeat: "कृपया फिर से बोलें।", permissionDenied: "माइक्रोफ़ोन की अनुमति नहीं मिली।",
    customerCount: "ग्राहक", outstanding: "बकाया", noTransactions: "अभी कोई एंट्री नहीं"
  },
  "te-IN": {
    today: "మీ దుకాణం వివరాలు", welcome: "నమస్కారం, దుకాణదారులారా", subtitle: "ప్రతి నమోదుతో మీ వ్యాపార లెక్కలను తెలుసుకోండి.",
    sales: "ఈరోజు అమ్మకాలు", salesNote: "ఈరోజు సంపాదన", expenses: "ఈరోజు ఖర్చులు", expensesNote: "ఈరోజు ఖర్చు చేసిన మొత్తం", credit: "కస్టమర్ బాకీ", creditNote: "ఇంకా వసూలు చేయాలి",
    voiceEyebrow: "మీ వాయిస్ సహాయకుడు", voiceTitle: "మీ దుకాణంలో ఏమైంది?", privacy: "ఈ పరికరంలో సేవ్ అవుతుంది",
    voiceHint: "మైక్ నొక్కి సహజంగా మాట్లాడండి. సేవ్ చేసే ముందు వివరాలను నిర్ధారిస్తాను.", mic: "మాట్లాడటానికి నొక్కండి", listening: "వింటున్నాను… మాట్లాడండి", processing: "మీ మాటను అర్థం చేసుకుంటున్నాను…",
    manualDivider: "లేదా ఇక్కడ టైప్ చేయండి", placeholder: "ఉదా: ఈరోజు 500 రూపాయల సరుకులు అమ్మాను", transcript: "నేను విన్నది",
    confirmation: "దయచేసి ఈ నమోదును నిర్ధారించండి", save: "అవును, సేవ్ చేయండి", cancel: "రద్దు చేయండి",
    tryEyebrow: "కొన్ని ఉదాహరణలు", tryTitle: "ఇలా చెప్పండి", saleTitle: "అమ్మకాన్ని నమోదు చేయండి", saleCopy: "“ఈరోజు 500 రూపాయల సరుకులు అమ్మాను”",
    expenseTitle: "ఖర్చును జోడించండి", expenseCopy: "“ఈరోజు 200 రూపాయలు ఖర్చు చేశాను”", creditTitle: "కస్టమర్ బాకీ నమోదు", creditCopy: "“రవి 300 రూపాయల సరుకులు అప్పుగా తీసుకున్నాడు”",
    tip: "మీ నియంత్రణలోనే ఉంటుంది. మీరు నిర్ధారించే వరకు ఏదీ సేవ్ కాదు.",
    historyEyebrow: "మీ ఇటీవలి నమోదులు", historyTitle: "లావాదేవీల చరిత్ర", entries: "నమోదులు",
    customersEyebrow: "వసూలు చేయాల్సిన మొత్తం", customersTitle: "కస్టమర్ బాకీ", historyEmpty: "మీ నమోదులు ఇక్కడ కనిపిస్తాయి.", customersEmpty: "కస్టమర్ బాకీలు ఇక్కడ కనిపిస్తాయి.",
    footer: "సులభమైన లెక్కలు. మీ వ్యాపారానికి ఎక్కువ సమయం.", reset: "డెమో డేటాను రీసెట్ చేయండి",
    type: { sale: "అమ్మకం", expense: "ఖర్చు", credit: "అప్పు అమ్మకం" },
    saved: "నమోదు సేవ్ అయింది. మొత్తం అప్‌డేట్ అయింది.", cancelled: "నమోదు రద్దు అయింది. ఏదీ సేవ్ కాలేదు.",
    unclear: "అది నాకు స్పష్టంగా అర్థం కాలేదు. అమ్మకం, ఖర్చు లేదా కస్టమర్ బాకీతో పాటు మొత్తాన్ని చెప్పండి.",
    missingAmount: "లావాదేవీ రకం అర్థమైంది, కానీ మొత్తం తెలియలేదు. దయచేసి రూపాయల్లో మొత్తాన్ని చెప్పండి.",
    missingCustomer: "అప్పు అమ్మకం అర్థమైంది, కానీ కస్టమర్ పేరు తెలియలేదు. దయచేసి పేరు, మొత్తం చెప్పండి.",
    duplicate: "అదే నమోదు ఇప్పుడే సేవ్ అయింది. మళ్లీ జోడించలేదు.",
    micUnsupported: "ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు అందుబాటులో లేదు. మీరు టైప్ చేయవచ్చు.",
    micPermission: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించండి లేదా టైప్ చేయండి.",
    micError: "స్పష్టంగా వినిపించలేదు. మళ్లీ ప్రయత్నించండి లేదా టైప్ చేయండి.",
    noSpeech: "ఏమీ వినిపించలేదు. నిశ్శబ్ద ప్రదేశంలో మళ్లీ ప్రయత్నించండి లేదా టైప్ చేయండి.",
    questionUnknown: "మీరు ఏమి అడుగుతున్నారో అర్థం కాలేదు. ఈరోజు అమ్మకాలు లేదా కస్టమర్ బాకీ గురించి అడగండి.",
    salesAnswer: "ఈరోజు అమ్మకాలు", owesAnswer: "మీకు బాకీ ఉంది", noDebt: "బాకీ ఏమీ లేదు.",
    resetConfirm: "డెమో డేటాను రీసెట్ చేయాలా? సేవ్ చేసిన నమోదులన్నీ మొదటి ఉదాహరణలతో మారతాయి.",
    resetDone: "డెమో డేటా పునరుద్ధరించబడింది.", listeningButton: "వినడం ఆపండి", idleButton: "మాట్లాడటానికి నొక్కండి",
    askRepeat: "దయచేసి మళ్లీ చెప్పండి.", permissionDenied: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది.",
    customerCount: "కస్టమర్లు", outstanding: "బాకీ", noTransactions: "ఇంకా నమోదులు లేవు"
  }
};

const elements = Object.fromEntries([
  "language", "reset-demo", "sales-total", "expenses-total", "credit-total", "transaction-list",
  "history-empty", "customer-list", "customers-empty", "record-count", "customer-count",
  "mic-button", "mic-label", "listening-status", "entry-form", "command-input", "transcript-box",
  "transcript-text", "confirmation-box", "confirmation-title", "confirmation-details",
  "confirm-button", "cancel-button", "toast"
].flatMap((id) => {
  const camelCaseId = id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  const element = document.getElementById(id);
  return [[id, element], [camelCaseId, element]];
}));

let locale = elements.language.value;
let transactions = loadTransactions();
let pendingTransaction = null;
let recognition = null;
let toastTimer = null;
let lastSavedFingerprint = "";
let lastSavedAt = 0;

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function makeSampleData() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return [
    { id: createId(), type: "sale", amount: 1250, description: "Vegetables and groceries", customer: "", createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 20).toISOString() },
    { id: createId(), type: "expense", amount: 360, description: "Market supplies", customer: "", createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 5).toISOString() },
    { id: createId(), type: "credit", amount: 300, description: "Groceries", customer: "Ravi", createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 15).toISOString() },
    { id: createId(), type: "sale", amount: 850, description: "Shop sale", customer: "", createdAt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 16, 40).toISOString() }
  ];
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function isValidTransaction(item) {
  return item && ["sale", "expense", "credit"].includes(item.type)
    && Number.isFinite(item.amount) && item.amount > 0 && item.amount <= 100000000
    && typeof item.createdAt === "string" && !Number.isNaN(Date.parse(item.createdAt))
    && typeof item.description === "string"
    && typeof item.customer === "string"
    && (item.type !== "credit" || item.customer.trim().length > 0);
}

function loadTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      const samples = makeSampleData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
      return samples;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("Stored transaction data is not a list.");
    const validTransactions = parsed.filter(isValidTransaction);
    if (validTransactions.length !== parsed.length) {
      console.warn("Ignored invalid entries in HisabSaathi storage.");
      showToast("Some saved entries were invalid and could not be loaded.");
    }
    return validTransactions;
  } catch (error) {
    console.error("Could not load HisabSaathi data:", error);
    showToast("Saved data could not be read. Please check browser storage.");
    return [];
  }
}

function persistTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error("Could not save HisabSaathi data:", error);
    showToast("Could not save this entry. Check available browser storage.");
    return false;
  }
}

function currentMessages() {
  return messages[locale] || messages["en-IN"];
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function applyLanguage() {
  locale = elements.language.value;
  const m = currentMessages();
  const labels = {
    "today-label": "today", "welcome-title": "welcome", "welcome-subtitle": "subtitle",
    "sales-label": "sales", "sales-note": "salesNote", "expenses-label": "expenses", "expenses-note": "expensesNote",
    "credit-label": "credit", "credit-note": "creditNote", "voice-eyebrow": "voiceEyebrow", "voice-title": "voiceTitle",
    "privacy-label": "privacy", "voice-hint": "voiceHint", "manual-divider": "manualDivider",
    "transcript-label": "transcript", "confirmation-title": "confirmation", "cancel-button": "cancel",
    "confirm-button": "save", "try-eyebrow": "tryEyebrow", "try-title": "tryTitle",
    "example-sale-title": "saleTitle", "example-sale-copy": "saleCopy", "example-expense-title": "expenseTitle",
    "example-expense-copy": "expenseCopy", "example-credit-title": "creditTitle", "example-credit-copy": "creditCopy",
    "tip-copy": "tip", "history-eyebrow": "historyEyebrow", "history-title": "historyTitle",
    "customers-eyebrow": "customersEyebrow", "customers-title": "customersTitle",
    "history-empty-copy": "historyEmpty", "customers-empty-copy": "customersEmpty", "footer-copy": "footer",
    "reset-demo": "reset"
  };
  for (const [id, key] of Object.entries(labels)) setText(id, m[key]);
  elements.commandInput.placeholder = m.placeholder;
  document.getElementById("command-label").textContent = m.voiceTitle;
  elements.micButton.setAttribute("aria-label", m.idleButton);
  document.documentElement.lang = locale.slice(0, 2);
  if (!elements.micButton.classList.contains("is-listening")) elements.micLabel.textContent = m.mic;
  renderDashboard();
}

function formatCurrency(value) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}

function formatTime(iso) {
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function creditBalances() {
  const balances = new Map();
  transactions.filter((item) => item.type === "credit").forEach((item) => {
    const name = item.customer.trim();
    const key = name.toLocaleLowerCase();
    const current = balances.get(key) || { name, amount: 0 };
    current.amount += item.amount;
    balances.set(key, current);
  });
  return [...balances.values()].filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);
}

function renderDashboard() {
  const today = todayKey();
  const todayTransactions = transactions.filter((item) => todayKey(new Date(item.createdAt)) === today);
  const sales = todayTransactions.filter((item) => item.type === "sale" || item.type === "credit").reduce((sum, item) => sum + item.amount, 0);
  const expenses = todayTransactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  const outstanding = creditBalances().reduce((sum, item) => sum + item.amount, 0);
  elements["sales-total"].textContent = formatCurrency(sales);
  elements["expenses-total"].textContent = formatCurrency(expenses);
  elements["credit-total"].textContent = formatCurrency(outstanding);

  const sorted = [...transactions].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const recent = sorted.slice(0, 6);
  elements.transactionList.innerHTML = recent.map((item) => {
    const m = currentMessages();
    const title = item.type === "credit" ? `${item.customer} · ${item.description}` : item.description;
    const icon = item.type === "sale" ? "↗" : item.type === "expense" ? "↘" : "◷";
    const sign = item.type === "expense" ? "−" : "+";
    return `<div class="transaction-row">
      <span class="transaction-icon ${item.type}" aria-hidden="true">${icon}</span>
      <span><span class="transaction-name">${escapeHTML(title || m.type[item.type])}</span><span class="transaction-meta">${escapeHTML(m.type[item.type])} · ${escapeHTML(formatTime(item.createdAt))}</span></span>
      <span class="transaction-amount ${item.type}">${sign}${escapeHTML(formatCurrency(item.amount))}</span>
    </div>`;
  }).join("");
  elements.historyEmpty.hidden = recent.length > 0;
  elements.transactionList.hidden = recent.length === 0;
  elements.recordCount.textContent = `${transactions.length} ${currentMessages().entries}`;

  const customers = creditBalances();
  elements.customerList.innerHTML = customers.map((customer) => {
    const initial = [...customer.name][0] || "?";
    return `<div class="customer-row">
      <span class="avatar" aria-hidden="true">${escapeHTML(initial.toLocaleUpperCase())}</span>
      <span><span class="customer-name">${escapeHTML(customer.name)}</span><span class="customer-subtitle">${escapeHTML(currentMessages().outstanding)}</span></span>
      <span class="customer-balance">${escapeHTML(formatCurrency(customer.amount))}</span>
    </div>`;
  }).join("");
  elements.customersEmpty.hidden = customers.length > 0;
  elements.customerList.hidden = customers.length === 0;
  elements.customerCount.textContent = String(customers.length);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 3600);
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  window.speechSynthesis.speak(utterance);
}

function normalizeText(text) {
  return text.toLocaleLowerCase().replace(/[,.!?।]/g, " ").replace(/\s+/g, " ").trim();
}

function extractAmount(text) {
  const explicitAmount = text.match(/(?:₹\s*(\d[\d,]*(?:\.\d{1,2})?)|(\d[\d,]*(?:\.\d{1,2})?)\s*(?:rupees?|rs\.?|inr|రూపాయలు?|రూపాయి|రూపాయ|रुपये|रुपया|रुपए))/i);
  const numericAmounts = [...text.matchAll(/\d[\d,]*(?:\.\d{1,2})?/g)];
  const match = explicitAmount || numericAmounts[numericAmounts.length - 1];
  if (!match) return null;
  const amountText = match[1] || match[2] || match[0];
  const amount = Number(amountText.replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 && amount <= 100000000 ? amount : null;
}

function parseCustomer(text) {
  const english = text.match(/^\s*([A-Za-z][A-Za-z'-]*)\s+(?:purchased|bought|took|got|has)\b/i)
    || text.match(/\b(?:customer|from)\s+([A-Za-z][A-Za-z'-]*)\b/i);
  if (english) return english[1];
  const hindi = text.match(/^\s*([\u0900-\u097f]{2,})\s+(?:ने|को)(?:\s|$)/);
  if (hindi) return hindi[1];
  const telugu = text.match(/^\s*([\u0c00-\u0c7f]{2,})\s+(?:కు|కి|అప్పుగా|తీసుకున్నాడు|తీసుకుంది)(?:\s|$)/);
  if (telugu) return telugu[1];
  return null;
}

function parseQuestion(text) {
  const normalized = normalizeText(text);
  const asksSales = /\b(how much|what are|what were|tell me|total)\b/.test(normalized)
    && /\b(sales?|sold|sell|today)\b/.test(normalized)
    || /(?:आज|आज की).*(?:बिक्री|बेचा)|(?:ఈరోజు|ఈ రోజు).*(?:అమ్మకాలు|అమ్మాను)/.test(normalized);
  if (asksSales) {
    const total = transactions
      .filter((item) => (item.type === "sale" || item.type === "credit") && todayKey(new Date(item.createdAt)) === todayKey())
      .reduce((sum, item) => sum + item.amount, 0);
    return { answer: `${currentMessages().salesAnswer} ${formatCurrency(total)}.` };
  }

  const asksOwed = /\b(owe|owes|owed|owing|balance|due)\b/.test(normalized)
    || (/\bcredit\b/.test(normalized) && /\b(how much|what does|what is|tell me)\b/.test(normalized))
    || /(?:कितना|कितने).*(?:उधार|बकाया|देना)|(?:ఎంత|ఎవరు).*(?:బాకీ|అప్పు)/.test(normalized);
  if (asksOwed) {
    const namedCustomer = parseCustomer(text)
      || text.match(/\b(?:does|do|is|for)\s+([A-Za-z][A-Za-z'-]*)\b/i)?.[1]
      || text.match(/\b([A-Za-z][A-Za-z'-]*)\s+(?:owe|owes|ow|debt|balance)\b/i)?.[1]
      || text.match(/^\s*([\u0900-\u097f]{2,})\s+(?:का|की|के|पर|को)(?:\s|$)/)?.[1]
      || text.match(/^\s*([\u0c00-\u0c7f]{2,})\s+(?=ఎంత|ఎవరు|కు|కి)/)?.[1]
      || text.match(/(?:కోసం)\s*([\u0c00-\u0c7f]+)/)?.[1];
    if (!namedCustomer) return { error: currentMessages().unclear };
    const balance = creditBalances().find((item) => item.name.toLocaleLowerCase() === namedCustomer.toLocaleLowerCase());
    if (!balance) return { answer: `${namedCustomer} ${currentMessages().noDebt}` };
    return { answer: `${namedCustomer} ${currentMessages().owesAnswer} ${formatCurrency(balance.amount)}.` };
  }
  return null;
}

function parseCommand(text) {
  const question = parseQuestion(text);
  if (question) return { kind: "question", ...question };

  const normalized = normalizeText(text);
  const isCredit = /\b(credit|on credit|owe|owed|borrowed)\b/.test(normalized)
    || /(?:उधार|बकाया|अभी देना|ఖాతాలో|అప్పుగా|బాకీ)/.test(normalized);
  const isExpense = /\b(spent|spend|expense|expenses|paid|payment|cost)\b/.test(normalized)
    || /(?:खर्च|खरीदा|भुगतान|व्यय|ఖర్చు|చెల్లించ|కొన్నాను)/.test(normalized);
  const isSale = /\b(sold|sell|sale|sales|purchased|bought)\b/.test(normalized)
    || /(?:बेचा|बिक्री|बेच|అమ్మకాలు|అమ్మాను|అమ్మిన|విక్రయ)/.test(normalized);
  const amount = extractAmount(text);

  if (!isCredit && !isExpense && !isSale) return { error: currentMessages().unclear };
  if (!amount) return { error: currentMessages().missingAmount };

  let type = isCredit ? "credit" : isExpense ? "expense" : isSale ? "sale" : null;
  if (!type) return { error: currentMessages().unclear };
  if (type === "credit") {
    const customer = parseCustomer(text);
    if (!customer) return { error: currentMessages().missingCustomer };
    const description = text.replace(customer, "").trim();
    return { transaction: { type, amount, customer, description: cleanDescription(text, customer, type) } };
  }
  return { transaction: { type, amount, customer: "", description: cleanDescription(text, "", type) } };
}

function cleanDescription(text, customer, type) {
  const amountMatch = text.match(/(?:₹\s*\d[\d,]*(?:\.\d{1,2})?|\d[\d,]*(?:\.\d{1,2})?\s*(?:rupees?|rs\.?|inr|రూపాయలు?|రూపాయి|రూపాయ|रुपये|रुपया|रुपए))/i);
  let description = text;
  if (amountMatch) {
    description = text.replace(amountMatch[0], " ");
  } else {
    const numericMatches = [...text.matchAll(/\d[\d,]*(?:\.\d{1,2})?/g)];
    const amountToken = numericMatches[numericMatches.length - 1];
    if (amountToken) description = `${text.slice(0, amountToken.index)} ${text.slice(amountToken.index + amountToken[0].length)}`;
  }
  if (customer) description = description.replace(customer, " ");
  description = description
    .replace(/\b(i|we|today|on credit|credit|rupees?|rs\.?|inr|spent|spend|expense|expenses|paid|payment|cost|sold|sell|sale|sales|purchased|bought|worth|for|the|a|an|of|to|on|in|my)\b/ig, " ")
    .replace(/(?:^|\s)(मैंने|मैं|ने|आज|रुपये|रुपया|रुपए|उधार|खर्च|खरीदा|बेचा|बिक्री|అప్పుగా|రూపాయలు?|ఖర్చు|అమ్మాను|అమ్మకాలు|తీసుకున్నాడు|తీసుకుంది|ఈరోజు)(?=\s|$)/g, " ")
    .replace(/[.,!?।]/g, " ").replace(/\s+/g, " ").trim();
  if (!description || description.length < 2) {
    return type === "expense" ? currentMessages().type.expense : type === "credit" ? currentMessages().type.credit : currentMessages().type.sale;
  }
  return [...description].slice(0, 60).join("");
}

function handleInput(text) {
  const cleaned = text.trim();
  if (!cleaned) {
    showToast(currentMessages().askRepeat);
    return;
  }
  elements.transcriptText.textContent = cleaned;
  elements.transcriptBox.hidden = false;
  const result = parseCommand(cleaned);
  if (result.answer) {
    pendingTransaction = null;
    elements.confirmationBox.hidden = true;
    showToast(result.answer);
    speak(result.answer);
    return;
  }
  if (result.error) {
    pendingTransaction = null;
    elements.confirmationBox.hidden = true;
    showToast(result.error);
    speak(result.error);
    return;
  }
  pendingTransaction = { ...result.transaction, createdAt: new Date().toISOString() };
  const typeLabel = currentMessages().type[pendingTransaction.type];
  const detail = pendingTransaction.type === "credit"
    ? `${typeLabel}: ${formatCurrency(pendingTransaction.amount)} · ${pendingTransaction.customer} · ${pendingTransaction.description}`
    : `${typeLabel}: ${formatCurrency(pendingTransaction.amount)} · ${pendingTransaction.description}`;
  elements.confirmationDetails.textContent = detail;
  elements.confirmationBox.hidden = false;
  speak(`${currentMessages().confirmation}. ${detail}`);
}

function savePendingTransaction() {
  if (!pendingTransaction) return;
  const fingerprint = `${pendingTransaction.type}|${pendingTransaction.amount}|${pendingTransaction.customer.toLocaleLowerCase()}|${pendingTransaction.description.toLocaleLowerCase()}`;
  if (fingerprint === lastSavedFingerprint && Date.now() - lastSavedAt < 8000) {
    pendingTransaction = null;
    elements.confirmationBox.hidden = true;
    showToast(currentMessages().duplicate);
    speak(currentMessages().duplicate);
    return;
  }
  const transaction = { ...pendingTransaction, id: createId() };
  if (!isValidTransaction(transaction)) {
    showToast(currentMessages().missingAmount);
    return;
  }
  transactions.push(transaction);
  if (!persistTransactions()) {
    transactions.pop();
    return;
  }
  lastSavedFingerprint = fingerprint;
  lastSavedAt = Date.now();
  pendingTransaction = null;
  elements.confirmationBox.hidden = true;
  elements.transcriptBox.hidden = true;
  elements.commandInput.value = "";
  renderDashboard();
  showToast(currentMessages().saved);
  speak(currentMessages().saved);
}

function cancelPendingTransaction() {
  pendingTransaction = null;
  elements.confirmationBox.hidden = true;
  showToast(currentMessages().cancelled);
  speak(currentMessages().cancelled);
}

function stopRecognition() {
  if (!recognition) return;
  recognition.stop();
  recognition = null;
}

function startRecognition() {
  if (!recognitionSupported) {
    showToast(currentMessages().micUnsupported);
    return;
  }
  if (recognition) {
    stopRecognition();
    return;
  }
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new Recognition();
  recognition.lang = locale;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  let finalTranscript = "";
  elements.micButton.classList.add("is-listening");
  elements.micButton.setAttribute("aria-label", currentMessages().listeningButton);
  elements.micLabel.textContent = currentMessages().listeningButton;
  elements.listeningStatus.textContent = currentMessages().listening;
  recognition.onresult = (event) => {
    let interim = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      if (event.results[index].isFinal) finalTranscript += event.results[index][0].transcript;
      else interim += event.results[index][0].transcript;
    }
    const visibleTranscript = (finalTranscript + " " + interim).trim();
    if (visibleTranscript) {
      elements.transcriptText.textContent = visibleTranscript;
      elements.transcriptBox.hidden = false;
    }
    if (finalTranscript.trim()) {
      elements.listeningStatus.textContent = currentMessages().processing;
      handleInput(finalTranscript);
      stopRecognition();
    }
  };
  recognition.onerror = (event) => {
    const permissionError = event.error === "not-allowed" || event.error === "service-not-allowed";
    const message = permissionError ? currentMessages().micPermission : event.error === "no-speech" ? currentMessages().noSpeech : currentMessages().micError;
    elements.listeningStatus.textContent = "";
    showToast(message);
    if (permissionError) speak(message);
    stopRecognition();
  };
  recognition.onend = () => {
    elements.micButton.classList.remove("is-listening");
    elements.micButton.setAttribute("aria-label", currentMessages().idleButton);
    elements.micLabel.textContent = currentMessages().mic;
    elements.listeningStatus.textContent = "";
    recognition = null;
    if (!finalTranscript.trim()) elements.transcriptBox.hidden = true;
  };
  try {
    recognition.start();
  } catch (error) {
    console.error("Could not start speech recognition:", error);
    stopRecognition();
    elements.micButton.classList.remove("is-listening");
    elements.micLabel.textContent = currentMessages().mic;
    showToast(currentMessages().micError);
  }
}

elements.language.addEventListener("change", applyLanguage);
elements.micButton.addEventListener("click", startRecognition);
elements.entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleInput(elements.commandInput.value);
});
elements.confirmButton.addEventListener("click", savePendingTransaction);
elements.cancelButton.addEventListener("click", cancelPendingTransaction);
document.querySelectorAll(".example-item").forEach((button) => {
  button.addEventListener("click", () => {
    elements.commandInput.value = button.dataset.example;
    handleInput(button.dataset.example);
  });
});
document.getElementById("reset-demo").addEventListener("click", () => {
  if (!window.confirm(currentMessages().resetConfirm)) return;
  const original = transactions;
  transactions = makeSampleData();
  if (!persistTransactions()) {
    transactions = original;
    return;
  }
  pendingTransaction = null;
  elements.confirmationBox.hidden = true;
  elements.transcriptBox.hidden = true;
  renderDashboard();
  showToast(currentMessages().resetDone);
});

applyLanguage();
