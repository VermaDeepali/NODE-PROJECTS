const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const currentWaterText = document.getElementById('current-water');
  const targetWaterText = document.getElementById('target-water');
  const statusCommentText = document.getElementById('status-comment');
  const progressCircle = document.getElementById('progress-circle');
  
  const selectInterval = document.getElementById('select-interval');
  const inputGoal = document.getElementById('input-goal');
  const toggleSound = document.getElementById('toggle-sound');
  
  const btnReset = document.getElementById('btn-reset');
  const btnTestReminder = document.getElementById('btn-test-reminder');
  const quickAddButtons = document.querySelectorAll('.btn-quick');

  const circleLength = 527.7; // 2 * PI * r (r=84)

  // Request initial state from main process
  ipcRenderer.send('get-dashboard-state');

  // Listen for state update
  ipcRenderer.on('dashboard-state', (event, state) => {
    updateUI(state);
  });

  // Render method
  function updateUI(state) {
    const { consumed, goal, interval, muteSound } = state;

    // Update text content
    currentWaterText.textContent = consumed;
    targetWaterText.textContent = goal;
    inputGoal.value = goal;
    selectInterval.value = interval;
    toggleSound.checked = !muteSound;

    // Update circle progress
    const percent = Math.min(1, consumed / goal);
    const offset = circleLength - (percent * circleLength);
    progressCircle.style.strokeDashoffset = offset;

    // Update motivational comment
    let comment = "Let's start drinking water! 💧";
    if (percent === 0) {
      comment = "Let's start drinking water! 💧";
    } else if (percent < 0.25) {
      comment = "Good start! Keep it up. 👍";
    } else if (percent < 0.5) {
      comment = "Getting there! Hydration level rising. 📈";
    } else if (percent < 0.75) {
      comment = "You are halfway! Doing great! ⭐";
    } else if (percent < 1) {
      comment = "Almost at your goal! Just a bit more! 🔥";
    } else {
      comment = "Amazing! Daily goal achieved! 🏆🎉";
    }
    statusCommentText.textContent = comment;
  }

  // Bind change events
  selectInterval.addEventListener('change', (e) => {
    const val = parseInt(e.target.value, 10);
    ipcRenderer.send('set-interval', val);
  });

  inputGoal.addEventListener('change', (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 500) val = 500;
    if (val > 5000) val = 5000;
    e.target.value = val;
    ipcRenderer.send('set-goal', val);
  });

  toggleSound.addEventListener('change', (e) => {
    ipcRenderer.send('set-sound', !e.target.checked); // main stores as muteSound
  });

  // Bind click actions
  btnReset.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset today's water intake statistics?")) {
      ipcRenderer.send('reset-stats');
    }
  });

  btnTestReminder.addEventListener('click', () => {
    ipcRenderer.send('test-reminder');
  });

  quickAddButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.getAttribute('data-amount'), 10);
      ipcRenderer.send('increment-water', amount);
    });
  });
});
