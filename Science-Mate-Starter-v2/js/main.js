// 화면 요소를 가져옵니다.
const startScreen = document.getElementById("startScreen");
const categoryScreen = document.getElementById("categoryScreen");
const ecircuitTopicsScreen = document.getElementById("ecircuitTopicsScreen");

const startButton = document.getElementById("startButton");
const ecircuitButton = document.getElementById("ecircuitButton");

let hasStarted = false;

// 공통 화면 전환 함수
function changeScreen(currentScreen, nextScreen) {
  currentScreen.classList.add("is-leaving");

  window.setTimeout(() => {
    currentScreen.classList.add("is-hidden");
    currentScreen.classList.remove("is-leaving");

    nextScreen.classList.remove("is-hidden");
    nextScreen.classList.add("is-entering");
  }, 220);
}

// 시작 화면에서 분야 선택 화면으로 이동
function startWebsite() {
  if (hasStarted) return;
  hasStarted = true;

  changeScreen(startScreen, categoryScreen);
}

// 시작 문구 영역 클릭
startButton.addEventListener("click", startWebsite);

// 시작 화면에서 키보드의 아무 키나 눌러도 시작
document.addEventListener("keydown", () => {
  if (!hasStarted) {
    startWebsite();
  }
});

// E.CIRCUIT 영역을 클릭하면 PDF 3페이지의 주제 선택 화면으로 이동
ecircuitButton.addEventListener("click", () => {
  changeScreen(categoryScreen, ecircuitTopicsScreen);
});
