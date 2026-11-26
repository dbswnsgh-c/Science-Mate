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

// OHM’S LAW 선택: E.CIRCUIT 주제 선택 화면 → 옴의 법칙 학습 화면
const ohmsScreen = document.getElementById("ohmsScreen");
const ohmsButton = document.getElementById("ohmsButton");
const backButton = document.getElementById("backButton");
let isNavigating = false;
function navigateOnce(from, to) {
  if (isNavigating) return;
  isNavigating = true;
  changeScreen(from, to);
  window.setTimeout(() => { isNavigating = false; }, 500);
}
ohmsButton.addEventListener("click", () => navigateOnce(ecircuitTopicsScreen, ohmsScreen));
backButton.addEventListener("click", () => navigateOnce(ohmsScreen, ecircuitTopicsScreen));

// 옴의 법칙: 전류와 저항을 입력하면 전압은 자동으로 계산됩니다.
const currentSlider = document.getElementById("currentSlider");
const resistanceSlider = document.getElementById("resistanceSlider");
const voltageSlider = document.getElementById("voltageSlider");
const voltageValue = document.getElementById("voltageValue");
const voltageOutput = document.getElementById("voltageOutput");
const currentOutput = document.getElementById("currentOutput");
const resistanceOutput = document.getElementById("resistanceOutput");
const equationDetail = document.getElementById("equationDetail");

function updateOhmsLaw() {
  const current = Number(currentSlider.value);
  const resistance = Number(resistanceSlider.value);
  const voltage = current * resistance;

  voltageSlider.value = String(voltage); // 전압 점 위치 자동 이동
  voltageValue.textContent = voltage.toFixed(1);
  voltageOutput.textContent = `${voltage.toFixed(1)} V`;
  currentOutput.textContent = `${current.toFixed(1)} A`;
  resistanceOutput.textContent = `${resistance.toFixed(1)} Ω`;
  equationDetail.textContent = `${current.toFixed(1)} A × ${resistance.toFixed(1)} Ω = ${voltage.toFixed(1)} V`;
}
currentSlider.addEventListener("input", updateOhmsLaw);
resistanceSlider.addEventListener("input", updateOhmsLaw);
updateOhmsLaw();

document.getElementById("categoryBack").addEventListener("click",()=>navigateOnce(ecircuitTopicsScreen,categoryScreen));
if(location.hash==="#subjects"){hasStarted=true;startScreen.classList.add("is-hidden");categoryScreen.classList.remove("is-hidden");}
