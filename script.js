// Wait for the DOM to be fully loaded before executing code
document.addEventListener("DOMContentLoaded", function () {
  // Set dates for all certificates
  setDatesForCertificates();

  // Check music state
  checkMusicState();

  // Add music controls
  addMusicControls();

  // Check if we should skip the intro
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("skip_intro") === "true") {
    skipIntro();
  }

  // Set up event listeners
  setupEventListeners();

  // Set up swipe detection for mobile
  setupSwipeDetection();
});

// Set the current date for all certificates
function setDatesForCertificates() {
  const currentDate = new Date().toLocaleDateString();

  // Use a more robust approach to set dates
  const dateElements = ["date0","date1", "date2", "date3", "date4", "date5", "date6", "date7", "date8", "date9", "date10", "date11", "date12", "date13", "date14", "date15", "date16", "date17", "date18", "date19", "date20"];
  dateElements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.textContent = currentDate;
  });
}

// Music control functions
function playBackgroundMusic() {
  const music = document.getElementById("backgroundMusic");
  if (!music) return; // Guard clause if element doesn't exist

  music.volume = 0.2; 


  const playPromise = music.play();

  // Handle potential play() promise rejection
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("Music started successfully");
        updateMusicIcon(true);
      })
      .catch((error) => {
        console.log("Autoplay prevented by browser:", error);
        updateMusicIcon(false);
      });
  }

  // Store music state in localStorage so it persists across pages
  localStorage.setItem("musicPlaying", "true");
}





function checkMusicState() {
  // Check if music should be playing (coming back from another page)
  if (localStorage.getItem("musicPlaying") === "true") {
    const music = document.getElementById("backgroundMusic");
    if (!music) return;

    music.volume = 0.5;
    music
      .play()
      .then(() => updateMusicIcon(true))
      .catch((e) => {
        console.log("Couldn't autoplay returning from another page:", e);
        updateMusicIcon(false);
      });
  } else {
    updateMusicIcon(false);
  }
}



// Skip intro animation and show all elements directly
function skipIntro() {
  // Hide the start button
  const startButton = document.getElementById("startButton");
  if (startButton) startButton.style.display = "none";

  // Show all elements directly
  showAllElements();
}

// Show all elements that are initially hidden
// First, ensure the showAllElements function properly displays all buttons
function showAllElements() {
  console.log("Showing all elements...");
  
  // Show main content elements with explicit display values
  const elementsToShow = [
    '.carousel', 
    '.reveal-btn', 
    'footer',
    '.show-affirmation-btn',
    '.toggle-btn',
    '#toggleMusic',
    '#affirmationToggle',
    '#beforeYouGoToggle',
    '#finalMessageToggle'
  ];
  
  elementsToShow.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`Found ${elements.length} elements for selector: ${selector}`);
    
    elements.forEach(el => {
      if (el.tagName === 'BUTTON') {
        el.style.display = 'block';
      } else if (el.classList.contains('carousel')) {
        el.style.display = 'flex';
      } else {
        el.style.display = 'block';
      }
      console.log(`Set display for ${el.tagName}${el.id ? '#'+el.id : ''} to ${el.style.display}`);
    });
  });
  
  // Special handling for toggle buttons that need specific display values
  const specialToggles = document.querySelectorAll('#toggleMusic, #affirmationToggle');
  specialToggles.forEach(toggle => {
    if (toggle) {
      toggle.style.display = 'flex';
      console.log(`Set special display for ${toggle.id} to flex`);
    }
  });
  
  // Ensure event listeners are properly set up
  setupEventListeners();
}

