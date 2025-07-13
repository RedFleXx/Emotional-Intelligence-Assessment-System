const uniqueQuestions = [
  "I am aware of my emotions as I experience them.",
  "I find it easy to recognize how others are feeling even without them saying anything.",
  "I remain calm and composed during stressful situations.",
  "I find it challenging to manage my impulses when upset.",
  "I am open to feedback, even when it is critical.",
  "I take responsibility for my actions and their impact on others.",
  "I can shift my mood to match the emotional needs of a situation.",
  "I try to resolve conflicts calmly and respectfully.",
  "I often reflect on my interactions to understand what went well and what I could improve.",
  "I motivate myself to pursue goals even when I feel discouraged.",
  "I enjoy helping others work through their emotions.",
  "I can recognize my emotional triggers.",
  "I strive to understand others' perspectives.",
  "I maintain control when provoked.",
  "I value emotional honesty in relationships.",
  "I am confident in expressing my feelings.",
  "I can identify my emotional needs.",
  "I adjust well to emotional changes in situations.",
  "I am patient when resolving misunderstandings.",
  "I express gratitude regularly.",
  "I remain focused despite emotional distractions.",
  "I check in with others to see how they are feeling.",
  "I accept responsibility when my emotions affect others negatively.",
  "I seek to improve my emotional responses.",
  "I consider how my words may impact others emotionally.",
  "I am calm under pressure.",
  "I regularly self-reflect on emotional decisions.",
  "I strive to maintain emotional balance.",
  "I show empathy in conversations.",
  "I avoid reacting defensively.",
  "I am proactive in improving emotional health.",
  "I encourage emotional expression in my environment.",
  "I understand how past experiences shape my emotions.",
  "I value feedback to grow emotionally.",
  "I use emotions to make better decisions.",
  "I handle emotionally intense situations maturely.",
  "I regulate my mood throughout the day.",
  "I forgive others to move on emotionally.",
  "I communicate clearly even when emotional.",
  "I regularly self-reflect on emotional decisions."
];

const questions = uniqueQuestions.slice(0, 40);
const reverseScored = [3, 13, 25, 29];

const questionnaire = document.getElementById("questionnaire");
const progressBar = document.getElementById("progressBar");
const summaryModal = document.getElementById("summaryModal");
const summary = document.getElementById("summary");

questions.forEach((question, i) => {
  const div = document.createElement("div");
  div.classList.add("question");
  div.id = `question_${i}`;
  div.innerHTML = `<h3>${question}</h3>
    <div class="likert">
      ${[1, 2, 3, 4, 5, 6, 7].map(n => `
        <input type="radio" id="q${i}_${n}" name="q${i}" value="${n}" onclick="handleAnswer(${i}, ${n})">
        <label class="scale-${n}" for="q${i}_${n}"></label>
      `).join('')}
    </div>`;
  questionnaire.appendChild(div);
});

function updateProgress() {
  const total = questions.length;
  const answered = document.querySelectorAll("input[type='radio']:checked").length;
  const percent = Math.round((answered / total) * 100);
  progressBar.style.width = percent + "%";
  if (answered === total) scrollToSubmit();
}

