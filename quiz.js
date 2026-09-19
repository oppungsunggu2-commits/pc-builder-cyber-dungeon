// Pengelola Quiz Edukasi
const QuizManager = {
    currentQuestions: [],
    currentIndex: 0,

    startQuiz() {
        this.currentQuestions = CyberDatabase.getQuestions();
        this.currentIndex = 0;
        this.renderQuestion();
        document.getElementById('modal-quiz').classList.add('active');
    },

    renderQuestion() {
        const q = this.currentQuestions[this.currentIndex];
        if (!q) return;

        document.getElementById('quiz-question-text').innerText = q.question;
        const optionsContainer = document.getElementById('quiz-options-container');
        optionsContainer.innerHTML = '';

        const feedback = document.getElementById('quiz-feedback');
        feedback.style.display = 'none';
        document.getElementById('btn-next-quiz').classList.add('hidden');

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.innerText = `${idx + 1}. ${opt}`;
            btn.addEventListener('click', () => this.checkAnswer(idx, q));
            optionsContainer.appendChild(btn);
        });
    },

    checkAnswer(selectedIndex, questionObj) {
        const feedback = document.getElementById('quiz-feedback');
        feedback.style.display = 'block';

        if (selectedIndex === questionObj.correct_answer) {
            feedback.className = 'feedback-box correct';
            feedback.innerHTML = `<strong>BENAR! ✅</strong><br>${questionObj.explanation}`;
            MainApp.addXP(50);
        } else {
            feedback.className = 'feedback-box wrong';
            feedback.innerHTML = `<strong>SALAH! ❌</strong><br>${questionObj.explanation}`;
        }

        document.getElementById('btn-next-quiz').classList.remove('hidden');
    },

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex < this.currentQuestions.length) {
            this.renderQuestion();
        } else {
            alert('Selamat! Anda telah menyelesaikan seluruh soal Quiz.');
            document.getElementById('modal-quiz').classList.remove('active');
        }
    }
};