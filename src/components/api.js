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

export function get(uri) {
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

export function post(uri, data, method = "POST") {
  return fetch(config.baseUrl + uri, {
    method,
    headers: config.headers,
    body: JSON.stringify(data),
  }).then(handleResponse);
}

/**
 * Обработчик ошибок запроса
 * @param {Response} response объект с ответом сервера до загрузки данных
 * @return {Promise} в then всегда будет результат
 * @reject {status, error} в catch всегда будет ошибка
 */

const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(`Error: ${response.status}`);
  }
};
