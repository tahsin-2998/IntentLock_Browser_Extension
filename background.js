chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'pomodoroAlarm') {
    
    // 1. Push the PC Notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'IntentLock',
      message: 'Time is up. Transition to your next phase.',
      priority: 2
    });

    // 2. Setup the offscreen document to play audio
    await setupOffscreenDocument('offscreen.html');
    
    // 3. Send a message to the offscreen document to play the sound
    chrome.runtime.sendMessage({ playAudio: true });

    // 4. Reset the state
    chrome.storage.local.set({ pomoState: 'none' });
  }
});

// Helper function to create the offscreen document required for Manifest V3 audio
async function setupOffscreenDocument(path) {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT']
  });
  if (existingContexts.length > 0) return;

  await chrome.offscreen.createDocument({
    url: path,
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Playing Pomodoro alarm sound'
  });
}