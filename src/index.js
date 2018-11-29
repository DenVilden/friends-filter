import './styles/main.scss';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faTimes, faSearch, faPlus, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import Loader from './modules/Loader';
import Model from './modules/Model';
import Controller from './modules/Controller';

(() => {
  Loader.loadFriends().then((friends) => {
    const savedFriends = Loader.getFriends();
    const model = new Model(friends.items, savedFriends);
    new Controller(model);
  });
})();

library.add(faTimes, faSearch, faPlus, faSpinner);
dom.watch();
