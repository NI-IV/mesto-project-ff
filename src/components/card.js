import { post } from "./api";

const cardTemplate = document.querySelector("#card-template").content;

// Функция создания карточки путем клонирования темплейта
export function createCard(card, deleteFunc, openPopupCardFunc, likeFunc, myId) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardLikeCounter = cardElement.querySelector(".card__like-counter");

  // Присваиваем каждой карточке ID в html для корректного удаления

  cardElement.id = card['_id'];

  /**
   *  Если карточка чужая - скрываем кнопку удаления, 
   *  функцию удаления вешаем только на свои
   */ 
  
  if (myId !== card.owner["_id"]) {
    deleteButton.style = 'display: none';
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

  cardImage.addEventListener('click', openPopupCardFunc);

  cardLikeButton.addEventListener('click', () => {
    likeFunc(card, myId);
  });

  return cardElement;
}

// Коллбэк добавления лайка
export function likeCard(card, myId) {

  // Находим элементы по ID

  const likedCard = document.getElementById(card["_id"]);
  const likeButton = likedCard.querySelector(".card__like-button");
  const likesCounter = likedCard.querySelector('.card__like-counter');

  /**
   *  Проверяем присутствие своего лайка в карточке на сервере
   */

  if (checkMyLike(card, myId)) {

    /**
     *  Если да - удаляем с сервера, удаляем активный класс из разметки,
     *  меняем массив лайков на ответ от сервера - для корректной проверки в дальнейшем
     */

    post(`/cards/likes/${card["_id"]}`, {}, 'DELETE')
      .then(res => {

        likesCounter.textContent = res.likes.length;
        likeButton.classList.remove("card__like-button_is-active");
        card.likes = res.likes;

      })
      .catch(err => {
        console.log(err);
      })
  
  } else {

     /**
     *  Если нет - добавляем на сервер, добавляем активный класс в разметку,
     *  меняем массив лайков на ответ от сервера - для корректной проверки в дальнейшем
     */

    post(`/cards/likes/${card["_id"]}`, {}, 'PUT')
      .then(res => {
        
        likesCounter.textContent = res.likes.length;
        likeButton.classList.add("card__like-button_is-active");
        card.likes = res.likes;
      })
      .catch(err => {
        console.log(err);
      })
  }
}

// Проверка моего лайка в массиве лайков карточки
function checkMyLike(card, myId) {
  return card.likes.some(item => item['_id'] === myId);
}