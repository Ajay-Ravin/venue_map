// script.js

const map = document.getElementById('venue-map');
let scale = 1;  // Initial zoom scale
let isDragging = false;  // To track if the map is being dragged
let startX, startY;  // Variables to track mouse position

// For mobile: Pinch-to-zoom
let initialDistance = null;

// Zoom In and Out using Mouse Wheel (Desktop)
map.addEventListener('wheel', (event) => {
    event.preventDefault();  // Prevent page scroll

    // Zoom in or out
    if (event.deltaY < 0) {
        scale += 0.1;  // Zoom in
    } else {
        scale -= 0.1;  // Zoom out
    }

    // Set limits for zooming
    scale = Math.min(Math.max(scale, 0.5), 3);  // Zoom limit: 50% to 300%

    // Apply the zoom with smooth transition
    map.style.transform = `scale(${scale})`;
});

// Pinch-to-zoom (for touch devices)
map.addEventListener('touchstart', (event) => {
    if (event.touches.length === 2) {
        initialDistance = getDistanceBetweenTouches(event);
    }
});

map.addEventListener('touchmove', (event) => {
    if (event.touches.length === 2 && initialDistance !== null) {
        const newDistance = getDistanceBetweenTouches(event);
        const scaleChange = newDistance / initialDistance;

        scale *= scaleChange;  // Adjust the zoom scale based on pinch gesture
        scale = Math.min(Math.max(scale, 0.5), 3);  // Zoom limit: 50% to 300%

        // Apply the zoom with smooth transition
        map.style.transform = `scale(${scale})`;

        // Update initial distance for next move event
        initialDistance = newDistance;
    }
});

map.addEventListener('touchend', () => {
    initialDistance = null;  // Reset pinch distance when fingers are lifted
});

// Function to calculate the distance between two touch points
function getDistanceBetweenTouches(event) {
    const x = event.touches[0].pageX - event.touches[1].pageX;
    const y = event.touches[0].pageY - event.touches[1].pageY;
    return Math.sqrt(x * x + y * y);
}

// Pan with Mouse Drag (for both desktop and mobile)
map.addEventListener('mousedown', (event) => {
    isDragging = true;  // Start dragging
    startX = event.pageX - map.offsetLeft;
    startY = event.pageY - map.offsetTop;
    map.style.cursor = 'grabbing';  // Change cursor while dragging
});

map.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const x = event.pageX - startX;
        const y = event.pageY - startY;
        map.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;  // Apply panning
    }
});

map.addEventListener('mouseup', () => {
    isDragging = false;  // Stop dragging
    map.style.cursor = 'grab';  // Reset cursor after dragging
});

map.addEventListener('mouseleave', () => {
    isDragging = false;  // Stop dragging if mouse leaves the image
});

// Mobile pan (touch drag)
map.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
        startX = event.touches[0].pageX - map.offsetLeft;
        startY = event.touches[0].pageY - map.offsetTop;
    }
});

map.addEventListener('touchmove', (event) => {
    if (event.touches.length === 1 && isDragging) {
        const x = event.touches[0].pageX - startX;
        const y = event.touches[0].pageY - startY;
        map.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;  // Apply panning
    }
});

map.addEventListener('touchend', () => {
    isDragging = false;
});