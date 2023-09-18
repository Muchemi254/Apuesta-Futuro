// JavaScript redirect to mobile version if screen width is less than a certain value
function redirectMobile() {
    if (window.innerWidth < 450) {
      window.location.href = "mobile/mobile-index.html";
    }
  }
  
  // Call the redirectMobile function when the page loads
  redirectMobile();
  
  // Listen for the resize event and call redirectMobile when the screen size changes
window.addEventListener('resize', redirectMobile);



//swiper
function initializeSwiper() {
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    autoplay: {
      delay:2000,
      disableOnInteraction:false,
    },

    loop: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
}

// Call the function to initialize the swiper
initializeSwiper();



// chat box UI
function initializePage() {
  // Initialize the swiper
  const swiper = new Swiper('.swiper', {
    // Swiper options here
  });

  let isChatOpen = false; // Add a flag to track chat box state

  // Function to open the chat box
  function openChatPopup() {
    $(".chat-popup").slideDown("fast", function () {
      isChatOpen = true;
    });
  }

  // Function to close the chat box
  function closeChatPopup() {
    $(".chat-popup").slideUp("fast", function () {
      isChatOpen = false;
    });
  }

  // Click event for the chat button
  $(".chat-btn").click(() => {
    if (!isChatOpen) {
      openChatPopup(); // Open the chat box if it's closed
    } else {
      closeChatPopup(); // Close the chat box if it's open
    }
  });

  // Click event for closing the chat box when clicking outside of it
  $(document).on("click", function (event) {
    const chatPopup = $(".chat-popup");
    const chatBtn = $(".chat-btn");

    if (isChatOpen && !chatPopup.is(event.target) && chatPopup.has(event.target).length === 0 && !chatBtn.is(event.target)) {
      closeChatPopup(); // Close the chat box if clicked outside and it's open
    }
  });

  // Load chatbox.html content into the popup div
  $(".chat-popup").load("/chatbox/chatbox.html", () => {
    // Initialize any necessary scripts or event handlers for the loaded content
  });
}

// Call the function when the document is ready
$(document).ready(() => {
  initializePage();
});
