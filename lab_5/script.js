

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
        <button class="button_js" type="submit">Перевернути</button>
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
        <button class = "button_js" id="changeColorButton">Змінити колір рамки</button>
        <button class = "button_js" id="cancelBorder" style="display:none" >Прибрати рамку</button>
        <input type="color" id="colorPicker" value="#000000">
    </div>
`;

function setBorderColor(color) {
    var blocks = document.querySelectorAll('.header, .news, .header_2, .ad, .fact, .main_content_js, .footer');
    blocks.forEach(block => {
        block.style.borderColor = color;
    });
}




//                                    5 пункт
mainContent.innerHTML+=`
<div class="cssChange">
    <button class="button_js" id="startSelectButton">Вибрати елемент</button>
    <button class="button_js" id="cancelSelectButton" style="display: none;">Припинити вибір</button>
    <h id="ifCanSelect" style="display: none;">Вибір активний!</h>
    <h id="optionText" style="display: none;"> </h>
    <button class="button_js" id="okOption" style="display: none;">OK</button>
    <h id="selectedElementInfo" style="display: none;">Вибрано елемент: </h>
    <div id="cssEditor" style="display: none;">
        <label for="cssInstructions">Введіть CSS інструкції:</label>
        <textarea id="cssInstructions" rows="5" cols="30"></textarea>
        <br>
        <button class="button_js" id="applyCssButton">Застосувати CSS</button>
        <button class="button_js" id="clearCssButton">Видалити CSS</button>
        <button class="button_js" id="clearAllCssButton">Видалити всі CSS</button>
    </div>
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
    var startSelectButton = document.getElementById('startSelectButton');
    var cancelSelectButton = document.getElementById('cancelSelectButton');
    var selectedElementInfo = document.getElementById('selectedElementInfo');
    var cssEditor = document.getElementById('cssEditor');
    var cssTextarea = document.getElementById('cssInstructions');
    var applyCssButton = document.getElementById('applyCssButton');
    var clearCssButton = document.getElementById('clearCssButton');
    var clearAllCssButton = document.getElementById('clearAllCssButton');
    var ifCanSelect = document.getElementById('ifCanSelect');
    var optionText = document.getElementById('optionText');
    var okOption = document.getElementById('okOption');
    let isSelecting = false;
    let selectedElement = null;

    var savedColor = localStorage.getItem('borderColor');
    if (savedColor) {
        document.getElementById('colorPicker').value = savedColor;
        setBorderColor(savedColor);
    }

    startSelectButton.addEventListener('click', () => {
        cancelSelectButton.style.display = 'inline';
        cssEditor.style.display = 'flex';
        ifCanSelect.style.display = 'block'
        isSelecting = true;
    });

    cancelSelectButton.addEventListener('click', () => {
        isSelecting = false;
        ifCanSelect.style.display = 'none'
    });

    document.body.addEventListener('click', (event) => {
        if (isSelecting) {
            event.preventDefault();
            event.stopPropagation();

            selectedElement = event.target;

            selectedElementInfo.style.display = 'block';
            selectedElementInfo.textContent = `Вибрано елемент: ${selectedElement.tagName}.${selectedElement.className}`;

            cssEditor.style.display = 'flex';
            startSelectButton.style.display = 'inline-block';

            var savedCss = localStorage.getItem(`css-${selectedElement.className}`) || '';
            cssTextarea.value = savedCss;
        }
    });

    applyCssButton.addEventListener('click', () => {
        if (selectedElement && cssTextarea.value.trim()) {
            var css = cssTextarea.value.trim();
            selectedElement.style.cssText += css;
            localStorage.setItem(`css-${selectedElement.className}`, css);
            optionText.style.display = 'block';
            okOption.style.display = 'block';
            optionText.textContent = `CSS застосовано до елемента ${selectedElement.tagName}.${selectedElement.className}`;
        } else {
            optionText.style.display = 'block';
            okOption.style.display = 'block';
            optionText.textContent = `Введіть CSS інструкції перед застосуванням.`;
        }
    });

    okOption.addEventListener('click',()=>{
        optionText.style.display = 'none';
        okOption.style.display = 'none';
    })

    clearCssButton.addEventListener('click', () => {
        var className = selectedElement.className;
        localStorage.removeItem(`css-${className}`);
        selectedElement.style.cssText = '';
        cssTextarea.value = '';
        optionText.style.display = 'block';
        okOption.style.display = 'block';
        optionText.textContent = `CSS інструкції видалено для елемента ${selectedElement.tagName}.${className}`;
    });

    clearAllCssButton.addEventListener('click', () => {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('css-')) {
                localStorage.removeItem(key);
            }
        });
        optionText.style.display = 'block';
        okOption.style.display = 'block';
        optionText.textContent = `Всі інструкції було видалено, перезавантажте сторінку`;
    });

    document.querySelectorAll('*').forEach((element) => {
        var className = element.className;
        var savedCss = localStorage.getItem(`css-${className}`);
        if (savedCss) {
            element.style.cssText += savedCss;
        }
    });
});

mainContent.innerHTML += `<p class = "area_text">Площа пʼятикутника: ${area} </p>`

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
    localStorage.setItem('borderColor', color);
    var blocks = document.querySelectorAll('.header, .news, .header_2, .ad, .fact, .main_content_js, .footer');
    blocks.forEach(block => {
        block.style.borderStyle = 'solid';
        block.style.borderWidth = '2px';
    });
    var cancelButton = document.getElementById('cancelBorder');
    cancelButton.style.display = 'inline';
});

document.getElementById('cancelBorder').addEventListener('click', () =>{
    var blocks = document.querySelectorAll('.header, .news, .header_2, .ad, .fact, .main_content_js, .footer');
    blocks.forEach(block => {
        block.style.borderStyle = 'none';
    });
})