/* global debounce */

/*
The debounce function is used to limit how often a function can be executed.
It takes a callback function ('fn') and a delay ('wait') and returns a new function
that will invoke the callback function only after the specified delay has passed since the last call.
 */

// Initialise and observe animate on scroll

// If body element has class 'cc-animate-enabled', then enable animations. 'cc-animate-enabled' marks elements that have been initialized for animation.
if (document.body.classList.contains('cc-animate-enabled')) {
  // Checks if 'IntersectionObserver' and 'MutationObserver' APIs are available in browser.
  if ('IntersectionObserver' in window && 'MutationObserver' in window)

    // This function selects all elements that have the 'data-cc-animate' attribute, but not the 'cc-animate-init' class.
    const initAnimateOnScroll = () => {
      const animatableElems = document.querySelectorAll('[data-cc-animate]:not(.cc-animate-init)');
      if (animatableElems.length > 0) {
        // An 'IntersectionObserver' is created to observe when these elements come into view.
        const intersectionObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            // If an observed element intersects (comes into view).
            if (entry.isIntersecting && !entry.target.classList.contains('cc-animate-in'))
              // The observer adds the 'cc-animate-in' class to start the animation.
              entry.target.classList.add('cc-animate-in');
            // The observer stops observing the element.
              observer.unobserve(entry.target);
            }
          });
        });


        // Initialise and observe each animatable element

        // animatableElems is an array of elements that are considered animatable.
        animatableElems.forEach((elem) => {
          // Checks if the element has a 'data-cc-animate-delay' attribute.
          if (elem.dataset.ccAnimateDelay) {
            // Sets the animation delay to the value of the 'data-cc-animate-delay' attribute.
            elem.style.animationDelay = elem.dataset.ccAnimateDelay;
          }

          // Checks if the element has a 'data-cc-animate-duration' attribute.
          if (elem.dataset.ccAnimateDuration) {
            // Sets the animation duration to the value of the 'data-cc-animate-duration' attribute.
            elem.style.animationDuration = elem.dataset.ccAnimateDuration;
          }


          // Initializing the animation.

          // Checks if the element has a 'data-cc-animate-timing-function' attribute.
          if (elem.dataset.ccAnimate) {
            // Sets the value of the 'animation-timing-function' CSS property to the value of the 'data-cc-animate-timing-function' attribute.
            elem.classList.add(elem.dataset.ccAnimate);
          }

          // Adds the 'cc-animate-init' class to the element.
          elem.classList.add('cc-animate-init');

          // Watch for element. 'IntersectionObserver' is used to detect when the element comes into view.
          intersectionObserver.observe(elem);
        });
      }
    };

    const aosMinWidth = getComputedStyle(document.documentElement)
      .getPropertyValue('--aos-min-width') || '0';
    const mq = window.matchMedia(`(min-width: ${aosMinWidth}px)`);
    if (mq.matches) {
      initAnimateOnScroll();

      // Check for more animatable elements when the DOM mutates
      document.addEventListener('DOMContentLoaded', () => {
        const observer = new MutationObserver(debounce(initAnimateOnScroll, 250));
        observer.observe(document.body, {
          subtree: true,
          childList: true
        });
      });
    } else {
      document.body.classList.remove('cc-animate-enabled');

      try {
        mq.addEventListener('change', (event) => {
          if (event.matches) {
            document.body.classList.add('cc-animate-enabled');
            setTimeout(initAnimateOnScroll, 100);
          }
        });
      } catch (e) {
        // Legacy browsers (Safari < 14), rely on the animations being shown by the line above the
        // try
      }
    }
  } else {
    // Reveal all the animations
    document.body.classList.remove('cc-animate-enabled');
  }
}
