import Api from './Api';

export default class Loader {
  static async loadFriends() {
    await Api.init();
    await Api.auth();
    return Api.callAPI('friends.get', { fields: 'photo_50' });
  }

  static getFriends() {
    const friendsJSON = localStorage.getItem('friends');

    try {
      return friendsJSON ? JSON.parse(friendsJSON) : [];
    } catch (error) {
      return [];
    }
  }

  static setFriends(friends) {
    localStorage.setItem('friends', JSON.stringify(friends));
  }
}
