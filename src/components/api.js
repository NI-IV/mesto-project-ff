const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-1",
  headers: {
    authorization: "d49f8c35-874e-409a-8e48-d7efdaa466d1",
    "Content-Type": "application/json",
  },
};

/**
 * Базовая реализация GET запроса
 * @param { string } uri частичный путь после базового адреса
 */
function get(uri) {
  return fetch(config.baseUrl + uri, {
    headers: config.headers,
  }).then(handleResponse);
}

/**
 * Базовая реализация POST запроса
 * @param { string } uri частичный путь после базового адреса
 * @param { object } data данные, передаваемые на сервер
 * @param { string } method HTTP метод запроса
 */
function post(uri, data, method = "POST") {
  return fetch(config.baseUrl + uri, {
    method,
    headers: config.headers,
    body: JSON.stringify(data),
  }).then(handleResponse);
}

/**
 * Обработчик ошибок запроса
 * @param { Response } response объект с ответом сервера до загрузки данных
 * @return { Promise } в then всегда будет результат
 * @reject { status, error } в catch всегда будет ошибка
 */
const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(`Error: ${response.status}`);
  }
};

/**
 * Удаление карточки с сервера
 * @param { string } cardId
 * @returns { Promise }
 */
export function deleteCardRequest(cardId) {
  return post(`/cards/${cardId}`, {}, "DELETE");
}

/**
 * Добавление новой карточки на сервер
 * @param { string } name
 * @param { string } link
 * @returns { Promise }
 */
export function addCardRequest(cardName, cardLink) {
  return post("/cards", {
    name: cardName,
    link: cardLink,
  });
}

/**
 * Изменение информации профиля
 * @param { string } inputName
 * @param { string } inputDescription
 * @returns { Promise }
 */
export function changeProfileInfoRequest(profileName, profileDescription) {
  return post(
    "/users/me",
    {
      name: profileName,
      about: profileDescription,
    },
    "PATCH"
  );
}

/**
 * Отправка нового изображение аватара на сервер
 * @param { string } inputLink
 * @returns { Promise }
 */
export function changeAvatarRequest(inputLink) {
  return post(
    "/users/me/avatar",
    {
      avatar: inputLink,
    },
    "PATCH"
  );
}

/**
 * Запрос информации о моем профиле
 * @returns { Promise }
 */
export function getMyInfoRequest() {
  return get("/users/me");
}

/**
 * Запрос карточек с сервера
 * @returns { Promise }
 */
export function getCardsRequest() {
  return get("/cards");
}

/**
 * Удаление лайка карточки с сервера
 * @param { object } card
 * @returns { Promise }
 */
export function deleteLikeRequest(card) {
  return post(`/cards/likes/${card["_id"]}`, {}, "DELETE");
}

/**
 * Добавление лайка карточки с сервера
 * @param { object } card
 * @returns { Promise }
 */
export function addLikeRequest(card) {
  return post(`/cards/likes/${card["_id"]}`, {}, "PUT");
}
