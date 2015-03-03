// Preloading & fading in David background
(function(){
    var url = 'homepage/images/david-by-michelangelo.jpg';
    var image = new Image();
    image.src = url;
    image.onload = function() {
        document.querySelector('.david-by-michelangelo').className += ' loaded ';
    }
})();



// Form
(function(){
    var form = document.getElementById('id_form');
    var action = form.getAttribute('action');
    var method = form.getAttribute('method');

    var emailInput = document.getElementById('id_email');
    var emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var email = emailInput.value;
        if (!email || !email.match(emailRegex)) {
            return alert('Please enter an email address.');
        }

        new AJAX({
            error: onFormSubmitError,
            form: form,
            method: method,
            success: onFormSubmitSuccess,
            url: action,
        });
    }, false);

    function onFormSubmitSuccess(e) {
        location.href = 'https://www.fightforthefuture.org/confirm/';
    }

    function onFormSubmitError(e) {
        alert('Sorry, we are experiencing technical issues. Please try again in five minutes.');
    }
})();



// Mobile navigation
(function(){
    var header = document.querySelector('header');
    var cheeseburger = document.querySelector('.cheeseburger');
    var lines = document.querySelector('.cheeseburger .lines');
    var mobileNavigationIsExpanded = false;

    cheeseburger.addEventListener('click', function(e) {
        if (mobileNavigationIsExpanded) {
            header.className = header.className.replace(' mobile-navigation-is-expanded ', '');
        } else {
            header.className += ' mobile-navigation-is-expanded ';
        }

        mobileNavigationIsExpanded = !mobileNavigationIsExpanded;
    }, false);
})();



// Additional Sections
(function(){
    var container = document.querySelector('.additional-sections');

    new AdditionalSection('Projects', function(el) {
        // Make entire projects clickable
        el.addEventListener('click', function(e) {
            e.preventDefault();

            var target = e.target;

            if (target.tagName === 'A') {
                return;
            }

            while (target.parentNode) {
                if (target.className === 'project') {
                    var link = target.querySelector('a');
                    window.open(link.href, '_blank');
                    break;
                }

                target = target.parentNode;
            }
        }, true);

        new AdditionalSection('Press');
        new Footer();
    });
})();



/*
 * Modules
 */



function AdditionalSection(name, callback) {
    var container = document.querySelector('.additional-sections');
    var element = document.createElement('div');
    container.appendChild(element);

    new AJAX({
        url: 'homepage/sections/' + name + '.html',
        success: function(e) {
            element.className = ' fadeIn ';
            element.innerHTML = e.target.responseText;

            if (callback) {
                callback(element);
            }
        }
    });

    return element;
}



function Footer() {
    var container = document.querySelector('.footer');
    var element = document.createElement('div');
    container.appendChild(element);

    new AJAX({
        url: 'homepage/sections/Footer.html',
        success: function(e) {
            element.className = ' fadeIn ';
            element.innerHTML = e.target.responseText;
        }
    });

    return element;
}



function AJAX(params) {
    this.async = params.async || true;
    this.data = params.data;
    this.error = params.error;
    this.form = params.form;
    this.method = params.method || 'GET';
    this.success = params.success;
    this.url = params.url;

    this.request = new XMLHttpRequest();
    this.request.open(this.method, this.url, this.async);

    if (this.success) {
        this.request.onload = this.success;
    }

    if (this.error) {
        this.request.onerror = this.error;
    }

    if (this.data) {
        var params = '';
        for (var key in this.data) {
            if (params.length !== 0) {
                params += '&';
            }

            params += key + '=' + this.data[key];
        }

        this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this.request.send(params);
    } else if (this.form) {
        var params = this.serializeForm(this.form);

        this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this.request.send(params);
    } else {
        this.request.send();
    }

}

AJAX.prototype.serializeForm = function(form) {
    if (!form || form.nodeName !== "FORM") {
        return;
    }

    var i, j, q = [];
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === "") {
            continue;
        }
        switch (form.elements[i].nodeName) {
        case 'INPUT':
            switch (form.elements[i].type) {
            case 'email':
            case 'text':
            case 'hidden':
            case 'password':
            case 'button':
            case 'reset':
            case 'submit':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'checkbox':
            case 'radio':
                if (form.elements[i].checked) {
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                }
                break;
            case 'file':
                break;
            }
            break;
        case 'TEXTAREA':
            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
            break;
        case 'SELECT':
            switch (form.elements[i].type) {
            case 'select-one':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'select-multiple':
                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                    if (form.elements[i].options[j].selected) {
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                    }
                }
                break;
            }
            break;
        case 'BUTTON':
            switch (form.elements[i].type) {
            case 'reset':
            case 'submit':
            case 'button':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            }
            break;
        }
    }

    return q.join("&");
};
