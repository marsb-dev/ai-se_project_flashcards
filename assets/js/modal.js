const modal = document.querySelector("#confirmation-modal");
const modalText = modal.querySelector(".modal__text");
const cancelButton = modal.querySelector(".modal__btn_type_cancel");
const confirmButton = modal.querySelector(".modal__btn_type_confirm");

let onConfirm = null;

function closeModal() {
  onConfirm = null;
  modal.classList.remove("modal_visible");
}

function requestConfirmation(message, callback) {
  modalText.textContent = message;
  onConfirm = callback;
  modal.classList.add("modal_visible");
}

cancelButton.addEventListener("click", closeModal);
confirmButton.addEventListener("click", () => {
  const callback = onConfirm;
  closeModal();
  if (callback) {
    callback();
  }
});

export { requestConfirmation };
