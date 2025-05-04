// html
const mainPage = document.querySelector(".main");
const headButton = document.querySelector(".logo-button");
const mainStartClass = document.querySelector(".main-start");
const mainRulesClass = document.querySelector(".main-rules");
const mainContactClass = document.querySelector(".main-contacts");
const mainGameClass = document.querySelector(".main-game");

// buttons
const mainRulesButtonClass = document.querySelector(".rules-button");
const mainContactsButtonClass = document.querySelector(".contacts-button");
const mainGoPlayButtonClass = document.querySelector(".go-to-game-button");

// game buttons
const gameButtonAnsw1Class = document.querySelector(".answ1-button");
const gameButtonAnsw2Class = document.querySelector(".answ2-button");
const gameButtonAnsw3Class = document.querySelector(".answ3-button");
const gameButtonAnsw4Class = document.querySelector(".answ4-button");

const maxQuestions = 10;

// vars
let dbQuestions = [];
let rightAnswersArr = [];
let queuedQuestions = [];
let rightAnswers = 0;
let questionCounter = 0;
const totallyRandomCharArray =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqc2FvZnhldWtma3FiY3p4dnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjE2ODYsImV4cCI6MjA1ODIzNzY4Nn0.jm7XLvX-9byehMvRLqbr80iM4yxj58P1CwVWSKAZm3Y";

const finalResults = [
  // score в процентах
  { score: 0, 
    text: "Мда.", 
    img: "img/лисичка.jpg" 
  },
  {
    score: 25,
    text: "Ваш результат сумний, як дощ на київсьокму вокзалі.Хутчіш вивчати меми!",
    img: "img/вера.jpg",
  },
  {
    score: 50,
    text: "Половинка, але можна було б і краще",
    img: "img/чоловік.jpg",
  },
  {
    score: 75,
    text: "Дала йшли не те щоб погано, але і не те щоб добре. Спробуй ще раз!",
    img: "img/чіл.jpg",
  },
  {
    score: 100,
    text: "Якби ви пішли на шоу “Розсміши коміка” ви б витрясли усі гроші. Чудовий резултат!",
    img: "img/людина.jpg",
  },
];

// const
/*const mainPageHTML = mainPage.getHTML();
mainPage.setHTMLUnsafe(mainPageHTML);*/

// start listeners
mainGoPlayButtonClass.addEventListener("click", function () {
  goToGame();
});

// logo button
headButton.addEventListener("click", function () {
  window.location.reload();
});

// Rules button handler
mainRulesButtonClass.addEventListener("click", function () {
  if (mainRulesClass.classList.contains("hidden")) {
    // hide all
    hideAll();
    // unhide rules + start button
    mainRulesClass.classList.remove("hidden");
    // rename button
    mainRulesButtonClass.textContent = "На головну";
    // rename rules button as well
    mainContactsButtonClass.textContent = "Контакти";
  } else {
    // hide all
    hideAll();
    // show main
    mainStartClass.classList.remove("hidden");
    // rename button
    mainRulesButtonClass.textContent = "Правила гри";
    // rename rules button as well
    mainContactsButtonClass.textContent = "Контакти";
  }
});

// Contacts button handler
mainContactsButtonClass.addEventListener("click", function () {
  if (mainContactClass.classList.contains("hidden")) {
    // hide all
    hideAll();
    // unhide contacts
    mainContactClass.classList.remove("hidden");
    // rename button
    mainRulesButtonClass.textContent = "Правила гри";
    // rename rules button as well
    mainContactsButtonClass.textContent = "На головну";
  } else {
    // hide all
    hideAll();
    // show main
    mainStartClass.classList.remove("hidden");
    // rename button
    mainRulesButtonClass.textContent = "Правила гри";
    // rename rules button as well
    mainContactsButtonClass.textContent = "Контакти";
  }
});

// main go-to-game
async function goToGame() {
  console.log("GOOOOOOOOL");
  dbQuestions = await loadDataFromDB();
  queuedQuestions = generateIndexArray(maxQuestions, dbQuestions.length - 2);
  rightAnswersArr = getRightAnswers(dbQuestions[0].img, dbQuestions.length - 1);
  dbQuestions.shift(); // убираєм 0 ід з ключами
  // console.log( queuedQuestions );
  //  console.log(dbQuestions);
  //  console.log(rightAnswersArr);
  questionCounter = 0;

  hideAll();
  mainContactsButtonClass.classList.add("hidden");
  mainRulesButtonClass.classList.add("hidden");

  // TODO нема хендлінга помилки завантаження списку питань, зараз буде просто не пускати всередину гри

  updateGame();
  mainGameClass.classList.remove("hidden");
  document.querySelector(".actual-game-buttons").classList.remove("hidden");

  gameButtonAnsw1Class.addEventListener("click", function () {
    checkIsAnswerRight(1);
  });
  gameButtonAnsw2Class.addEventListener("click", function () {
    checkIsAnswerRight(2);
  });
  gameButtonAnsw3Class.addEventListener("click", function () {
    checkIsAnswerRight(3);
  });
  gameButtonAnsw4Class.addEventListener("click", function () {
    checkIsAnswerRight(4);
  });
}

