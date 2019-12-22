import { api } from "../../scripts/API";
import { Popup } from "../popup/Popup";
import { profileFormSubmitButton } from "../../scripts/script";

export class Profile {
  constructor(name, job, photo) {
    (this.name = name), (this.job = job), (this.photo = photo), this.render();
  }
  render() {
    return api
      .getMyProfile()
      .then(profileObj => {
        this.name.textContent = profileObj.name;
        this.job.textContent = profileObj.about;
        this.photo.style.backgroundImage = `url('${profileObj.avatar}')`;
      })
      .catch(err => console.log(`Ошибка получения данных профиля: ${err}`));
  }
  patch(...args) {
    api
      .patchProfile(...args)
      .then(res => {
        this.name.textContent = res.name;
        this.job.textContent = res.about;
        this.photo.style.backgroundImage = `url('${res.avatar}')`;
      })
      .catch(err => console.log(`Ошибка добавления профиля: ${err}`))
      .finally(() =>
        Popup.loaderInBtn(false, profileFormSubmitButton, "Сохранить")
      );
  }
}
