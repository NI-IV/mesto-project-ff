import "../pages/index.css";
import { openPopup, closePopup } from "../components/modal";
import { createCard, likeCard } from "../components/card";
import { enableValidation, clearValidation } from "../components/validation";
import { get, post } from "../components/api";

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
const popupAvatarButton = popupAvatar.querySelector('.popup__button');

// Попап ПРОФИЛЬ
const popupProfile = document.querySelector(".popup_type_edit");
const popupProfileForm = document.forms["edit-profile"];
const popupProfileNameInput = popupProfileForm.elements.name;
const popupProfileDescriptionInput = popupProfileForm.elements.description;
const popupProfileButton = popupProfile.querySelector('.popup__button');

// Попап НОВАЯ КАРТОЧКА
const popupAddCard = document.querySelector(".popup_type_new-card");
const popupAddCardForm = document.forms["new-place"];
const popupAddCardNameInput = popupAddCardForm.elements["place-name"];
const popupAddCardLinkInput = popupAddCardForm.elements.link;
const popupAddCardButton = popupAddCard.querySelector('.popup__button');

// Попап КАРТОЧКА
const popupCard = document.querySelector(".popup_type_image");
const popupCardImage = document.querySelector(".popup__image");
const popupCardName = document.querySelector(".popup__caption");

// Попап ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ КАРТОЧКИ
const popupDeleteCard = document.querySelector(".popup_delete-image");
const popupDeleteCardButton = popupDeleteCard.querySelector(".popup__button");

// Кнопки закрытия попапов
const closeButtons = document.querySelectorAll(".popup__close");

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
Promise.all([get("/cards"), get("/users/me")])
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

// Слушатель закрытия на все кнопки попапов
closeButtons.forEach((item) => {
  item.addEventListener("click", (evt) => {
    const popup = evt.target.closest(".popup");

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

  post(
    "/users/me/avatar",
    {
      avatar: popupAvatarLinkInput.value,
    },
    "PATCH"
  )
    .then((res) => {
      profileImage.style = `background-image: url('${res.avatar}')`;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderSaving(false, popupAvatarButton);
      closePopup(popupAvatar);
      popupAvatarForm.reset();
    })

  
}

// Слушатель клика по кнопке сохранения формы добавления аватара
popupAvatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Коллбэк сохранения данных формы изменения профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  renderSaving(true, popupProfileButton);

  // POST запрос добавления имени и описания
  post(
    "/users/me",
    {
      name: popupProfileNameInput.value,
      about: popupProfileDescriptionInput.value,
    },
    "PATCH"
  )
    .then((res) => {
      profileName.textContent = res.name;
      profileDescription.textContent = res.about;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderSaving(false, popupProfileButton);
      closePopup(popupProfile);
    })
}

// Слушатель клика по кнопке сохранения формы профиля
popupProfileForm.addEventListener("submit", handleProfileFormSubmit);

// Коллбэк сохранения данных формы добавления карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderSaving(true, popupAddCardButton);

  // POST запрос добавления новой карточки
  post("/cards", {
    name: popupAddCardNameInput.value,
    link: popupAddCardLinkInput.value,
  })
    .then((card) => {
      cardsList.prepend(
        createCard(card, deleteMyCard, openPopupImage, likeCard, accountId)
      );
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderSaving(false, popupAddCardButton);
      closePopup(popupAddCard);
      popupAddCardForm.reset();
    })
}

// Слушатель клика по кнопке сохранения формы добавления карточки
popupAddCardForm.addEventListener("submit", handleCardFormSubmit);

// Удаление карточки с сервера
function deleteMyCard(card) {
  openPopup(popupDeleteCard);

  // Присваиваем ID удаляемой карточки в попап подтверждения
  const cardId = (popupDeleteCardButton.dataset.cardId = card["_id"]);

  popupDeleteCardButton.addEventListener("click", () => {
    // Удаляем с сервера
    post(`/cards/${cardId}`, {}, "DELETE")
      .then(() => {
        // Через ID на карточках в списке HTML удаляем со страницы
        const deleteCard = document.getElementById(cardId);
        popupDeleteCardButton.dataset.cardId = "";
        deleteCard.remove();
        closePopup(popupDeleteCard);
      })
      .catch((err) => console.log(err));
  });
}

// Функция уведомления о сохранении
function renderSaving(isLoading, button) {
  if (isLoading) {
    button.textContent = 'Сохранение...';
  } else {
    button.textContent = button.dataset.buttonText;
  }
}
