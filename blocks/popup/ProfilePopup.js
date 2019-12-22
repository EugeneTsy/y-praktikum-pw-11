import { Popup } from "./Popup";

import * as glbVars from "../../scripts/script";

export class ProfilePopup extends Popup {
  constructor(popup, rules, button) {
    super(popup, rules);
    this.button = button;
  }
  gettingContent() {
    return ([glbVars.profileNameInput.value, glbVars.profileJobInput.value] = [
      glbVars.userInfoName.textContent,
      glbVars.userInfoJob.textContent
    ]);
  }
  submit() {
    event.preventDefault();
    const isValidName = this.textValidation(
      glbVars.profileNameInput,
      glbVars.nameError
    );
    const isValidJob = this.textValidation(
      glbVars.profileJobInput,
      glbVars.jobError
    );
    if (isValidName && isValidJob) {
      Popup.loaderInBtn(
        true,
        glbVars.profileFormSubmitButton,
        glbVars.profileFormSubmitButton.textContent
      );
      if (glbVars.profile) {
        glbVars.profile.patch(
          glbVars.profileNameInput,
          glbVars.profileJobInput
        );
      }
    } else this.button.classList.remove("popup__button-text_active");
  }
}
