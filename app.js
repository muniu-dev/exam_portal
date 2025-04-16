document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const isTeacher = window.location.href.includes('?teacher');
    const timerElement = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const teacherPanel = document.getElementById('teacherPanel');
    const pdfViewer = document.getElementById('pdf-viewer');

    // Load settings from localStorage
    let examDuration = parseInt(localStorage.getItem('examDuration')) || 60;
    let pdfFilename = localStorage.getItem('pdfFilename') || '';
    let startTime = parseInt(localStorage.getItem('timerStart')) || null;

    // Initialize UI
    if (isTeacher) {
        teacherPanel.style.display = 'block';
        document.getElementById('pdfFilename').value = pdfFilename;
        document.getElementById('examDuration').value = examDuration;
    } else {
        startBtn.style.display = 'block';
        if (pdfFilename) {
            pdfViewer.data = pdfFilename;
        }
    }

    // Timer functionality
    function updateTimer() {
        if (!startTime) return;

        const elapsed = Date.now() - startTime;
        const remaining = (examDuration * 60000) - elapsed;

        if (remaining <= 0) {
            timerElement.textContent = 'TIME\'S UP!';
            localStorage.removeItem('timerStart');
            return;
        }

        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        timerElement.textContent = 
            `${String(hours).padStart(2, '0')}:` +
            `${String(minutes).padStart(2, '0')}:` +
            `${String(seconds).padStart(2, '0')}`;

        setTimeout(updateTimer, 1000);
    }

    // Event listeners
    startBtn.addEventListener('click', () => {
        startTime = Date.now();
        localStorage.setItem('timerStart', startTime);
        startBtn.style.display = 'none';
        updateTimer();
    });

    // Check for existing timer
    if (localStorage.getItem('timerStart') && !isTeacher) {
        updateTimer();
    }
});

// Teacher settings function
function saveSettings() {
    const filenameInput = document.getElementById('pdfFilename');
    const durationInput = document.getElementById('examDuration');

    const newFilename = filenameInput.value.trim();
    const newDuration = parseInt(durationInput.value) || 60;

    if (!newFilename) {
        alert('Please enter a valid PDF filename!');
        return;
    }

    localStorage.setItem('pdfFilename', newFilename);
    localStorage.setItem('examDuration', newDuration);

    document.getElementById('pdf-viewer').data = newFilename;
    alert('Settings saved successfully!\nStudents will now see: ' + newFilename);
}