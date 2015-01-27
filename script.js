"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var SecureInput = (function () {
  function SecureInput(el) {
    this.el = el;
    this.el.securedInput = true;
    this.id = el.id + "_" + this.name;
    this.init();
    this.xmlhttp = new XMLHttpRequest();
  }

  _prototypeProperties(SecureInput, null, {
    getId: {
      value: function getId() {
        return this.id;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    init: {
      value: function init() {
        var _ref;
        this.el.addEventListener("change", (_ref = this, _ref.passwordChanged.bind(_ref)));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    passwordChanged: {
      value: function passwordChanged() {
        this.el.classList.remove("securePassword-empty");
        this.el.classList.remove("securePassword-working");
        this.el.classList.remove("securePassword-secure");
        this.el.classList.remove("securePassword-unsecure");

        if (this.el.value == "") {
          this.el.classList.add("securePassword-empty");
          return;
        }
        this.el.classList.add("securePassword-working");

        this.checkPassword();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    checkPassword: {
      value: function checkPassword() {
        var _ref2;
        this.xmlhttp.onreadystatechange = (_ref2 = this, _ref2.readyStateChanged.bind(_ref2));
        this.xmlhttp.open("GET", window.document.location.protocol + "//www.google.com/search?q=" + md5(this.el.value), true);
        this.xmlhttp.send();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    readyStateChanged: {
      value: function readyStateChanged() {
        if (this.xmlhttp.readyState == 4 && this.xmlhttp.status == 200) {
          if (this.xmlhttp.responseText.indexOf(" - did not match any documents.") != -1) {
            this.el.classList.remove("securePassword-working");
            this.el.classList.add("securePassword-secure");
          } else {
            this.el.classList.remove("securePassword-working");
            this.el.classList.add("securePassword-unsecure");
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return SecureInput;
})();

var SecurePass = (function () {
  function SecurePass() {
    this.els = [];
    this.watch();
  }

  _prototypeProperties(SecurePass, null, {
    refresh: {
      value: function refresh() {
        var inputs = window.document.getElementsByTagName("input");

        for (var i = 0; i < inputs.length; i++) {
          var input = inputs[i];
          if (input.getAttribute("type") == "password" && !input.securedInput) {
            this.els.push(new SecureInput(input));
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    watch: {
      value: function watch() {
        var _ref3;
        var observeDOM = (function () {
          var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

          return function (obj, callback) {
            if (MutationObserver) {
              // define a new observer
              var obs = new MutationObserver(function (mutations, observer) {
                if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) callback();
              });
              // have the observer observe foo for changes in children
              obs.observe(obj, { childList: true, subtree: true });
            } else if (eventListenerSupported) {
              obj.addEventListener("DOMNodeInserted", callback, false);
              obj.addEventListener("DOMNodeRemoved", callback, false);
            }
          };
        })();

        // Observe a specific DOM element:
        observeDOM(document.body, (_ref3 = this, _ref3.refresh.bind(_ref3)));
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return SecurePass;
})();

var securePass = new SecurePass();
securePass.refresh();

