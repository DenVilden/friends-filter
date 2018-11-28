import View from './View';
import Loader from './Loader';
import { getFilters } from './filters';

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
    // stores current filters array
    this.friendsAllFiltered = getFilters(this.model.friendsAll, this.filters.textAll);
    this.friendsAllDOM.innerHTML = new View(this.friendsAllFiltered).template;
  }

  renderFav() {
    this.friendsFavFiltered = getFilters(this.model.friendsFav, this.filters.textFav);
    this.friendsFavDOM.innerHTML = new View(this.friendsFavFiltered).template;
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
    });

    this.friendsFavDOM.addEventListener('dragover', (evt) => {
      evt.preventDefault();
    });

    this.friendsFavDOM.addEventListener('drop', () => {
      this.model.addFriend(id);
      this.renderAll();
      this.renderFav();
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
