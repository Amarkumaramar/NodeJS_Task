const form = document.getElementById('upload-form');
const imageContainer = document.getElementById('image-container');
const downloadButton = document.getElementById('download-button');

let uploadedImage;

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const response = await fetch('/upload', { method: 'POST', body: formData });
    const data = await response.json();
    if (data.filePath) {
        uploadedImage = new Image();
        uploadedImage.src = data.filePath;
        uploadedImage.onload = () => {
            imageContainer.innerHTML = '';
            imageContainer.appendChild(uploadedImage);
            downloadButton.style.display = 'block';
        };
    }
});

imageContainer.addEventListener('click', (event) => {
    if (!uploadedImage) return;

    const rect = imageContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.textContent = prompt('Enter annotation:', 'Annotation');
    popup.draggable = true;

    popup.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', null);
        e.dataTransfer.effectAllowed = 'move';
    });

    popup.addEventListener('dragend', (e) => {
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;
        popup.style.left = `${newX}px`;
        popup.style.top = `${newY}px`;
    });

    imageContainer.appendChild(popup);
});

downloadButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;

    ctx.drawImage(uploadedImage, 0, 0);
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        const x = parseInt(popup.style.left);
        const y = parseInt(popup.style.top);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(x, y, popup.offsetWidth, popup.offsetHeight);
        ctx.strokeRect(x, y, popup.offsetWidth, popup.offsetHeight);
        ctx.fillStyle = '#000';
        ctx.fillText(popup.textContent, x + 5, y + 15);
    });

    const link = document.createElement('a');
    link.download = 'modified-image.png';
    link.href = canvas.toDataURL();
    link.click();
});
