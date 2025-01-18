### Frontend Challenge 1: File-based Routing

- **Decription**  
Build a simple website with multiple HTML files that link to each other and deploy it on Arweave.
- **Why?**  
This is the easiest way to build a website and fits Arweave’s permanent storage model, and AR.IO gateways can’t execute server-side code. Use it for very simple websites when additional tooling would create too much overhead.
- **Tools**  
Dragondeploy, etc.

###index.html

- **html Code**
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Game - Home</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-image: url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.8hF1NHa_99Cgl7YeLENECQHaE8%26pid%3DApi&f=1&ipt=0b7165054e92f7e16f228ef660040b0aa6e8df9bdf41d90d1d1b198866644241&ipo=images');
            background-size: cover;
            color: #000000;
        }
        .btn {
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            background-color: #4CAF50;
            color: #00116a;
            border: none;
        }
        .btn:hover {
            background-color: #45a049;
        }
        audio {
            display: none;
        }
    </style>
</head>
<body>
    <h1>Welcome to $AR Mini Game!</h1>
    <p>Click the button to start the game:</p>
    <a href="level1.html"><button class="btn">Start Game</button></a>
    <p>credit:</p>
    <a href="about.html"><button class="btn">About US</button></a>
    
    <!-- Retro Music -->
    <audio controls autoplay>
        <source src="%F0%9F%8E%AE%F0%9F%91%BE%20Retro%20Video%20Game%20Arcade%208%20Bit%20[Sound%20Effects]%20Free%20Download%20Audio%20Background%20for%20Edits.mp3" type="audio/mpeg"> 
        Your browser does not support the audio element.
    </audio>
</body>
</html>

###level1.html

- **html Code**
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JUST CLICK - Level 1</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-image: url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fidbwtqzu00ux.jpg&f=1&nofb=1&ipt=f8ac2199ff7e2ddaa3b6412902ca4e55a35f4ca477e19079014bb450ccae700e&ipo=images'); /* Replace with your image URL */
            background-size: cover;
            color: #f0de00;
        }
        .btn {
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            background-color: #4CAF50;
            color: #000000;
            border: none;
        }
        .btn:hover {
            background-color: #45a049;
        }
        audio {
            display: none;
        }
    </style>
</head>
<body>
    <h1>Level 1: You WOn 20 $AR, Find more $AR!</h1>
    <p>Click the button below to go to the next level:</p>
    <a href="level2.html"><button class="btn">Go to Level 2</button></a>
    
    <!-- Retro Music -->
    <audio controls autoplay>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3"> <!-- Replace with your music URL -->
        Your browser does not support the audio element.
    </audio>
</body>
</html>


###level2.html

- **html Code**
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FIND BUTTON - Level 2</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-image: url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fhips.hearstapps.com%2Fhmg-prod%2Fimages%2Frays-of-sunlight-into-the-underwater-cave-royalty-free-image-1665512420.jpg%3Fresize%3D1200%3A*&f=1&nofb=1&ipt=54d0b686cf21594d5aa4655c22dc502afb7dd80013f60d2c87c9787298f7bb25&ipo=images'); /* Replace with your image URL */
            background-size: cover;
            color: #640101;
        }
        .btn {
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            background-color: #640101;
            color: #0b54ff;
            border: none;
        }
        .btn:hover {
            background-color: #45a049;
        }
        audio {
            display: none;
        }
    </style>
</head>
<body>
    <h1>Level 2: Congratulations, You Won 50 $AR!</h1>
    <p>You have completed the game!</p>
    <a href="index.html"><button class="btn">Return to Home</button></a>
    <p>credit:</p>
    <a href="about.html"><button class="btn">About US</button></a>

    <!-- Retro Music -->
    <audio autoplay loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3"> <!-- Replace with your music URL -->
        Your browser does not support the audio element.
    </audio>
</body>
</html>


###about.html

- **html Code**
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Credits</title>
    <!-- Font Awesome CDN for social media icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f0f0f0;
            color: #333;
        }
        h1 {
            color: #4CAF50;
        }
        .social-icons {
            margin: 20px 0;
        }
        .social-icons a {
            margin: 0 15px;
            text-decoration: none;
            font-size: 40px;
            color: #333;
        }
        .social-icons a:hover {
            color: #4CAF50;
        }
        .btn {
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            border: none;
            margin-top: 30px;
        }
        .btn:hover {
            background-color: #45a049;
        }

        /* Running credits section */
        .credits-container {
            width: 100%;
            overflow: hidden;
            background-color: #333;
            color: white;
            margin-top: 50px;
            padding: 20px 0;
        }
        .credits-text {
            display: inline-block;
            white-space: nowrap;
            animation: scrollText 10s linear infinite;
            font-size: 20px;
            padding-left: 100%;
        }
        @keyframes scrollText {
            0% {
                transform: translateX(100%);
            }
            100% {
                transform: translateX(-100%);
            }
        }
    </style>
</head>
<body>
    <h1>About This Mini Game</h1>
    <p>Thank you for visiting! Connect with us on social media.</p>
    
    <!-- Social Media Icons -->
    <div class="social-icons">
        <a href="https://discord.com/invite/YGXJbuz44K" target="_blank"><i class="fab fa-discord"></i></a>
        <a href="https://x.com/ArweaveOasis" target="_blank"><i class="fab fa-twitter"></i></a>
        <a href="https://github.com/permaweb/ao" target="_blank"><i class="fab fa-github"></i></a>
    </div>

    <!-- Credits Section with Running Text -->
    <div class="credits-container">
        <div class="credits-text">
            <p>Credits: Developed by R3x & ARwaves Dev | Graphics by R3x | Music by Retro Music Creator | Special Thanks to All Supporters!</p>
        </div>
    </div>

    <a href="index.html"><button class="btn">Back to Home</button></a>

</body>
</html>
