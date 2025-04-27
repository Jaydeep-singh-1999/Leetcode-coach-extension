console.log("LeetCode Coach Extension is running!");

// --- GLOBALS ---
let lastUrl = location.href;

// --- Add global styles ---
function addGlobalStyles() {
    if (document.getElementById('leetcode-coach-styles')) return;
    const style = document.createElement('style');
    style.id = 'leetcode-coach-styles';
    style.textContent = `
        /* Editor Blocker */
        .editor-blocker {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.3);
            z-index: 10000;
            pointer-events: all;
            display: block;
        }

        .editor-blocker.hidden {
            display: none;
        }

        /* Draggable Window */
        .approach-window {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            width: 600px;
            min-width: 400px;
            max-width: 90vw;
            height: 500px;
            min-height: 300px;
            max-height: 80vh;
            border: 1px solid #e0e0e0;
            z-index: 10002;
            display: flex;
            flex-direction: column;
            resize: both;
            overflow: auto;
        }

        .approach-window.hidden {
            display: none;
        }
        .approach-window h3 {
            margin: 0 0 20px 0;
            color: #2c3e50;
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            user-select: none;
        }
        #approachExplanation {
            width: 100%;
            flex: 1;
            padding: 15px;
            margin-bottom: 20px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            line-height: 1.5;
            transition: border-color 0.3s ease;
            background: white;
            resize: none;
            color: #2c3e50;
        }
        #approachExplanation:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
        #approachExplanation::placeholder {
            color: #95a5a6;
        }
        #submitApproach {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            width: 100%;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: auto;
        }
        #submitApproach:hover {
            background-color: #2980b9;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
        }
        #submitApproach:active {
            transform: translateY(0);
        }
        .approach-window p {
            color: #7f8c8d;
            font-size: 14px;
            margin-bottom: 20px;
            text-align: center;
            line-height: 1.5;
            user-select: none;
        }
        .minimize-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: #95a5a6;
            cursor: pointer;
            padding: 5px;
            font-size: 20px;
            transition: color 0.3s ease;
            z-index: 1;
        }
        .minimize-btn:hover {
            color: #2c3e50;
        }
        .approach-window.minimized {
            height: 60px !important;
            width: 200px !important;
            padding: 10px;
            overflow: hidden;
        }
        .approach-window.minimized h3,
        .approach-window.minimized p,
        .approach-window.minimized #approachExplanation {
            display: none;
        }
        .approach-window.minimized #submitApproach {
            margin-top: 0;
            padding: 8px 16px;
            font-size: 14px;
        }
        .resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: se-resize;
            background: linear-gradient(135deg, transparent 50%, #e0e0e0 50%);
        }
        /* Floating View Button */
        .view-approach-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10001;
            transition: all 0.3s ease;
        }

        .view-approach-btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .view-approach-btn svg {
            width: 16px;
            height: 16px;
        }

        /* Approach Popup */
        .approach-popup {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            width: 400px;
            max-width: 90vw;
            max-height: 60vh;
            overflow-y: auto;
            z-index: 10002;
            display: none;
        }

        .approach-popup.visible {
            display: block;
        }

        .approach-popup h4 {
            margin: 0 0 15px 0;
            color: #2c3e50;
            font-size: 18px;
        }

        .approach-popup p {
            margin: 0;
            color: #34495e;
            line-height: 1.5;
            white-space: pre-wrap;
        }

        .close-popup {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #95a5a6;
            cursor: pointer;
            font-size: 20px;
            padding: 5px;
        }

        .close-popup:hover {
            color: #2c3e50;
        }
    `;
    document.head.appendChild(style);
}

