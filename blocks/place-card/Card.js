import { api } from "../../scripts/API";

//класс карточки с методами создания, лайка и удаления
export class Card {
  constructor(name, link, cardId, likes) {
    this.name = name;
    this.link = link;
    this.id = cardId;
    this.likes = likes;
  }
  createMarkup(visibility) {
    const cardTmpl = document.getElementById("cardTmpl");
    cardTmpl.content.querySelector(".place-card").id = this.id;
    cardTmpl.content.querySelector(
      ".place-card__image"
    ).style.backgroundImage = `url('${this.link}')`;
    if (visibility) {
      cardTmpl.content
        .querySelector(".place-card__delete-icon")
        .classList.add("place-card__delete-icon_visible");
    } else {
      cardTmpl.content
        .querySelector(".place-card__delete-icon")
        .classList.remove("place-card__delete-icon_visible");
    }
    cardTmpl.content.querySelector(".place-card__name").textContent = this.name;
    cardTmpl.content.querySelector(
      ".place-card__like-counter"
    ).textContent = this.likes.length;
    const cardElement = cardTmpl.content.cloneNode(true);
    return cardElement;
  }
  like(event) {
    if (event.target.classList.contains("place-card__like-icon")) {
      let cardId = event.target.parentNode.parentNode.parentNode.id;
      api.putLikeTheCard(cardId)
      .then(res => {console.log(res)})

      event.target.classList.toggle("place-card__like-icon_liked");
    }
  }
  remove() {
    if (event.target.classList.contains("place-card__delete-icon")) {
      let cardId = event.target.parentNode.parentNode.id;
      if (confirm("Удалить карточку?")) {
        api
          .deleteCard(cardId)
          .then(() => document.getElementById(cardId).remove())
          .catch(err =>
            console.log(`Не могу удалить карточку. Ошибка: ${err.message}`)
          );
      }
    }
  }
}
