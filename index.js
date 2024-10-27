let quizData = [
    {
        question: "Siapa Nama Bang Latif ?",
        options: ["Latif suherman", "Latif sudirman","latif jefri","latif vernandash"],
        correct: "latif vernandash",
    },
    {
        question: "Ibu Kota Jakarta adalah ?",
        options: ["Bandung", "DKI Jakarta","Garut","Brunei"],
        correct: "DKI Jakarta",
    },
    {
        question: "Siapa Nama asli Jokowo adalah ?",
        options: ["Mulyadi", "Mulyana","Yanto","Mulyono"],
        correct: "Mulyono",
    },
    {
        question: "Di Mana Gedung Altira ?",
        options: ["Boqor", "tangerang","Sunter","Sumedang"],
        correct: "Sunter",
    },
    {
        question: "1 + 2 + 9 adalah",
        options: ["1", "2","10","12"],
        correct: "12",
    },
];



const quizContainer = document.querySelector('.quiz-container');
const question = document.querySelector('.quiz-container  .question');
const options = document.querySelector(".quiz-container .options");
const nextBtn = document.querySelector(".quiz-container .next-btn");
const quizResult = document.querySelector(".quiz-result");
const startBtnContainer = document.querySelector(".start-btn-container");
const startBtn = document.querySelector(".start-btn-container .start-btn");
let questionNumber = 0;
let score = 0;
const MAX_QUESTIONS = 5;
let timerInterval;

const shuffleArray = array => {
    return array.slice().sort(() => Math.random() - 0.5 );
}

quizData = shuffleArray(quizData);
window.addEventListener('load', () => {
    localStorage.removeItem('quizWithName');
});
const resetLocalStorage = () => {
    for(i = 0; i < MAX_QUESTIONS; i++){
        localStorage.removeItem(`userAnswer_${i}`)
    }
}
resetLocalStorage();
const checkAnswer = (e) => {
    let userAnswer = e.target.textContent;
    if (userAnswer === quizData[questionNumber].correct) {
        score++; 
        e.target.classList.add("correct")
    } else {
        e.target.classList.add("incorrect")
    }
    localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer)

    let allOptions = document.querySelectorAll(".quiz-container .option")
    allOptions.forEach(o => {
        o.classList.add("disabled");
    })
}


const createQuestion = () => {
    clearInterval(timerInterval);

    let secondsLeft = 59;
    const timerDisplay = document.querySelector(".quiz-container .timer");
    timerDisplay.classList.remove("danger")

    timerDisplay.textContent = `Waktu Anda : 60 Detik`;
    timerInterval = setInterval(()=> {
        timerDisplay.textContent = `Waktu anda : ${secondsLeft.toString().padStart(2, "0")} Detik `;
        secondsLeft--;
        if (secondsLeft < 15) {
            timerDisplay.classList.add("danger")
        }
        if (secondsLeft < 0 ){
            clearInterval(timerInterval);
            displayNextQuestion();
        };
    }, 1000)
    options.innerHTML = "";
    question.innerHTML = `<span class='question-number'>${questionNumber + 1}/${MAX_QUESTIONS}</span>${quizData[questionNumber].question}`;
    const shuffledOptions = shuffleArray(quizData[questionNumber].options)
    shuffledOptions.forEach((o) => {
        const option = document.createElement("button");
        option.classList.add("option");
        option.innerHTML = o
        option.addEventListener("click", (e)=> {
            checkAnswer(e)
        })
        options.appendChild(option);
    })
}

const retakeQuiz = () => {
    questionNumber = 0;
    score = 0;
    quizData = shuffleArray(quizData);
    resetLocalStorage();
    createQuestion();
    quizResult.style.display = 'none'
    quizContainer.style.display = "block"
}

const displayQuizResult = () => {
    quizResult.style.display = 'flex';
    quizContainer.style.display = 'none';
    quizResult.innerHTML = "";
    const quizWithName = JSON.parse(localStorage.getItem('quizWithName')); 
    const resultHeading = document.createElement("h2");
    resultHeading.innerHTML = ` Nilai ${quizWithName.participantName}: <span class="question-score">${score}</span> <br/>
    <span class="question-nilai">Contoh Warna</span><span class="question-nilai-Merah">Merah Jawaban Salah</span>`;
    quizResult.appendChild(resultHeading);
    
    for (let i = 0; i < MAX_QUESTIONS; i++){
        const resultItem = document.createElement("div");
        resultItem.classList.add("question-container")
        const userAnswer = localStorage.getItem(`userAnswer_${i}`)
        const correctAnswer = quizData[i].correct;

        let answeredCorrectly = userAnswer === correctAnswer

        if (!answeredCorrectly) {
            resultItem.classList.add("incorrect");
        }
        resultItem.innerHTML = ` <div class="question"> Pertanyaan ${i + 1} : ${quizData[i].question}<div>
            <div class="user-answer">${userAnswer || `Tidak Pilih Soal`} </div>
            <div class="correct-answer">Jawaban Benar: ${correctAnswer}</div>`;

        quizResult.appendChild(resultItem);
    }

    const retakeBtn = document.createElement("button");
    retakeBtn.classList.add("retake-btn");
    retakeBtn.innerHTML= 'Ulang Psikotest';
    retakeBtn.addEventListener("click", retakeQuiz);
    quizResult.appendChild(retakeBtn);
}


displayNextQuestion = () => {
    if (questionNumber >= MAX_QUESTIONS - 1) {
        displayQuizResult();
        return;
    }

    questionNumber++
    createQuestion();
}

nextBtn.addEventListener("click", displayNextQuestion);

// startBtn.addEventListener("click", () => {
//     startBtnContainer.style.display = "none";
//     quizContainer.style.display = "block";
//     createQuestion();
// });

startBtn.addEventListener('click', (event) => {
    const name = document.getElementById('name').value;
    const errorMessage = document.getElementById('error-message'); // Ambil elemen pesan error


    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    if (!name) {
        event.preventDefault(); 
        errorMessage.textContent = 'Silakan masukkan nama Anda.';
        errorMessage.style.display = 'block'; 
        document.getElementById('name').focus();
    } else {
        const quizWithName = {
            participantName: name,
            quizData: quizData
        };
        
        localStorage.setItem('quizWithName', JSON.stringify(quizWithName));
        // startQuiz(quizWithName);
        startBtnContainer.style.display = "none";
        quizContainer.style.display = "block";
        createQuestion();
    }
});

// function startQuiz(quizWithName) {
//     console.log("Memulai kuis untuk:", quizWithName.participantName);
// }




