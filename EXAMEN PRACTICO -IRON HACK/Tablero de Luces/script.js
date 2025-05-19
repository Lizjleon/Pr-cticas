const gridContainer = document.getElementById('grid-container');
const lightCount = document.getElementById('light-count');
const turnOnAllButton = document.getElementById('turn-on-all');
const turnOffAllButton = document.getElementById('turn-off-all');
const toggleAllButton = document.getElementById('toggle-all');

let lightsOn = 0;

for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => {
        cell.classList.toggle('on');
        updateLightCount();
    });
    gridContainer.appendChild(cell);
}

const countElement = document.getElementById("count");

function updateLightCount() {
    const lightCount = document.querySelectorAll(".cell.on").length;
    countElement.textContent = lightCount;

    countElement.classList.add("active");

    setTimeout(() => {
        countElement.classList.remove("active");
    }, 300);
}

function addGlowEffect(button) {
    button.classList.add('glow');
    setTimeout(() => {
        button.classList.remove('glow');
    }, 300); 
}

turnOnAllButton.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.add('on'));
    updateLightCount();
    addGlowEffect(turnOnAllButton);
});

turnOffAllButton.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('on'));
    updateLightCount();
    addGlowEffect(turnOffAllButton);
});

toggleAllButton.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.toggle('on'));
    updateLightCount();
    addGlowEffect(toggleAllButton);
});