// Make sure the event listeners are properly set up
function setupEventListeners() {
  console.log("Setting up event listeners...");
  
  // Back to home button
  const backToHome = document.getElementById('backToHome');
  if (backToHome) {
    console.log("Found backToHome button, adding event listener");
    // Remove existing listeners to avoid duplicates
    const newButton = backToHome.cloneNode(true);
    backToHome.parentNode.replaceChild(newButton, backToHome);
    newButton.addEventListener('click', hideAffirmations);
  } else {
    console.log("backToHome button not found");
  }
  
  // Show Affirmation buttons
  const affirmationButtons = document.querySelectorAll('.show-affirmation-btn');
  console.log(`Found ${affirmationButtons.length} affirmation buttons`);
  
  affirmationButtons.forEach(button => {
    // Remove existing listeners to avoid duplicates
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener('click', function() {
      console.log("Affirmation button clicked");
      showAffirmations();
    });
  });
  
  // Before You Go toggle
  const beforeYouGoToggle = document.getElementById('beforeYouGoToggle');
  if (beforeYouGoToggle) {
    console.log("Found beforeYouGoToggle button, adding event listener");
    // Remove existing listeners to avoid duplicates
    const newButton = beforeYouGoToggle.cloneNode(true);
    beforeYouGoToggle.parentNode.replaceChild(newButton, beforeYouGoToggle);
    newButton.addEventListener('click', function() {
      console.log("Before You Go button clicked");
      showModal('beforeYouGoPage');
    });
  } else {
    console.log("beforeYouGoToggle button not found");
  }
  
  // Final Message toggle
  const finalMessageToggle = document.getElementById('finalMessageToggle');
  if (finalMessageToggle) {
    console.log("Found finalMessageToggle button, adding event listener");
    // Remove existing listeners to avoid duplicates
    const newButton = finalMessageToggle.cloneNode(true);
    finalMessageToggle.parentNode.replaceChild(newButton, finalMessageToggle);
    newButton.addEventListener('click', function() {
      console.log("Final Message button clicked");
      showModal('finalMessagePage');
    });
  } else {
    console.log("finalMessageToggle button not found");
  }
  
  // Back buttons in modals
  const backButtons = document.querySelectorAll('.back-btn');
  console.log(`Found ${backButtons.length} back buttons`);
  
  backButtons.forEach(button => {
    // Remove existing listeners to avoid duplicates
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener('click', function() {
      console.log("Back button clicked");
      const parentModal = this.closest('.modal-page');
      if (parentModal) {
        hideModal(parentModal.id);
      }
    });
  });
  
  // Reveal button
  const revealBtn = document.querySelector('.reveal-btn');
  if (revealBtn) {
    console.log("Found reveal button, adding event listener");
    // Remove existing listeners to avoid duplicates
    const newButton = revealBtn.cloneNode(true);
    revealBtn.parentNode.replaceChild(newButton, revealBtn);
    newButton.addEventListener('click', function() {
      console.log("Reveal button clicked");
      revealSecretCertificate();
    });
  } else {
    console.log("Reveal button not found");
  }
}

// Fix the showAffirmations function to ensure it works correctly
function showAffirmations() {
  console.log("Showing affirmations...");
  
  const affirmationPage = document.getElementById('affirmationPage');
  if (!affirmationPage) {
    console.error("Affirmation page not found!");
    return;
  }
  
  // Make sure the affirmation page is visible
  affirmationPage.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  console.log("Affirmation page displayed");
  
  // Reset animation by removing and re-adding the elements
  const list = document.querySelector('#affirmationPage .affirmation-list');
  if (!list) {
    console.error("Affirmation list not found!");
    return;
  }
  
  const items = list.innerHTML;
  list.innerHTML = '';
  
  setTimeout(() => {
    list.innerHTML = items;
    
    // Add click effects to the affirmations
    document.querySelectorAll('#affirmationPage .affirmation-list p').forEach(item => {
      item.addEventListener('click', createHeartEffect);
    });
    
    console.log("Affirmation items re-added with animations");
  }, 10);
}

// Fix the hideAffirmations function
function hideAffirmations() {
  console.log("Hiding affirmations...");
  
  const affirmationPage = document.getElementById('affirmationPage');
  if (!affirmationPage) {
    console.error("Affirmation page not found!");
    return;
  }
  
  affirmationPage.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  console.log("Affirmation page hidden");
}

