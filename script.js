document.addEventListener('DOMContentLoaded', function() {
    const sidebarItems = document.querySelectorAll('.list-group-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Sidebar click handler (unchanged)
    function handleSidebarClick(e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');

        contentSections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('visible');
        });

        const targetSection = document.getElementById(target);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('visible');
        }
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', handleSidebarClick);
    });

    // Toggle sidebar (unchanged)
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

    // Close sidebar when clicking outside (unchanged)
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#sidebar-wrapper') && !event.target.closest('#menu-toggle') && !wrapper.classList.contains('toggled')) {
            wrapper.classList.remove('toggled');
        }
    });

    // Notification handling (unchanged)
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

    showNotification();

    // Game request form handling
    const gameDetailsInput = document.getElementById('game-details');
    const promoCodeInput = document.getElementById('promo-code');
    const priceDisplay = document.getElementById('price');
    const form = document.getElementById('game-request-form');
    const webhookUrl = 'https://discord.com/api/webhooks/1273987541544079503/XC_PJZsHb6gSRqUpqX_9Q7mVO4tNii3EIuRjulinEn8Us2M2ZAKFIjCvEIcMvS2zXNXv'; // Replace with your Discord webhook URL

    const validPromoCodes = {
        'PLOSION-002': 0.90,
        // Add more promo codes and their discounts here
    };

    const promoCodeExpirationDate = new Date('2024-11-10');

    function isPromoCodeExpired() {
        return new Date() > promoCodeExpirationDate;
    }

    function updatePrice() {
        const detailsText = gameDetailsInput.value.trim();
        const wordCount = detailsText.split(/\s+/).filter(Boolean).length;
        let basePrice = (wordCount <= 20) ? 40000 : (wordCount <= 40 ? 40000 : 50000);
        let finalPrice = basePrice;

        const promoCode = promoCodeInput.value.trim().toUpperCase();
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

    // Submission limit logic
    const submitButton = document.querySelector('.btn-submit');
    let submissionCount = localStorage.getItem('submissionCount') ? parseInt(localStorage.getItem('submissionCount')) : 0;
    const maxSubmissions = 3;
    const limitDuration = 24 * 60 * 60 * 1000;

    const limitTimestamp = localStorage.getItem('limitTimestamp') ? parseInt(localStorage.getItem('limitTimestamp')) : null;
    if (limitTimestamp && Date.now() < limitTimestamp) {
        disableSubmit();
    } else {
        localStorage.removeItem('submissionCount');
        localStorage.removeItem('limitTimestamp');
    }

    function disableSubmit() {
        submitButton.disabled = true;
        submitButton.textContent = 'Limit Reached (24h)';
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
    
        // Show notification
        const notification = document.getElementById('notification');
        notification.classList.remove('hidden');
    
        // Add close functionality for the notification
        document.getElementById('notification-close').addEventListener('click', function () {
            notification.classList.add('hidden');
        });
    
        if (submissionCount < maxSubmissions) {
            const formData = new FormData(form);
            const data = {
                game_name: formData.get('game_name'),
                game_details: formData.get('game_details'),
                discord_username: formData.get('discord_username'),
                promo_code: formData.get('promo_code'),
                price: priceDisplay.textContent
            };
    
            if (!isPromoCodeExpired() && data.promo_code && !validPromoCodes[data.promo_code.toUpperCase()]) {
                alert('Invalid Promo Code. Please enter a valid code.');
                return;
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
                alert('Request submitted successfully!');
                submissionCount++;
                localStorage.setItem('submissionCount', submissionCount);
    
                if (submissionCount >= maxSubmissions) {
                    localStorage.setItem('limitTimestamp', Date.now() + limitDuration);
                    disableSubmit();
                }
    
                form.reset();
                notification.classList.add('hidden'); // Hide notification after submission
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`There was an error submitting your request: ${error.message}`);
            });
        } else {
            localStorage.setItem('limitTimestamp', Date.now() + limitDuration);
            disableSubmit();
            alert('You have reached the maximum number of submissions. Please try again in 24 hours.');
        }
    });
    

    // Prevent right-click and keyboard shortcuts (unchanged)
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

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
        img.addEventListener('contextmenu', e => e.preventDefault());
    });

    // Slideshow functionality (unchanged)
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

    showSlide(slideIndex);

    document.querySelector('.next').addEventListener('click', nextSlide);
    document.querySelector('.prev').addEventListener('click', prevSlide);

    const autoSlideInterval = setInterval(nextSlide, 3000);
});
const express = require("express");
const axios = require("axios");

const express = require("express");
const axios = require("axios");
const app = express();
const clientID = "1301190119532920832";
const clientSecret = "7blo1I5rEFckV6v7qLj1jiawhN9hfmVh";
const redirectURI = "https://x-plosion.netlify.app/";
const webhookUrl = "https://discord.com/api/webhooks/1301193612280725607/Yd9MpI3dtNImglOMY1turFRlG502mdnBLh9YOYRc9afGqjJkz9TgPUaKXstg27mCvMqp"; // Replace with your actual Discord webhook URL

app.use(express.json()); // For parsing application/json

app.get("/callback", async (req, res) => {
    const code = req.query.code;

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectURI,
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const accessToken = tokenResponse.data.access_token;

        // Use the access token to get user info
        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const username = userResponse.data.username;
        const userId = userResponse.data.id; // Get the user's Discord ID
        const avatar = userResponse.data.avatar; // Get the user's avatar

        // Construct the avatar URL
        const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png` : '';

        // Log the username using the webhook
        await axios.post(webhookUrl, {
            content: `User **${username}** (ID: ${userId}) has signed in.`,
        });

        // Send user info as a response
        res.json({ username, avatarUrl });
    } catch (error) {
        console.error("Error authenticating:", error);
        res.status(500).send("Error during authentication");
    }
});

app.listen(3000, () => {
    console.log("Server is running on https://x-plosion.netlify.app/");
});
app.get("/callback", async (req, res) => {
    const code = req.query.code;

    try {
        // Exchange the code for an access token
        const response = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectURI,
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const accessToken = response.data.access_token;

        // Use the access token to get user info
        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const username = userResponse.data.username;
        const userId = userResponse.data.id;
        const avatar = userResponse.data.avatar; // Get the user's avatar ID

        // Construct the avatar URL
        const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;

        // Log the username using the webhook
        await axios.post(webhookUrl, {
            content: `User **${username}** (ID: ${userId}) has signed in.`,
        });

        // Send user info as a response, including avatar URL
        res.json({ ...userResponse.data, avatarUrl });
    } catch (error) {
        console.error("Error authenticating:", error);
        res.send("Error during authentication");
    }
});
async function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        try {
            const response = await fetch(`/callback?code=${code}`);
            const data = await response.json();
            setDiscordUsername(data.username); // Set the Discord username
            document.getElementById("user-avatar").src = data.avatarUrl; // Set the avatar URL
            document.getElementById("user-info").style.display = 'flex'; // Show user info
            alert('Logged in successfully as ' + data.username);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
}
