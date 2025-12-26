
let slideIdx = 0;
const addons = ingredients.filter(i => i.type === 'addon'); // Bahan selain roti [cite: 92]
let userBurger = []; // Stack bahan yang dipilih

function init() {
    renderSlide();
    renderBurger();
}

// Navigasi Single Slide [cite: 81, 95]
function renderSlide() {
    const item = addons[slideIdx];
    document.getElementById('current-ing').innerHTML = `
            <div class="ing-display" data-id="${item.id}">
                <div>${item.name} - $${item.price}</div>
                <img src="${item.image}" alt="${item.name}" class="visual-item" />
            </div>
        `;
}

function changeSlide(n) {
    slideIdx = (slideIdx + n + addons.length) % addons.length;
    renderSlide();
}

// Drag and Drop Logic [cite: 94, 109]
function allowDrop(ev) { ev.preventDefault(); }

function dragNew(ev) {
    ev.dataTransfer.setData("type", "NEW");
    ev.dataTransfer.setData("id", addons[slideIdx].id);
}

function dragMove(ev, index) {
    ev.dataTransfer.setData("type", "MOVE");
    ev.dataTransfer.setData("index", index);
}

function dropToStack(ev) {
    ev.preventDefault();
    const type = ev.dataTransfer.getData("type");
    if (type === "NEW") {
        const id = parseInt(ev.dataTransfer.getData("id"));
        userBurger.push(id); // Posisi stack bertumpuk ke atas [cite: 111]
    }
    renderBurger();
}

function dropToDelete(ev) {
    ev.preventDefault();
    const type = ev.dataTransfer.getData("type");
    if (type === "MOVE") {
        const idx = ev.dataTransfer.getData("index");
        userBurger.splice(idx, 1); // Menghapus bahan [cite: 119]
    }
    renderBurger();
}

function renderBurger() {
    const area = document.getElementById('burger-area');
    const bottom = ingredients.find(i => i.id === 1);
    const top = ingredients.find(i => i.id === 7);

    // Render Roti Default (Tidak bisa di-drag) [cite: 110]
    let html = `<img class="layer fixed" src="${bottom.image}" alt="${bottom.name}" style="object-fit: contain; width: 160px; height: 25px;" />`;

    userBurger.forEach((ingId, idx) => {
        const item = ingredients.find(i => i.id === ingId);
        html += `<img class="layer" draggable="true" ondragstart="dragMove(event, ${idx})" src="${item.image}" alt="${item.name}" style="object-fit: contain; width: 160px; height: 25px;" />`;
    });

    html += `<img class="layer fixed" src="${top.image}" alt="${top.name}" style="object-fit: contain; width: 160px; height: 35px;" />`;
    area.innerHTML = html;
    updateDetail();
}

function updateDetail() {
    const detailDiv = document.getElementById('detail-view');
    let total = 2; // Dasar roti ($1 + $1)
    let rows = `<tr><td>Bottom Bread</td><td>$1</td></tr>`;

    userBurger.forEach(id => {
        const item = ingredients.find(i => i.id === id);
        total += item.price;
        rows += `<tr><td>${item.name}</td><td>$${item.price}</td></tr>`;
    });

    rows += `<tr><td>Top Bread</td><td>$1</td></tr>`;
    detailDiv.innerHTML = `<table>${rows}<tr class="total-row"><td>TOTAL</td><td>$${total}</td></tr></table>`;
}

function resetBurger() {
    userBurger = []; // Menghapus semua kecuali bahan default [cite: 114, 120]
    renderBurger();
}

function submitOrder() {
    const orderObj = {
        components: userBurger.map(id => ingredients.find(i => i.id === id)),
        totalPrice: userBurger.reduce((acc, id) => acc + ingredients.find(i => i.id === id).price, 2)
    };
    localStorage.setItem('burgerOrder', JSON.stringify(orderObj)); // Simpan data JSON [cite: 112]
    window.location.href = 'order.html'; // Redirect [cite: 112]
}

window.onload = init;