// Fix the modal functions
function showModal(modalId) {
  console.log(`Showing modal: ${modalId}`);
  
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Modal ${modalId} not found!`);
    return;
  }
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  console.log(`Modal ${modalId} displayed`);
}

function hideModal(modalId) {
  console.log(`Hiding modal: ${modalId}`);
  
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Modal ${modalId} not found!`);
    return;
  }
  
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  console.log(`Modal ${modalId} hidden`);
}


// Certificate functions
function revealSecretCertificate() {
  const secretCert = document.getElementById("secretCert");
  if (!secretCert) return; // Guard clause

  secretCert.style.display = "block";

  // Add a small delay before scrolling to ensure the element is rendered
  setTimeout(() => {
    secretCert.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
}

// Affirmation functions
function showAffirmations() {
  const affirmationPage = document.getElementById("affirmationPage");
  if (!affirmationPage) return; // Guard clause

  affirmationPage.style.display = "block";
  document.body.style.overflow = "hidden";

  // Update toggle button if it exists
  const affirmationToggle = document.getElementById("affirmationToggle");
  if (affirmationToggle) {
    affirmationToggle.style.backgroundColor = "rgba(126, 87, 194, 0.8)";
  }

  // Reset animation by removing and re-adding the elements
  const list = document.querySelector("#affirmationPage .affirmation-list");
  if (!list) return;

  const items = list.innerHTML;
  list.innerHTML = "";

  setTimeout(() => {
    list.innerHTML = items;

    // Add click effects to the affirmations
    document
      .querySelectorAll("#affirmationPage .affirmation-list p")
      .forEach((item) => {
        item.addEventListener("click", createHeartEffect);
      });
  }, 10);
}

function hideAffirmations() {
  const affirmationPage = document.getElementById("affirmationPage");
  if (!affirmationPage) return; // Guard clause

  affirmationPage.style.display = "none";
  document.body.style.overflow = "auto";

  // Reset toggle button if it exists
  const affirmationToggle = document.getElementById("affirmationToggle");
  if (affirmationToggle) {
    affirmationToggle.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  }
}

// Heart effect function
function createHeartEffect(event) {
  // Create a heart element
  const heart = document.createElement("span");
  heart.innerHTML = "💖";
  heart.style.position = "fixed";
  heart.style.left = event.clientX - 10 + "px";
  heart.style.top = event.clientY - 10 + "px";
  heart.style.fontSize = "24px";
  heart.style.pointerEvents = "none";
  heart.style.transition = "all 1s ease";
  heart.style.zIndex = "1001";
  document.body.appendChild(heart);

  // Animate the heart
  setTimeout(() => {
    heart.style.transform = "translateY(-100px) scale(1.5)";
    heart.style.opacity = "0";
  }, 50);

  // Remove the heart after animation
  setTimeout(() => {
    document.body.removeChild(heart);
  }, 1000);

  // Highlight the clicked affirmation
  this.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  setTimeout(() => {
    this.style.backgroundColor = "transparent";
  }, 500);
}

// Modal functions for "Before You Go" and "Final Message"
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";

  // Update toggle button if it exists
  const toggleId = modalId.replace("Page", "Toggle");
  const toggleBtn = document.getElementById(toggleId);
  if (toggleBtn) {
    toggleBtn.style.backgroundColor = "rgba(255, 154, 158, 0.8)";
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = "auto";

  // Reset toggle button if it exists
  const toggleId = modalId.replace("Page", "Toggle");
  const toggleBtn = document.getElementById(toggleId);
  if (toggleBtn) {
    toggleBtn.style.backgroundColor = "";
  }
}

// Set up all event listeners
function setupEventListeners() {
  // Start button
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.addEventListener("click", function () {
      playBackgroundMusic();
      startAnimation();
    });
  }

  // Back to home button
  const backToHome = document.getElementById("backToHome");
  if (backToHome) {
    backToHome.addEventListener("click", hideAffirmations);
  }

  // Show Affirmation buttons
  document.querySelectorAll(".show-affirmation-btn").forEach((button) => {
    button.addEventListener("click", showAffirmations);
  });

  // Affirmation toggle
  const affirmationToggle = document.getElementById("affirmationToggle");
  if (affirmationToggle) {
    affirmationToggle.addEventListener("click", function () {
      const affirmationPage = document.getElementById("affirmationPage");
      if (!affirmationPage) return;

      if (
        affirmationPage.style.display === "none" ||
        affirmationPage.style.display === ""
      ) {
        showAffirmations();
      } else {
        hideAffirmations();
      }
    });
  }

  // Before You Go toggle
  const beforeYouGoToggle = document.getElementById("beforeYouGoToggle");
  if (beforeYouGoToggle) {
    beforeYouGoToggle.addEventListener("click", function () {
      showModal("beforeYouGoPage");
    });
  }

  // Final Message toggle
  const finalMessageToggle = document.getElementById("finalMessageToggle");
  if (finalMessageToggle) {
    finalMessageToggle.addEventListener("click", function () {
      showModal("finalMessagePage");
    });
  }

  // Back buttons in modals
  document.querySelectorAll(".back-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const parentModal = this.closest(".modal-page");
      if (parentModal) {
        hideModal(parentModal.id);
      }
    });
  });

  console.log("Setting up flip card event listeners");
  const flipCards = document.querySelectorAll('.flip-card');
  console.log(`Found ${flipCards.length} flip cards`);
  
  flipCards.forEach((card, index) => {
    // Remove existing listeners to avoid duplicates
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);
    
    // Add click event listener
    newCard.addEventListener('click', function(event) {
      console.log(`Flip card ${index} clicked`);
      this.classList.toggle('flipped');
      
      // Prevent event from bubbling up to parent elements
      event.stopPropagation();
    });
    
    // Also add click event to inner elements to ensure clicks work everywhere on the card
    const innerElements = newCard.querySelectorAll('.flip-card-inner, .flip-card-front, .flip-card-back');
    innerElements.forEach(element => {
      element.addEventListener('click', function(event) {
        console.log(`Inner element of flip card ${index} clicked`);
        newCard.classList.toggle('flipped');
        
        // Prevent event from bubbling up
        event.stopPropagation();
      });
    });
  });
  
  // ... rest of existing code ...
}

