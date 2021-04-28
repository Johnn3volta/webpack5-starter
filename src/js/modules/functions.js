/**
 * @param callback
 * @return void
 */
const ready = (callback) => {
  (document.readyState !== 'loading')
    ?
    callback()
    :
    document.addEventListener('DOMContentLoaded', callback);
};

/**
 * Добавляет класс active
 * @param items
 * @return void
 */
const manipulateActiveClass = items => {
  items.forEach(item => {
    item.addEventListener('focus', e => {
      e.currentTarget.classList.add('active');
    });

    item.addEventListener('blur', e => {
      const target = e.currentTarget;
      const value = target.value.trim();
      if (!value) {
        target.classList.remove('active');
      }
    });
  });
};

export { ready, manipulateActiveClass };
