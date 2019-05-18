const forms = document.querySelector('#formTweets');
forms.addEventListener('submit', function (event) {
  const checks = document.getElementsByClassName('tweet-check');
  let checks2 = Array.prototype.slice.call(checks, 0);
  const thisForm = this;
  checks2.forEach(element => {
    if (element.checked) {
      // text.push);
      let text = element.parentElement.getElementsByClassName('textt')[0].innerText;
      let hidden = document.createElement("input");
      hidden.value = text;
      hidden.name = "texto[]";
      hidden.type = "hidden";
      thisForm.appendChild(hidden);
    }
  });
  return true;
})