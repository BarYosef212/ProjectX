function openDialog() {
    const dialog = document.getElementById('dialog');
    if (dialog) {
        dialog.style.display = 'block'; 
        dialog.classList.add('jump'); 
    }
}

function closeDialog() {
    const dialog = document.getElementById('dialog');
    if (dialog) {
        dialog.style.display = 'none'; 
        dialog.classList.remove('jump'); 
    }
}

const cartIcon = document.querySelector('.cart');
const cartWindow = document.querySelector('.cart-window');

// Toggle on click
cartIcon.addEventListener('click', function(event) {
    event.preventDefault();
    cartWindow.classList.toggle('show');
});

// Show on hover
cartIcon.addEventListener('mouseenter', function() {
    cartWindow.classList.add('show');
});

// Hide when the mouse leaves the cart window
cartWindow.addEventListener('mouseleave', function() {
    cartWindow.classList.remove('show');
});

async function login(event) {
  event.preventDefault(); // Prevent form from submitting the traditional way
  try {
    const email = document.querySelector("#emailLogin").value;
    const password = document.querySelector("#passwordLogin").value;

    const data = {
      email,
      password,
    };

    const message = document.querySelector(".loginMessage");
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    console.log(result);
    if (response.ok) {
      message.style.display = "block";
      message.textContent = result.message;
      message.style.color = "green";
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      message.style.display = "block";
      message.textContent = result.message;
      message.style.color = "red";
    }
  } catch (error) {
    console.log(error);
  }
}


