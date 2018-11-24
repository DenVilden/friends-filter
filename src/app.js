import './styles/main.scss';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faTimes, faSearch, faPlus);
dom.watch();
