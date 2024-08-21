// welcome.js
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.overlay');
    const popup = document.querySelector('.info-popup');
    const showPopupBtn = document.getElementById('popup-ok');
    const closePopupBtn = document.getElementById('popup-close');

    // Show popup on page load (or use any other trigger)
    setTimeout(function() {
        overlay.classList.add('show');
        popup.classList.add('show');
    }, 0); // Adjust time as needed

    // Close popup
    showPopupBtn.addEventListener('click', function() {
        overlay.classList.remove('show');
        popup.classList.remove('show');
    });

    closePopupBtn.addEventListener('click', function() {
        overlay.classList.remove('show');
        popup.classList.remove('show');
    });
});

