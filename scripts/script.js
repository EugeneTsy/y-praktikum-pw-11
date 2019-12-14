/* элементы DOM */
// попап профиля
const profilePopupSelector = document.querySelector('.popup_profile');
const profileFormOpenButton = document.querySelector('.user-info__button-edit');

const nameError = document.getElementById('name-error');
const jobError = document.getElementById('job-error');
const profileFormSubmitButton = document.querySelector('.popup__button-text');
//Форма и инпуты
const popupFormProfile = document.forms.profile;
const profileNameInput = popupFormProfile.elements.name;
const profileJobInput = popupFormProfile.elements.job;


// попап места
const placePopupSelector = document.querySelector('.popup_place');
const placeFormOpenButton = document.querySelector('.user-info__button-plus');
const placeFormSubmitButton = document.querySelector('.popup__button-plus');
const placeFormSelector = document.forms.place;
const placeError = document.getElementById('place-error');
const linkError = document.getElementById('link-error');
//Форма и инпуты
const popupFormPlace = document.forms.place;
const placeNameInput = popupFormPlace.elements.place;
const placeLinkInput = popupFormPlace.elements.link;

// лайтбокс
const popupCloseButton = document.querySelector('.popup__close');
const placeLikeButton = document.querySelector('.place-card__like-icon');
const popupLightbox = document.querySelector('.popup_image');
const popupLightboxImage = document.querySelector('.popup__scaled-image');

// карточки
const placesList = document.querySelector('.places-list');
const placeCard = document.querySelector('.place-card');

// блок профиля
const userInfoPhoto = document.querySelector('.user-info__photo');
const userInfoName = document.querySelector('.user-info__name');
const userInfoJob = document.querySelector('.user-info__job');

