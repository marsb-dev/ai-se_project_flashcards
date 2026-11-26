import { hexToString, removeColorClasses } from "./colorMap.js";
import { requestConfirmation } from "./modal.js";

const deckView = document.querySelector("#deck-view");
const homeDeckList = document.querySelector("#home .gallery__list");
const deckCardList = deckView.querySelector(".gallery__list");
const deckViewTitle = deckView.querySelector(".gallery__title");
const practiceButton = deckView.querySelector(".gallery__practice-btn");
const cardTemplate = document.querySelector("#card-template");

let activeDeck = null;

function createFlashcardEl(card, deck) {
  const cardEl = cardTemplate.content.querySelector(".card").cloneNode(true);
  const colorName = hexToString(deck.color);
  removeColorClasses(cardEl);
  if (colorName) {
    cardEl.classList.add(`card_color_${colorName}`);
  }

  const cardText = cardEl.querySelector(".card__text");
  const flipButton = cardEl.querySelector(".card__flip-btn");
  const deleteButton = cardEl.querySelector(".card__delete-btn");
  let showingAnswer = false;

  cardText.textContent = card.question;
  flipButton.addEventListener("click", () => {
    showingAnswer = !showingAnswer;
    cardText.textContent = showingAnswer ? card.answer : card.question;
    cardEl.classList.toggle("card_color_white", showingAnswer);
    flipButton.setAttribute(
      "aria-label",
      showingAnswer ? "Show question" : "Show answer",
    );
  });
  deleteButton.addEventListener("click", () => {
    requestConfirmation(
      "Are you sure you want to delete this flashcard?",
      () => {
        const cardIndex = deck.cards.indexOf(card);
        if (cardIndex !== -1) {
          deck.cards.splice(cardIndex, 1);
        }
        cardEl.remove();
        practiceButton.disabled = deck.cards.length === 0;
        const homeDeckCard = [...homeDeckList.querySelectorAll(".card")].find(
          (homeCard) => homeCard.dataset.deckId === deck.id,
        );
        if (homeDeckCard) {
          homeDeckCard.querySelector(".card__count").textContent =
            `${deck.cards.length} cards`;
        }
      },
    );
  });

  return cardEl;
}

function renderDeckView(deck) {
  activeDeck = deck;
  deckViewTitle.textContent = deck.name;
  deckCardList.innerHTML = "";
  deck.cards.forEach((card) => {
    deckCardList.append(createFlashcardEl(card, deck));
  });
  practiceButton.disabled = deck.cards.length === 0;
}

practiceButton.addEventListener("click", () => {
  if (activeDeck && activeDeck.cards.length > 0) {
    window.location.hash = `${activeDeck.id}/practice`;
  }
});

export { renderDeckView };
