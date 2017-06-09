import objectAssign from 'object-assign';
import Promise from 'promise-polyfill';

if (typeof Promise === 'undefined') {
  window.Promise = Promise;
}

Object.assign = objectAssign;
