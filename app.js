document.addEventListener('DOMContentLoaded', () => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const isTeacher = urlParams.has('teacher');

    // DOM Elements
    const timerElement = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const teacherPanel = document.getElementById('teacherPanel');
    const pdfViewer = document.getElementById('pdf-viewer');

    // Load settings from localStorage
    let examDuration = parseInt(localStorage.getItem('examDuration')) || 60;
    let pdfFilename = localStorage.getItem('pdfFilename') || '';
    let startTime = parseInt(localStorage.getItem('timerStart')) || null;

    // Initialize UI based on mode
    if (isTeacher) {
        // Teacher Mode Configuration
        teacherPanel.style.display = 'block';
        startBtn.style.display = 'none';
        document.getElementById('pdfFilename').value = pdfFilename;
        document.getElementById('examDuration').value = examDuration;
        pdfViewer.style.display = 'none'; // Hide PDF viewer for teachers
    } else {
        // Student Mode Configuration
        teacherPanel.style.display = 'none';
        startBtn.style.display = 'block';
        pdfViewer.style.display = 'block';
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

    // Start button handler
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

// Teacher settings save function
function saveSettings() {
    const filenameInput = document.getElementById('pdfFilename');
    const durationInput = document.getElementById('examDuration');

    // Input validation
    if (!filenameInput.value.endsWith('.pdf')) {
        alert('Please enter a valid PDF filename (must end with .pdf)');
        return;
    }

    if (durationInput.value < 1 || durationInput.value > 360) {
        alert('Exam duration must be between 1 and 360 minutes');
        return;
    }

    // Save settings
    localStorage.setItem('pdfFilename', filenameInput.value);
    localStorage.setItem('examDuration', durationInput.value);

    // Confirmation
    alert(`Settings updated:\nPDF: ${filenameInput.value}\nDuration: ${durationInput.value} minutes`);
    window.location.reload(); // Refresh to apply changes
}