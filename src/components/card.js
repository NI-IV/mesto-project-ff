import { addLikeRequest, deleteLikeRequest } from "./api";

const cardTemplate = document.querySelector("#card-template").content;

// Функция создания карточки путем клонирования темплейта
export function createCard(
  card,
  deleteFunc,
  openPopupCardFunc,
  likeFunc,
  myId
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardLikeCounter = cardElement.querySelector(".card__like-counter");

  /* 
    Данный элемент присваивается для дальнейшего поиска ID при удалении через попап
    (ID присваивается попапу и при подтверждении удаления происходит поиск по списку карточек)
  */
  cardElement.id = card["_id"];

  /*
    Если карточка чужая - удаляем кнопку удаления, 
    функцию удаления вешаем только на свои
   */
  if (myId !== card.owner["_id"]) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      deleteFunc(card);
    });
  }

  // Проверка поставленных лайков
  if (checkMyLike(card, myId)) {
    cardLikeButton.classList.add("card__like-button_is-active");
  } else {
    cardLikeButton.classList.remove("card__like-button_is-active");
  }

  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;
  cardLikeCounter.textContent = card.likes.length;

  cardImage.addEventListener("click", openPopupCardFunc);

  cardLikeButton.addEventListener("click", () => {
    likeFunc(card, myId, cardElement);
  });

  return cardElement;
}

// Коллбэк добавления лайка
export function likeCard(card, myId, cardElement) {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likesCounter = cardElement.querySelector(".card__like-counter");

  /**
   *  Проверяем присутствие своего лайка в карточке на сервере
   */
  if (checkMyLike(card, myId)) {
    /**
     *  Если да - удаляем с сервера, удаляем активный класс из разметки,
     *  меняем массив лайков на ответ от сервера - для корректной проверки в дальнейшем
     */
    deleteLikeRequest(card)
      .then((res) => {
        likesCounter.textContent = res.likes.length;
        likeButton.classList.remove("card__like-button_is-active");
        card.likes = res.likes;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    /**
     *  Если нет - добавляем на сервер, добавляем активный класс в разметку,
     *  меняем массив лайков на ответ от сервера - для корректной проверки в дальнейшем
     */
    addLikeRequest(card)
      .then((res) => {
        likesCounter.textContent = res.likes.length;
        likeButton.classList.add("card__like-button_is-active");
        card.likes = res.likes;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// Проверка моего лайка в массиве лайков карточки
function checkMyLike(card, myId) {
  return card.likes.some((item) => item["_id"] === myId);
}
