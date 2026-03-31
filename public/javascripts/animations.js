/**
 * Shopping Cart - UI Animations & Interactions
 * ============================================
 * Adds ripple effects, smooth transitions, and interactive feedback
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initRippleEffect();
    initNavbarScroll();
    initSmoothScrolling();
    initFormAnimations();
    initButtonHoverEffects();
});

/**
 * 1. RIPPLE CLICK EFFECT
 * Adds a Material Design-style ripple click effect to buttons
 */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove ripple if already exists (from rapid clicks)
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Get button position and size
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            // Calculate ripple position (center on click)
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            // Set ripple size and position
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            // Add ripple to button
            this.appendChild(ripple);

            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);

            // Add bounce effect for successful actions (like add to cart)
            if (this.classList.contains('btn-success') || this.textContent.includes('Add') || this.textContent.includes('Checkout')) {
                this.classList.add('bounce');
                setTimeout(() => {
                    this.classList.remove('bounce');
                }, 600);
            }
        });
    });

    // Also add ripple to dropdown items and other clickable elements
    const clickables = document.querySelectorAll('.dropdown-item, .nav-link, .card');
    clickables.forEach(el => {
        if (el.classList.contains('nav-link') || el.classList.contains('dropdown-item')) {
            el.addEventListener('click', function(e) {
                createRipple(e, this);
            });
        }
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

/**
 * 2. NAVBAR SCROLL EFFECT
 * Adds shadow and reduces padding when scrolling down
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initial state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
}

/**
 * 3. SMOOTH SCROLLING
 * Makes anchor links scroll smoothly
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 4. FORM INTERACTIONS
 * Adds animations and enhanced feedback to form elements
 */
function initFormAnimations() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        // Add fade-in on form submit (loading state)
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
                submitBtn.disabled = true;

                // Restore button after 3 seconds (fallback)
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });

        // Input focus animations
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    });

    // Select2-like enhancement for select boxes (if Bootstrap 4 Select not used)
    const selects = document.querySelectorAll('select.form-control');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            this.classList.add('scale-in');
            setTimeout(() => {
                this.classList.remove('scale-in');
            }, 400);
        });
    });
}

/**
 * 5. BUTTON HOVER EFFECTS
 * Additional hover enhancements beyond CSS
 */
function initButtonHoverEffects() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        // Sound effect placeholder (commented out for now)
        // button.addEventListener('click', function() {
        //     // playClickSound();
        // });
    });

    // Cart add confirmation animation
    const addToCartButtons = document.querySelectorAll('a[href*="add-to-cart"], button.btn-success');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Find cart badge and animate it
            const cartBadge = document.querySelector('.badge');
            if (cartBadge) {
                cartBadge.classList.add('bounce');
                setTimeout(() => {
                    cartBadge.classList.remove('bounce');
                }, 600);

                // Increment visual
                let count = parseInt(cartBadge.textContent) || 0;
                cartBadge.textContent = count + 1;
            }
        });
    });
}

/**
 * 6. CART ITEM REMOVAL ANIMATION
 * Smooth fade-out when removing items
 */
function animateCartRemoval(element) {
    element.style.transition = 'all 0.5s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateX(-20px)';

    setTimeout(() => {
        element.remove();
    }, 500);
}

/**
 * 7. PAGE ELEMENT STAGGER ANIMATIONS
 * For lists (products, cart items, orders)
 */
function initStaggerAnimations() {
    const lists = document.querySelectorAll('.product-list, .cart-items, .order-list');

    lists.forEach(list => {
        const items = list.children;
        Array.from(items).forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `all 0.5s ease ${index * 0.1}s`;

            // Trigger animation
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        });
    });
}

// Initialize stagger animations after page load
window.addEventListener('load', function() {
    setTimeout(initStaggerAnimations, 200);
});

/**
 * 8. TOAST NOTIFICATIONS (Helper function)
 * Can be called from server-side rendered code
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '300px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.animation = 'slideInRight 0.3s ease-out';

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);

    // Close button
    toast.querySelector('.close').addEventListener('click', () => {
        toast.remove();
    });
}

// Expose to window for inline onclick handlers
window.showToast = showToast;
window.animateCartRemoval = animateCartRemoval;
