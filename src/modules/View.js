import friendTemplate from '../templates/friend.hbs';

export default class View {
  static render(element, friends) {
    const template = friendTemplate(friends);
    element.innerHTML = template;
  }
}
