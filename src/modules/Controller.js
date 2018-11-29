import View from './View';
import Loader from './Loader';
import { getFilters } from './utils/filters';

export default class Controller {
  constructor(model) {
    this.model = model;

    // stores inputs value
    this.filters = {
      textAll: '',
      textFav: ''
    };

    this.friendsAllDOM = document.querySelector('#all');
    this.friendsFavDOM = document.querySelector('#fav');

    this.renderAll();
    this.renderFav();

    this.friendsAllDOM.addEventListener('click', this.addFriend.bind(this));
    this.friendsFavDOM.addEventListener('click', this.removeFriend.bind(this));
    this.friendsAllDOM.addEventListener(
      'dragstart',
      this.addFriendDrag.bind(this)
    );
    document
      .querySelector('#input-all')
      .addEventListener('input', this.filterAll.bind(this));
    document
      .querySelector('#input-fav')
      .addEventListener('input', this.filterFav.bind(this));
    document
      .querySelector('#save-button')
      .addEventListener('click', this.saveFriends.bind(this));
  }

  renderAll() {
    // render based on current filter value
    const filtered = getFilters(this.model.friendsAll, this.filters.textAll);
    View.render(this.friendsAllDOM, filtered);
  }

  renderFav() {
    const filtered = getFilters(this.model.friendsFav, this.filters.textFav);
    View.render(this.friendsFavDOM, filtered);
  }

  addFriend(evt) {
    if (evt.target.tagName === 'BUTTON') {
      // get vk id of clicked element
      const id = evt.target.closest('li').dataset.id;
      this.model.addFriend(id);
      this.renderAll();
      this.renderFav();
    }
  }

  addFriendDrag(evt) {
    const id = evt.target.closest('li').dataset.id;

    const dragover = dragEvt => {
      dragEvt.preventDefault();
    };

    const drop = () => {
      this.model.addFriend(id);
      this.renderAll();
      this.renderFav();

      // removes listeners on drop
      this.friendsFavDOM.removeEventListener('dragover', dragover);
      this.friendsFavDOM.removeEventListener('drop', drop);
    };

    // adds listeners on drag start
    this.friendsFavDOM.addEventListener('dragover', dragover);
    this.friendsFavDOM.addEventListener('drop', drop);
  }

  removeFriend(evt) {
    if (evt.target.tagName === 'BUTTON') {
      const id = evt.target.closest('li').dataset.id;
      this.model.removeFriend(id);
      this.renderAll();
      this.renderFav();
    }
  }

  filterAll(evt) {
    // set filter to current input value
    this.filters.textAll = evt.target.value.trim();
    this.renderAll();
  }

  filterFav(evt) {
    this.filters.textFav = evt.target.value.trim();
    this.renderFav();
  }

  saveFriends() {
    // save to local storage
    Loader.setFriends(this.model.friendsFav);
    alert('Сохранено');
  }
}
