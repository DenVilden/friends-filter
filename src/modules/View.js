import friendTemplate from '../templates/friend.hbs';

export default class View {
  constructor(friends) {
    this.friends = friends;
  }

  get template() {
    return friendTemplate(this.friends);
  }
}
