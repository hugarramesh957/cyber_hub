// ============================================================
//  PASSWORD STRENGTH CHECKER
// ============================================================

const pwInput = document.getElementById('pwInput');
const strengthBar = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');
const crackTime = document.getElementById('crackTime');

pwInput.addEventListener('input', function () {
  const val = this.value;
  const score = getScore(val);
  updateBar(val, score);
  updateCriteria(val);
});

function getScore(val) {
  let score = 0;
  if (val.length >= 8)  score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[a-z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
}

function updateBar(val, score) {
  if (!val) {
    strengthBar.style.width = '0%';
    strengthLabel.textContent = 'Enter a password';
    strengthLabel.style.color = 'rgba(200,216,240,0.4)';
    crackTime.textContent = '';
    return;
  }

  let width, color, label, crack;

  if (score <= 2) {
    width = '25%'; color = '#ff2d55'; label = '⚠ WEAK'; crack = 'Crack time: < 1 second';
  } else if (score <= 4) {
    width = '55%'; color = '#ffd60a'; label = '~ MEDIUM'; crack = 'Crack time: ~few hours';
  } else {
    width = '100%'; color = '#00ff88'; label = '✔ STRONG'; crack = 'Crack time: 200+ years';
  }

  strengthBar.style.width = width;
  strengthBar.style.background = color;
  strengthBar.style.boxShadow = `0 0 10px ${color}`;
  strengthLabel.textContent = label;
  strengthLabel.style.color = color;
  crackTime.textContent = crack;
}

function updateCriteria(val) {
  setCriterion('c-length', val.length >= 8);
  setCriterion('c-upper',  /[A-Z]/.test(val));
  setCriterion('c-lower',  /[a-z]/.test(val));
  setCriterion('c-number', /[0-9]/.test(val));
  setCriterion('c-symbol', /[^A-Za-z0-9]/.test(val));
  setCriterion('c-long',   val.length >= 12);
}

function setCriterion(id, pass) {
  const el = document.getElementById(id);
  if (pass) {
    el.classList.add('pass');
  } else {
    el.classList.remove('pass');
  }
}

function togglePw() {
  const input = document.getElementById('pwInput');
  input.type = input.type === 'password' ? 'text' : 'password';
}


// ============================================================
//  FAKE vs REAL WEBSITE QUIZ
// ============================================================

const quizData = [
  {
    question: "You receive an email from 'support@paypa1.com' asking you to verify your account. What is the red flag?",
    options: [
      "The email has a logo",
      "The domain uses '1' instead of 'l' — classic phishing trick",
      "The email asks for your name",
      "The email has a footer"
    ],
    answer: 1,
    feedback: {
      correct: "✔ Correct! Phishers replace letters with lookalikes (paypa1 vs paypal). Always check the sender's domain carefully.",
      wrong: "✘ Look closely at the domain: 'paypa1.com' uses the number 1 instead of the letter l. This is a common phishing technique."
    }
  },
  {
    question: "A website URL shows 'https://www.amazon-support-login.com'. Is this the real Amazon?",
    options: [
      "Yes, it has HTTPS so it's safe",
      "Yes, it says Amazon in the URL",
      "No — the real domain is amazon.com, not amazon-support-login.com",
      "Can't tell without seeing the page"
    ],
    answer: 2,
    feedback: {
      correct: "✔ Correct! HTTPS only means the connection is encrypted — not that the site is legitimate. The real domain must be amazon.com.",
      wrong: "✘ HTTPS does NOT mean safe. The actual domain here is 'amazon-support-login.com', not 'amazon.com'. Always check the root domain."
    }
  },
  {
    question: "A pop-up says 'Your PC is infected! Call 1-800-HELP-NOW immediately!' What should you do?",
    options: [
      "Call the number right away",
      "Click the X button to close it",
      "This is a scareware scam — close the browser tab",
      "Download the suggested antivirus"
    ],
    answer: 2,
    feedback: {
      correct: "✔ Correct! This is scareware — fake alerts designed to scare you into calling scammers or installing malware. Close the tab immediately.",
      wrong: "✘ Legitimate software never shows scary pop-ups demanding you call a number. This is a well-known scam — just close the tab."
    }
  },
  {
    question: "Which password is the strongest?",
    options: [
      "password123",
      "MyDog2010",
      "P@ssw0rd",
      "xK#9mQ!vL2$nR"
    ],
    answer: 3,
    feedback: {
      correct: "✔ Correct! A random mix of uppercase, lowercase, numbers and symbols with 13+ characters is extremely hard to crack.",
      wrong: "✘ The strongest password is 'xK#9mQ!vL2$nR' — random, long, and using all character types. Common words and simple substitutions are easy to crack."
    }
  },
  {
    question: "You get a text: 'Your bank account is locked. Click here to unlock: bit.ly/unl0ck-bank'. What do you do?",
    options: [
      "Click the link since it's urgent",
      "Ignore it — shortened URLs from banks are normal",
      "Do NOT click. Go directly to your bank's official website",
      "Forward it to friends to warn them"
    ],
    answer: 2,
    feedback: {
      correct: "✔ Correct! Banks never use shortened URLs (bit.ly) in official messages. Always navigate directly to your bank's official site.",
      wrong: "✘ Shortened URLs hide the real destination. Real banks never send links like bit.ly. Always go directly to your bank's official website."
    }
  }
];

let currentQ = 0;
let quizScore = 0;
let answered = false;

function loadQuestion() {
  const q = quizData[currentQ];
  document.getElementById('quizQuestion').textContent = q.question;
  document.getElementById('quizCounter').textContent = `Question ${currentQ + 1} / ${quizData.length}`;
  document.getElementById('quizProgress').style.width = `${((currentQ) / quizData.length) * 100}%`;
  document.getElementById('quizScoreTrack').textContent = `Score: ${quizScore}`;

  const optContainer = document.getElementById('quizOptions');
  optContainer.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    optContainer.appendChild(btn);
  });

  const fb = document.getElementById('quizFeedback');
  fb.className = 'quiz-feedback';
  fb.textContent = '';
  document.getElementById('nextBtn').style.display = 'none';
  answered = false;
}

