const cards = [];
let curr_cards = [];
let seconds = 0;
let curr_card = null;
let curr_duplicate = null;
let timeInterval;
function pick_random_background(){
    //picks a random background
    const backgroundImages= ['pikachu_8bits.jpeg','pokeballs.jpeg','pokedex.png','starters.webp','surfing_pikachu.jpeg']
    const selectedImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.body.style.backgroundImage=`url(static/images/backgrounds/${selectedImage})`;
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function updateTimerDisplay() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    document.getElementById('timerDisplay').innerText = formattedTime;
    seconds++;
}
function shuffle(array) {
    // shuffle 
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function clear_emphasis(){
    //highlight the selected card. 
    var emphasized_cards = document.querySelectorAll('.emphasis');
    //ok so this will remove all previously emphasized cards. careful when call this func 
    emphasized_cards.forEach(function(element) {
        element.classList.remove('emphasis');
    });
}
function emphasis_card(card){
    clear_emphasis();
    card.classList.add('emphasis');
}
async function show_leading_board(){
    const url = '/getRecord';
    const leadingBoard = document.getElementById('leading-board');
    try{
        const res = await fetch(url);
        const records = await res.json();
        records.forEach((record)=>{
            const record_section = document.createElement('p');
            record_section.innerText = `${record.player} ------- ${record.time}`;
            leadingBoard.appendChild(record_section);
        })
    }catch(e){
        console.log(e);
    }
    const restart_game = document.createElement('a');
    restart_game.innerHTML='<button>restart game</button>';
    restart_game.url = '/';
    leadingBoard.appendChild(restart_game);
}
function add_to_leading_board(time){
    const inputfiled = document.getElementById('inputfield');
    const nameinput = document.createElement('input');
    nameinput.setAttribute('type', 'text');
    nameinput.setAttribute('id', 'name-input');
    const prompt = document.createElement('h3');
    prompt.innerText = 'put your name to add to leading board!';
    const add_btn = document.createElement('button');
    add_btn.innerText = 'Add';
    add_btn.addEventListener('click',async()=>{
        let player = nameinput.value;
        const url = '/addRecord';
        const options = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({player, time:time}),
        }
        try{
            const res = await fetch(url, options);
            const saved_data = await res.json();
            console.log('data saved', saved_data);
            inputfiled.style.display='none'
            show_leading_board();
        }catch(e){
            console.log('error',e);
        }
    });
    inputfiled.appendChild(prompt);
    inputfiled.appendChild(nameinput);
    inputfiled.appendChild(add_btn);
}
function endgame(){
    console.log('you win!');
    clearInterval(timeInterval);
    const currentTime = document.getElementById('timerDisplay').innerText;
    add_to_leading_board(currentTime);
}
function match(card){
    //cancle mathced cards. 
    const matched_pokemon = card.getAttribute('data-pokemon');
    var matched_cards = document.querySelectorAll(`[data-pokemon='${matched_pokemon}']`);
    matched_cards.forEach(card=>{
        card.classList.add('hidden');
    })
    curr_cards=curr_cards.filter(elem=>elem!=matched_pokemon);
    if (curr_cards.length===0){
        endgame();
    }
} 
function show_card(card){
    if (curr_card===null || curr_duplicate===null){
        return;
    }
    const curr_card_pokemon = card.getAttribute('data-pokemon');
    const curr_card_duplicate = card.getAttribute('data-duplicate');
    if (curr_card_pokemon===curr_card&&curr_card_duplicate===curr_duplicate){
        return;
    }
    const curr_card_path = `static/images/cards/${curr_card_pokemon}`
    const last_card = document.querySelector(`[data-pokemon='${curr_card}'][data-duplicate='${curr_duplicate}']`);
    const last_card_path = `static/images/cards/${curr_card}`
    card.src = curr_card_path;
    last_card.src = last_card_path;
    setTimeout(()=>{
        console.log(card);
        card.src = `static/images/card_back.webp`;
        last_card.src = `static/images/card_back.webp`;
    },600);
}
async function handleSelectCard(evt){
    const selected_card = evt.target;
    emphasis_card(selected_card);
    show_card(selected_card);
    //console.log(curr_duplicate);
    //console.log(selected_card.getAttribute('data-duplicate'));
    if (selected_card.getAttribute('data-pokemon') === curr_card){
        if(selected_card.getAttribute('data-duplicate')===curr_duplicate){
            console.log('same card clicked');
        }
        else{
            await delay(500);
            match(selected_card);
            curr_card=null;
            curr_duplicate=null;
            console.log('match!');
        }
    }
    else{
        if (curr_card===null && curr_duplicate===null){
            curr_card=selected_card.getAttribute('data-pokemon');
            curr_duplicate=selected_card.getAttribute('data-duplicate');
        }
        else{
            curr_card=null;
            curr_duplicate=null;
            clear_emphasis();
        }
    }
}
function display_cards(){
    // display the current cards array 
    const cards_section = document.querySelector('.cards');
    const doublecards = shuffle(cards.concat(cards));
    const added_cards=[];
    doublecards.forEach(card=>{
        const card_url = `static/images/card_back.webp`;
        const new_card = document.createElement('img');
        new_card.src=card_url;
        new_card.classList.add('card');
        new_card.setAttribute('data-pokemon', card);
        if (added_cards.includes(card)){
            new_card.setAttribute('data-duplicate',2);
        }else{
            new_card.setAttribute('data-duplicate',1);
            added_cards.push(card);
        };
        new_card.addEventListener('click',(evt)=>{
            handleSelectCard(evt);
        });
        cards_section.appendChild(new_card);
    });
}
function pick_cards(n){
    //pick 4 random cards 
    const cards_path = '/getCardList';
    fetch(cards_path).then(res=>res.json())
    .then(data=>{
        const cardnames = data.cards;
        const shuffled_cards = shuffle(cardnames);
        let i; 
        for (i=0;i<n;i++){
            cards.push(shuffled_cards[i]);
        }
        console.log(cards);
        curr_cards=cards.slice();
        display_cards();
    }).catch(console.log);
}

function main(){
    //main function to call after DOM load 
    pick_random_background();
    timeInterval=setInterval(updateTimerDisplay, 1000);
    pick_cards(4);
}
document.addEventListener('DOMContentLoaded',main);