// Make sure the CSS for flip cards is properly applied
function ensureFlipCardCSS() {
  console.log("Ensuring flip card CSS is properly applied");
  
  // Check if the style already exists
  if (!document.getElementById('flip-card-fix-style')) {
    const style = document.createElement('style');
    style.id = 'flip-card-fix-style';
    style.textContent = `
      .flip-card {
        perspective: 1000px;
        cursor: pointer;
      }
      
      .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.8s;
        transform-style: preserve-3d;
      }
      
      .flip-card.flipped .flip-card-inner {
        transform: rotateY(180deg);
      }
      
      .flip-card-front, .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      
      .flip-card-back {
        transform: rotateY(180deg);
      }
    `;
    document.head.appendChild(style);
    console.log("Added flip card CSS fix");
  }
}

// Call this function after the animation completes and elements are shown
function fixFlipCards() {
  console.log("Fixing flip cards");
  
  // Ensure CSS is properly applied
  ensureFlipCardCSS();
  
  // Set up event listeners for flip cards
  setupEventListeners();
  
  // Force a reflow to ensure CSS is applied
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    void card.offsetWidth;
  });
  
  console.log("Flip cards fixed");
}

// Set up swipe detection for mobile devices
function setupSwipeDetection() {
  let touchStartX = 0;
  let touchEndX = 0;

  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    false
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < swipeThreshold) return; // Not a significant swipe

    if (swipeDistance < 0) {
      // Swipe left - go to next card
      carousel.scrollBy({ left: window.innerWidth * 0.9, behavior: "smooth" });
    } else {
      // Swipe right - go to previous card
      carousel.scrollBy({ left: -window.innerWidth * 0.9, behavior: "smooth" });
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  // Create elements if they don't exist
  if (!document.getElementById("introAnimation")) {
    const introAnimation = document.createElement("div");
    introAnimation.id = "introAnimation";
    introAnimation.className = "intro-animation";

    const introText = document.createElement("div");
    introText.id = "introText";
    introText.textContent = "Welcome to my friendship certificate!";

    introAnimation.appendChild(introText);
    document.body.appendChild(introAnimation);

    // Add a start button if it doesn't exist
    if (!document.getElementById("startButton")) {
      const startButton = document.createElement("button");
      startButton.id = "startButton";
      startButton.textContent = "Start";
      startButton.style.position = "fixed";
      startButton.style.top = "50%";
      startButton.style.left = "50%";
      startButton.style.transform = "translate(-50%, -50%)";
      startButton.style.zIndex = "1001";
      startButton.style.padding = "10px 20px";
      startButton.style.fontSize = "18px";
      startButton.style.cursor = "pointer";

      document.body.appendChild(startButton);

      startButton.addEventListener("click", startAnimation);
    }
  }

  // Add essential CSS
  if (!document.getElementById("essentialAnimationCSS")) {
    const style = document.createElement("style");
    style.id = "essentialAnimationCSS";
    style.textContent = `
        #introAnimation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        
        #introAnimation.active {
          opacity: 1;
          pointer-events: all;
        }
        
        #introText {
          font-size: 2.5rem;
          color: white;
          text-align: center;
          max-width: 80%;
          padding: 2rem;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        #introText span {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
      `;
    document.head.appendChild(style);
  }

  // Simple animation function
  function startAnimation() {
    const startButton = document.getElementById("startButton");
    if (startButton) startButton.style.display = "none";

    const introAnimation = document.getElementById("introAnimation");
    introAnimation.classList.add("active");

    const introText = document.getElementById("introText");
    const text = introText.textContent;
    introText.innerHTML = "";

    // Add each character with a delay
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement("span");

      if (text[i] === " ") {
        span.innerHTML = "&nbsp;";
      } else {
        span.textContent = text[i];
      }

      span.style.transitionDelay = `${i * 0.1}s`;
      introText.appendChild(span);
    }

    // Start the animation
    setTimeout(() => {
      const spans = introText.querySelectorAll("span");
      spans.forEach((span) => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      });

      // End the animation after all characters are displayed
      setTimeout(() => {
        introAnimation.classList.remove("active");
        // Show your main content here
      }, text.length * 100 + 2000);
    }, 1000);
  }

  // If you want to start automatically
  // setTimeout(startAnimation, 1000);
});

