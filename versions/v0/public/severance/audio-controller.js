(() => {
  let currentAudio = null;
  let currentTurn = 0;

  function stopCurrentAudio() {
    if (!currentAudio) return;
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    try {
      currentAudio.currentTime = 0;
    } catch (error) {
      // Some browsers reject seeking before media metadata is available.
    }
    currentAudio.src = '';
    currentAudio = null;
  }

  function beginTurn() {
    currentTurn += 1;
    stopCurrentAudio();
    return currentTurn;
  }

  function playAudio(url, turn = currentTurn) {
    if (!url || turn !== currentTurn) return;
    stopCurrentAudio();

    const audio = new Audio(url);
    currentAudio = audio;
    const release = () => {
      if (currentAudio === audio) currentAudio = null;
    };
    audio.onended = release;
    audio.onerror = release;
    audio.play().catch(error => {
      release();
      console.error('Audio play failed:', error);
    });
  }

  function stopAll() {
    currentTurn += 1;
    stopCurrentAudio();
  }

  window.AIAudioController = Object.freeze({
    beginTurn,
    playAudio,
    stopCurrentAudio,
    stopAll
  });

  window.addEventListener('pagehide', stopAll);
})();
