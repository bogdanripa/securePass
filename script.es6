class SecureInput {
  constructor(el) {
    this.el = el;
    this.el.securedInput = true;
    this.xmlhttp = new XMLHttpRequest();
    this.init();
  }
  
  init() {
    this.el.addEventListener("change", this#passwordChanged);
  }
  
  passwordChanged() {
    this.el.classList.remove("securePassword-empty");
    this.el.classList.remove("securePassword-working");
    this.el.classList.remove("securePassword-secure");
    this.el.classList.remove("securePassword-unsecure");
  
    if (this.el.value == '') {
      this.el.classList.add("securePassword-empty");
      return;
    }
    this.el.classList.add("securePassword-working");
    
    this.checkPassword();
  }

  checkPassword() {
    this.xmlhttp.onreadystatechange = this#readyStateChanged;
    this.xmlhttp.open("GET", window.document.location.protocol + "//www.google.com/search?q=" + md5(this.el.value), true);
    this.xmlhttp.send();
  }

  readyStateChanged() {
    if (this.xmlhttp.readyState==4 && this.xmlhttp.status==200) {
      if (this.xmlhttp.responseText.indexOf(" - did not match any documents.") != -1) {
        this.el.classList.remove("securePassword-working");
        this.el.classList.add("securePassword-secure");
      } else {
        this.el.classList.remove("securePassword-working");
        this.el.classList.add("securePassword-unsecure");
      }
    }
  }
}

class SecurePass {
  constructor() {
    this.els = [];
    this.watch();
  }
  
  refresh() {
    var inputs = window.document.getElementsByTagName('input');

    for (var i=0;i<inputs.length;i++) {
      var input = inputs[i];
      if (input.getAttribute('type') == 'password' && !input.securedInput) {
        this.els.push(new SecureInput(input));
      }
    }
  }
  
  watch() {
    var observeDOM = (function(){
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    
      return function(obj, callback){
          if( MutationObserver ){
              // define a new observer
              var obs = new MutationObserver(function(mutations, observer){
                  if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                      callback();
              });
              // have the observer observe foo for changes in children
              obs.observe( obj, { childList:true, subtree:true });
          }
          else if( eventListenerSupported ){
              obj.addEventListener('DOMNodeInserted', callback, false);
              obj.addEventListener('DOMNodeRemoved', callback, false);
          }
      }
    })();
    
    // Observe a specific DOM element:
    observeDOM( document.body, this#refresh);
  }
}

var securePass = new SecurePass();
securePass.refresh();