function getRightAnswers(num, count) {
  // точно не витяг правильних відповідей з ключа
  let answers = new Array(parseInt(count));
  for (let i = 0; i < count; i++) {
    answers[i] = (num & 0x03) + 1;
    num >>= 2;
  }
  return answers;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateIndexArray(size, max) {
  let currentInt;
  let arr = new Array(size);
  for( let i = 0; i < size; i++ ) {
    while( arr.includes( currentInt = getRandomInt(max+1), 0 ) );
    arr[i] = currentInt;
  }
  return arr;
}

function checkIsAnswerRight(buttNum) {
  // перевірка правильності відповіді + перехід на наступне питання (todo)
  if (buttNum === rightAnswersArr[queuedQuestions[questionCounter-1]]) {
    rightAnswers++;
  }

  console.log(
    "got " +
      buttNum +
      ", right - " +
      rightAnswersArr[queuedQuestions[questionCounter-1]] +
      "\r\nCurrent score - " +
      rightAnswers
  );

  updateGame();
}

function updateGame() {
  // оновлення сторінки
  if (questionCounter < maxQuestions) {
    mainGameClass.setHTMLUnsafe(
      updateGameTextAndImg(dbQuestions, questionCounter, queuedQuestions)
    );

    gameButtonAnsw1Class.textContent = dbQuestions[queuedQuestions[questionCounter]].answer1;
    gameButtonAnsw2Class.textContent = dbQuestions[queuedQuestions[questionCounter]].answer2;
    gameButtonAnsw3Class.textContent = dbQuestions[queuedQuestions[questionCounter]].answer3;
    gameButtonAnsw4Class.textContent = dbQuestions[queuedQuestions[questionCounter]].answer4;
    questionCounter++;
  } else {
    hideAll();
    mainGameClass.setHTMLUnsafe(
      updateGameFinal(finalResults, (100 / maxQuestions) * rightAnswers)
    );
    mainGameClass.classList.remove("hidden");
  }
}

function updateGameTextAndImg(arr, counter, num) {
  /*
  return `
  <img src=${arr[num[counter]].img} height="350" width="350" alt="img" />
  <p>${arr[num[counter]].name}</p>`;
  */
  // без текста під картинкою буде
  return `<img src=${arr[num[counter]].img} height="350" width="350" alt="img" />`;
}

function updateGameFinal(finArr, finalScore) {
  /*
  switch(finalScore) {
    case 
  }*/
  // расчет шага по процентам
  let num = 100 / finArr.length;
  let arrIndex = 0;
  if (finalScore < num) arrIndex = 0;
  else if (finalScore < num * 2) arrIndex = 1;
  else if (finalScore < num * 3) arrIndex = 2;
  else if (finalScore < num * 4) arrIndex = 3;
  else arrIndex = 4;
  const html = `
  <h1>ТЕСТ ПРОЙДЕНО!</h1>
  <h2>Ви набрали ${finalScore}%</h2>
  <img src=${finArr[arrIndex].img} height="350" width="350" alt="img" />
  <p>${finArr[arrIndex].text}</p>
  `;
  document
    .querySelector(".go-to-main-from-final")
    .addEventListener("click", function () {
      window.location.reload();
    });
  document.querySelector(".go-to-main-from-final").classList.remove("hidden");
  return html;
}

/*
function showFinalScreen() {
  hideAll();
}*/

// hide func
function hideAll() {
  // hide main page text
  if (!mainStartClass.classList.contains("hidden")) {
    mainStartClass.classList.add("hidden");
  }
  // unhide rules + start button
  if (!mainRulesClass.classList.contains("hidden")) {
    mainRulesClass.classList.add("hidden");
  }
  // hide contacts
  if (!mainContactClass.classList.contains("hidden")) {
    mainContactClass.classList.add("hidden");
  }
  // hide game
  if (!mainGameClass.classList.contains("hidden")) {
    mainGameClass.classList.add("hidden");
    document.querySelector(".actual-game-buttons").classList.add("hidden");
  }
}

function sortById() {
  // шоб убрать можливі проблеми з отриманим жсоном
  return function (el1, el2) {
    if (el1.id < el2.id) {
      return -1;
    } else if (el1.id > el2.id) {
      return 1;
    } else {
      return 0;
    }
  };
}

async function loadDataFromDB() {
  const res = await fetch(
    "https://vjsaofxeukfkqbczxvsh.supabase.co/rest/v1/memes",
    {
      headers: {
        // read-only, навіть не намагайтесь)
        apikey: totallyRandomCharArray,
        authorization: "Bearer " + totallyRandomCharArray,
      },
    }
  );
  const data = await res.json();
  data.sort(sortById());
  /*console.log(data);*/
  return data;
}
