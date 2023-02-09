import * as bootstrap from 'bootstrap';

export function alert(title, description) {
    var toastElement = buildToast(title, description, "fa-info-circle", "primary");
    var toastWrapper = getOrCreateToastWrapper();
    toastWrapper.append(toastElement);
    this.bootstrapToast = bootstrap.Toast.getOrCreateInstance(toastElement);
    
    this.show = function() {
        this.bootstrapToast.show();
    }
    
    this.hide = function() {
        this.bootstrapToast.hide();
    }
    
    this.dispose = function() {
        this.bootstrapToast.dispose();
    }
}

export function success(title, description) {
    var toastElement = buildToast(title, description, "fa-check-circle", "success");
    var toastWrapper = getOrCreateToastWrapper();
    toastWrapper.append(toastElement);
    this.bootstrapToast = bootstrap.Toast.getOrCreateInstance(toastElement);
    
    this.show = function() {
        this.bootstrapToast.show();
    }
    
    this.hide = function() {
        this.bootstrapToast.hide();
    }
    
    this.dispose = function() {
        this.bootstrapToast.dispose();
    }
}

export function warning(title, description) {
    var toastElement = buildToast(title, description, "fa-warning", "warning");
    var toastWrapper = getOrCreateToastWrapper();
    toastWrapper.append(toastElement);
    this.bootstrapToast = bootstrap.Toast.getOrCreateInstance(toastElement);
    
    this.show = function() {
        this.bootstrapToast.show();
    }
    
    this.hide = function() {
        this.bootstrapToast.hide();
    }
    
    this.dispose = function() {
        this.bootstrapToast.dispose();
    }
}

export function danger(title, description) {
    var toastElement = buildToast(title, description, "fa-warning", "danger");
    var toastWrapper = getOrCreateToastWrapper();
    toastWrapper.append(toastElement);
    this.bootstrapToast = bootstrap.Toast.getOrCreateInstance(toastElement);
    
    this.show = function() {
        this.bootstrapToast.show();
    }
    
    this.hide = function() {
        this.bootstrapToast.hide();
    }
    
    this.dispose = function() {
        this.bootstrapToast.dispose();
    }
}

function getOrCreateToastWrapper() {
    var toastWrapper = document.querySelector('body > [data-toast-wrapper]');
    
    if (!toastWrapper) {
        toastWrapper = document.createElement('div');
        toastWrapper.style.zIndex = 11;
        toastWrapper.style.position = 'fixed';
        toastWrapper.style.bottom = 0;
        toastWrapper.style.right = 0;
        toastWrapper.style.padding = '1rem';
        toastWrapper.setAttribute('data-toast-wrapper', '');
        toastWrapper.setAttribute("class", "toast-container position-fixed bottom-0 end-0 p-3")
        document.body.append(toastWrapper);
    }
    
    return toastWrapper;
}

function buildToastHeader(title, faIcon, color) {
    var toastHeader = document.createElement('div');
    toastHeader.setAttribute('class', 'toast-header bg-'+ color +'-subtle');
    
    var strong = document.createElement('strong');
    strong.setAttribute('class', 'me-auto text-'+ color +'-emphasis');
    strong.textContent = title;

    var icon = document.createElement('i')
    icon.setAttribute('class', 'me-1 text-'+ color +'-emphasis fa ' + faIcon)
    
    var closeButton = document.createElement('button');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('class', 'btn-close');
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('data-label', 'Close');
    
    toastHeader.append(icon);
    toastHeader.append(strong);
    toastHeader.append(closeButton);

    return toastHeader;
}

function buildToastBody(description, color) {
    var toastBody = document.createElement('div');
    toastBody.setAttribute('class', 'toast-body text-'+ color +'-emphasis');
    toastBody.textContent = description;
    
    return toastBody;
}

function buildToast(title, description, icon, color) {
    var toast = document.createElement('div');
    toast.setAttribute('class', 'toast bg-'+ color +'-subtle border-'+ color +'-subtle ');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    var toastHeader = buildToastHeader(title, icon, color);
    var toastBody = buildToastBody(description, color);
    
    toast.append(toastHeader);
    toast.append(toastBody);
    
    return toast;
}