
import "../pages/index.css";
import { initialCards } from "../components/cards";
import { openPopup, closePopup } from "../components/modal";
import { createCard, deleteCard, likeCard } from "../components/card";

/*-----------------------------------------------------------------------------------
    КОНСТАНТЫ И ПЕРЕМЕННЫЕ
*/

// Список карточек

const cardsList = document.querySelector(".places__list");

// Кнопки

const profileEditButton = document.querySelector(".profile__edit-button");
const newCardButton = document.querySelector(".profile__add-button");

// ПРОФИЛЬ на странице

const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Попап ПРОФИЛЬ

const popupProfile = document.querySelector(".popup_type_edit");
const popupProfileForm = document.forms['edit-profile'];
const popupProfileNameInput = popupProfileForm.elements.name;
const popupProfileDescriptionInput = popupProfileForm.elements.description;

// Попап НОВАЯ КАРТОЧКА

const popupAddCard = document.querySelector(".popup_type_new-card");
const popupAddCardForm = document.forms['new-place'];
const popupAddCardNameInput = popupAddCardForm.elements['place-name'];
const popupAddCardLinkInput = popupAddCardForm.elements.link;

// Попап КАРТОЧКА

const popupCard = document.querySelector(".popup_type_image");
const popupCardImage = document.querySelector(".popup__image");
const popupCardName = document.querySelector(".popup__caption");

// Кнопки закрытия попапов

const closeButtons = document.querySelectorAll('.popup__close');


/*-----------------------------------------------------------------------------------
    
*/


// Выводит карточки на страницу

initialCards.forEach((item) => {
  cardsList.append(createCard(item, deleteCard, openPopupImage, likeCard));
});



// Слушатель клика по кнопке редактирования профиля

profileEditButton.addEventListener("click", () => {
  popupProfileNameInput.value = profileName.textContent;
  popupProfileDescriptionInput.value = profileDescription.textContent;

  openPopup(popupProfile);
});



// Слушатель клика по кнопке добавления карточки

newCardButton.addEventListener("click", () => {
  openPopup(popupAddCard);
});



// Слушатель закрытия на все кнопки попапов

closeButtons.forEach(item => {
  item.addEventListener("click", (evt) => {
    const popup = evt.target.closest('.popup');

    closePopup(popup);
  })
})



// Функция открытия попапа с изображением

function openPopupImage(evt) {
  popupCardImage.src = evt.target.src;
  popupCardImage.alt = evt.target.alt;
  popupCardName.textContent = evt.target.alt;

  openPopup(popupCard);
}



// Коллбэк сохранения данных формы изменения профиля

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  profileName.textContent = popupProfileNameInput.value;
  profileDescription.textContent = popupProfileDescriptionInput.value;

  closePopup(popupProfile);
}

// Слушатель клика по кнопке сохранения формы профиля

popupProfileForm.addEventListener('submit', handleProfileFormSubmit);



// Коллбэк сохранения данных формы добавления карточки

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const card = {};
  card.name = popupAddCardNameInput.value;
  card.link = popupAddCardLinkInput.value;

  cardsList.prepend(createCard(card, deleteCard, openPopupImage, likeCard));

  closePopup(popupAddCard);
  popupAddCardForm.reset();
}

// Слушатель клика по кнопке сохранения формы добавления карточки

popupAddCardForm.addEventListener('submit', handleCardFormSubmit);
