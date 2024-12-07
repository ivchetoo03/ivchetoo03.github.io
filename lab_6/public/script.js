let menuData = [];

function addMenuItem() {
    const menuItem = document.getElementById('menuItem').value;
    const subItem = document.getElementById('subItem').value;
    const link = document.getElementById('link').value;

    if (!menuItem || !subItem || !link) {
        alert('Заповніть всі поля!');
        return;
    }

    let existingMenu = menuData.find(item => item.name === menuItem);
    if (!existingMenu) {
        existingMenu = { name: menuItem, subItems: [] };
        menuData.push(existingMenu);
    }

    existingMenu.subItems.push({ name: subItem, link });
    renderMenu();
}

function renderMenu() {
    const menu = document.getElementById('menuContainer');
    menu.innerHTML = '';
    menuData.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;

        const ul = document.createElement('ul');
        item.subItems.forEach(sub => {
            const subLi = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = sub.name;
            a.href = sub.link;
            subLi.appendChild(a);
            ul.appendChild(subLi);
        });

        li.appendChild(ul);
        menu.appendChild(li);
    });
}

async function saveMenu() {
    const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
    });

    if (response.ok) {
        alert('Меню збережено!');
    } else {
        alert('Помилка збереження!');
    }
}

async function fetchMenu() {
    const response = await fetch('/api/menu');
    const menuData = await response.json();
    const menu = document.getElementById('menuContainer');
    
    menu.innerHTML = '';
    menuData.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;

        const ul = document.createElement('ul');
        item.subItems.forEach(sub => {
            const subLi = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = sub.name;
            a.href = sub.link;
            subLi.appendChild(a);
            ul.appendChild(subLi);
        });

        li.appendChild(ul);
        menu.appendChild(li);
    });
}