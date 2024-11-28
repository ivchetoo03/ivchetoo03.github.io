

//                                    1 пункт
var factBlock = document.querySelector('.fact .fact_content');
var newsBlock = document.querySelector('.news .news_content');

var factHTML = factBlock.innerHTML;
var newsHTML = newsBlock.innerHTML;

factBlock.innerHTML = newsHTML;
newsBlock.innerHTML = factHTML;



//                                    2 пункт
var sideLength = 10;
var apothem = 7;
var area = (sideLength * apothem * 5) / 2;
var mainContent = document.querySelector('.mcj_inside');



//                                    3 пункт
mainContent.innerHTML += `
    <form id="numberForm">
        <label for="numberInput">Введіть натуральне число:</label>
        <input type="number" id="numberInput" min="1" required>
        <button type="submit">Перевернути</button>
    </form>
`;

var cookies = document.cookie.split("; ").find(row => row.startsWith("reversedNumber="));
if (cookies) {
    var reversedNumber = cookies.split("=")[1];
    if (confirm(`Збережене число: ${reversedNumber}. Натисніть OK, щоб видалити cookies.`)) {
        document.cookie = "reversedNumber=; max-age=0; path=/";
        alert("Cookies видалено!");
        location.reload();
    }
}


//                                    4 пункт
mainContent.innerHTML += `
    <div class="colorChange">
        <button id="changeColorButton">Змінити колір рамки</button>
        <input type="color" id="colorPicker" value="#000000">
    </div>
`;

mainContent.innerHTML += `<p class = "area_text">Площа пʼятикутника: ${area} </p>`

function setBorderColor(color) {
    var blocks = document.querySelectorAll('.header, .news, .header_2, .ad, .fact, .main_content_js, .footer');
    blocks.forEach(block => {
        block.style.borderColor = color;
    });
}

// Завантажуємо колір з localStorage при завантаженні сторінки
var savedColor = localStorage.getItem('borderColor');
if (savedColor) {
    setBorderColor(savedColor);
    document.getElementById('colorPicker').value = savedColor;
}
console.log(localStorage);


//                                    5 пункт

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main_content_js');
    const cssTextarea = document.getElementById('cssInstructions');
    const applyCssButton = document.getElementById('applyCssButton');
    const clearCssButton = document.getElementById('clearCssButton');
    let selectedElement = null;

    // Додаємо можливість обирати елемент для редагування
    chooseBlock.addEventListener('click', () =>{
        if (chooseBlock.clicked) {
            document.querySelectorAll('*:not(#chooseBlock):not(#applyCssButton):not(#clearCssButton)').forEach((element) => {
            element.removeEventListener('click', chooseBlockHandler);
            });
            chooseBlock.clicked = false;
        } 
        else {
            chooseBlock.clicked = true;

            mainContent.innerHTML += `
                <label for="cssInstructions">Введіть CSS інструкції:</label>
                <textarea id="cssInstructions" rows="5" cols="30"></textarea>
                <br>
                <button id="chooseBlock">Вибрати блок</button>
                <button id="applyCssButton">1 (Застосувати CSS)</button>
                <button id="clearCssButton">2 (Видалити CSS)</button>
            `;
            
            var chooseBlockHandler = (event) => {
                event.preventDefault();
                event.stopPropagation();
                selectedElement = event.target;
                mainContent.innerHTML = `Вибрано елемент: ${event.target.tagName}.${event.target.className}`;
                cssTextarea.value = localStorage.getItem(`css-${event.target.className}`) || '';
            };
            document.querySelectorAll('*:not(#chooseBlock):not(#applyCssButton):not(#clearCssButton)').forEach((element) => {
                element.addEventListener('click', chooseBlockHandler);
            });
        }
    });

    // Застосовуємо CSS і зберігаємо у localStorage
    applyCssButton.addEventListener('click', () => {
        if (selectedElement && cssTextarea.value.trim()) {
            const css = cssTextarea.value.trim();
            selectedElement.style.cssText += css;
            localStorage.setItem(`css-${selectedElement.className}`, css);
            alert(`CSS застосовано до елемента ${selectedElement.tagName}.${selectedElement.className}`);
        } else {
            alert('Спершу виберіть елемент для редагування.');
        }
    });

    // Видаляємо CSS і очищуємо localStorage
    clearCssButton.addEventListener('click', () => {
        if (selectedElement) {
            const className = selectedElement.className;
            localStorage.removeItem(`css-${className}`);
            selectedElement.style.cssText = ''; // Очищуємо стилі
            alert(`CSS інструкції видалено для елемента ${selectedElement.tagName}.${className}`);
        } else {
            alert('Спершу виберіть елемент для видалення CSS.');
        }
    });

    // Завантажуємо CSS із localStorage при завантаженні сторінки
    document.querySelectorAll('*').forEach((element) => {
        const className = element.className;
        const savedCss = localStorage.getItem(`css-${className}`);
        if (savedCss) {
            element.style.cssText += savedCss;
        }
    });
});


document.getElementById("numberForm").addEventListener("submit", (event) => {
    event.preventDefault();
    var numberInput = document.getElementById("numberInput").value;
    var reversedNumber = numberInput.split("").reverse().join("");
    alert(`Перевернуте число: ${reversedNumber}`);
    document.cookie = `reversedNumber=${reversedNumber}; path=/`;
    event.target.reset();
});

document.getElementById('changeColorButton').addEventListener('click', () => {
    var color = document.getElementById('colorPicker').value;
    setBorderColor(color);
    localStorage.setItem('borderColor', color); // Зберігаємо колір у localStorage
    var blocks = document.querySelectorAll('.header, .news, .header_2, .ad, .fact, .main_content_js, .footer');
    blocks.forEach(block => {
        block.style.borderStyle = 'solid';
        block.style.borderWidth = '2px';
    });
});