document.addEventListener('DOMContentLoaded', function() {
    // Get the status button
    const statusBtn = document.getElementById('status');

    // Function to check if we're on a LeetCode problem page
    function checkProblemPage() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (!tabs || !tabs.length || !tabs[0]?.url) {
                console.error('No valid tab found');
                return;
            }

            const isProblemPage = tabs[0].url.includes('/problems/');
            if (isProblemPage) {
                statusBtn.textContent = 'On Problem Page';
                statusBtn.style.backgroundColor = '#4CAF50';
            } else {
                statusBtn.textContent = 'Not on Problem Page';
                statusBtn.style.backgroundColor = '#f44336';
            }
        });
    }

    // Check the current page status
    checkProblemPage();
}); 