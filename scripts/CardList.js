import { myConfig } from './apiConfig.js';
import { Card } from './Card';
import { api } from './API';

export class CardList {
  constructor(container) {
    this.container = container;
  }
  addCard(card) {
    const newCard = new Card(card.name, card.link, card._id, card.likes);
    let createdCard;
    if (card.owner._id === myConfig.ownerId) {
      createdCard = newCard.createMarkup(true);
    }
    else {
      createdCard = newCard.createMarkup(false);
    }
    this.container.appendChild(createdCard);
  }
  render() {
    api.getAllCards()
      .then(cardsArr => {
        cardsArr.forEach((card) => {
          this.addCard(card);
        });
      }).catch((err) => console.log(`Не могу создать карточки: ${err}`));
  }
}
