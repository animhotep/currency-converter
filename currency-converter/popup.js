var action = "buy",
    RUR = {},
    USD = {},
    EUR = {},
    c = {};

var currency = {
    init: function() {
        currency.localizeHtmlPage();

        //load from local storage
        if (localStorage["action"] == "sale") {
            document.getElementById("sale").checked = true;
        };
        //change action way
        document.querySelector('#buy').addEventListener('click', function(e) {
            var format = document.querySelector('input[type="radio"]:checked');
            action = format.value;
            localStorage["action"] = action;
            currency.calc();
        }, false);
        document.querySelector('#sale').addEventListener('click', function(e) {
            var format = document.querySelector('input[type="radio"]:checked');
            action = format.value;
            localStorage["action"] = action;
            currency.calc();
        }, false);

        var req = new XMLHttpRequest();
        req.open("GET", 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5', true);
        req.onload = this.getCourse.bind(this);
        req.send(null);
    },

    getCourse: function(e) {
        c = e.target.responseXML.querySelectorAll('exchangerate');
        this.calc();
    },

    calc: function(e) {
        var usdInput = document.getElementById('usd-input'),
            rubInput = document.getElementById('rub-input'),
            eurInput = document.getElementById('eur-input'),
            uahInput = document.getElementById('uah-input');

        //set
        RUR.buy = c[2].getAttribute(action);
        EUR.buy = c[1].getAttribute(action);
        USD.buy = c[0].getAttribute(action);
        //init
        var usd = localStorage["usdVal"] || 1;
        usdInput.value = usd;
        rubInput.value = USD.buy / RUR.buy * usd;
        eurInput.value = USD.buy / EUR.buy * usd;
        uahInput.value = USD.buy * usd;
        //change
        usdInput.oninput = function() {
            rubInput.value = (USD.buy * this.value) / RUR.buy;
            eurInput.value = (USD.buy * this.value) / EUR.buy;
            uahInput.value = (USD.buy * this.value);
            localStorage["usdVal"] = document.getElementById('usd-input').value;
        };
        rubInput.oninput = function() {
            usdInput.value = (RUR.buy * this.value) / USD.buy;
            eurInput.value = (RUR.buy * this.value) / EUR.buy;
            uahInput.value = (RUR.buy * this.value);
            localStorage["usdVal"] = document.getElementById('usd-input').value;
        };
        eurInput.oninput = function() {
            usdInput.value = (EUR.buy * this.value) / USD.buy;
            rubInput.value = (EUR.buy * this.value) / RUR.buy;
            uahInput.value = (EUR.buy * this.value);
            localStorage["usdVal"] = document.getElementById('usd-input').value;
        };
        uahInput.oninput = function() {
            rubInput.value = (this.value / RUR.buy);
            usdInput.value = (this.value / USD.buy);
            eurInput.value = (this.value / EUR.buy);
            localStorage["usdVal"] = document.getElementById('usd-input').value;
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

    localizeHtmlPage: function (){
        //Localize by replacing __MSG_***__ meta tags
        var objects = document.getElementsByTagName('html');
        
        for (var j = 0; j < objects.length; j++){
            var obj = objects[j];
            var valStrH = obj.innerHTML.toString();
            var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1){
                return v1 ? chrome.i18n.getMessage(v1) : "";
            });

            if(valNewH != valStrH){
                obj.innerHTML = valNewH;
            }
        }
    }
};


document.addEventListener('DOMContentLoaded', function() {
    currency.init();

    document.getElementById('donate').addEventListener('click', function() {
        chrome.tabs.create({
            url: 'https://www.liqpay.com/api/3/checkout?data=eyJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXlkb25hdGUiLCJwdWJsaWNfa2V5IjoiaTg3NDE1OTE4MzkxIiwiYW1vdW50IjoiNDUiLCJjdXJyZW5jeSI6IlVBSCIsImRlc2NyaXB0aW9uIjoi0JrQvtC90LLQtdGA0YLQtdGAINCy0LDQu9GO0YIiLCJ0eXBlIjoiZG9uYXRlIiwibGFuZ3VhZ2UiOiJydSJ9&signature=%2F6MCepPdJBNYHq6cuxyc9ZZWajM%3D'
        });
    });
});