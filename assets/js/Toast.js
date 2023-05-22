const toastContainer = document.querySelector('#toast-container');

const toast = (type, content) => {
  const toastClass = {
    'success' : 'toast__icon--messenger toast__icon--success fas fa-check-circle',
    'error' : 'toast__icon--messenger toast__icon--error fas fa-exclamation-triangle',
    'warning' : 'toast__icon--messenger toast__icon--warring far fa-exclamation-triangle',
    'info' : 'toast__icon--messenger toast__icon--info fas fa-exclamation-circle', 
  }
  const div = document.createElement('div')
  div.innerHTML = `<div class="toast">
  <i
    class="${toastClass[type]}"
  ></i>
  <p class="toast__title">${content}</p>
  <i class="toast__icon--close toast__icon--error far fa-times"></i>
</div>`

  return div;
}

const addToast = (type, content) => {
  const item = toast(type, content)
  toastContainer.appendChild(item)
  setTimeout(() => {
    item.remove();
  }, 5000);
}