
const cardTemplate = document.querySelector("#card-template").content;


// Функция создания карточки путем клонирования темплейта

export function createCard(card, deleteFunc, openPopupCardFunc, likeFunc) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;

  deleteButton.addEventListener("click", deleteFunc);
  cardImage.addEventListener('click', openPopupCardFunc);
  cardLikeButton.addEventListener('click', likeFunc);

  return cardElement;
}


// Функция удаления карточки

export function deleteCard(evt) {
  const card = evt.target.closest(".card");
  card.remove();
}


// Коллбэк добавления лайка

export function likeCard(evt) {
    evt.target.classList.toggle("card__like-button_is-active");
}
  