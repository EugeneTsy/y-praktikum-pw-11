import { Popup } from "./Popup";

export class Lightbox extends Popup {
  constructor(popup, image) {
    super(popup);
    (this.popup = popup), (this.image = image);
  }
  imageToggling(event) {
    if (event.target.classList.contains("place-card__image")) {
      let link = event.target.style.backgroundImage.split('"')[1];
      this.image.setAttribute("src", `${link}`);
      this.show();
    } else if (event.target.classList.contains("popup__close")) {
      this.hide();
    }
  }
}
