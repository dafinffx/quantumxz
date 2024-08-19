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
// Simulasi penyimpanan untuk kode promo yang telah digunakan
let usedCodes = []; // Kode yang digunakan, harus disimpan di tempat yang persisten
const MAX_USES = 4; // Jumlah maksimum penggunaan
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1250487187489947851/wDyA2tTG6aqE8JKpQ2CvImu7LOzIbx08Vqm_6Z3G5Uw68I9qwFyMums9vNrPfUIml3iw';

// Fungsi untuk mengirim log ke Discord webhook
function sendLogToDiscord(code, user) {
    const message = {
        content: `Promo code ${code} has been redeemed by ${user}.`,
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
    .then(response => {
        if (response.ok) {
            console.log('Log sent to Discord successfully.');
        } else {
            console.error('Failed to send log to Discord.');
        }
    })
    .catch(error => {
        console.error('Error sending log to Discord:', error);
    });
}

// Fungsi untuk menebus kode promo
function redeemPromoCode(code, user) {
    // Cek apakah kode promo sudah digunakan maksimal
    const codeUsage = usedCodes.filter(c => c.code === code).length;
    if (codeUsage >= MAX_USES) {
        return {
            success: false,
            message: 'Promo code has already been used by the maximum number of people.'
        };
    }

    // Untuk kesederhanaan, kita anggap kode "QUANTUM-01" memberikan diskon 5%
    if (code === 'QUANTUM-01') {
        usedCodes.push({ code: code, user: user });
        sendLogToDiscord(code, user); // Kirim log ke Discord
        return {
            success: true,
            discount: 0.05, // 5% diskon
            message: 'Success Redeem Promo!'
        };
    } else {
        return {
            success: false,
            message: 'Invalid promo code'
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
        content: `# Request Modpack\n**Client:** ${gameName}\n**Details:** ${gameDetails}\n**Discord Username:** ${discordUsername}\n**Price:** ${document.getElementById('price').textContent}\n**Note : PHP Banned 3 Hari**`
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
// Mencegah klik kanan
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Mencegah pemilihan teks
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});
// Mencegah Inspect Element
document.onkeydown = function(e) {
    if(e.keyCode == 123) {
       return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
       return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
       return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
       return false;
    }
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
       return false;
    }
}

