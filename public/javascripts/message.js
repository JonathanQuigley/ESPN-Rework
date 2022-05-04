const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

if (message) {
  let element = (
    <span>{message}</span>
  );
  ReactDOM.render(
    element,
    document.getElementById('message')
  );
}