// ASRS-v1.1 Questions based on WHO/DSM-IV criteria
const asrsQuestions = [
    {
        id: 1,
        text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
        type: "inattentive",
        weight: 1 // Part A questions (1-6) have higher weight for screening
    },
    {
        id: 2,
        text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
        type: "inattentive",
        weight: 1
    },
    {
        id: 3,
        text: "How often do you have problems remembering appointments or obligations?",
        type: "inattentive",
        weight: 1
    },
    {
        id: 4,
        text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
        type: "inattentive",
        weight: 1
    },
    {
        id: 5,
        text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
        type: "hyperactive",
        weight: 1
    },
    {
        id: 6,
        text: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
        type: "hyperactive",
        weight: 1
    },
    {
        id: 7,
        text: "How often do you make careless mistakes when you have to work on a boring or difficult project?",
        type: "inattentive",
        weight: 0.5 // Part B questions (7-18) have lower weight
    },
    {
        id: 8,
        text: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
        type: "inattentive",
        weight: 0.5
    },
    {
        id: 9,
        text: "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
        type: "inattentive",
        weight: 0.5
    },
    {
        id: 10,
        text: "How often do you misplace or have difficulty finding things at home or at work?",
        type: "inattentive",
        weight: 0.5
    },
    {
        id: 11,
        text: "How often are you distracted by activity or noise around you?",
        type: "inattentive",
        weight: 0.5
    },
    {
        id: 12,
        text: "How often do you leave your seat in meetings or other situations where you are expected to remain seated?",
        type: "hyperactive",
        weight: 0.5
    },
    {
        id: 13,
        text: "How often do you feel restless or fidgety?",
        type: "hyperactive",
        weight: 0.5
    },
    {
        id: 14,
        text: "How often do you have difficulty unwinding and relaxing when you have time to yourself?",
        type: "hyperactive",
        weight: 0.5
    },
    {
        id: 15,
        text: "How often do you find yourself talking too much when you are in social situations?",
        type: "hyperactive",
        weight: 0.5
    },
    {
        id: 16,
        text: "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?",
        type: "impulsive",
        weight: 0.5
    },
    {
        id: 17,
        text: "How often do you have difficulty waiting your turn in situations when turn taking is required?",
        type: "impulsive",
        weight: 0.5
    },
    {
        id: 18,
        text: "How often do you interrupt others when they are busy?",
        type: "impulsive",
        weight: 0.5
    }
];

// Answer options for all questions
const answerOptions = [
    { value: 0, text: "Never", points: 0 },
    { value: 1, text: "Rarely", points: 0 },
    { value: 2, text: "Sometimes", points: 1 },
    { value: 3, text: "Often", points: 1 },
    { value: 4, text: "Very Often", points: 1 }
];

// Test state
let currentQuestion = 0;
let answers = new Array(18).fill(null);
let testStarted = false;

// Initialize the test when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the test page
    if (document.getElementById('asrsForm')) {
        initializeTest();
    }
    
    // Add smooth scrolling for anchor links on home page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

function initializeTest() {
    testStarted = true;
    displayQuestion(0);
    updateProgress();
}

function displayQuestion(questionIndex) {
    if (questionIndex < 0 || questionIndex >= asrsQuestions.length) {
        return;
    }
    
    const question = asrsQuestions[questionIndex];
    const questionText = document.getElementById('questionText');
    const answerOptionsContainer = document.getElementById('answerOptions');
    
    // Update question text
    questionText.textContent = question.text;
    
    // Clear previous options
    answerOptionsContainer.innerHTML = '';
    
    // Create answer options
    answerOptions.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';
        optionDiv.onclick = () => selectAnswer(questionIndex, option.value);
        
        // Check if this option was previously selected
        if (answers[questionIndex] === option.value) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.innerHTML = `
            <input type="radio" name="question${questionIndex}" value="${option.value}" ${answers[questionIndex] === option.value ? 'checked' : ''}>
            <span>${option.text}</span>
        `;
        
        answerOptionsContainer.appendChild(optionDiv);
    });
    
    // Update navigation buttons
    updateNavigationButtons();
    updateProgress();
}

function selectAnswer(questionIndex, value) {
    answers[questionIndex] = value;
    
    // Update visual selection
    const options = document.querySelectorAll('.answer-option');
    options.forEach((option, index) => {
        option.classList.remove('selected');
        if (index === value) {
            option.classList.add('selected');
        }
    });
    
    // Update radio button
    const radio = document.querySelector(`input[name="question${questionIndex}"][value="${value}"]`);
    if (radio) {
        radio.checked = true;
    }
    
    // Enable next button if answer is selected
    updateNavigationButtons();
}

function nextQuestion() {
    if (answers[currentQuestion] === null) {
        alert('Please select an answer before proceeding.');
        return;
    }
    
    if (currentQuestion < asrsQuestions.length - 1) {
        currentQuestion++;
        displayQuestion(currentQuestion);
    } else {
        // Test completed, show results
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion(currentQuestion);
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Update previous button
    prevBtn.disabled = currentQuestion === 0;
    
    // Update next button text and state
    if (currentQuestion === asrsQuestions.length - 1) {
        nextBtn.textContent = 'Show Results';
    } else {
        nextBtn.textContent = 'Next';
    }
    
    // Next button is enabled if current question is answered
    nextBtn.disabled = answers[currentQuestion] === null;
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / asrsQuestions.length) * 100;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `Question ${currentQuestion + 1} of ${asrsQuestions.length}`;
    }
}

