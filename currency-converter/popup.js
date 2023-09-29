var action = "buy",
    USD = {},
    EUR = {},
    c = {};

var currency = {
    init: function () {
        currency.localizeHtmlPage();
        
        this.getCourse();
        
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
    },

    getCourse: async function (e) {
        let r = await fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5');

        c = await r.json();
        this.calc();
    },

    calc: function (e) {
        var usdInput = document.getElementById('usd-input'),
            eurInput = document.getElementById('eur-input'),
            uahInput = document.getElementById('uah-input');

        //set
        EUR = c[0][action];
        USD = c[1][action];

        //init
        var usd = localStorage["usdVal"] || 1;
        usdInput.value = usd;
        eurInput.value = USD / EUR * usd;
        uahInput.value = USD * usd;
        //change
        usdInput.oninput = function () {
            eurInput.value = (USD * this.value) / EUR;
            uahInput.value = (USD * this.value);
            localStorage["usdVal"] = document.getElementById('usd-input').value;
        };
        eurInput.oninput = function () {
            usdInput.value = (EUR * this.value) / USD;
            uahInput.value = (EUR * this.value);
            localStorage["usdVal"] = document.getElementById('usd-input').value;
        };
        uahInput.oninput = function () {
            usdInput.value = (this.value / USD);
            eurInput.value = (this.value / EUR);
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