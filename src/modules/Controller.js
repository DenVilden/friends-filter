import View from './View';
import Loader from './Loader';
import { getFilters, render } from './utils';

export default class Controller {
  constructor(model) {
    this.model = model;

    this.filters = {
      textAll: '',
      textFav: '',
    };

    this.friendsAllDOM = document.querySelector('#friends-all');
    this.friendsFavDOM = document.querySelector('#friends-fav');

    this.renderAll();
    this.renderFav();
    this.addFriend();
    this.dragFriend();
    this.removeFriend();
    this.filterAll();
    this.filterFav();
    this.saveFriends();
  }

  renderAll() {
    // render based on current filter value
    const filtered = getFilters(this.model.friendsAll, this.filters.textAll);
    const template = new View(filtered).template;
    render(this.friendsAllDOM, template);
  }

  renderFav() {
    const filtered = getFilters(this.model.friendsFav, this.filters.textFav);
    const template = new View(filtered).template;
    render(this.friendsFavDOM, template);
  }

  addFriend() {
    this.friendsAllDOM.addEventListener('click', (evt) => {
      if (evt.target.tagName === 'BUTTON') {
        const id = evt.target.parentElement.dataset.id;

        this.model.addFriend(id);
        this.renderAll();
        this.renderFav();
      }
    });
  }

  dragFriend() {
    let id;

    this.friendsAllDOM.addEventListener('dragstart', (evt) => {
      id = evt.target.dataset.id;

      const dragover = (dragEvt) => {
        dragEvt.preventDefault();
      };

      const drop = () => {
        this.model.addFriend(id);
        this.renderAll();
        this.renderFav();

        this.friendsFavDOM.removeEventListener('dragover', dragover);
        this.friendsFavDOM.removeEventListener('drop', drop);
      };

      this.friendsFavDOM.addEventListener('dragover', dragover);
      this.friendsFavDOM.addEventListener('drop', drop);
    });
  }

  removeFriend() {
    this.friendsFavDOM.addEventListener('click', (evt) => {
      if (evt.target.tagName === 'BUTTON') {
        // get vk id of clicked element
        const id = evt.target.parentElement.dataset.id;

        this.model.removeFriend(id);
        this.renderAll();
        this.renderFav();
      }
    });
  }

  filterAll() {
    const input = document.querySelector('.filter-input-all');

    input.addEventListener('input', (evt) => {
      // set filter to current input value
      this.filters.textAll = evt.target.value.trim();

      this.renderAll();
    });
  }

  filterFav() {
    const input = document.querySelector('.filter-input-fav');

    input.addEventListener('input', (evt) => {
      this.filters.textFav = evt.target.value.trim();

      this.renderFav();
    });
  }

  saveFriends() {
    const button = document.querySelector('.footer-button');

    button.addEventListener('click', () => {
      try {
        // save to local storage
        Loader.saveFriends(this.friendsFavFiltered);
        alert('Сохранено');
      } catch (error) {
        alert(`${error}: Что-то пошло не так`);
      }
    });
  }
}
