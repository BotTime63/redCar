document.addEventListener("DOMContentLoaded", function() {
    const nextButton = document.getElementById("next-btn");
    const mediaElement = document.getElementById("media");
    const linkPreviewElement = document.getElementById("link-preview");
    const mediaIdElement = document.getElementById('media-id');
    const backButton = document.getElementById("back-btn");
    const randomButton = document.getElementById("random-btn");
    const autoNextCounter = document.getElementById('autoNextCounter');

    let currentIndex = 0;
    let mediaHistory = [];
    let autoNextInterval;
    let counterInterval;
    let isAutoRandomActive = false;

    // Function to display a media item (image/video) and update the ID number
    function showMedia(direction) {
        if (direction === 'next') {
            // Pick a random index for the next media
            const randomIndex = Math.floor(Math.random() * mediaUrls.length);
            currentIndex = randomIndex;
        } else if (direction === 'prev') {
            currentIndex--;
            // Loop to the last media if we're at the beginning
            if (currentIndex < 0) {
                currentIndex = mediaUrls.length - 1;
            }
        }
    
        let mediaUrl = mediaUrls[currentIndex];
        const mediaDisplay = document.getElementById('mediaDisplay');
        const linkPreview = document.getElementById('link-preview');
    
        // Clear previous media content
        mediaDisplay.innerHTML = "";
    
        // Fallback image path
        const fallbackImage = "assets/fallback-image.jpg";
    
        // Check if media is an image
        if (mediaUrl.endsWith(".jpg") || mediaUrl.endsWith(".jpeg") || mediaUrl.endsWith(".png")) {
            const img = document.createElement("img");
            img.src = mediaUrl;
            img.alt = "Media Image";
            img.onerror = function () {
                img.src = fallbackImage; // Use fallback image if original fails
            };
            mediaDisplay.appendChild(img);
        } 
        // Check if media is a video
        else if (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".gifv")) {
            const video = document.createElement("video");
            video.controls = true;
            const source = document.createElement("source");
            source.src = mediaUrl;
            source.type = "video/mp4";
            source.onerror = function () {
                const img = document.createElement("img");
                img.src = fallbackImage; // Fallback to image if video fails
                img.alt = "Fallback for video";
                mediaDisplay.innerHTML = ""; // Clear video and display fallback
                mediaDisplay.appendChild(img);
            };
            video.appendChild(source);
            mediaDisplay.appendChild(video);
        } 
        // Handle unsupported media types
        else {
            const img = document.createElement("img");
            img.src = fallbackImage;
            img.alt = "Unsupported Media";
            mediaDisplay.appendChild(img);
        }
    
        // Update link preview
        linkPreview.innerHTML = `Link: <a href="${mediaUrl}" target="_blank">${mediaUrl}</a>`;
    
        // Update media ID
        document.getElementById("media-id").textContent = currentIndex + 1;
    
        // Update button states
        updateButtons();
    }
    


    // Function to update button states (enabling/disabling)
    function updateButtons() {
        const prevButton = document.querySelector('button[onclick="showMedia(\'prev\')"]');
        
        // Update "Prev" button based on currentIndex
        prevButton.disabled = currentIndex === 0;
        prevButton.classList.toggle('disabled', currentIndex === 0);
    
        // Ensure "Next" button is always enabled
        const nextButton = document.querySelector('button[onclick="showMedia(\'next\')"]');
        nextButton.disabled = false; // Always keep it enabled
        nextButton.classList.remove('disabled'); // Ensure no "disabled" styling
    }
    
    

    // Random media selection with better handling to avoid repetition
    function showRandomMedia() {
        const availableIndices = mediaUrls
            .map((_, index) => index)
            .filter(index => !mediaHistory.includes(index));

        if (availableIndices.length === 0) {
            mediaHistory = [];
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        mediaHistory.push(randomIndex);

        if (mediaHistory.length > mediaUrls.length) {
            mediaHistory.shift();
        }

        currentIndex = randomIndex;
        showMedia('next');
    }

    // Start auto-random with a 15-second timer
    function startAutoRandom() {
        isAutoRandomActive = true;
        randomButton.textContent = "Stop Auto-Random";

        clearInterval(counterInterval);
        clearInterval(autoNextInterval);

        let countdown = 15;
        autoNextCounter.textContent = `Next in: ${countdown}s`;

        counterInterval = setInterval(() => {
            countdown--;
            autoNextCounter.textContent = `Next in: ${countdown}s`;
            if (countdown <= 0) {
                clearInterval(counterInterval);
            }
        }, 1000);

        autoNextInterval = setInterval(() => {
            showRandomMedia();
            clearInterval(counterInterval);
        }, 15000);
    }

    // Stop auto-random
    function stopAutoRandom() {
        isAutoRandomActive = false;
        randomButton.textContent = "Start Auto-Random";
        clearInterval(autoNextInterval);
        clearInterval(counterInterval);
        autoNextInterval = null;
    }

    randomButton.addEventListener("click", function() {
        if (isAutoRandomActive) {
            stopAutoRandom();
        } else {
            startAutoRandom();
        }
    });

    nextButton.addEventListener("click", function() {
        showMedia('next');
    });

    backButton.addEventListener("click", function() {
        showMedia('prev');
    });

    showMedia('next');
});
