/*  
    Объект для данного модуля для возможности переиспользования.
    Не передается в качестве параметра, так как 
    предполагается использование только в этом файле, 
    поэтому вызывается из глобальной области видимости 
*/
const config = {
  openPopupClass: "popup_is-opened",
  animatedPopupClass: "popup_is-animated",
};

// Функция открытия попапа
export function openPopup(popup) {
  popup.classList.add(config.animatedPopupClass);

  // Добавляем таймаут для добавления класса после анимации
  setTimeout(() => {
    popup.classList.add(config.openPopupClass);
  }, 0);

  document.addEventListener("keydown", closePopupByESC);
}

// Функция закрытия попапа
export function closePopup(popup) {
  popup.classList.remove(config.openPopupClass);

  // Откладываем удаление на время работы анимации
  setTimeout(() => {
    popup.classList.remove(config.animatedPopupClass);
  }, 600);

  document.removeEventListener("keydown", closePopupByESC);
}

// Функция закрытия попапа кнопкой ESC
function closePopupByESC(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector("." + config.openPopupClass);

    closePopup(openedPopup);
  }
}

// Функция закрытия попапа по оверлэю
export function closePopupByOverlay(evt) {
  if (evt.target.classList.contains(config.openPopupClass)) {
    closePopup(evt.target);
  }
}
