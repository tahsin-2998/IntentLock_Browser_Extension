chrome.runtime.onMessage.addListener((message) => {
  if (message.playAudio) {
    const audio = document.getElementById('audioPlayer');
    audio.volume = 1.0;
    audio.play();
  }
});