function selectAnswer(selected) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQ];
  const buttons = document.querySelectorAll('.quiz-option');
  const fb = document.getElementById('quizFeedback');

  buttons.forEach(btn => { btn.disabled = true; });

  if (selected === q.answer) {
    buttons[selected].classList.add('correct');
    fb.className = 'quiz-feedback correct show';
    fb.textContent = q.feedback.correct;
    quizScore++;
  } else {
    buttons[selected].classList.add('wrong');
    buttons[q.answer].classList.add('correct');
    fb.className = 'quiz-feedback wrong show';
    fb.textContent = q.feedback.wrong;
  }

  document.getElementById('quizScoreTrack').textContent = `Score: ${quizScore}`;
  document.getElementById('nextBtn').style.display = 'inline-block';
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= quizData.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

function showResult() {
  document.getElementById('quizBody').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('quizScoreTrack').style.display = 'none';

  const result = document.getElementById('quizResult');
  result.style.display = 'block';
  document.getElementById('finalScore').textContent = `${quizScore}/${quizData.length}`;
  document.getElementById('quizProgress').style.width = '100%';

  let msg = '';
  if (quizScore === quizData.length) msg = '🏆 Perfect score! You are a cybersecurity expert!';
  else if (quizScore >= 3) msg = '✔ Good job! Keep sharpening your security awareness.';
  else msg = '⚠ Needs improvement. Review the tips and try again!';

  document.getElementById('scoreMsg').textContent = msg;
}

function restartQuiz() {
  currentQ = 0;
  quizScore = 0;
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizBody').style.display = 'block';
  document.getElementById('quizScoreTrack').style.display = 'inline';
  loadQuestion();
}

loadQuestion();


// ============================================================
//  DATA BREACH CHECKER
// ============================================================

const mockBreaches = [
  { name: 'LinkedIn', year: 2021, records: '700M' },
  { name: 'Adobe',    year: 2013, records: '153M' },
  { name: 'Canva',    year: 2019, records: '137M' },
  { name: 'Dropbox',  year: 2012, records: '68M'  },
  { name: 'Twitter',  year: 2022, records: '5.4M' },
];

