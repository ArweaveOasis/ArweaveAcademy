const routes = {
    home: {
        title: 'Welcome to Hash-Based SPA',
        content: `
            <h1>Welcome to Hash-Based SPA</h1>
            <p>This is a simple Single Page Application using hash-based routing.</p>
            <p>Click on the navigation links to explore different pages without reloading.</p>
        `
    },
    about: {
        title: 'About Us',
        content: `
            <h1>About Us</h1>
            <p>We are a team passionate about creating simple, efficient web applications.</p>
            <p>This SPA demonstrates the power of client-side routing using hash-based navigation.</p>
        `
    },
    contact: {
        title: 'Contact Us',
        content: `
            <h1>Contact Us</h1>
            <p>Get in touch with us:</p>
            <form id="contact-form">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <textarea placeholder="Your Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        `
    }
};

function router() {
    let hash = window.location.hash.slice(1) || 'home';
    const app = document.getElementById('app');
    const route = routes[hash] || routes.home;

    document.title = route.title;
    app.innerHTML = route.content;

    // Add active class to current nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${hash}`);
    });

    // Add event listener for contact form
    if (hash === 'contact') {
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Message sent! (This is a demo, no actual message was sent)');
        });
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);