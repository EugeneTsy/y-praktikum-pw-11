import { Card } from './Card';
import { CardList } from './CardList';
import { ProfilePopup } from './ProfilePopup';
import { PlacePopup } from './PlacePopup';

import { api } from './API';



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
const placeError = document.getElementById('place-error');
const linkError = document.getElementById('link-error');
//Форма и инпуты
const popupFormPlace = document.forms.place;
const placeNameInput = popupFormPlace.elements.place;
const placeLinkInput = popupFormPlace.elements.link;

const popupLightbox = document.querySelector('.popup_image');
const popupLightboxImage = document.querySelector('.popup__scaled-image');

// карточки
const placesList = document.querySelector('.places-list');
const renderCardList = new CardList(placesList);

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
    test: value => !/(^https?:\/\/)?[a-z0-9~_\-.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/g.test(value),
    error: 'Здесь должна быть ссылка',
  }
}

//Загружалка для кнопок
export function loaderInBtn(loading, btn, btnDefaultValue) {
  if (loading) {
    btn.textContent = 'Загружаю...';
  } else btn.textContent = btnDefaultValue;
}




//Получим данные профиля с сервера и сразу отрендерим
function renderProfileData() {
  api.getMyProfile()
    .then(profileObj => {
      userInfoName.textContent = profileObj.name;
      userInfoJob.textContent = profileObj.about;
      userInfoPhoto.style.backgroundImage = `url('${profileObj.avatar}')`;
    })
    .catch((err) => console.log(`Ошибка получения данных профиля: ${err}`));
}

renderProfileData()


renderCardList.render();





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
popupFormProfile.name.addEventListener('input', () => { popupProfile.textValidation(popupFormProfile.name, nameError) });
popupFormProfile.job.addEventListener('input', () => { popupProfile.textValidation(popupFormProfile.job, jobError) });

// Вкл/выкл lightbox
placesList.addEventListener('click', showMePlace);
popupLightbox.addEventListener('click', showMePlace);

// Лайк и удаление карточек
placesList.addEventListener('click', (e) => { new Card().like(e); });
placesList.addEventListener('click', (e) => { new Card().remove(e); });

export {
  profilePopupSelector,
  profileFormOpenButton,
  nameError,
  jobError,
  profileFormSubmitButton,
  popupFormProfile,
  profileNameInput,
  profileJobInput,
  placePopupSelector,
  placeFormOpenButton,
  placeFormSubmitButton,
  placeError,
  linkError,
  popupFormPlace,
  placeNameInput,
  placeLinkInput,
  popupLightbox,
  popupLightboxImage,
  placesList,
  renderCardList,
  userInfoPhoto,
  userInfoName,
  userInfoJob,
  validationRules
}