var RUR = {},
  USD = {},
  EUR = {};

var currency = {
  requestc: function() {
    var req = new XMLHttpRequest();
    req.open("GET", 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5', true);
    req.onload = this.getCourse.bind(this);
    req.send(null);
  },

  getCourse: function(e) {
    var c = e.target.responseXML.querySelectorAll('exchangerate');
    RUR.buy = c[0].getAttribute("buy");
    EUR.buy = c[1].getAttribute("buy");
    USD.buy = c[2].getAttribute("buy");

    this.calc();
  },

  calc: function(e) {
    var usdInput = document.getElementById('usd-input'),
      rubInput = document.getElementById('rub-input'),
      eurInput = document.getElementById('eur-input'),
      uahInput = document.getElementById('uah-input');
    //init
    rubInput.value = USD.buy / RUR.buy;
    eurInput.value = USD.buy / EUR.buy;
    uahInput.value = USD.buy;
    //change
    usdInput.oninput = function() {
      rubInput.value = (USD.buy * this.value) / RUR.buy;
      eurInput.value = (USD.buy * this.value) / EUR.buy;
      uahInput.value = (USD.buy * this.value);
    };
    rubInput.oninput = function() {
      usdInput.value = (RUR.buy * this.value) / USD.buy;
      eurInput.value = (RUR.buy * this.value) / EUR.buy;
      uahInput.value = (RUR.buy * this.value);
    };
    eurInput.oninput = function() {
      usdInput.value = (EUR.buy * this.value) / USD.buy;
      rubInput.value = (EUR.buy * this.value) / RUR.buy;
      uahInput.value = (EUR.buy * this.value);
    };
    uahInput.oninput = function() {
      rubInput.value = (this.value / RUR.buy);
      usdInput.value = (this.value / USD.buy);
      eurInput.value = (this.value / EUR.buy);
    };
    //select on click
    usdInput.onclick = function() {
      this.select();
    };
    rubInput.onclick = function() {
      this.select();
    };
    eurInput.onclick = function() {
      this.select();
    };
    uahInput.onclick = function() {
      this.select();
    };
  },

};

document.addEventListener('DOMContentLoaded', function() {
  currency.requestc();
});