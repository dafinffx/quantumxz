document.getElementById('game-request-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const gameName = document.getElementById('game-name').value;
    const gameDetails = document.getElementById('game-details').value;
    const discordUsername = document.getElementById('discord-username').value;

    // Prepare data for Discord webhook
    const message = {
        content: `# Request Modpack\n**Client:** ${gameName}\n**Details:** ${gameDetails}\n**Discord Username:** ${discordUsername}`
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
