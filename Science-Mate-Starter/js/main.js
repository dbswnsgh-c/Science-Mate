// 시작 화면과 다음 화면 요소를 가져옵니다.
const startScreen = document.getElementById("startScreen");
const categoryScreen = document.getElementById("categoryScreen");
const startButton = document.getElementById("startButton");

let hasStarted = false;

// 시작 화면에서 분야 선택 화면으로 전환합니다.
function startWebsite() {
  // 여러 번 클릭하거나 키를 눌러도 전환은 한 번만 실행합니다.
  if (hasStarted) return;
  hasStarted = true;

  startScreen.classList.add("is-leaving");

  // 페이드아웃이 끝난 뒤 첫 화면을 숨기고 다음 화면을 표시합니다.
  window.setTimeout(() => {
    startScreen.classList.add("is-hidden");
    startScreen.classList.remove("is-leaving");

    categoryScreen.classList.remove("is-hidden");
    categoryScreen.classList.add("is-entering");
  }, 220);
}

// 시작 문구 영역 클릭
startButton.addEventListener("click", startWebsite);

// 시작 화면에서 키보드의 아무 키나 눌러도 시작
document.addEventListener("keydown", (event) => {
  if (!hasStarted) {
    startWebsite();
  }
});
