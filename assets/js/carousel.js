let eventController;

function renderCarouselView(decks) {
  let currentIndex = 0;
  let isFlipped = false;
  eventController?.abort();
  eventController = new AbortController();

  const carouselEl = document.querySelector(".carousel");
  const sectionTitle = carouselEl.querySelector(".carousel__title");
  const cardText = carouselEl.querySelector(".carousel__card_text");
  const cardElement = carouselEl.querySelector(".carousel__card");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");

  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    if (currentIndex === decks.cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  function updateDisplay() {
    const card = decks.cards[currentIndex];
    sectionTitle.textContent = `${decks.name} \u00b7 ${currentIndex + 1} of ${decks.cards.length}`;
    cardText.textContent = isFlipped ? card.answer : card.question;
    if (isFlipped) {
      cardElement.classList.add("carousel__card_color_white");
      cardElement.style.backgroundColor = "";
    } else {
      cardElement.classList.remove("carousel__card_color_white");
      cardElement.style.backgroundColor = decks.color || "";
    }
    updateArrows();
  }

  rightBtn.addEventListener("click", () => {
    if (currentIndex < decks.cards.length - 1) {
      currentIndex++;
      isFlipped = false;
      updateDisplay();
    }
  }, { signal: eventController.signal });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      isFlipped = false;
      updateDisplay();
    }
  }, { signal: eventController.signal });

  flipBtn.addEventListener("click", () => {
    isFlipped = !isFlipped;
    updateDisplay();
  }, { signal: eventController.signal });

  updateDisplay();
}

export { renderCarouselView };
