import format from './format';
import defaultenglish from './lang/en';
import tamil from './lang/ta';
//import { i18n } from 'element-react';

let _lang = localStorage.getItem("localLanguage") ? getlang(localStorage.getItem("localLanguage")) : defaultenglish;

function use(lang) {
  _lang = lang;
}

function getlang(lan) {
  if (lan == 'en') {
   // i18n.use(defaultenglish);
    return defaultenglish;
  }
  else if (lan == 'ta') {
    //i18n.use(tamil);
    return tamil;
  }
}

function t(path, options) {

  const array = path.split('.');
  let current = _lang;
  //i18n.use(current);
  for (var i = 0, j = array.length; i < j; i++) {
    var property = array[i];
    var value = current[property];
    if (i === j - 1) return format(value, options);
    if (!value) return '';
    current = value;
  }
  return '';
}

export default {
  use,
  t
}
