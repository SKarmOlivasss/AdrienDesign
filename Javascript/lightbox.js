import {enableBodyScroll, disableBodyScroll} from './body-scroll-body.js';




/**
     * @property {HTMLElement} element
     * @property {string[]} images chemins images de la lightbox
     * @property {string} url Image actuellement affiché
     */
    class Lightbox {

        
        static init () {
            const links = Array.from(document.querySelectorAll('a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".gif"]'))
            const gallery = links.map(link => link.getAttribute('href'));
            links.forEach(link => link.addEventListener('click', e => {
                e.preventDefault();
                new Lightbox(e.currentTarget.getAttribute('href'), gallery);
                
            }))
        }

        /**
         * @param {string} url  URL de l'image
         * @param {string[]} gallery chemins images de la lightbox
         */
        constructor(url, images) {
            this.element = this.buildDOM(url);
            this.images = images; 
            this.loadImage(url);
            this.onKeyUp = this.onKeyUp.bind(this)
            document.body.appendChild(this.element);
            disableBodyScroll(this.element);
            document.addEventListener('keyup', this.onKeyUp);

        }

        loadImage(url){
            this.url = null
            const image = new Image();
            const container = this.element.querySelector('.lightbox__container');
            const loader = document.createElement('div');
            loader.classList.add('lightbox__loader');
            container.innerHTML = '';
            container.appendChild(loader)
            image.onload = () => {
                container.removeChild(loader);
                container.appendChild(image);
                this.url = url 
            }
            image.src = url
        }


        /**
         * @param {KeyboardEvent} e
         */
        onKeyUp(e){
            if (e.key === 'Escape'){
                this.close(e);
            } else if (e.key === 'ArrowLeft'){
                this.prev(e);
            } else if (e.key === 'ArrowRight'){
                this.next(e);
            }
        }
        
/**
 * Fermer lightbox
 * @param {MouseEvent/KeyboardEvent} e 
 */
        close(e){
            e.preventDefault();
                this.element.classList.add('fadeOut');
                enableBodyScroll(this.element);
            window.setTimeout(() => {
            this.element.parentElement.removeChild(this.element);
            }, 500);
            document.removeEventListener('keyup', this.onKeyUp);

        }
/**
 * @param {MouseEvent/KeyboardEvent} e 
 */
        next (e) {
            e.preventDefault();
            let i = this.images.findIndex( image => image === this.url);
            if (i === this.images.length -1){
                i = -1;
            }
            this.loadImage(this.images[i+1]);
        }

        /**
 * @param {MouseEvent/KeyboardEvent} e 
 */
         prev (e) {
            e.preventDefault();
            let i = this.images.findIndex( image => image === this.url);
            if (i === 0){
                i = this.images.length;
            }
            this.loadImage(this.images[i - 1]);
        }


        /**
         * @param {string} url  URL de l'image 
         * @returns {HTMLElement}
         */


        buildDOM() {
            const lightboxHtml = `<button class="lightbox__close"></button>
            <button class="lightbox__next"></button>
            <button class="lightbox__prev"></button>
            <div class="lightbox__container"></div></div>` ; 
            const dom = document.createElement('div');
            dom.classList.add('lightbox')
            dom.innerHTML = lightboxHtml;
            dom.querySelector('.lightbox__close').addEventListener('click', this.close.bind(this));
            dom.querySelector('.lightbox__next').addEventListener('click', this.next.bind(this));
            dom.querySelector('.lightbox__prev').addEventListener('click', this.prev.bind(this));
        return dom;
            

        }

    }

    Lightbox.init();

    /**
     * <div class="lightbox">
            <button class="lightbox__close"></button>
            <button class="lightbox__next"></button>
            <button class="lightbox__prev"></button>
            <div class="lightbox__container">
                <img src="../images/grisaille/1lightbox.png" alt="">
            </div>
        </div>
    */
