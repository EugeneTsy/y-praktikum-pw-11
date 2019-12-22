export class Popup {
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
    }
    else if (this.rules.twoToThirty.test(input.value)) {
      errorMessageWrapper.textContent = this.rules.twoToThirty.error;
    }
    else {
      errorMessageWrapper.textContent = '';
      isValid = true;
    }
    if (isValid) {
      this.button.classList.add(`${this.button.classList[1]}_active`);
    }
    else {
      this.button.classList.remove(`${this.button.classList[1]}_active`);
    }
    return isValid;
  }
}
