import ee from 'event-emitter';
import allOff from 'event-emitter/all-off';
import Mousetrap from 'mousetrap';

import forEach from 'lodash/forEach';

import getYTVideoId from '_util/getYTVideoId';

const _pool = {};

function isFocusOnVideo() {
  return document.activeElement.id === 'movie_player';
}

export const getEmitter = id => {
  if (_pool[id]) {
    return _pool[id];
  }

  // clear all
  forEach(_pool, (emtr, k) => {
    delete _pool[k];
    allOff(emtr);
  });

  _pool[id] = ee({ id });
  return _pool[id];
};

export const bind = () => {
  const emtr = () => getEmitter(getYTVideoId());
  const config = {
    a: () => {
      emtr().emit('add tag');
      return false;
    },
    '/': () => {
      emtr().emit('focus description');
      return false;
    },
    d: () => {
      emtr().emit('focus description');
      return false;
    },
    left: () => {
      if (isFocusOnVideo()) {
        return true;
      }
      emtr().emit('backward 5');
      emtr().emit('tag sub 5');
      return false;
    },
    right: () => {
      if (isFocusOnVideo()) {
        return true;
      }
      emtr().emit('forward 5');
      emtr().emit('tag add 5');
      return false;
    },
    'alt+left': () => {
      emtr().emit('backward 1');
      emtr().emit('tag sub 1');
      return false;
    },
    'alt+right': () => {
      emtr().emit('forward 1');
      emtr().emit('tag add 1');
      return false;
    },
    esc: () => {
      emtr().emit('clear active');
      return false;
    },
    space: () => true,
    del: () => {
      emtr().emit('tag remove');
      return false;
    },
    backspace: () => {
      emtr().emit('tag remove');
      return false;
    },
  };

  forEach(config, (fn, key) => {
    Mousetrap.bind(key, fn);
  });
};
