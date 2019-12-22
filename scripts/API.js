import { myConfig } from './apiConfig';

export class API {
  constructor(config) {
    this.url = config.url;
    this.userUrl = config.userUrl;
    this.headers = config.headers;
    this.cardsUrl = config.cardsUrl;
  }

  getResponseJson(res) {
      if (res.ok) {
        return res.json()
      } else return Promise.reject(res.status);
  }

  async getMyProfile () {
    const res = await fetch(this.url + this.userUrl, {
      method: 'GET',
      headers: this.headers,
    });
    return this.getResponseJson(res);
  }

  patchProfile (name, about) {
    return fetch(this.url + this.userUrl, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
          name: name.value,
          about: about.value,
      })
    })
    .then((res) => this.getResponseJson(res))
  }

  getAllCards() {
    return fetch(this.url + this.cardsUrl, {
      method: 'GET',
      headers: this.headers,
    })
    .then((res) => this.getResponseJson(res))
  }

  setNewCard(name, link) {
    return fetch(this.url + this.cardsUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
          name: name.value,
          link: link.value,
      })
    })
    .then((res) => this.getResponseJson(res))
  }

  deleteCard(cardId) {
    return fetch(this.url + this.cardsUrl + '/' + cardId, {
      method: 'DELETE',
      headers: api.headers,
    })
      .then((res) => api.getResponseJson(res))
  }

  putLikeTheCard(cardId) {
    return fetch(api.url + '/cards/like/' + cardId, {
      method: 'PUT',
      headers: this.headers
    })
    .then((res) => this.getResponseJson(res))
  }
}


export const api = new API(myConfig);