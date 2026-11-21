import { decks } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

function createDeckEl(item) {
  const deckEl = document
    .querySelector("#deck-template")
    .content.cloneNode(true);
  const deckCard = deckEl.querySelector(".deck");
  const colorName = hexToString(item.color);
  removeColorClasses(deckCard);
  if (colorName) {
    deckCard.classList.add(`deck_color_${colorName}`);
  }
  const deckLink = deckEl.querySelector(".deck__link");
  deckLink.href = `#${item.id}`;
  deckEl.querySelector(".deck__title").textContent = item.name;
  deckEl.querySelector(".deck__count").textContent =
    `${item.cards.length} cards`;
  const deleteButton = deckEl.querySelector(".deck__delete-btn");
  deleteButton.addEventListener("click", () => {
    deleteButton.closest(".deck").remove();
  });
  return deckEl;
}

function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  const deckListEl = document.querySelector(".decks__list");
  deckListEl.prepend(deckEl);
}

decks.forEach((element) => {
  renderDeckEl(element);
});

function renderViewFromHash() {
  const hash = window.location.hash.slice(1);
  const decksView = document.querySelector("#home");
  const notFoundView = document.querySelector("#not-found");
  const carouselView = document.querySelector("#carousel");
  const element = document.querySelector(".page__main-content");

  if (!hash || hash === "home") {
    decksView.hidden = false;
    notFoundView.hidden = true;
    carouselView.hidden = true;
    element.classList.remove("page__main-content_location_carousel");
    return;
  }

  const deck = decks.find((item) => item.id === hash);
  if (deck) {
    decksView.hidden = true;
    notFoundView.hidden = true;
    carouselView.hidden = false;
    element.classList.add("page__main-content_location_carousel");
    renderCarouselView(deck);
    return;
  } else {
    decksView.hidden = true;
    carouselView.hidden = true;
    notFoundView.hidden = false;
    element.classList.remove("page__main-content_location_carousel");
  }
}

window.addEventListener("hashchange", renderViewFromHash);
renderViewFromHash();
