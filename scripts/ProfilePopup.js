import { Popup } from './Popup';
import { profileNameInput, profileJobInput, userInfoName, userInfoJob, nameError, jobError, loaderInBtn, profileFormSubmitButton, userInfoPhoto } from './script';
import { api } from './API';

export class ProfilePopup extends Popup {
  constructor(popup, rules, button) {
    super(popup, rules);
    this.button = button;
  }
  gettingContent() {
    return [profileNameInput.value, profileJobInput.value] = [userInfoName.textContent, userInfoJob.textContent];
  }
  submit() {
    event.preventDefault();
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
    }
    else
      this.button.classList.remove('popup__button-text_active');
  }
}
