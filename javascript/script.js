// Smooth Scroll for Navbar Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        event.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Add smooth scrolling effect to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('scroll-animation');
});

// CSS animation for sections
const style = document.createElement('style');
style.innerHTML = `
    .scroll-animation {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .scroll-animation.visible {
        opacity: 1;
        transform: translateY(0);
    }
    /* Opening animation */
    .opening-animation {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 1s ease-out, transform 1s ease-out;
    }
    .opening-animation.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Add 'visible' class to sections when they are in view
function handleScroll() {
    document.querySelectorAll('.scroll-animation').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }
    });
}

// Add opening animation to the entire page
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('opening-animation');
    setTimeout(() => document.body.classList.add('visible'), 100);
});

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll); // Trigger on load to show animations for already visible sections

// Handle notification display
document.addEventListener("DOMContentLoaded", function() {
    const notification = document.getElementById('notification');
    const closeNotificationBtn = document.getElementById('close-notification');

    if (notification && closeNotificationBtn) {
        // Show the notification
        notification.classList.add('visible');

        // Hide the notification when the close button is clicked
        closeNotificationBtn.addEventListener('click', function() {
            notification.classList.remove('visible');
        });
    }
});

// Prevent context menu and certain keyboard shortcuts
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && e.keyCode == 73)) {
        e.preventDefault();
    }
});

// Update price based on textarea length
document.addEventListener('DOMContentLoaded', function() {
    const detailsTextarea = document.getElementById('game-details');
    const priceSpan = document.getElementById('price');

    // Function to update price based on the length of the details text
    function updatePrice() {
        const detailsLength = detailsTextarea.value.length;
        let price;

        if (detailsLength <= 100) { // Adjust the character count as needed
            price = '30.000 IDR'; // Minimum price
        } else if (detailsLength <= 200) {
            price = '40.000 IDR'; // Mid-range price
        } else {
            price = '50.000 IDR'; // Maximum price
        }

        priceSpan.textContent = price;
        console.log('Price:', price); // Log the updated price to the console
    }

    // Update price when the user types in the textarea
    detailsTextarea.addEventListener('input', updatePrice);
});

// Function to handle the code redeem process
// Function to handle code redemption and update price
function redeemPromoCode(code) {
    // For simplicity, let's assume the code "QUANTUM-01" gives a 3% discount
    if (code === "QUANTUM-01") {
        return {
            success: true,
            discount: 0.03, // 3% discount
            message: "Success Redeem Promo!"
        };
    } else {
        return {
            success: false,
            message: "Invalid promo code"
        };
    }
}

// Function to update price based on textarea length
function updatePrice() {
    const detailsTextarea = document.getElementById('game-details');
    const priceSpan = document.getElementById('price');
    const detailsLength = detailsTextarea.value.length;
    let price;

    if (detailsLength <= 100) { // Adjust the character count as needed
        price = 30000; // Minimum price in IDR
    } else if (detailsLength <= 200) {
        price = 40000; // Mid-range price in IDR
    } else {
        price = 50000; // Maximum price in IDR
    }

    // Update the price display
    priceSpan.textContent = `IDR ${price}`;
}

// Handle form submission to Discord webhook
document.getElementById('game-request-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const gameName = document.getElementById('game-name').value;
    const gameDetails = document.getElementById('game-details').value;
    const discordUsername = document.getElementById('discord-username').value;
    const promoCode = document.getElementById('promo-code').value;
    let priceText = document.getElementById('price').textContent; // Get the price from the span

    // Remove 'IDR ' from the priceText and parse it to an integer
    let originalPrice = parseInt(priceText.replace('IDR ', '').replace(/\s+/g, ''));

// Apply promo code
const promoResult = redeemPromoCode(promoCode);
if (promoResult.success) {
    // Calculate the discounted price
    let discountedPrice = originalPrice - (originalPrice * promoResult.discount);

    // Update the price display
    let formattedPrice = `IDR ${discountedPrice.toLocaleString('en-ID')}`; // Format to include thousands separator
    document.getElementById('price').textContent = formattedPrice;

    // Display a success message
    alert(promoResult.message);
} else {
    // Display an error message
    alert(promoResult.message);
}   

    // Prepare data for Discord webhook
    const message = {
        content: `# Request Modpack\n**Client:** ${gameName}\n**Details:** ${gameDetails}\n**Discord Username:** ${discordUsername}\n**Price:** ${document.getElementById('price').textContent}`
    };

    // Send data to Discord webhook
    fetch('https://discord.com/api/webhooks/1273987541544079503/XC_PJZsHb6gSRqUpqX_9Q7mVO4tNii3EIuRjulinEn8Us2M2ZAKFIjCvEIcMvS2zXNXv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message) // Send the correct message content
    })
    .then(response => {
        if (response.ok) {
            console.log('Success:', response);
            alert('Your request has been submitted successfully!');
            document.getElementById('game-request-form').reset(); // Reset the form
        } else {
            console.error('Error:', response);
            alert('Failed to send request.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to send request.');
    });
});

// Update price when the user types in the textarea
document.getElementById('game-details').addEventListener('input', updatePrice);
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch and update visit count
    function updateVisitCounter() {
        fetch('/api/get-visit-count') // Endpoint to get the current visit count
            .then(response => response.json())
            .then(data => {
                document.getElementById('visit-counter').innerText = `Visits Web: ${data.count}`;
            })
            .catch(error => console.error('Error fetching visit count:', error));
    }

    // Update visit counter every 1 minute
    setInterval(updateVisitCounter, 60000); // 60000 ms = 1 minute

    // Initial update
    updateVisitCounter();
});
const express = require('express');
const app = express();
const port = 3000;

let visitCount = 0;

// Middleware to simulate visit count increment
app.use((req, res, next) => {
    visitCount += 1; // Increment visit count on every request
    next();
});

app.get('/api/get-visit-count', (req, res) => {
    res.json({ count: visitCount });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

