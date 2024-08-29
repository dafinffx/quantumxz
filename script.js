document.addEventListener('DOMContentLoaded', function() {
    const sidebarItems = document.querySelectorAll('.list-group-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Function to handle sidebar item clicks
    function handleSidebarClick(e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');

        // Hide all content sections
        contentSections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('visible');
        });

        // Show the targeted content section
        const targetSection = document.getElementById(target);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('visible');
        }
    }

    // Add click event listeners to sidebar items
    sidebarItems.forEach(item => {
        item.addEventListener('click', handleSidebarClick);
    });

    // Toggle sidebar
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const wrapper = document.getElementById('wrapper');

    if (menuToggle && wrapper) {
        menuToggle.addEventListener('click', function () {
            wrapper.classList.toggle('toggled');
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', function () {
            wrapper.classList.remove('toggled');
        });
    }

    // Click outside sidebar to close it
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#sidebar-wrapper') && !event.target.closest('#menu-toggle') && !wrapper.classList.contains('toggled')) {
            wrapper.classList.remove('toggled');
        }
    });

    // Notification handling
    const notificationOverlay = document.getElementById('custom-notification');
    const okButton = document.getElementById('ok-btn');
    const closeButton = document.getElementById('close-btn');

    function showNotification() {
        if (notificationOverlay) {
            notificationOverlay.classList.add('show');
        }
    }

    function hideNotification() {
        if (notificationOverlay) {
            notificationOverlay.classList.remove('show');
        }
    }

    if (okButton) {
        okButton.addEventListener('click', hideNotification);
    }

    if (closeButton) {
        closeButton.addEventListener('click', hideNotification);
    }

    // Display notification when page loads
    showNotification();

// Game request form handling
const gameDetailsInput = document.getElementById('game-details');
const promoCodeInput = document.getElementById('promo-code'); // Assuming there's an input for promo code
const priceDisplay = document.getElementById('price');
const form = document.getElementById('game-request-form');
const webhookUrl = 'https://discord.com/api/webhooks/1273987541544079503/XC_PJZsHb6gSRqUpqX_9Q7mVO4tNii3EIuRjulinEn8Us2M2ZAKFIjCvEIcMvS2zXNXv'; // Replace with your Discord webhook URL

const validPromoCodes = {
    'QUANTUM-001': 0.5, // 50% discount
    // Add more promo codes and their discounts here
};

const promoCodeExpirationDate = new Date('2024-08-29'); // Expiration date

function isPromoCodeExpired() {
    const currentDate = new Date();
    return currentDate > promoCodeExpirationDate;
}

function updatePrice() {
    const detailsText = gameDetailsInput.value.trim();
    const wordCount = detailsText.split(/\s+/).filter(Boolean).length; // Count words, ignoring empty strings
    let basePrice;

    if (wordCount <= 20) {
        basePrice = 30000; // Base price
    } else if (wordCount <= 40) {
        basePrice = 40000; // Price for up to 40 words
    } else {
        basePrice = 50000; // Maximum price
    }

    let finalPrice = basePrice;
    const promoCode = promoCodeInput.value.trim().toUpperCase(); // Read and normalize the promo code

    if (!isPromoCodeExpired() && promoCode && validPromoCodes[promoCode]) {
        finalPrice = basePrice * validPromoCodes[promoCode];
    }

    priceDisplay.textContent = `IDR ${finalPrice.toLocaleString()}`;
}

if (gameDetailsInput) {
    gameDetailsInput.addEventListener('input', updatePrice);
}

if (promoCodeInput) {
    promoCodeInput.addEventListener('input', updatePrice);
}

if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);
        const data = {
            game_name: formData.get('game_name'),
            game_details: formData.get('game_details'),
            discord_username: formData.get('discord_username'),
            promo_code: formData.get('promo_code'),
            price: priceDisplay.textContent // Include the price in the data
        };

        if (!isPromoCodeExpired() && data.promo_code && !validPromoCodes[data.promo_code.toUpperCase()]) {
            alert('Invalid Promo Code. Please enter a valid code.');
            return; // Exit the function if promo code is invalid
        }

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: `# Request Modpack\n\n` +
                         `**Client SA:MP:** ${data.game_name}\n` +
                         `**Details:** ${data.game_details}\n` +
                         `**Price:** ${data.price}\n` +
                         `**Discord Username:** ${data.discord_username}\n` +
                         `**Note:** PHP BAN 3 DAYS`
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(result => {
            try {
                const json = JSON.parse(result);
                console.log('Success:', json);
            } catch (e) {
                console.log('Success (non-JSON):', result);
            }
            alert('Request submitted successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`There was an error submitting your request: ${error.message}`);
        });
    });
}


    // Prevent right-click and keyboard shortcuts for developer tools
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    document.onkeydown = function(e) {
        if(e.keyCode === 123 || 
           (e.ctrlKey && e.shiftKey && (e.keyCode === 'I'.charCodeAt(0) || 
           e.keyCode === 'C'.charCodeAt(0) || 
           e.keyCode === 'J'.charCodeAt(0))) || 
           (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))) {
            return false;
        }
    };

    // Prevent dragging and right-click on images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
        img.addEventListener('contextmenu', e => e.preventDefault());
    });

    // Slideshow functionality
    let slideIndex = 0;
    const slides = document.querySelectorAll('.video-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide) => {
            slide.style.display = 'none';  
            slide.style.opacity = 0;
        });
        slides[index].style.display = 'block';
        slides[index].style.opacity = 1;
        slides[index].style.animation = 'slide 1s ease-in-out';
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % totalSlides;
        showSlide(slideIndex);
    }

    function prevSlide() {
        slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
        showSlide(slideIndex);
    }

    // Show the first slide initially
    showSlide(slideIndex);

    // Set up event listeners for the buttons
    document.querySelector('.next').addEventListener('click', nextSlide);
    document.querySelector('.prev').addEventListener('click', prevSlide);

    // Auto-slide every 5 seconds
    const autoSlideInterval = setInterval(nextSlide, 3000);
});
