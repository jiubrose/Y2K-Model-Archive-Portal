let text = '> Wake up...'
const timer = ms => new Promise(res => setTimeout(res, ms))
let charIndex = 0
let typingText = ''
let typingTextPrev = ''

async function load (blockId, text, delay) {
  console.log("load:",blockId,text) 
  let block = document.getElementById(blockId)
  for (let c of text) {
    typingText = typingTextPrev + text.charAt(charIndex)
    block.innerText = typingText
    typingTextPrev = typingText
    charIndex++
    charIndex === text.length ? cursor(10, true) : await timer(delay);
  }
}

const cursor = (times, fadeout, blockId) => {
  const span = document.createElement('span')
  span.innerText = '_'
  let block = document.getElementById("wakeup")
  blockId ? block = document.getElementById(blockId) : block
  block.append(span)
  let count = 0
  const interval = setInterval(() => {
    span.classList.toggle('active');
    if (count++ === times) {
      clearInterval(interval);
      fadeout ? switch_content() : load("wakeup", "> Wake up...", 100);
    }
  }, 400);
}

switch_content = () => {
  document.body.classList.add('fadeout') 
  const wakeup = document.getElementById('wakeup')
  wakeup.innerText = ''
  wakeup.style.display = 'none'
  const content = document.getElementById('main')
  content.style.display = 'block'
}

cursor(6,null,"wakeup")

display_text = () => {
  const bodytext = document.getElementById('bodytext')
  fetch("bodytextcontent.txt")
  .then((res) => res.text())
  .then((text) => {
    let charIndex = 0;
    let tagBuffer = '';
    let isTag = false;
    const interval = setInterval(() => {
      if (charIndex < text.length) {
        if (text[charIndex] === '<') {
          isTag = true;
          tagBuffer += text[charIndex];
        } else if (text[charIndex] === '>') {
          isTag = false;
          tagBuffer += text[charIndex];
          bodytext.insertAdjacentHTML('beforeend', tagBuffer);
          tagBuffer = '';
        } else if (isTag) {
          tagBuffer += text[charIndex];
        } else {
          bodytext.insertAdjacentHTML('beforeend', text[charIndex]);
        }
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  })
  .catch((e) => console.error(e));
}

// Generate a random brightness value between 50% and 200%
function randomBrightness() {
  return Math.floor(Math.random() * 150) + 50;
}

// Create a new style element
const style = document.createElement('style');

// Generate the keyframes rule
let keyframes = '@keyframes glitch {';
for (let i = 0; i <= 100; i += 1) {
  keyframes += `${i}% { filter: brightness(${randomBrightness()}%); }`;
}
keyframes += '}';

// Add the keyframes rule to the style element
style.innerHTML = `.glitch-effect { animation: glitch 1s infinite; } ${keyframes}`;

// Append the style element to the head of the document
document.head.appendChild(style);