//Правила валидации инпутов
const validationRules = {
  emptyInput: {
    test: value => value.length === 0,
    error: 'Это обязательное поле',
  },
  twoToThirty: {
    test: value => value.length < 2 || value.length > 30,
    error: 'Должно быть от 2 до 30 символов',
  },
  isLink: {
    test: value => !/(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/g.test(value),
    error: 'Здесь должна быть ссылка',
  }
}

const myConfig = {
  url: 'http://95.216.175.5/cohort5',
  userUrl: '/users/me',
  cardsUrl: '/cards',
  ownerId: '0cda97c1671dd43528db36c3',
  headers: {
    authorization: '1003b7c1-17ce-4b29-b464-35db02904fc5',
    'Content-Type': 'application/json'
  },
};


//Загружалка для кнопок
function loaderInBtn(loading, btn, btnDefaultValue) {
  if (loading) {
    btn.textContent = 'Загружаю...';
  } else btn.textContent = btnDefaultValue;
}


//Класс, который ходит на сервер
class API {
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

  getMyProfile () {
    return fetch(this.url + this.userUrl, {
      method: 'GET',
      headers: this.headers,
    })
    .then(res => this.getResponseJson(res))
  }

  patchProfile (name, about) {
    return fetch(api.url + api.userUrl, {
      method: 'PATCH',
      headers: api.headers,
      body: JSON.stringify({
          name: name.value,
          about: about.value,
      })
    })
    .then(res => this.getResponseJson(res))
  }

  getAllCards() {
    return fetch(this.url + this.cardsUrl, {
      method: 'GET',
      headers: this.headers,
    })
    .then(res => this.getResponseJson(res))
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
    .then(res => this.getResponseJson(res))
  }

  deleteCard(cardId) {
    return fetch(this.url + this.cardsUrl + '/' + cardId, {
      method: 'DELETE',
      headers: api.headers,
    })
    .then(res => api.getResponseJson(res))
  }
}


const api = new API(myConfig)

//Получим данные профиля с сервера и сразу отрендерим
function renderProfileData () {
  api.getMyProfile()
    .then(profileObj => {
      userInfoName.textContent = profileObj.name;
      userInfoJob.textContent = profileObj.about;
      userInfoPhoto.style.backgroundImage = `url('${profileObj.avatar}')`;
    })
  .catch((err) => console.log(`Ошибка получения данных профиля: ${err}`));
}

renderProfileData()

//класс, который управляет созданием
class Card {
  constructor(name, link, cardId, likes) {
    this.name = name;
    this.link = link;
    this.id = cardId;
    this.likes = likes;
  }

  createMarkup(visibility) {
    const cardTmpl = document.getElementById('cardTmpl');

    cardTmpl.content.querySelector('.place-card').id = this.id;
    cardTmpl.content.querySelector('.place-card__image').style.backgroundImage = `url('${this.link}')`;
    if (visibility) {
        cardTmpl.content.querySelector('.place-card__delete-icon').classList.add('place-card__delete-icon_visible');}
    cardTmpl.content.querySelector('.place-card__name').textContent = this.name;
    cardTmpl.content.querySelector('.place-card__like-counter').textContent = this.likes.length;
    
    const cardElement = cardTmpl.content.cloneNode(true);
    return cardElement;

  }

  like(event) {
    if (event.target.classList.contains('place-card__like-icon')) {
      event.target.classList.toggle('place-card__like-icon_liked');
    }
  }

  remove() {
    if (event.target.classList.contains('place-card__delete-icon')) {
      let cardId = event.target.parentNode.parentNode.id;
      if (confirm('Удалить карточку?')){
        api.deleteCard(cardId)
          .then(() => document.getElementById(cardId).remove())
          .catch((err) => console.log(`Не могу удалить карточку. Ошибка: ${err}`))
      }
    }
  }
}


class CardList {
  constructor(container) {
    this.container = container;
  }

  addCard(card) {
    const newCard = new Card(card.name, card.link, card._id, card.likes);

    let createdCard;
    if (card.owner._id === myConfig.ownerId) {
      createdCard = newCard.createMarkup(true);
    }else {createdCard = newCard.createMarkup(false)};

    this.container.appendChild(createdCard);
  }
  

  render () {
    api.getAllCards()
      .then(cardsArr => {
        cardsArr.forEach((card) => {
          this.addCard(card);
        });
      }).catch((err) => console.log(`Не могу создать карточки: ${err}`));
  };
}

const renderCardList = new CardList(placesList);
renderCardList.render();





class Popup {
  constructor(popup, rules) {
    this.popup = popup;
    this.rules = rules;
  }

  show() {
    this.popup.classList.add('popup_is-opened');
  }

  hide() {
    if (event.target.classList.contains('popup__close')) {
      this.popup.classList.remove('popup_is-opened');
    }
  }

  textValidation(input, errorMessageWrapper) {
    let isValid = false;

    if (this.rules.emptyInput.test(input.value)) {
      errorMessageWrapper.textContent = this.rules.emptyInput.error;
    } else if (this.rules.twoToThirty.test(input.value)) {
      errorMessageWrapper.textContent = this.rules.twoToThirty.error;
    } else {
      errorMessageWrapper.textContent = '';
      isValid = true;
    }

    if (isValid) {
      this.button.classList.add(`${this.button.classList[1]}_active`);
    } else {
      this.button.classList.remove(`${this.button.classList[1]}_active`)
    };

    return isValid;
  }
}


class ProfilePopup extends Popup {
  constructor(popup, rules, button) {
    super(popup, rules);
    this.button = button;
  }

  gettingContent() {
    return [profileNameInput.value, profileJobInput.value] = [userInfoName.textContent, userInfoJob.textContent];
  }

  submit() {
    event.preventDefault()
    const isValidName = this.textValidation(profileNameInput, nameError);
    const isValidJob = this.textValidation(profileJobInput, jobError);

    if (isValidName && isValidJob) {
      loaderInBtn(true, profileFormSubmitButton, profileFormSubmitButton.textContent);
      api.patchProfile(profileNameInput, profileJobInput)
      .then((res) => {
        userInfoName.textContent = res.name;
        userInfoJob.textContent = res.about;
        userInfoPhoto.style.backgroundImage = `url('${res.avatar}')`;
        this.popup.classList.remove('popup_is-opened');
      })
      .catch((err) => console.log(`Ошибка добавления профиля: ${err}`))
      .finally(() => loaderInBtn(false, profileFormSubmitButton, 'Сохранить'));
    } else this.button.classList.remove('popup__button-text_active');
  }
}

class PlacePopup extends Popup {
  constructor(popup, rules, button) {
    super(popup, rules);
    this.button = button;
  }

  linkValidation(input, errorMessageWrapper) {
    let isValid = false;

    if (this.rules.emptyInput.test(input.value)) {
      errorMessageWrapper.textContent = this.rules.emptyInput.error;
    } else if (this.rules.isLink.test(input.value)) {
      errorMessageWrapper.textContent = this.rules.isLink.error;
    } else {
      errorMessageWrapper.textContent = '';
      isValid = true;
    }

    if (isValid) {
      this.button.classList.add('popup__button-plus_active');
    } else this.button.classList.remove('popup__button-plus_active');

    return isValid;
  }

  submit(name, link) {
    event.preventDefault()
    const isValidPlace = this.textValidation(name, placeError);
    const isValidLink = this.linkValidation(link, linkError);

    if (isValidPlace && isValidLink) {
      loaderInBtn(true, placeFormSubmitButton, placeFormSubmitButton.textContent);
      api.setNewCard(name, link)
      .then(() => {
        api.getAllCards()  
        .then(res => {
          new CardList(placesList).addCard(res.pop())
        })
      })
      /* 🤷‍♂️ 😔Можно лучше: не нужно перезапрашивать все карточки с сервера, достаточно добавить одну в контейнер
    
      //Добавление картотчки на страницу без перезапроса всех карточек:
      api.setNewCard(name, link)  // внутри setNewCard должн быть getResponseJson
        .then((res) => {   //В ответ на отправку карточки сервер возвращает данные добавленной карточки
          renderCardList.addCard(res);   
        })
        .catch((err) => console.log(err));
      */
      .catch((res) => console.log(`Не удалось загрузить карточки с сервера. Ошибка: ${res}`));
      placeNameInput.value = '';
      placeLinkInput.value = '';
      loaderInBtn(false, placeFormSubmitButton, '');
      this.popup.classList.remove('popup_is-opened');
    } else this.button.classList.add('popup__button-plus_active');
  }
}

// Создание попапов
const popupProfile = new ProfilePopup(profilePopupSelector, validationRules, profileFormSubmitButton);
const popupPlace = new PlacePopup(placePopupSelector, validationRules, placeFormSubmitButton);

//Управление видимостью лайтбокса popupLightbox
function showMePlace(event) {
  if (event.target.classList.contains('place-card__image')) {
    let link = event.target.style.backgroundImage.split('"')[1];
    popupLightbox.classList.add('popup_is-opened');
    popupLightboxImage.setAttribute('src', `${link}`);
  } else if (event.target.classList.contains('popup__close')) {
    popupLightbox.classList.remove('popup_is-opened');
  }
}

// Методы popupPlace
placeFormOpenButton.addEventListener('click', () => popupPlace.show());
placePopupSelector.addEventListener('click', () => popupPlace.hide());
placePopupSelector.addEventListener('submit', () => popupPlace.submit(placeNameInput, placeLinkInput));
popupFormPlace.place.addEventListener('input', () => { popupPlace.textValidation(popupFormPlace.place, placeError) });
popupFormPlace.link.addEventListener('input', () => { popupPlace.linkValidation(popupFormPlace.link, linkError) });

// Методы popupForm
profileFormOpenButton.addEventListener('click', () => {
  popupProfile.show();
  popupProfile.gettingContent();//Закидываем в инпут свежую дату
});
profilePopupSelector.addEventListener('click', () => popupProfile.hide());
popupFormProfile.addEventListener('submit', () => popupProfile.submit());
popupFormProfile.name.addEventListener('input', () => {popupProfile.textValidation(popupFormProfile.name, nameError) });
popupFormProfile.job.addEventListener('input', () => {popupProfile.textValidation(popupFormProfile.job, jobError) });

// Вкл/выкл lightbox
placesList.addEventListener('click', showMePlace);
popupLightbox.addEventListener('click', showMePlace);

// Лайк и удаление карточек
placesList.addEventListener('click', (e) => { new Card().like(e); });
placesList.addEventListener('click', (e) => { new Card().remove(e); });


/*
  Запросы к серверу выполняются, карточки отрисовываются и данные пользователя отправляются - это отлично.
  Но есть ряд замечаний:

  Надо исправить:
  - все запросы к серверу должны быть через методы класса Api
  - обработчик ошибок должен стоять в самом конце цепочки блоков then
  Пример кода: 
    getUserData() {
      return fetch(`${this.baseUrl}/users/me`,{ // <-- возвращаем промис с данными
        headers: this.headers
      })
      .then((res) => {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
    }

    Использование метода:
      api.getUserData()
      .then((obj) => {
        userName.textContent = obj.name;
        userJob.textContent = obj.about;
      })
      .catch((err) => console.log(err));  // <-- обработка ошибок здесь, в самом конце цепочки then
    }

  - в методе getResponseJson исправить возврат отклоненного промиса

  - отправка карточки на сервер не должна быть в методе addCard, там должно быть добавление карточки в контейнер
  
  - для добавления карточки в контейнер не использовать innerHTML

  Можно лучше: 
  - не разбивать Api на несколько классов, все запросы к серверу описать в одном классе


  Т.к. замечаний довольно много, при следующем ревью могут появится ещё места, которые нужно 
  будет поправить.
*/



/*
    Отлично, большинство замечаний исправлено, на мой взгляд программа стала выглядеть 
    гораздо лучше.
  
    Но нужно исправить:
    - во всех блоках catch делать вывод сообщения в консоль, а не Promise.reject

    Можно лучше: 
    - в ответ на отправку данных сервер отправляет в ответ данные которые он сохранил,
    поэтому не нужно при добавлении карточки и сохранении данных пользователя слать ещё один запрос 
*/

/*
    Хорошая работа, обмен с сервером теперь реализован правильно.
    Критичные замечания исправлены, но при добавлении карточки лучше не перезапрашивать
    все карточки с сервера вызывая api.getAllCards() а просто добавить
    карточку в контейнер (пример привел в классе PlacePopup, надеюсь поможет)

    Если у Вас будет свободное время попробуйте изучить работу с сервером
    с использованием async/await для работы с асинхронными запросами.
    https://learn.javascript.ru/async-await
    https://habr.com/ru/company/ruvds/blog/414373/
    Это часто используется в реальной работе

    Успехов в дальнейшем обучении!
*/