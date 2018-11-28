const CORS = 'https://cors-anywhere.herokuapp.com/';
const URL = 'https://api.vk.com/method/';
const TOKEN = '5325414e5325414e5325414e6853426050553255325414e08dca090d48849a157e73cc1';

const ID = 5700352;
const MAX_FRIENDS = 20;

export default class Loader {
  static async loadData() {
    const response = await fetch(
      `${CORS}${URL}friends.get?user_id=${ID}&count=${MAX_FRIENDS}&fields=photo_50&access_token=${TOKEN}&v=5.88`,
    );

    if (response.ok) {
      const data = await response.json();

      return data.response.items;
    }

    throw new Error(`${response.status}: ${response.statusText}`);
  }

  static getSavedFriends() {
    const friendsJSON = localStorage.getItem('friends');

    try {
      return friendsJSON ? JSON.parse(friendsJSON) : [];
    } catch (error) {
      return [];
    }
  }

  static saveFriends(friends) {
    localStorage.setItem('friends', JSON.stringify(friends));
  }
}