// Add this function to your script
function ensureAnimationStyles() {
  if (!document.getElementById('essential-animations')) {
    const style = document.createElement('style');
    style.id = 'essential-animations';
    style.textContent = `
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInRight {
        0% { opacity: 0; transform: translateX(-30px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes popIn {
        0% { opacity: 0; transform: scale(0.5); }
        70% { transform: scale(1.1); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes shimmer {
        0% { text-shadow: 0 0 0 rgba(255,255,255,0); }
        50% { text-shadow: 0 0 10px rgba(255,255,255,0.8); }
        100% { text-shadow: 0 0 0 rgba(255,255,255,0); }
      }
      
      .intro-animation {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      
      .intro-animation.active {
        opacity: 1;
      }
      
      #introText {
        font-size: 2rem;
        color: white;
        text-align: center;
        max-width: 80%;
        padding: 2rem;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
      }
    `;
    document.head.appendChild(style);
  }
}

// Call this function before starting the animation
ensureAnimationStyles();


function startVisibleAnimation() {
  // Hide the start button
  const startButton = document.getElementById('startButton');
  if (startButton) startButton.style.display = 'none';
  
  // Get the animation container
  const introAnimation = document.getElementById('introAnimation');
  if (!introAnimation) return;
  
  // Force visibility
  introAnimation.style.display = 'flex';
  introAnimation.style.opacity = '1';
  introAnimation.classList.add('active');
  
  // Get the text container
  const introText = document.getElementById('introText');
  if (!introText) return;
  
  // Get the text
  const text = introText.textContent || "This certificate is presented to the most beautiful girl";
  
  // Clear the container
  introText.innerHTML = '';
  
  // Create a visible container
  const visibleContainer = document.createElement('div');
  visibleContainer.style.color = 'white';
  visibleContainer.style.fontSize = '30%';
  visibleContainer.style.textAlign = 'center';
  visibleContainer.style.width = '100%';
  visibleContainer.style.visibility = 'visible';
  visibleContainer.style.opacity = '1';
  introText.appendChild(visibleContainer);
  
  // Split text into individual characters
  const characters = text.split('');
  
  if (!window.audioContext) {
    try {
      window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log("Web Audio API not supported");
    }
  }
  // Add each character with a pop animation

  characters.forEach((char, index) => {
    const charSpan = document.createElement('span');
    
    // Handle spaces specially
    if (char === ' ') {
      charSpan.innerHTML = '&nbsp;';
    } else {
      charSpan.textContent = char;
      
      // Schedule typing sound for this character
      // Use setTimeout to match the animation delay
      setTimeout(() => {
        // Only play sound for some characters to avoid sound overload
        if (Math.random() > 0.6) {
          playTypingSound();
        }
      }, index * 50); // Match timing with animation delay
    }
    
    // Style the character
    charSpan.style.display = 'inline-block';
    charSpan.style.opacity = '0';
    charSpan.style.color = 'white';
    charSpan.style.fontSize = 'inherit';
    charSpan.style.animation = 'popIn 0.5s forwards';
    
    // Delay each character's animation
    charSpan.style.animationDelay = `${index * 0.05}s`;
    
    // Add to container
    visibleContainer.appendChild(charSpan);
    // If this is the last character, prepare for transition out
    if (index === characters.length - 1) {
      const totalAnimationTime = characters.length * 0.05 + 0.5; // in seconds
      
      setTimeout(() => {
        // Add shimmer effect to all characters
        const allChars = visibleContainer.querySelectorAll('span');
        allChars.forEach(char => {
          char.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
          char.style.transition = 'text-shadow 1s ease-in-out alternate infinite';
        });
        
        // Wait for shimmer effect to be visible
        setTimeout(() => {
          // Fade out the intro animation
          introAnimation.style.transition = 'opacity 1s ease';
          introAnimation.style.opacity = '0';
          
          // After fade-out completes, show main content AND play music
          setTimeout(() => {
            introAnimation.style.display = 'none';
            createConfetti();
            showAllElements();
            
            // Play background music after animation completes
            playBackgroundMusic();
            
            // Fix flip cards
            setTimeout(fixFlipCards, 500);
          }, 1000);
        }, 2000);
      }, Math.max(1500, totalAnimationTime * 1000));
    }
  });
}



 //Replace your current animation function with this one
