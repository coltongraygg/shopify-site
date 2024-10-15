/*
Creates a reusable web component for displaying product-added notifications,
which manage their display, interactions, and dismissal in a structured way.
*/



// Check if custom element is already defined. If it isn't, we proceed to define it.
 (!customElements.get('added-notification')) {
   // Define the custom element class, creating a new HTML element type.
  const AddedNotification = class extends HTMLElement {
    // connectedCallback is a lifecycle method that runs when the element is added to the DOM.
    connectedCallback() {
      // Dismisses other notifications
      this.dismissOthers();
      // Set the product title using a data attribute
      this.setProductTitle(this.dataset.productTitle)
      // Display the notification
      this.display();
    }



    // disconnectedCallback is a lifecycle method that runs when the element is removed from the DOM.
    disconnectedCallback() {
      // Clears a timeout to prevent memory leaks or unexpected behaviors
      clearTimeout(this.delayedDismissTimeout);
    }


    // This method dismisses all other 'added-notification' elements in the DOM, except for the current one.
    dismissOthers() {
      document.querySelectorAll('.added-notification').forEach((notification) => {
        if (notification !== this) {
          notification.dismiss();
        }
      });
    }

    // This method sets the product title in the notification by updating the text content of an element with the class .added-notification__message-title.
    setProductTitle(productTitle) {
      this.querySelector('.added-notification__message-title').innerText = productTitle;
    }

    //
    display() {
      // Reveals the notification by removing the 'added-notification--hidden' class.
      setTimeout(() => this.classList.remove('added-notification--hidden'), 10);

      // Sets a timeout to automatically dismiss the notification after 6 seconds.
      this.delayedDismissTimeout = setTimeout(this.dismiss.bind(this), 6000);

      // Adds a click event listener to elements with the '.added-notification_close' class to dismiss the notification when clicked.
      this.querySelector('.added-notification__close').addEventListener('click', this.dismiss.bind(this));
      // If the 'theme.settings.carType' is 'drawer'
      if (theme.settings.cartType === 'drawer') {
        // Add click event listeners to links within the notification that direct to '/cart' to open a cart drawer and dismiss the notification.
        const cartLinks = this.querySelectorAll('.added-notification__message-text a[href$="/cart"]');
        cartLinks.forEach((el) => {
          el.addEventListener('click', (evt) => {
            evt.preventDefault();
            document.querySelector('.js-cart-drawer').open();
            this.dismiss();
          });
        });
      }
    }


    // This method handles the dismissal of the notifications.
    dismiss(evt) {
      // Prevents the default action if the method is triggered by a click event.
      if (evt) { evt.preventDefault(); }
      // Adds the 'added-notification-dismissed' class to start the dismissal animation.
      this.classList.add('added-notification--dismissed');
      // Sets a timeout to remove the element from the DOM after 2 seconds.
      setTimeout(this.remove.bind(this), 2000);
    }
  };

  // Define the 'added-notification' custom element with tag name 'added-notification' and the 'AddedNotification' class.
  window.customElements.define('added-notification', AddedNotification);
}
