export class Form {
    /**
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.el = el;
        this.el.Form = this;

        this.isValid = false;

        this.nodes = {
            items: this.el.querySelectorAll('.js-form-item'),
            iframe: this.el.parentNode.querySelector('.js-form-iframe'),
            confirm: this.el.parentNode.querySelector('.js-form-confirm'),
            check: this.el.parentNode.querySelector('#check'),
            btn: this.el.parentNode.querySelector('[type="submit"]')
        };

        // this.init();
        this.setListeners();
    }

    // init() {
    //
    // }

    setListeners() {
        this.nodes.btn.addEventListener('click', e => {
            this.handleCheckValid();
        });

        this.el.addEventListener('submit', e => {
            e.preventDefault();

            if (this.isValid) {
                this.el.submit();
            }
        });

        this.nodes.iframe.addEventListener('load', e => {
            if (this.isValid) {
                this.el.classList.add('d-none');
                this.nodes.confirm.classList.remove('d-none');
            }
        });

        this.nodes.items.forEach(item => {
            item.addEventListener('change', () => {
                this.handleErrorToggle(item);
            });
        })
    }

    handleCheckValid() {
        this.nodes.items.forEach(item => {
            this.handleErrorToggle(item);
        })

        this.nodes.check.checked

        if (Array.prototype.slice.call(this.nodes.items).filter(item => item.classList.contains('error')).length) {
            this.isValid = false;
            this.el.classList.add('form-invalid');
        } else {
            if (!this.nodes.check.checked) {

            this.el.classList.remove('form-invalid');
                this.nodes.check.removeAttribute('required');
                this.isValid = true;
            }
        }
    }

    handleErrorToggle(item) {
        if (item.value.trim()) {
            item.classList.remove('error');
        } else {
            item.classList.add('error');
        }
    }
}