window.startEnhancedAnimation = startVisibleAnimation;

// Particle background for intro animation
function initParticles() {
  // Check if canvas already exists
  if (document.getElementById("particleCanvas")) return;

  // Create canvas element
  const canvas = document.createElement("canvas");
  canvas.id = "particleCanvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "-1";

  // Add canvas to intro animation container
  const introAnimation = document.getElementById("introAnimation");
  if (introAnimation) {
    introAnimation.appendChild(canvas);
  } else {
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Particle settings
  const particleCount = 100;
  const particles = [];

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
    });
  }

  // Animation loop
  function animate() {
    // Only run animation if intro is active
    if (
      !document.getElementById("introAnimation")?.classList.contains("active")
    ) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      // Move particles
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// Play typing sound effect
function playTypingSound() {
  // Create audio context only when needed (to comply with browser autoplay policies)
  if (!window.audioContext) {
    try {
      window.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    } catch (e) {
      console.log("Web Audio API not supported");
      return;
    }
  }

  // Create a simple oscillator for a typing sound
  const oscillator = window.audioContext.createOscillator();
  const gainNode = window.audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 800 + Math.random() * 500; // Random frequency for variation
  gainNode.gain.value = 0.05; // Very low volume

  oscillator.connect(gainNode);
  gainNode.connect(window.audioContext.destination);

  // Very short duration
  oscillator.start();

  // Quick fade out
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    window.audioContext.currentTime + 0.05
  );

  // Stop after 50ms
  setTimeout(() => {
    oscillator.stop();
  }, 50);
}

