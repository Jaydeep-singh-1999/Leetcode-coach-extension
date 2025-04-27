document.addEventListener('DOMContentLoaded', function() {
    // Get all buttons
    const analyzeProblemBtn = document.getElementById('analyzeProblem');
    const showHintsBtn = document.getElementById('showHints');
    const timeComplexityBtn = document.getElementById('timeComplexity');

    // Add click event listeners
    analyzeProblemBtn.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "analyzeProblem"});
        });
    });

    showHintsBtn.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "showHints"});
        });
    });

    timeComplexityBtn.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "checkTimeComplexity"});
        });
    });
}); 