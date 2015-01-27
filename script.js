// (c) Bogdan Ripa 2015

var inputs = window.document.getElementsByTagName('input');

for (var i=0;i<inputs.length;i++) {
	var input = inputs[i];
	if (input.getAttribute('type') == 'password') {
		passwordChanged(input);

		input.addEventListener("change", passwordChangedEvent);

	}
}

function passwordChangedEvent(event) {
	passwordChanged(event.target);
}

function passwordChanged(el) {
	el.classList.remove("securePassword-empty");
	el.classList.remove("securePassword-working");
	el.classList.remove("securePassword-secure");
	el.classList.remove("securePassword-unsecure");

	if (el.value == '') {
		el.classList.add("securePassword-empty");
		return;
	}
	el.classList.add("securePassword-working");
	
	checkPassword(el);
}

function checkPassword(el) {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		readyStateChanged(el, xmlhttp);
	}
	xmlhttp.open("GET", window.document.location.protocol + "//www.google.com/search?q=" + md5(el.value), true);
	xmlhttp.send();
}

function readyStateChanged(el, xmlhttp) {
	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		if (xmlhttp.responseText.indexOf(" - did not match any documents.") != -1) {
			el.classList.remove("securePassword-working");
			el.classList.add("securePassword-secure");
		} else {
			el.classList.remove("securePassword-working");
			el.classList.add("securePassword-unsecure");
		}
	}
}