// Create confetti effect for transitions
function createConfetti() {
  const confettiCount = 200;
  const container = document.body;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    // Random properties
    const size = Math.random() * 10 + 5;
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.background = color;
    confetti.style.position = "fixed";
    confetti.style.top = "-10px";
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.opacity = Math.random();
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.zIndex = "1000";

    // Animation
    const animationDuration = Math.random() * 3 + 2;
    confetti.style.animation = `confettiFall ${animationDuration}s linear forwards`;

    container.appendChild(confetti);

    // Remove after animation
    setTimeout(() => {
      if (container.contains(confetti)) {
        container.removeChild(confetti);
      }
    }, animationDuration * 1000);
  }

  // Add confetti animation style if it doesn't exist
  if (!document.getElementById("confettiStyle")) {
    const style = document.createElement("style");
    style.id = "confettiStyle";
    style.textContent = `
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `;
    document.head.appendChild(style);
  }
}

// Add animation styles for enhanced intro
function addAnimationStyles() {
  // Check if styles already exist
  if (document.getElementById("enhancedAnimationStyles")) return;

  const style = document.createElement("style");
  style.id = "enhancedAnimationStyles";
  style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes popIn {
        0% { opacity: 0; transform: scale(0.5); }
        70% { transform: scale(1.1); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes shimmer {
        0% { text-shadow: 0 0 0 rgba(255,255,255,0); }
        50% { text-shadow: 0 0 10px rgba(255,255,255,0.8); }
        100% { text-shadow: 0 0 0 rgba(255,255,255,0); }
      }
      
      .intro-animation {
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
      }
      
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
  document.head.appendChild(style);
}


function initEnhancedAnimations() {
  addAnimationStyles();
  
  // Replace the standard animation with enhanced version
  const startButton = document.getElementById('startButton');
  if (startButton) {
    // Remove existing event listeners
    const newButton = startButton.cloneNode(true);
    startButton.parentNode.replaceChild(newButton, startButton);
    
    // Add new event listener with enhanced animation
    // IMPORTANT: Removed playBackgroundMusic() from here
    newButton.addEventListener('click', function() {
      // Don't play music here anymore
      // playBackgroundMusic(); <- REMOVE THIS LINE
      startVisibleAnimation();
    });
  }
}


// Call this function to enable the enhanced animations
initEnhancedAnimations();
// Add to your script.js file

// Initialize the moments gallery
function initMomentsGallery() {
  // Create the photo data
  const photoMemories = [
    {
      src: "photo1.jpg", // Replace with your actual photo paths
      caption: "First day we met!",
      note: "I was so nervous that day, but you made me feel comfortable right away. Little did I know this would be the start of an amazing friendship.",
      rotation: -5
    },
    {
      src: "photo2.jpg",
      caption: "That summer adventure",
      note: "Remember how we got lost and found that amazing hidden spot? Sometimes getting lost leads to the best discoveries, especially with you!",
      rotation: 3
    },
    {
      src: "photo3.jpg",
      caption: "Birthday surprise!",
      note: "Your face when you saw the surprise party was priceless! Planning it was so worth it just to see your reaction.",
      rotation: -2
    },
    {
      src: "photo4.jpg",
      caption: "Coffee & deep talks",
      note: "This simple coffee date turned into hours of conversation about life, dreams, and everything in between. I treasure these moments.",
      rotation: 4
    },
    {
      src: "photo5.jpg",
      caption: "Laughing until it hurt",
      note: "I don't even remember what was so funny, but I do remember my stomach hurting from laughing so much. You always know how to make me smile.",
      rotation: -3
    }
    // Add more photos as needed
  ];
  
  // Add photos to the gallery
  createPolaroids(photoMemories);
  
  // Set up event listeners
  setupGalleryEvents();
}

// Create polaroid elements
function createPolaroids(photos) {
  const container = document.querySelector('.polaroid-container');
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Add each photo as a polaroid
  photos.forEach((photo, index) => {
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';
    polaroid.style.setProperty('--rotation', `${photo.rotation}deg`);
    
    polaroid.innerHTML = `
      <img src="${photo.src}" alt="Memory ${index + 1}">
      <div class="caption">${photo.caption}</div>
    `;
    
    // Store the memory note as a data attribute
    polaroid.dataset.note = photo.note;
    polaroid.dataset.index = index;
    
    // Add click event to show expanded view
    polaroid.addEventListener('click', function() {
      showExpandedPhoto(photo.src, photo.note);
    });
    
    container.appendChild(polaroid);
  });
}

// Show expanded photo with memory note
function showExpandedPhoto(src, note) {
  // Check if expanded photo container exists, create if not
  let expandedPhoto = document.querySelector('.expanded-photo');
  
  if (!expandedPhoto) {
    expandedPhoto = document.createElement('div');
    expandedPhoto.className = 'expanded-photo';
    
    expandedPhoto.innerHTML = `
      <div class="expanded-photo-content">
        <button class="close-expanded">&times;</button>
        <img src="" alt="Expanded memory">
        <p class="memory-note"></p>
      </div>
    `;
    
    document.body.appendChild(expandedPhoto);
    
    // Add close button event
    expandedPhoto.querySelector('.close-expanded').addEventListener('click', function() {
      expandedPhoto.classList.remove('active');
    });
  }
  
  // Set the image and note
  expandedPhoto.querySelector('img').src = src;
  expandedPhoto.querySelector('.memory-note').textContent = note;
  
  // Show the expanded photo
  expandedPhoto.classList.add('active');
}

// Set up gallery events
function setupGalleryEvents() {
  // Toggle button for showing the gallery
  const momentsToggle = document.getElementById('momentsToggle');
  const momentsGallery = document.getElementById('momentsGallery');
  
  if (momentsToggle && momentsGallery) {
    momentsToggle.addEventListener('click', function() {
      momentsGallery.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  }
  
  // Back button
  const backButton = momentsGallery?.querySelector('.back-btn');
  if (backButton) {
    backButton.addEventListener('click', function() {
      momentsGallery.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }
}

// Make sure the moments toggle is shown with other elements
function updateShowAllElements() {
  const originalShowAllElements = window.showAllElements;
  window.showAllElements = function() {
    originalShowAllElements();
    
    // Show the moments toggle button
    const momentsToggle = document.getElementById('momentsToggle');
    if (momentsToggle) {
      momentsToggle.style.display = 'block';
    }
  };
}

// Initialize the feature
document.addEventListener('DOMContentLoaded', function() {
  // Moments Gallery Toggle
  const momentsToggle = document.getElementById('momentsToggle');
  const momentsGallery = document.getElementById('momentsGallery');
  
  if (momentsToggle && momentsGallery) {
    momentsToggle.addEventListener('click', function() {
      console.log('Opening moments gallery');
      momentsGallery.style.display = 'flex';
    });
    
    // Back button functionality
    const backButtons = momentsGallery.querySelectorAll('.back-btn');
    backButtons.forEach(button => {
      button.addEventListener('click', function() {
        momentsGallery.style.display = 'none';
      });
    });
  } else {
    console.error('Moments gallery elements not found');
  }
});

// Function to expand images when clicked
function expandImage(element) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('expandedImage');
  const captionText = document.getElementById('modalCaption');
  
  modal.style.display = "block";
  modalImg.src = element.querySelector('img').src;
  captionText.innerHTML = element.querySelector('.caption').innerHTML;
  
  // Close the modal when the × is clicked
  const closeBtn = document.getElementsByClassName('close-modal')[0];
  closeBtn.onclick = function() {
    modal.style.display = "none";
  }
  
  // Also close when clicking outside the image
  modal.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
}

// Add event listener for ESC key to close modal
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    const modal = document.getElementById('imageModal');
    if (modal.style.display === "block") {
      modal.style.display = "none";
    }
  }
});

