// Fungsi untuk memuat konten berdasarkan hash URL
function loadContent() {
    const content = document.getElementById('content');
    const hash = window.location.hash;

    switch (hash) {
        case '#home':
            content.innerHTML = '<h2>Welcome to the Home Page</h2><p>This is the homepage content.</p>';
            break;
        case '#about':
            content.innerHTML = '<h2>About Us</h2><p>This is the about page content.</p>';
            break;
        case '#contact':
            content.innerHTML = '<h2>Contact Us</h2><p>This is the contact page content.</p>';
            break;
        default:
            content.innerHTML = '<h2>Welcome to our site</h2><p>Please select a page from the menu above.</p>';
            break;
    }
}

// Tambahkan event listener untuk menangani perubahan hash
window.addEventListener('hashchange', loadContent);

// Load konten pertama kali saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadContent);
