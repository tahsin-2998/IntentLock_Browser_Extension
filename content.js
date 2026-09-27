let timer = null;

function checkAndShowReminder() {
  chrome.storage.local.get(['extensionActive', 'pomoState', 'pomoEndTime', 'minutes', 'message', 'whitelist'], (data) => {
    // 1. Is the master switch turned off for a break day?
    if (data.extensionActive === false) {
      return; 
    }

    // 2. Are we currently in a Pomodoro break?
    if (data.pomoState === 'break' && data.pomoEndTime > Date.now()) {
      return; 
    }

    // 3. Normal validation: check if current URL is whitelisted
    const currentUrl = window.location.href.trim();
    const whitelistStr = data.whitelist || "";
    const whitelistItems = whitelistStr.split(',').map(item => item.trim()).filter(item => item !== "");

    const isWhitelisted = whitelistItems.some(item => {
      if (!item) return false;
      if (item.startsWith('http://') || item.startsWith('https://')) {
        return currentUrl === item || currentUrl.startsWith(item);
      }
      return currentUrl.toLowerCase().includes(item.toLowerCase());
    });

    if (isWhitelisted) {
      return; // Safe site, do nothing
    }

    // 4. Default Message if empty
    const customMessage = data.message || "The Pain of Boredom is also Pain. And Every Pain you endure today will help you tomorrow in one way or another.";

    // 5. Fire Reminder
    showAlertOverlay(customMessage);
  });
}

function startReminderTimer() {
  chrome.storage.local.get(['minutes'], (data) => {
    const minutes = parseFloat(data.minutes) || 5; // Default is now 5 minutes
    const msInterval = minutes * 60 * 1000;

    if (timer) clearInterval(timer);

    // Set recurring timer
    timer = setInterval(() => {
      checkAndShowReminder();
    }, msInterval);
  });
}

function showAlertOverlay(message) {
  if (document.getElementById('identity-reminder-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'identity-reminder-overlay';
  
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0', left: '0', width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    color: '#ffffff',
    zIndex: '99999999',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    padding: '20px', boxSizing: 'border-box', textAlign: 'center'
  });

  const messageBox = document.createElement('div');
  Object.assign(messageBox.style, {
    maxWidth: '600px', fontSize: '24px', lineHeight: '1.6', marginBottom: '30px', fontWeight: '500'
  });
  messageBox.innerText = message;

  const closeButton = document.createElement('button');
  closeButton.innerText = "I understand. Back to work.";
  Object.assign(closeButton.style, {
    padding: '12px 24px', fontSize: '16px', fontWeight: 'bold',
    backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
  });
  
  closeButton.onclick = () => {
    overlay.remove();
  };

  overlay.appendChild(messageBox);
  overlay.appendChild(closeButton);
  document.body.appendChild(overlay);
}

// Track URL changes dynamically (e.g., YouTube AJAX)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    if (timer) clearInterval(timer);
    startReminderTimer();
  }
}).observe(document, {subtree: true, childList: true});

// Initialize
if (document.readyState === 'complete') {
  startReminderTimer();
} else {
  window.addEventListener('load', startReminderTimer);
}