console.log('Leetcode Coach extension loaded!');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "analyzeProblem":
            analyzeProblem();
            break;
        case "showHints":
            showHints();
            break;
        case "checkTimeComplexity":
            checkTimeComplexity();
            break;
    }
});

// Function to analyze the current problem
function analyzeProblem() {
    // Get problem title
    const title = document.querySelector('[data-cy="question-title"]')?.textContent;
    
    // Get problem description
    const description = document.querySelector('[data-cy="question-description"]')?.innerHTML;
    
    // Get difficulty
    const difficulty = document.querySelector('[data-cy="question-difficulty"]')?.textContent;
    
    // Create analysis container
    const analysisContainer = document.createElement('div');
    analysisContainer.className = 'leetcode-coach-analysis';
    analysisContainer.innerHTML = `
        <div class="analysis-header">
            <h3>Problem Analysis</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="analysis-content">
            <p><strong>Title:</strong> ${title || 'Not found'}</p>
            <p><strong>Difficulty:</strong> ${difficulty || 'Not found'}</p>
            <div class="key-points">
                <h4>Key Points:</h4>
                <ul>
                    <li>Analyzing problem requirements...</li>
                    <li>Identifying input/output patterns...</li>
                    <li>Looking for edge cases...</li>
                </ul>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .leetcode-coach-analysis {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px;
            z-index: 1000;
        }
        .analysis-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
        .key-points {
            margin-top: 15px;
        }
        .key-points ul {
            padding-left: 20px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(analysisContainer);
    
    // Add close button functionality
    analysisContainer.querySelector('.close-btn').addEventListener('click', () => {
        analysisContainer.remove();
    });
}

// Function to show hints
function showHints() {
    // Create hints container
    const hintsContainer = document.createElement('div');
    hintsContainer.className = 'leetcode-coach-hints';
    hintsContainer.innerHTML = `
        <div class="hints-header">
            <h3>Problem Hints</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="hints-content">
            <ol>
                <li>Read the problem carefully and understand the requirements</li>
                <li>Identify the input and output constraints</li>
                <li>Think about edge cases and special scenarios</li>
                <li>Consider different approaches to solve the problem</li>
                <li>Start with a brute force solution if needed</li>
                <li>Optimize your solution for better time/space complexity</li>
            </ol>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .leetcode-coach-hints {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px;
            z-index: 1000;
        }
        .hints-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
        .hints-content ol {
            padding-left: 20px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(hintsContainer);
    
    // Add close button functionality
    hintsContainer.querySelector('.close-btn').addEventListener('click', () => {
        hintsContainer.remove();
    });
}

// Function to check time complexity
function checkTimeComplexity() {
    // Get the code editor content
    const codeEditor = document.querySelector('.monaco-editor');
    if (!codeEditor) {
        alert('Please open the code editor first');
        return;
    }
    
    // Create time complexity container
    const complexityContainer = document.createElement('div');
    complexityContainer.className = 'leetcode-coach-complexity';
    complexityContainer.innerHTML = `
        <div class="complexity-header">
            <h3>Time Complexity Analysis</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="complexity-content">
            <div class="complexity-info">
                <p><strong>Best Case:</strong> O(1)</p>
                <p><strong>Average Case:</strong> O(n)</p>
                <p><strong>Worst Case:</strong> O(n²)</p>
            </div>
            <div class="complexity-explanation">
                <h4>Explanation:</h4>
                <p>This is a general analysis. The actual time complexity depends on your implementation.</p>
                <ul>
                    <li>Look for nested loops</li>
                    <li>Check for recursive calls</li>
                    <li>Consider data structure operations</li>
                </ul>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .leetcode-coach-complexity {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px;
            z-index: 1000;
        }
        .complexity-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
        .complexity-info {
            margin-bottom: 15px;
        }
        .complexity-explanation ul {
            padding-left: 20px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(complexityContainer);
    
    // Add close button functionality
    complexityContainer.querySelector('.close-btn').addEventListener('click', () => {
        complexityContainer.remove();
    });
} 