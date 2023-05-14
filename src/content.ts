let form: HTMLElement | null = null;
let textarea: HTMLInputElement | null | undefined = null;
let button: Element | null | undefined = null;

const getForm = (): void => {
  if (form) return;
  form = document.querySelector("form");
};

const getButton = (): void => {
  if (button) return;
  const buttonList = form?.querySelectorAll("button");
  if (!buttonList) return;

  // Regenerate responseもformのbuttonに含まれ、0個目の要素になることがある。
  if (buttonList.length > 1) {
    button = buttonList[1];
  } else {
    button = buttonList[0];
  }
};

const getTextarea = (): void => {
  if (textarea) return;
  textarea = form?.querySelector("textarea") as
    | HTMLInputElement
    | null
    | undefined;
};

const inputTextList: string[] = [];
let currentIndex = 0;
let currentInputText = "";

// inputTextListをユニークな配列にしつつ、currentIndexの整合性も保つ
const uniqueInputTextList = (inputTextList: string[]): void => {
  if (inputTextList.length <= 0) return;
  const currentText = inputTextList[currentIndex];
  const uniqueInputTextList = [...new Set(inputTextList)];
  currentIndex = uniqueInputTextList.indexOf(currentText);
  inputTextList = uniqueInputTextList;
};

// Upキー・Downキーが入力された時
const inputText = (textarea: HTMLInputElement, e: KeyboardEvent): void => {
  if (inputTextList.length <= 0) return;
  if (e.key === "ArrowUp") {
    currentIndex = decrementCurrentIndex(currentIndex);
    textarea.value = inputTextList[currentIndex];
  } else if (e.key === "ArrowDown") {
    currentIndex = incrementCurrentIndex(currentIndex);
    textarea.value = inputTextList[currentIndex];
  }
};

// currentIndexをデクリメントする
const decrementCurrentIndex = (index: number): number => {
  return index - 1 < 0 ? 0 : index - 1;
};

// currentIndexをインクリメントする
const incrementCurrentIndex = (index: number): number => {
  return index + 1 > inputTextList.length - 1
    ? inputTextList.length - 1
    : index + 1;
};

// Textareaに入力された文字を取得
const getCurrentInputText = (textarea: HTMLInputElement): void => {
  textarea.addEventListener("keydown", (e) => {
    currentInputText = textarea.value;
    inputText(textarea, e);
  });
};

// Buttonが押されたら、Textareaに入力された文字を取得して、inputTextListに追加
const clickButtonAndAddInputText = (
  button: Element,
  textarea: HTMLElement
): void => {
  const save = () => {
    inputTextList.push(currentInputText);
    currentIndex = inputTextList.length - 1;
    uniqueInputTextList(inputTextList);
  };

  button.addEventListener("click", () => {
    save();
  });

  textarea.addEventListener("keydown", (e) => {
    if (currentInputText === "") return;

    // IMEのEnterキーを押した時に反応するのを防ぐ
    if (e.keyCode === 13) {
      save();
    }
  });
};

const main = () => {
  console.log("activate chatgpt-up-down-key-input-history");
  getForm();
  getTextarea();
  getButton();

  const timeout = setTimeout(() => {
    if (form && textarea && button) {
      getCurrentInputText(textarea);
      clickButtonAndAddInputText(button, textarea);
      clearTimeout(timeout);
    } else {
      main();
    }
  }, 1000);
};

main();
