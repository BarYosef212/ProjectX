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

function submitForm(event) {
    event.preventDefault(); // Prevent form submission
    const userName = document.getElementById('user-name').value;
    const userPassword = document.getElementById('password').value;

    if (userName && userPassword) {
        localStorage.setItem('UserName', userName);
        localStorage.setItem('Password', userPassword);
        // You can redirect or perform another action here
    } else {
        alert('Please fill in both the username and password.');
    }
}

// Event listeners
document.getElementById('user-form').addEventListener('submit', submitForm);
document.querySelector('.close').addEventListener('click', closeDialog);