function checkBreach() {
  const email = document.getElementById('emailInput').value.trim();
  const resultDiv = document.getElementById('breachResult');
  const btn = document.getElementById('breachBtn');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    resultDiv.innerHTML = `<div class="breach-result-card breached"><div class="breach-title">⚠ Invalid Email</div>Please enter a valid email address.</div>`;
    return;
  }

  resultDiv.innerHTML = `<div style="padding:16px;font-size:0.82rem;color:var(--cyan);"><span class="spinner"></span> Scanning breach databases...</div>`;
  btn.disabled = true;

  setTimeout(function () {
    btn.disabled = false;
    const isBreached = Math.random() > 0.4;

    if (isBreached) {
      const count = Math.floor(Math.random() * 4) + 1;
      const found = mockBreaches.sort(() => 0.5 - Math.random()).slice(0, count);
      let listHTML = found.map(b => `<li style="margin:4px 0;">🔴 <b>${b.name}</b> (${b.year}) — ${b.records} records exposed</li>`).join('');
      resultDiv.innerHTML = `
        <div class="breach-result-card breached">
          <div class="breach-title">🚨 BREACH DETECTED</div>
          <p style="margin-bottom:12px;">Your email was found in <b>${count}</b> data breach${count > 1 ? 'es' : ''}:</p>
          <ul style="padding-left:10px;list-style:none;">${listHTML}</ul>
          <p style="margin-top:14px;font-size:0.75rem;opacity:0.7;">Recommendation: Change your passwords immediately and enable 2FA.</p>
        </div>`;
    } else {
      resultDiv.innerHTML = `
        <div class="breach-result-card safe">
          <div class="breach-title">✅ NO BREACHES FOUND</div>
          <p>Great news! Your email was not found in any known data breaches.</p>
          <p style="margin-top:10px;font-size:0.75rem;opacity:0.7;">Stay safe: Use unique passwords and enable 2FA on all accounts.</p>
        </div>`;
    }
  }, 2200);
}


// ============================================================
//  ANIMATED THREAT ALERTS
// ============================================================

const alertMessages = [
  { type: 'danger',  icon: '🚨', title: 'Suspicious Login Detected',     desc: 'Unauthorized access attempt from IP 192.168.45.102 — Location: Unknown' },
  { type: 'danger',  icon: '🦠', title: 'Malware Blocked',               desc: 'Trojan.GenericKD detected and quarantined successfully' },
  { type: 'warning', icon: '⚠️', title: 'Phishing Link Intercepted',     desc: 'Blocked redirect to fake-banklogin.com before page load' },
  { type: 'danger',  icon: '🔓', title: 'Brute Force Attack',            desc: '47 failed login attempts in 60 seconds from same source' },
  { type: 'warning', icon: '📡', title: 'Unsecured Network Detected',    desc: 'Connected to open Wi-Fi — data may be exposed' },
  { type: 'info',    icon: '🛡️', title: 'Firewall Rule Updated',         desc: 'New rule added: Block inbound traffic on port 4444' },
  { type: 'danger',  icon: '💀', title: 'Ransomware Activity',           desc: 'File encryption attempt detected in /documents — process terminated' },
  { type: 'warning', icon: '🔑', title: 'Weak Password Alert',           desc: 'Account "admin" is using a password found in breach databases' },
  { type: 'info',    icon: '📦', title: 'Software Update Required',      desc: 'OpenSSL 3.0.1 has a critical CVE — update immediately' },
  { type: 'danger',  icon: '🌐', title: 'DNS Spoofing Attempt',          desc: 'Fake DNS response intercepted — real IP masked by attacker' },
];

let alertCount = 0;

function generateAlert() {
  document.getElementById('noAlertsMsg').style.display = 'none';
  const panel = document.getElementById('alertPanel');
  const a = alertMessages[alertCount % alertMessages.length];
  alertCount++;

  const now = new Date();
  const time = now.toLocaleTimeString();

  const div = document.createElement('div');
  div.className = `alert-item ${a.type}`;
  div.id = `alert-${alertCount}`;
  div.innerHTML = `
    <div class="alert-icon">${a.icon}</div>
    <div class="alert-body">
      <div class="alert-title">${a.title}</div>
      <div class="alert-desc">${a.desc}</div>
    </div>
    <span class="alert-time">${time}</span>
    <button class="alert-close" onclick="removeAlert('alert-${alertCount}')">✕</button>
  `;

  panel.insertBefore(div, panel.firstChild);
  showToast(`${a.icon} ${a.title}`);

  // Auto remove after 8 seconds
  setTimeout(function () {
    removeAlert(`alert-${alertCount}`);
  }, 8000);
}

function removeAlert(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.transition = 'opacity 0.3s, transform 0.3s';
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    setTimeout(function () {
      el.remove();
      if (document.getElementById('alertPanel').children.length === 0) {
        document.getElementById('noAlertsMsg').style.display = 'block';
      }
    }, 300);
  }
}

function clearAlerts() {
  document.getElementById('alertPanel').innerHTML = '';
  document.getElementById('noAlertsMsg').style.display = 'block';
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('fadeout');
    setTimeout(function () { toast.remove(); }, 400);
  }, 3500);
}
