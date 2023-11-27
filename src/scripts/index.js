import "../pages/index.css";
import {
  openPopup,
  closePopup,
  closePopupByOverlay,
} from "../components/modal";
import { createCard, likeCard } from "../components/card";
import { enableValidation, clearValidation } from "../components/validation";
import {
  deleteCardRequest,
  addCardRequest,
  changeProfileInfoRequest,
  changeAvatarRequest,
  getMyInfoRequest,
  getCardsRequest,
} from "../components/api";

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
const profileImage = document.querySelector(".profile__image");

// Попап АВАТАР
const popupAvatar = document.querySelector(".popup_avatar");
const popupAvatarForm = document.forms["change-avatar"];
const popupAvatarLinkInput = popupAvatarForm.elements.link;
const popupAvatarButton = popupAvatar.querySelector(".popup__button");

// Попап ПРОФИЛЬ
const popupProfile = document.querySelector(".popup_type_edit");
const popupProfileForm = document.forms["edit-profile"];
const popupProfileNameInput = popupProfileForm.elements.name;
const popupProfileDescriptionInput = popupProfileForm.elements.description;
const popupProfileButton = popupProfile.querySelector(".popup__button");

// Попап НОВАЯ КАРТОЧКА
const popupAddCard = document.querySelector(".popup_type_new-card");
const popupAddCardForm = document.forms["new-place"];
const popupAddCardNameInput = popupAddCardForm.elements["place-name"];
const popupAddCardLinkInput = popupAddCardForm.elements.link;
const popupAddCardButton = popupAddCard.querySelector(".popup__button");

// Попап КАРТОЧКА
const popupCard = document.querySelector(".popup_type_image");
const popupCardImage = document.querySelector(".popup__image");
const popupCardName = document.querySelector(".popup__caption");

// Попап ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ КАРТОЧКИ
const popupDeleteCard = document.querySelector(".popup_delete-image");
const popupDeleteCardButton = popupDeleteCard.querySelector(".popup__button");

// Кнопки закрытия попапов
const closeButtons = document.querySelectorAll(".popup__close");

// Все попапы
const popupsList = document.querySelectorAll(".popup");

// Config для валидации форм
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Мой ID
export let accountId = "";

/*-----------------------------------------------------------------------------------
    
*/

// Вывод карточке на страницу
Promise.all([getCardsRequest(), getMyInfoRequest()])
  .then((request) => {
    // Получаем ID моего аккаунта
    accountId = request[1]["_id"];

    // Заполняем разметку моего аккаунта данными с сервера
    profileName.textContent = request[1].name;
    profileDescription.textContent = request[1].about;
    profileImage.style = `background-image: url('${request[1].avatar}')`;

    // Выводим карточки на страницу
    request[0].forEach((card) => {
      cardsList.append(
        createCard(card, deleteMyCard, openPopupImage, likeCard, accountId)
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Валидация форм
enableValidation(validationConfig);

// Слушатель клика по кнопке редактирования аватара
profileImage.addEventListener("click", () => {
  popupAvatarForm.reset();

  clearValidation(popupAvatar, validationConfig);
  openPopup(popupAvatar);
});

// Слушатель клика по кнопке редактирования профиля
profileEditButton.addEventListener("click", () => {
  popupProfileNameInput.value = profileName.textContent;
  popupProfileDescriptionInput.value = profileDescription.textContent;

  clearValidation(popupProfileForm, validationConfig);
  openPopup(popupProfile);
});

// Слушатель клика по кнопке добавления карточки
newCardButton.addEventListener("click", () => {
  popupAddCardForm.reset();

  clearValidation(popupAddCard, validationConfig);
  openPopup(popupAddCard);
});

// Слушатель закрытия по оверлею на все попапы
popupsList.forEach((item) => {
  item.addEventListener("mousedown", closePopupByOverlay);
});

// Слушатель закрытия на все кнопки попапов
closeButtons.forEach((item) => {
  const popup = item.closest(".popup");
  item.addEventListener("click", () => {
    closePopup(popup);
  });
});

// Функция открытия попапа с изображением
function openPopupImage(evt) {
  popupCardImage.src = evt.target.src;
  popupCardImage.alt = evt.target.alt;
  popupCardName.textContent = evt.target.alt;

  openPopup(popupCard);
}

// Коллбэк сохранения нового аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  renderSaving(true, popupAvatarButton);

  changeAvatarRequest(popupAvatarLinkInput.value)
    .then((res) => {
      profileImage.style = `background-image: url('${res.avatar}')`;

      closePopup(popupAvatar);
      popupAvatarForm.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderSaving(false, popupAvatarButton);
    });
}

// Слушатель клика по кнопке сохранения формы добавления аватара
popupAvatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Коллбэк сохранения данных формы изменения профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  renderSaving(true, popupProfileButton);

  // POST запрос добавления имени и описания
  changeProfileInfoRequest(
    popupProfileNameInput.value,
    popupProfileDescriptionInput.value
  )
    .then((res) => {
      profileName.textContent = res.name;
      profileDescription.textContent = res.about;

      closePopup(popupProfile);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderSaving(false, popupProfileButton);
    });
}

// Слушатель клика по кнопке сохранения формы профиля
popupProfileForm.addEventListener("submit", handleProfileFormSubmit);

// Коллбэк сохранения данных формы добавления карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderSaving(true, popupAddCardButton);

  // POST запрос добавления новой карточки
  addCardRequest(popupAddCardNameInput.value, popupAddCardLinkInput.value)
    .then((card) => {
      cardsList.prepend(
        createCard(card, deleteMyCard, openPopupImage, likeCard, accountId)
      );

      closePopup(popupAddCard);
      popupAddCardForm.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderSaving(false, popupAddCardButton);
    });
}

// Слушатель клика по кнопке сохранения формы добавления карточки
popupAddCardForm.addEventListener("submit", handleCardFormSubmit);

// Открытие подтверждения удаления картинки
function deleteMyCard(card) {
  openPopup(popupDeleteCard);

  // Присваиваем ID удаляемой карточки в попап подтверждения
  popupDeleteCardButton.dataset.cardId = card["_id"];
}

// Коллбэк удаления карточки
function handleDeleteClick(evt) {
  evt.preventDefault();

  // Присваиваем ID удаляемой карточки в попап подтверждения
  const cardId = popupDeleteCardButton.dataset.cardId;
  // Удаляем с сервера
  deleteCardRequest(cardId)
    .then(() => {
      // Через ID на карточках в списке HTML удаляем со страницы
      const deleteCard = document.getElementById(cardId);

      deleteCard.remove();
      popupDeleteCardButton.dataset.cardId = "";
      closePopup(popupDeleteCard);
    })
    .catch((err) => console.log(err));
}

// Удаление карточки при подтверждении popup
popupDeleteCardButton.addEventListener("click", handleDeleteClick);

// Функция уведомления о сохранении
function renderSaving(isLoading, button) {
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = button.dataset.buttonText;
  }
}
