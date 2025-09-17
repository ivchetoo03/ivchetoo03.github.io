const table = document.getElementById('bugTable');
const headerRow = table.tHead.rows[0];
let dragSrcIndex = null;

headerRow.addEventListener('dragstart', e => {
    if (e.target.classList.contains('drag-handle')) {
        dragSrcIndex = [...headerRow.cells].indexOf(e.target.closest('th'));
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragSrcIndex);
    }
});

headerRow.addEventListener('dragover', e => {
    const th = e.target.closest('th');
    if (th && th !== headerRow.cells[0]) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
});

headerRow.addEventListener('drop', e => {
    const targetTh = e.target.closest('th');
    if (!targetTh || targetTh === headerRow.cells[0]) return;

    const fromIndex = dragSrcIndex;
    const toIndex = [...headerRow.cells].indexOf(targetTh);
    if (fromIndex === toIndex) return;

    // ----- Переносимо заголовок разом з його width -----
    const movingTh = headerRow.cells[fromIndex];
    const width = movingTh.style.width;   // запам’ятали ширину
    headerRow.insertBefore(movingTh,
        fromIndex < toIndex ? targetTh.nextSibling : targetTh);
    movingTh.style.width = width;         // залишили ту ж ширину

    // ----- Переносимо відповідні комірки тіла -----
    for (const row of table.tBodies[0].rows) {
        const cell = row.cells[fromIndex];
        row.insertBefore(cell,
            fromIndex < toIndex ? row.cells[toIndex].nextSibling : row.cells[toIndex]);
        cell.style.width = width;           // та сама ширина разом із колонкою
    }
});

    document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('.report-table');
    const headerRow = table.tHead.rows[0];
    let sortDirection = {}; // запам’ятовуємо напрям для кожної колонки

    // додаємо слухач на всі заголовки, крім першого (fixed)
        [...headerRow.cells].forEach((th, index) => {
            if (index === 0) return; // перший не сортується
            th.addEventListener('click', (e) => {
                e.preventDefault();      // вимикає стандартні дії кліку
                e.stopPropagation();     // не передає подію далі
                sortByColumn(index, th); // виклик вашої сортувальної функції
            });
        });


        function sortByColumn(colIndex, th) {
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);

    // скинути індикатори сортування
    [...headerRow.cells].forEach(c => c.classList.remove('sort-asc','sort-desc'));

    // напрям: якщо вже була «asc», то робимо «desc», і навпаки
    const dir = sortDirection[colIndex] === 'asc' ? 'desc' : 'asc';
    sortDirection[colIndex] = dir;
    th.classList.add(dir === 'asc' ? 'sort-asc' : 'sort-desc');

    // визначаємо, чи це число
    const isNumeric = rows.every(row =>
    !isNaN(parseFloat(row.cells[colIndex].textContent.trim()))
    );

    // власне сортування
    rows.sort((a, b) => {
    let A = a.cells[colIndex].textContent.trim();
    let B = b.cells[colIndex].textContent.trim();
    if (isNumeric) {A = parseFloat(A); B = parseFloat(B);}
    return dir === 'asc'
    ? A > B ? 1 : A < B ? -1 : 0
    : A < B ? 1 : A > B ? -1 : 0;
});

    // вставляємо відсортовані рядки назад
    rows.forEach(r => tbody.appendChild(r));
}
});










// Функціонал для відкриття/закриття меню ACTIONS
document.addEventListener('DOMContentLoaded', function() {
    const actionsLink = document.getElementById('actions-link');
    const actionsMenu = document.getElementById('actions-menu');

    actionsLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Перемикаємо видимість меню
        if (actionsMenu.style.display === 'block') {
            actionsMenu.style.display = 'none';
        } else {
            actionsMenu.style.display = 'block';
        }
    });

    // Закриваємо меню при кліку поза ним
    document.addEventListener('click', function(e) {
        if (!actionsMenu.contains(e.target) && e.target !== actionsLink) {
            actionsMenu.style.display = 'none';
        }
    });

    // Запобігаємо закриттю меню при кліку всередині нього
    actionsMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// Функціонал для перемикання режимів фільтрації
document.addEventListener('DOMContentLoaded', function() {
    const filterRadios = document.querySelectorAll('input[name="filterMode"]');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const filterSelects = document.querySelectorAll('.filter-select');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    const findReportBtn = document.querySelector('.find-report-btn');

    // Функція оновлення стану кнопок
    function updateButtonsState() {
        const isWithFilter = document.querySelector('input[name="filterMode"]:checked').value === 'with';
        const anyCheckboxChecked = Array.from(filterCheckboxes).some(checkbox => checkbox.checked);

        clearFiltersBtn.disabled = !isWithFilter;
        findReportBtn.disabled = !isWithFilter || !anyCheckboxChecked;
    }

    // Обробник зміни радіокнопок
    filterRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const isWithFilter = this.value === 'with';

            // Активуємо/деактивуємо чекбокси
            filterCheckboxes.forEach(checkbox => {
                checkbox.disabled = !isWithFilter;
                if (!isWithFilter) {
                    checkbox.checked = false;
                }
            });

            // Активуємо/деактивуємо випадаючі списки
            filterSelects.forEach(select => {
                const checkbox = select.previousElementSibling.querySelector('.filter-checkbox');
                select.disabled = !isWithFilter || !checkbox.checked;
                if (!isWithFilter) {
                    select.value = '';
                }
            });

            updateButtonsState();
        });
    });

    // Обробник зміни чекбоксів
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const select = this.closest('.filter-group').querySelector('.filter-select');
            select.disabled = !this.checked;
            if (!this.checked) {
                select.value = '';
            }
            updateButtonsState();
        });
    });

    // Обробник для кнопки очищення фільтрів
    clearFiltersBtn.addEventListener('click', function() {
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        filterSelects.forEach(select => {
            select.value = '';
            select.disabled = true;
        });

        updateButtonsState();
    });

    // Обробник для кнопки пошуку
    findReportBtn.addEventListener('click', function() {
        const filters = {};

        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const filterName = checkbox.parentElement.textContent.trim();
                const select = checkbox.closest('.filter-group').querySelector('.filter-select');
                filters[filterName] = select.value;
            }
        });
    });

    updateButtonsState();
});

