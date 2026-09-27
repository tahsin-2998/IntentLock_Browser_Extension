let popupTimerInterval;

function autoExpandTextarea(element) {
  element.style.height = 'auto';
  element.style.height = element.scrollHeight + 'px';
}

function updateTimerDisplay() {
  chrome.storage.local.get(['pomoState', 'pomoEndTime'], (data) => {
    const display = document.getElementById('timerDisplay');
    const statusText = document.getElementById('timerStatus');
    
    if (!data.pomoState || data.pomoState === 'none') {
      display.innerText = "--:--";
      statusText.innerText = "Idle / Default Mode";
      statusText.style.color = "var(--text-muted)";
      return;
    }

    const remaining = data.pomoEndTime - Date.now();
    
    if (remaining <= 0) {
      display.innerText = "00:00";
      statusText.innerText = "Finished";
      // Reset state if timer is done
      chrome.storage.local.set({ pomoState: 'none' });
      return;
    }

    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (data.pomoState === 'focus') {
      statusText.innerText = "Focus Time Active";
      statusText.style.color = "var(--neon-blue)";
    } else if (data.pomoState === 'break') {
      statusText.innerText = "Break Time Active";
      statusText.style.color = "var(--neon-green)";
    }
  });
}

function setPomodoro(state, minutesInputId) {
  const mins = parseFloat(document.getElementById(minutesInputId).value) || 0;
  if (mins <= 0) return;
  
  const endTime = Date.now() + (mins * 60 * 1000);
  
  chrome.storage.local.set({ pomoState: state, pomoEndTime: endTime }, () => {
    updateTimerDisplay();
    // Create a precise system alarm that triggers when the time is up
    chrome.alarms.create('pomodoroAlarm', { when: endTime });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['extensionActive', 'minutes', 'message', 'whitelist', 'focusTime', 'breakTime'], (data) => {
    // Master Toggle
    document.getElementById('masterToggle').checked = data.extensionActive !== false; // default true
    
    // Inputs
    if (data.minutes) document.getElementById('minutes').value = data.minutes;
    if (data.focusTime) document.getElementById('focusTime').value = data.focusTime;
    if (data.breakTime) document.getElementById('breakTime').value = data.breakTime;
    
    const messageField = document.getElementById('message');
    const whitelistField = document.getElementById('whitelist');

    if (data.message) {
      messageField.value = data.message;
      autoExpandTextarea(messageField);
    }
    if (data.whitelist) {
      whitelistField.value = data.whitelist;
      autoExpandTextarea(whitelistField);
    }

    // Start UI timer loop
    updateTimerDisplay();
    popupTimerInterval = setInterval(updateTimerDisplay, 1000);
  });
});

['message', 'whitelist'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => autoExpandTextarea(el));
});

// Pomodoro Buttons
document.getElementById('btnFocus').addEventListener('click', () => setPomodoro('focus', 'focusTime'));
document.getElementById('btnBreak').addEventListener('click', () => setPomodoro('break', 'breakTime'));
document.getElementById('btnStop').addEventListener('click', () => {
  chrome.alarms.clear('pomodoroAlarm');
  chrome.storage.local.set({ pomoState: 'none' }, updateTimerDisplay);
});

// Master Toggle
document.getElementById('masterToggle').addEventListener('change', (e) => {
  chrome.storage.local.set({ extensionActive: e.target.checked });
});

// Save Settings Button
document.getElementById('saveBtn').addEventListener('click', () => {
  const minutes = document.getElementById('minutes').value;
  const focusTime = document.getElementById('focusTime').value;
  const breakTime = document.getElementById('breakTime').value;
  const message = document.getElementById('message').value;
  const whitelist = document.getElementById('whitelist').value;

  chrome.storage.local.set({ minutes, focusTime, breakTime, message, whitelist }, () => {
    const status = document.getElementById('status');
    status.innerText = "System parameters updated.";
    setTimeout(() => { status.innerText = ""; }, 2000);
  });
});