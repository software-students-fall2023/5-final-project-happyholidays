function pick_random_background(){
    //picks a random background
    const backgroundImages= ['pikachu_8bits.jpeg','pokeballs.jpeg','pokedex.png','starters.webp','surfing_pikachu.jpeg']
    const selectedImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.body.style.backgroundImage=`url(static/images/${selectedImage})`;
}
function display_cards(){
    //displays cards to user 
}

function main(){
    pick_random_background();
}
document.addEventListener('DOMContentLoaded',main);