// --- Add overlay to block code editor ---
function addEditorOverlay() {
    const editor = document.querySelector('.monaco-editor');
    if (!editor) {
        console.log('Editor not found, retrying...');
        return false;
    }

    if (document.querySelector('.editor-blocker')) {
        console.log('Overlay already exists');
        return true;
    }

    // Add editor blocker
    const editorBlocker = document.createElement('div');
    editorBlocker.className = 'editor-blocker';
    editor.appendChild(editorBlocker);

    // Add draggable window
    const approachWindow = document.createElement('div');
    approachWindow.className = 'approach-window';
    approachWindow.innerHTML = `
    <button class="minimize-btn">−</button>  <!-- ADD THIS -->
        <h3>Explain Your Approach First</h3>
        <p>Take a moment to think about your solution before coding. This helps improve your problem-solving skills.</p>
        <textarea id="approachExplanation" placeholder="Write your approach here...&#10;&#10;• What's your initial thought process?&#10;• What data structures will you use?&#10;• What's the time complexity you're aiming for?"></textarea>
        <button id="submitApproach">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
            Submit Approach
        </button>
        <div class="resize-handle"></div>
    `;
    document.body.appendChild(approachWindow);

    // Add drag handle
    const dragHandle = document.createElement('div');
    dragHandle.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        cursor: grab;
        background: #f8f9fa;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
    `;f

    // Add dots for visual indicator
    const dots = document.createElement('div');
    dots.style.cssText = `
        display: flex;
        gap: 4px;
    `;
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            width: 6px;
            height: 6px;
            background: #95a5a6;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        `;
        dots.appendChild(dot);
    }
    dragHandle.appendChild(dots);

    // Add hover effects
    dragHandle.addEventListener('mouseenter', () => {
        dragHandle.style.background = '#f1f3f5';
        dots.querySelectorAll('div').forEach(dot => {
            dot.style.background = '#7f8c8d';
        });
    });

    dragHandle.addEventListener('mouseleave', () => {
        dragHandle.style.background = '#f8f9fa';
        dots.querySelectorAll('div').forEach(dot => {
            dot.style.background = '#95a5a6';
        });
    });

    // Change cursor when dragging
    dragHandle.addEventListener('mousedown', () => {
        dragHandle.style.cursor = 'grabbing';
        dragHandle.style.background = '#e9ecef';
        dots.querySelectorAll('div').forEach(dot => {
            dot.style.background = '#6c757d';
        });
    });

    document.addEventListener('mouseup', () => {
        dragHandle.style.cursor = 'grab';
        dragHandle.style.background = '#f8f9fa';
        dots.querySelectorAll('div').forEach(dot => {
            dot.style.background = '#95a5a6';
        });
    });

    approachWindow.insertBefore(dragHandle, approachWindow.firstChild);

    // Make window draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    dragHandle.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === dragHandle) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            approachWindow.style.left = `${currentX}px`;
            approachWindow.style.top = `${currentY}px`;
            approachWindow.style.transform = 'none';
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    // Add minimize functionality
    const minimizeBtn = approachWindow.querySelector('.minimize-btn');
    minimizeBtn.addEventListener('click', () => {
        approachWindow.classList.toggle('minimized');
        minimizeBtn.textContent = approachWindow.classList.contains('minimized') ? '+' : '−';
    });

    // Function to handle submission
    function handleSubmission() {
        const explanation = document.getElementById('approachExplanation').value.trim();
        if (explanation) {
            // Store the explanation first
            const currentProblemUrl = window.location.href;
            chrome.storage.sync.set({ [currentProblemUrl]: explanation }, () => {
                console.log('Approach explanation saved for:', currentProblemUrl);
                
                // Remove the editor blocker
                const editorBlocker = document.querySelector('.editor-blocker');
                if (editorBlocker) {
                    editorBlocker.remove();
                }
                
                // Remove the approach window
                const approachWindow = document.querySelector('.approach-window');
                if (approachWindow) {
                    approachWindow.remove();
                }
                
                // Add view approach button
                addViewApproachButton(explanation);
            });
        } else {
            alert('Please provide an explanation first.');
        }
    }

    // Function to add view approach button
    function addViewApproachButton(explanation) {
        // Remove existing button and popup if any
        const existingButton = document.querySelector('.view-approach-btn');
        const existingPopup = document.querySelector('.approach-popup');
        if (existingButton) existingButton.remove();
        if (existingPopup) existingPopup.remove();

        // Create and add view button
        const viewButton = document.createElement('button');
        viewButton.className = 'view-approach-btn';
        viewButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View My Approach
        `;
        document.body.appendChild(viewButton);

        // Create and add popup
        const popup = document.createElement('div');
        popup.className = 'approach-popup';
        popup.innerHTML = `
            <button class="close-popup">&times;</button>
            <h4>My Approach</h4>
            <p>${explanation.replace(/\n/g, '<br>')}</p>
        `;
        document.body.appendChild(popup);

        // Add click handlers
        viewButton.addEventListener('click', () => {
            popup.classList.toggle('visible');
        });

        const closeButton = popup.querySelector('.close-popup');
        closeButton.addEventListener('click', () => {
            popup.classList.remove('visible');
        });

        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!popup.contains(e.target) && e.target !== viewButton) {
                popup.classList.remove('visible');
            }
        });
    }

    // Add submit button functionality
    const submitButton = document.getElementById('submitApproach');
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmission);
    }

    // Also allow submission on Enter key in textarea
    const textarea = document.getElementById('approachExplanation');
    if (textarea) {
        textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                handleSubmission();
            }
        });
    }

    return true;
}

// --- Remove existing overlay if any ---
function removeEditorOverlay() {
    const overlay = document.querySelector('.leetcode-coach-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// --- Check if approach is explained ---
function checkApproachExplanation() {
    const currentProblemUrl = window.location.href;
    chrome.storage.sync.get([currentProblemUrl], (result) => {
        if (!result[currentProblemUrl]) {
            console.log('No approach explanation found for this problem, adding overlay');
            addEditorOverlay();
        } else {
            console.log('Approach explanation found for this problem:', result[currentProblemUrl]);
            // If explanation exists, add the view button
            addViewApproachButton(result[currentProblemUrl]);
        }
    });
}

// --- Function to check editor existence ---
function checkForEditor() {
    console.log('Checking for editor...');
    const editor = document.querySelector('.monaco-editor');
    if (editor) {
        console.log('Editor found');
        checkApproachExplanation();
        return true;
    }
    return false;
}

// --- Helper: Is it a LeetCode problem page? ---
function isProblemPage(url) {
    return url.includes('/problems/');
}

// --- Handle URL changes (LeetCode uses SPA: Single Page Application) ---
const urlObserver = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        console.log('URL changed:', currentUrl);
        lastUrl = currentUrl;

        // Remove any existing UI elements
        const existingButton = document.querySelector('.view-approach-btn');
        const existingPopup = document.querySelector('.approach-popup');
        const existingOverlay = document.querySelector('.editor-blocker');
        const existingWindow = document.querySelector('.approach-window');
        
        if (existingButton) existingButton.remove();
        if (existingPopup) existingPopup.remove();
        if (existingOverlay) existingOverlay.remove();
        if (existingWindow) existingWindow.remove();

        if (isProblemPage(currentUrl)) {
            if (!checkForEditor()) {
                const editorObserver = new MutationObserver(() => {
                    if (checkForEditor()) {
                        editorObserver.disconnect();
                    }
                });
                editorObserver.observe(document.body, { childList: true, subtree: true });
            }
        }
    }
});
urlObserver.observe(document, { subtree: true, childList: true });

// --- Start everything ---
addGlobalStyles();

console.log('Running initial editor check...');
if (!checkForEditor()) {
    console.log('Setting up mutation observer for editor...');
    const editorObserver = new MutationObserver(() => {
        if (checkForEditor()) {
            editorObserver.disconnect();
        }
    });
    editorObserver.observe(document.body, { childList: true, subtree: true });
}
