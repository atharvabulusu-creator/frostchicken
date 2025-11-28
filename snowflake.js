// Snowflake effect - add to any page
function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.textContent = "❄";
    
    // Random horizontal position
    const randomX = Math.random() * window.innerWidth;
    snowflake.style.left = randomX + "px";
    
    // Random fall duration (3-8 seconds)
    const duration = Math.random() * 5 + 3;
    snowflake.style.animationDuration = duration + "s";
    
    // Random horizontal drift
    const drift = Math.random() * 200 - 100;
    snowflake.style.setProperty("--drift", drift + "px");
    
    document.body.appendChild(snowflake);
    
    // Remove snowflake after it falls
    setTimeout(() => {
        snowflake.remove();
    }, duration * 1000);
}

// Create snowflakes continuously
setInterval(createSnowflake, 300);
