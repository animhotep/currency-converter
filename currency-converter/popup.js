var action = "buy",
    USD = {},
    EUR = {},
    c = {};

var currency = {
    init: function () {
        //currency.localizeHtmlPage();

        //load from local storage
        if (localStorage["action"] == "sale") {
            document.getElementById("sale").checked = true;
            action = "sale";
        }
        //change action way
        document.querySelector('#buy').addEventListener('click', function (e) {
            var format = document.querySelector('input[type="radio"]:checked');
            action = format.value;
            localStorage["action"] = action;
            currency.calc();
        }, false);
        document.querySelector('#sale').addEventListener('click', function (e) {
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

    getCourse: function (e) {
        c = JSON.parse(e.target.response);
        this.calc();
    },

    calc: function (e) {
        var usdInput = document.getElementById('usd-input'),
            eurInput = document.getElementById('eur-input'),
            uahInput = document.getElementById('uah-input');

        //set
        EUR.buy = c[0].buy;
        USD.buy = c[1].buy;

        //init
        var usd = localStorage["usdVal"] || 1;
        usdInput.value = usd;
        eurInput.value = USD.buy / EUR.buy * usd;
        uahInput.value = USD.buy * usd;
        //change
        usdInput.oninput = function () {
            eurInput.value = (USD.buy * this.value) / EUR.buy;
            uahInput.value = (USD.buy * this.value);
            localStorage["usdVal"] = document.getElementById('usd-input').value;
        };
        eurInput.oninput = function () {
            usdInput.value = (EUR.buy * this.value) / USD.buy;
            rubInput.value = (EUR.buy * this.value) / RUR.buy;
            uahInput.value = (EUR.buy * this.value);
            localStorage["usdVal"] = document.getElementById('usd-input').value;
        };
        uahInput.oninput = function () {
            rubInput.value = (this.value / RUR.buy);
            usdInput.value = (this.value / USD.buy);
            eurInput.value = (this.value / EUR.buy);
            localStorage["usdVal"] = document.getElementById('usd-input').value;
        };
        //select on click
        usdInput.onclick = function () {
            this.select();
        };
        eurInput.onclick = function () {
            this.select();
        };
        uahInput.onclick = function () {
            this.select();
        };
    },

    localizeHtmlPage: function () {
        //Localize by replacing __MSG_***__ meta tags
        var objects = document.getElementsByTagName('html');

        for (var j = 0; j < objects.length; j++) {
            var obj = objects[j];
            var valStrH = obj.innerHTML.toString();
            var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
                return v1 ? chrome.i18n.getMessage(v1) : "";
            });

            if (valNewH != valStrH) {
                obj.innerHTML = valNewH;
            }
        }
    }
};


document.addEventListener('DOMContentLoaded', function () {
    currency.init();
});