function calculateScore() {
    let partAScore = 0; // Questions 1-6 (screening questions)
    let partBScore = 0; // Questions 7-18
    let totalScore = 0;
    
    answers.forEach((answer, index) => {
        if (answer !== null) {
            const question = asrsQuestions[index];
            const points = answerOptions[answer].points;
            
            if (index < 6) {
                // Part A questions (more significant for screening)
                if (points > 0) {
                    partAScore++;
                }
            } else {
                // Part B questions
                if (points > 0) {
                    partBScore++;
                }
            }
            
            totalScore += points;
        }
    });
    
    return {
        partA: partAScore,
        partB: partBScore,
        total: totalScore,
        percentage: Math.round((totalScore / 18) * 100)
    };
}

function interpretScore(score) {
    let interpretation = '';
    let recommendation = '';
    
    // ASRS screening criteria: 4 or more positive responses in Part A (questions 1-6)
    // OR 4+ in Part A and 9+ total positive responses
    
    if (score.partA >= 4) {
        interpretation = 'Your responses suggest symptoms consistent with ADHD.';
        recommendation = 'Consider consulting with a healthcare professional for a comprehensive evaluation.';
    } else if (score.total >= 9) {
        interpretation = 'Your responses indicate some symptoms that may be associated with ADHD.';
        recommendation = 'Consider discussing these symptoms with a healthcare provider for further assessment.';
    } else if (score.total >= 6) {
        interpretation = 'Your responses show mild symptoms that could be related to ADHD or other factors.';
        recommendation = 'If symptoms significantly impact your daily life, consider speaking with a healthcare professional.';
    } else {
        interpretation = 'Your responses suggest fewer symptoms typically associated with ADHD.';
        recommendation = 'If you continue to have concerns about attention or hyperactivity, consult with a healthcare provider.';
    }
    
    return {
        interpretation,
        recommendation,
        riskLevel: score.partA >= 4 ? 'High' : score.total >= 9 ? 'Moderate' : score.total >= 6 ? 'Low-Moderate' : 'Low'
    };
}

function showResults() {
    // Hide the form
    document.getElementById('asrsForm').style.display = 'none';
    
    // Show results container
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.style.display = 'block';
    
    // Calculate and display score
    const score = calculateScore();
    const interpretation = interpretScore(score);
    
    // Update score display
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.innerHTML = `
        <div style="font-size: 2rem; color: #667eea;">${score.total}/18</div>
        <div style="font-size: 1rem; color: #666; font-weight: normal;">
            Part A (Screening): ${score.partA}/6 | Part B: ${score.partB}/12
        </div>
        <div style="font-size: 1rem; color: #666; font-weight: normal; margin-top: 0.5rem;">
            Risk Level: <strong>${interpretation.riskLevel}</strong>
        </div>
    `;
    
    // Update interpretation
    const interpretationText = document.getElementById('interpretationText');
    interpretationText.innerHTML = `
        <p><strong>${interpretation.interpretation}</strong></p>
        <p style="margin-top: 1rem;">${interpretation.recommendation}</p>
    `;
    
    // Add color coding based on risk level
    const scoreInterpretation = document.getElementById('scoreInterpretation');
    let borderColor = '#667eea';
    if (interpretation.riskLevel === 'High') {
        borderColor = '#e74c3c';
    } else if (interpretation.riskLevel === 'Moderate') {
        borderColor = '#f39c12';
    } else if (interpretation.riskLevel === 'Low-Moderate') {
        borderColor = '#f1c40f';
    }
    scoreInterpretation.style.borderLeftColor = borderColor;
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

function restartTest() {
    // Reset test state
    currentQuestion = 0;
    answers = new Array(18).fill(null);
    
    // Show form, hide results
    document.getElementById('asrsForm').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    
    // Restart test
    displayQuestion(0);
    
    // Scroll to top of test
    document.querySelector('.test-container').scrollIntoView({ behavior: 'smooth' });
}

// Add keyboard navigation for test
document.addEventListener('keydown', function(e) {
    if (!testStarted || document.getElementById('resultsContainer').style.display !== 'none') {
        return;
    }
    
    // Number keys 1-5 for quick answer selection
    if (e.key >= '1' && e.key <= '5') {
        const answerIndex = parseInt(e.key) - 1;
        if (answerIndex < answerOptions.length) {
            selectAnswer(currentQuestion, answerIndex);
        }
    }
    
    // Arrow keys for navigation
    if (e.key === 'ArrowLeft' && currentQuestion > 0) {
        previousQuestion();
    } else if (e.key === 'ArrowRight' && answers[currentQuestion] !== null) {
        nextQuestion();
    }
});

// Add visual feedback for keyboard shortcuts
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('asrsForm')) {
        // Add keyboard shortcut hints
        const testContent = document.querySelector('.test-content');
        if (testContent) {
            const shortcutHint = document.createElement('div');
            shortcutHint.innerHTML = `
                <div style="background: #f8f9ff; padding: 1rem; border-radius: 10px; margin-bottom: 2rem; text-align: center; font-size: 0.9rem; color: #666;">
                    💡 <strong>Tip:</strong> Use number keys 1-5 for quick answers, or arrow keys to navigate
                </div>
            `;
            testContent.insertBefore(shortcutHint, testContent.firstChild);
        }
    }
});