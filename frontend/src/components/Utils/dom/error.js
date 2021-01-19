/* eslint-disable no-param-reassign */
export default function errorHandler(message, domElement) {
  domElement.style.display = 'block';
  domElement.style.position = 'absolute';
  domElement.style.top = '50%';
  domElement.style.left = '50%';
  domElement.style.transform = 'translate(-50%, -50%)';
  domElement.style.padding = '10px';
  domElement.style.backgroundColor = 'red';

  domElement.innerHTML = message;

  // append dom elemnt to the template
  document.body.appendChild(domElement);
}
