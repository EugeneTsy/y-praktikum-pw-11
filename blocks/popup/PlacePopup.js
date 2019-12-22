import { Popup } from "./Popup";
import {
  placeError,
  linkError,
  placeFormSubmitButton,
  placeNameInput,
  placeLinkInput,
  renderCardList
} from "../../scripts/script";
import { api } from "../../scripts/API";

export class PlacePopup extends Popup {
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
      errorMessageWrapper.textContent = "";
      isValid = true;
    }
    if (isValid) {
      this.button.classList.add("popup__button-plus_active");
    } else this.button.classList.remove("popup__button-plus_active");
    return isValid;
  }
  submit(name, link) {
    event.preventDefault();
    const isValidPlace = this.textValidation(name, placeError);
    const isValidLink = this.linkValidation(link, linkError);
    if (isValidPlace && isValidLink) {
      Popup.loaderInBtn(
        true,
        placeFormSubmitButton,
        placeFormSubmitButton.textContent
      );
      api
        .setNewCard(name, link)
        .then(res => {
          renderCardList.addCard(res);
        })
        .catch(res =>
          console.log(`Не удалось добавить новую карточку. Ошибка: ${res}`)
        );
      placeNameInput.value = "";
      placeLinkInput.value = "";
      Popup.loaderInBtn(false, placeFormSubmitButton, "");
      this.popup.classList.remove("popup_is-opened");
    } else this.button.classList.add("popup__button-plus_active");
  }
}
