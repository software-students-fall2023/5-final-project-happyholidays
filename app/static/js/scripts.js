const cards = [];
let curr_card = null;
let curr_duplicate = null;
function pick_random_background(){
    //picks a random background
    const backgroundImages= ['pikachu_8bits.jpeg','pokeballs.jpeg','pokedex.png','starters.webp','surfing_pikachu.jpeg']
    const selectedImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.body.style.backgroundImage=`url(static/images/backgrounds/${selectedImage})`;
}
function shuffle(array) {
    // shuffle 
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function emphasis_card(card){
    //highlight the selected card. 
    var emphasized_cards = document.querySelectorAll('.emphasis');
    //ok so this will remove all previously emphasized cards. careful when call this func 
    emphasized_cards.forEach(function(element) {
        element.classList.remove('emphasis');
      });
    card.classList.add('emphasis');
}
function match(card){
    //cancle mathced cards. 
    const matched_pokemon = card.getAttribute('data-pokemon');
    
}
function handleSelectCard(evt){
    const selected_card = evt.target;
    //console.log(curr_duplicate);
    //console.log(selected_card.getAttribute('data-duplicate'));
    if (selected_card.getAttribute('data-pokemon') === curr_card){
        if(selected_card.getAttribute('data-duplicate')===curr_duplicate){
            console.log('same card clicked');
        }
        else{
            match(selected_card);
            console.log('match!');
        }
    }
    else{
        emphasis_card(selected_card);
        curr_card=selected_card.getAttribute('data-pokemon');
        curr_duplicate=selected_card.getAttribute('data-duplicate');
    }
}
function display_cards(){
    // display the current cards array 
    const cards_section = document.querySelector('.cards');
    const doublecards = shuffle(cards.concat(cards));
    const added_cards=[];
    doublecards.forEach(card=>{
        const card_url = `static/images/cards/${card}`;
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
        display_cards();
    }).catch(console.log);
}

function main(){
    //main function to call after DOM load 
    pick_random_background();
    pick_cards(4);
}
document.addEventListener('DOMContentLoaded',main);