// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
    mode: "javascript",
    theme: "monokai",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: true,
});

// Set some example code
editor.setValue(`// Example: Array sorting visualization
let numbers = [64, 34, 25, 12, 22, 11, 90];
bubbleSort(numbers);

function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n-1; i++) {
        for (let j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap elements
                let temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    return arr;
}`);

// Animation state
let animationElements = [];
const animationCanvas = document.getElementById('animationCanvas');
const output = document.getElementById('output');

// Run button click handler
document.getElementById('runButton').addEventListener('click', async () => {
    // Clear previous animation
    clearAnimation();
    output.innerHTML = '';

    try {
        // Get the code from editor
        const code = editor.getValue();
        
        // Create a safe evaluation environment
        const sandbox = {
            console: {
                log: (...args) => {
                    output.innerHTML += args.join(' ') + '<br>';
                    visualizeOutput(args[0]);
                }
            },
            setTimeout: window.setTimeout.bind(window),
            Math: Math,
        };

        // Create visualization for arrays
        if (code.includes('bubbleSort')) {
            // Extract the initial array
            const match = code.match(/let\s+numbers\s*=\s*\[([\d,\s]+)\]/);
            if (match) {
                const numbers = match[1].split(',').map(n => parseInt(n.trim()));
                visualizeArray(numbers);
            }
        }

        // Evaluate the code
        const wrappedCode = `
            with (sandbox) {
                ${code}
            }
        `;
        new Function('sandbox', wrappedCode)(sandbox);

    } catch (error) {
        output.innerHTML += `<span style="color: #ff4444;">Error: ${error.message}</span>`;
    }
});

function clearAnimation() {
    animationCanvas.innerHTML = '';
    animationElements = [];
}

function visualizeArray(arr) {
    clearAnimation();
    const maxValue = Math.max(...arr);
    const width = animationCanvas.clientWidth;
    const elementWidth = (width / arr.length) - 10;

    arr.forEach((num, index) => {
        const element = document.createElement('div');
        element.className = 'animation-element';
        element.style.width = `${elementWidth}px`;
        element.style.height = `${(num / maxValue) * 200}px`;
        element.style.left = `${index * (elementWidth + 10)}px`;
        element.style.bottom = '10px';
        element.style.transform = 'translateX(10px)';
        element.textContent = num;
        
        animationCanvas.appendChild(element);
        animationElements.push(element);
    });
}

function visualizeOutput(value) {
    if (Array.isArray(value)) {
        visualizeArray(value);
    }
}

// Add animation for swapping elements
function animateSwap(index1, index2) {
    const el1 = animationElements[index1];
    const el2 = animationElements[index2];
    
    const el1Left = el1.style.left;
    const el2Left = el2.style.left;

    gsap.to(el1, {
        left: el2Left,
        duration: 0.5,
        ease: "power2.inOut"
    });

    gsap.to(el2, {
        left: el1Left,
        duration: 0.5,
        ease: "power2.inOut"
    });

    // Update the elements array
    [animationElements[index1], animationElements[index2]] = 
    [animationElements[index2], animationElements[index1]];
}
