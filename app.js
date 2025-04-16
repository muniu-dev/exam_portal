document.addEventListener('DOMContentLoaded', () => {
    const isTeacher = new URLSearchParams(window.location.search).has('teacher');
    const timerElement = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const teacherPanel = document.getElementById('teacherPanel');
    const pdfViewer = document.getElementById('pdf-viewer');

    // Load settings from localStorage
    let examDuration = localStorage.getItem('examDuration') || 60;
    let pdfFilename = localStorage.getItem('pdfFilename');
    let startTime = localStorage.getItem('timerStart');

    // Initialize UI
    if (isTeacher) {
        teacherPanel.style.display = 'block';
        document.getElementById('pdfFilename').value = pdfFilename || '';
        document.getElementById('examDuration').value = examDuration;
    } else {
        startBtn.style.display = 'block';
        if (pdfFilename) pdfViewer.src = `./${pdfFilename}`;
    }

    // Timer functions
    function updateTimer() {
        if (!startTime) return;

        const elapsed = Date.now() - startTime;
        const remaining = (examDuration * 60000) - elapsed;
        
        if (remaining <= 0) {
            timerElement.textContent = 'TIME\'S UP!';
            localStorage.remove 