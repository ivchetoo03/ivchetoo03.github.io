//                                    1
var blocks = document.querySelectorAll('.news_content, .fact_content')
const parent = blocks[0].parentNode;

const newsClone = blocks[0].cloneNode(true);
const factClone = blocks[1].cloneNode(true);

parent.replaceChild(factClone, blocks[0]);
parent.replaceChild(newsClone, blocks[1]);


//                                    2
const sideLength = 10;
const apothem = 7;
const area = (sideLength * apothem * 5) / 2;

const mainContent = document.querySelector('.main_content');
mainContent.innerHTML += `<p>Площа п’ятикутника: ${area}</p>`;


//                                    3
const reverseForm = document.getElementById('reverseForm');
const numberInput = document.getElementById('numberInput');

// Check if cookies exist
const savedValue = document.cookie.split('; ').find(row => row.startsWith('reversedNumber='));
if (savedValue) {
    const reversedNumber = savedValue.split('=')[1];
    alert(`Stored number: ${reversedNumber}. Data will be deleted after OK.`);
    document.cookie = 'reversedNumber=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    alert('Cookies deleted. Reloading page.');
    location.reload();
}

reverseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const number = numberInput.value;
    const reversedNumber = number.split('').reverse().join('');
    alert(`Reversed number: ${reversedNumber}`);
    document.cookie = `reversedNumber=${reversedNumber}; path=/;`;
});

