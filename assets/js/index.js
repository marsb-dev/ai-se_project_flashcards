import { decks } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { requestConfirmation } from "./modal.js";

const homeView = document.querySelector("#home");
const notFoundView = document.querySelector("#not-found");
const carouselView = document.querySelector("#carousel");
const mainContent = document.querySelector(".page__main-content");
const homeDeckList = homeView.querySelector(".gallery__list");

function createDeckEl(item) {
  const deckEl = document
    .querySelector("#deck-template")
    .content.cloneNode(true);
  const deckCard = deckEl.querySelector(".card");
  deckCard.dataset.deckId = item.id;
  const colorName = hexToString(item.color);
  removeColorClasses(deckCard);
  if (colorName) {
    deckCard.classList.add(`card_color_${colorName}`);
  }
  const deckLink = deckEl.querySelector(".card__link");
  deckLink.href = `#${item.id}`;
  deckEl.querySelector(".card__title").textContent = item.name;
  deckEl.querySelector(".card__count").textContent =
    `${item.cards.length} cards`;
  const deleteButton = deckEl.querySelector(".card__delete-btn");
  deleteButton.addEventListener("click", () => {
    requestConfirmation("Are you sure you want to delete this deck?", () => {
      deleteButton.closest(".card").remove();
    });
  });
  return deckEl;
}

function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  homeDeckList.prepend(deckEl);
}

function hideViews() {
  homeView.hidden = true;
  document.querySelector("#deck-view").hidden = true;
  notFoundView.hidden = true;
  carouselView.hidden = true;
}

decks.forEach(renderDeckEl);

function renderViewFromHash() {
  const hash = window.location.hash.slice(1);
  const [deckId, action] = hash.split("/");

  if (!deckId || deckId === "home") {
    hideViews();
    homeView.hidden = false;
    mainContent.classList.remove("page__main-content_location_carousel");
    return;
  }

  const deck = decks.find((item) => item.id === deckId);
  if (deck && !action) {
    hideViews();
    document.querySelector("#deck-view").hidden = false;
    mainContent.classList.remove("page__main-content_location_carousel");
    renderDeckView(deck);
    return;
  }

  if (deck && action === "practice") {
    hideViews();
    if (deck.cards.length === 0) {
      document.querySelector("#deck-view").hidden = false;
      mainContent.classList.remove("page__main-content_location_carousel");
      renderDeckView(deck);
      return;
    }
    carouselView.hidden = false;
    mainContent.classList.add("page__main-content_location_carousel");
    renderCarouselView(deck);
    return;
  }

  hideViews();
  notFoundView.hidden = false;
  mainContent.classList.remove("page__main-content_location_carousel");
}

window.addEventListener("hashchange", renderViewFromHash);
renderViewFromHash();
