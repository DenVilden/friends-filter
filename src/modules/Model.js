import { getIndex } from './utils';

export default class Model {
  constructor(friends, savedFriends) {
    this.friendsAll = friends;
    this.friendsFav = savedFriends;

    this.filterFriends();
  }

  addFriend(id) {
    const index = getIndex(this.friendsAll, id);
    const friend = this.friendsAll[index];
    friend.favorites = true;

    this.friendsAll.splice(index, 1);
    this.friendsFav.push(friend);
  }

  removeFriend(id) {
    const index = getIndex(this.friendsFav, id);
    const friend = this.friendsFav[index];
    delete friend.favorites;

    this.friendsFav.splice(index, 1);
    this.friendsAll.push(friend);
    this.friendsAll.sort((a, b) => a.id - b.id);
  }

  filterFriends() {
    // removes all non unique friends from array before rendering
    this.friendsAll = this.friendsAll.filter(
      friend => !this.friendsFav.some(friendFav => friendFav.id === friend.id),
    );
  }
}