function scrollToSubmit() {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    const top = submitBtn.getBoundingClientRect().top + window.pageYOffset - 600;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function handleAnswer(index, value) {
  saveAnswer(index, value);
  updateProgress();
  setTimeout(() => scrollToNextUnanswered(index), 150);
}

function scrollToNextUnanswered(currentIndex) {
  const answered = Array.from({ length: questions.length }, (_, i) =>
    document.querySelector(`input[name='q${i}']:checked`) !== null
  );
  const totalAnswered = answered.filter(Boolean).length;

  if (totalAnswered > 0 && totalAnswered % 4 === 0) {
    for (let i = currentIndex + 1; i < questions.length; i++) {
      if (!answered[i]) {
        const nextElem = document.getElementById(`question_${i}`);
        if (nextElem) {
          window.scrollTo({
            top: nextElem.getBoundingClientRect().top + window.pageYOffset - 165,
            behavior: 'smooth'
          });
          break;
        }
      }
    }
  }
}

function saveAnswer(index, value) {
  localStorage.setItem(`question_${index}`, value);
}

function loadSavedAnswers() {
  for (let i = 0; i < questions.length; i++) {
    const saved = localStorage.getItem(`question_${i}`);
    if (saved) {
      const input = document.getElementById(`q${i}_${saved}`);
      if (input) {
        input.checked = true;
        handleAnswer(i, parseInt(saved));
      }
    }
  }
}


function clearResponses() {
  for (let i = 0; i < questions.length; i++) {
    localStorage.removeItem(`question_${i}`);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  const checkScrollTop = () => {
    if (window.scrollY === 0) {
      clearInterval(scrollCheck);
      location.reload();
    }
  };

  const scrollCheck = setInterval(checkScrollTop, 20);
}

function showSummary() {
  const answers = [];
  let score = 0;
  let unanswered = [];

  for (let i = 0; i < questions.length; i++) {
    const selected = document.querySelector(`input[name='q${i}']:checked`);
    if (!selected) unanswered.push(i + 1);
    let val = selected ? parseInt(selected.value) : 0;
    if (reverseScored.includes(i) && val !== 0) val = 8 - val;
    score += val;
    answers.push({
      question: questions[i],
      answer: selected ? selected.value : "No answer"
    });
  }

  if (unanswered.length > 0) {
    alert("Please answer all the questions before submitting.");
    return;
  }

  //LOADING OVERLAY
  const overlay = document.getElementById("loadingOverlay");
  const progress = document.getElementById("loadingProgress");
  const percentText = document.getElementById("loadingPercent");
  const messageText = document.getElementById("loadingMessage");

  const messages = [
    "Analyzing emotional patterns...",
    "Calculating your results...",
    "Finalizing your summary..."
  ];

  overlay.style.display = "flex";

  let percent = 0;
  let msgIndex = 0;

  const interval = setInterval(() => {
    percent++;
    progress.style.width = percent + "%";
    percentText.textContent = percent + "%";
    if (percent % 25 === 0 && msgIndex < messages.length) {
      messageText.textContent = messages[msgIndex++];
    }
    if (percent >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        overlay.style.display = "none";
        displayResults(score, answers);
      }, 400);
    }
  }, 30);
}

    //SHOW/HIDE BTOP-BTN
window.addEventListener("scroll", () => {
  const backToTopBtn = document.getElementById("backToTop");
  if (window.scrollY > 400) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}


function displayResults(score, answers) {
  const maxScore = questions.length * 7;
  const percentage = Math.round((score / maxScore) * 100);
  let category = "";
  let color = "";

  if (percentage >= 80) {
    category = "High Emotional Intelligence";
    color = "#4caf50";
  } else if (percentage >= 60) {
    category = "Moderate Emotional Intelligence";
    color = "#ff9800";
  } else {
    category = "Needs Improvement";
    color = "#f44336";
  }

  const userInfoHTML = `
    <div class="user-profile">
      <img src="https://via.placeholder.com/100" alt="Profile" class="avatar">
      <div class="user-meta">
        <h2 class="user-name">Your Assessment Result</h2>
        <p><strong>Score:</strong> ${percentage}%</p>
        <p><strong>Category:</strong> ${category}</p>
      </div>
    </div>
  `;

  const resultBarHTML = `
    <div class="result-bar">
      <div class="result-bar-title" style="color: ${color};">${percentage}% - ${category}</div>
      <div class="result-bar-track">
        <div class="result-bar-fill" style="width:${percentage}%; background-color: ${color};"></div>
      </div>
      <div class="result-bar-sub">
        <span>Needs Improvement</span>
        <span>High E.I.</span>
      </div>
    </div>
  `;

  let answersHTML = `<div class="answers-list"><h4>Your Answers:</h4><div class="answers-grid">`;
  answers.forEach((a, i) => {
    answersHTML += `
      <div class="answer-item">
        <strong>Q${i + 1}:</strong> ${a.question}<br>
        <span class="your-answer">Your answer: ${a.answer}</span>
      </div>
    `;
  });
  answersHTML += `</div></div>`;

  const actionsHTML = `
    <div class="action-buttons">
      <button onclick="location.href='index.html'" class="btn">Back to Home</button>
      <button onclick="window.print()" class="btn">Download Result</button>
    </div>
  `;

  summary.innerHTML = userInfoHTML + resultBarHTML + answersHTML + actionsHTML;
  summaryModal.style.display = "flex";

  for (let i = 0; i < questions.length; i++) {
    localStorage.removeItem(`question_${i}`);
  }
}



loadSavedAnswers();