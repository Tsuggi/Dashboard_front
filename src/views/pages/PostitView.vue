<template>
    <div class="post-it-container card" ref="boardRef">
        <div v-for="postIt in postIts" :key="postIt.id" class="post-it" :style="{ top: postIt.y + 'px', left: postIt.x + 'px' }" @mousedown="startDrag(postIt, $event)">
            <textarea v-model="postIt.content" placeholder="Écrivez quelque chose..." @mousedown.stop></textarea>
        </div>

        <Button class="add-button" @click="addPostIt" icon="pi pi-plus" severity="success" rounded aria-label="Search" />
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

// --- REFERENCES ---
// ref pour le conteneur principal afin d'obtenir ses dimensions
const boardRef = ref(null);
// La liste de nos post-it
const postIts = ref([]);
// Variable pour suivre l'état du glissement (drag)
const dragInfo = ref({
    isDragging: false,
    item: null,
    offsetX: 0,
    offsetY: 0
});

// --- FONCTIONS ---

/**
 * Ajoute un nouveau Post-it à la liste
 */
function addPostIt() {
    const newPostIt = {
        id: Date.now(), // ID unique basé sur le timestamp
        content: '',
        // Position initiale aléatoire pour éviter les superpositions
        x: Math.random() * 50 + 20,
        y: Math.random() * 50 + 20
    };
    postIts.value.push(newPostIt);
}

/**
 * Démarre le processus de glissement (drag)
 * @param {object} item - Le Post-it à déplacer
 * @param {MouseEvent} event - L'événement du clic de la souris
 */
function startDrag(item, event) {
    // Empêche le comportement par défaut (ex: sélection de texte)
    event.preventDefault();

    dragInfo.value = {
        isDragging: true,
        item: item,
        // Calcule le décalage entre le coin supérieur gauche du Post-it et le curseur
        offsetX: event.clientX - item.x,
        offsetY: event.clientY - item.y
    };

    // Ajoute des écouteurs d'événements globaux pour suivre le mouvement et le relâchement
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
}

/**
 * Gère le déplacement du Post-it
 * @param {MouseEvent} event - L'événement de mouvement de la souris
 */
function onDrag(event) {
    if (!dragInfo.value.isDragging || !boardRef.value) return;

    const boardRect = boardRef.value.getBoundingClientRect();
    const postItElement = boardRef.value.querySelector('.post-it'); // Pour obtenir la taille
    if (!postItElement) return;

    const postItWidth = postItElement.offsetWidth;
    const postItHeight = postItElement.offsetHeight;

    // Calcule la nouvelle position potentielle
    let newX = event.clientX - dragInfo.value.offsetX;
    let newY = event.clientY - dragInfo.value.offsetY;

    // --- CONTRAINTE DANS LE CONTENEUR ---
    // Empêche de sortir par la gauche ou le haut
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);

    // Empêche de sortir par la droite ou le bas
    newX = Math.min(newX, boardRect.width - postItWidth);
    newY = Math.min(newY, boardRect.height - postItHeight);

    // Met à jour la position du Post-it
    dragInfo.value.item.x = newX;
    dragInfo.value.item.y = newY;
}

/**
 * Arrête le processus de glissement (drag)
 */
function stopDrag() {
    dragInfo.value.isDragging = false;
    dragInfo.value.item = null;

    // Supprime les écouteurs d'événements globaux pour nettoyer
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
}

// Nettoie les écouteurs d'événements si le composant est détruit
onUnmounted(() => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
/* Le conteneur principal qui définit la zone de jeu */
.post-it-container {
    position: relative;
    width: 100%;
    height: 80vh; /* Hauteur de 80% de la fenêtre */
    background-color: rgb(255, 255, 255);
    overflow: hidden; /* Assure que rien ne dépasse visuellement */
    margin: 0;
    padding: 0;
}

/* Le bouton d'ajout, positionné en absolu en bas à droite */
.add-button {
    position: absolute;
    bottom: 20px;
    right: 20px;
    height: 50px;
    z-index: 1000; /* S'assure qu'il est au-dessus des Post-it */
}

/* Style de base pour un Post-it */
.post-it {
    position: absolute;
    width: 200px;
    height: 200px;
    background-color: var(--primary-color); /* Jaune Post-it */
    border: 1px solid #6e6e68;
    box-shadow: 5px 5px 10px rgba(83, 83, 83, 0.15);
    cursor: grab; /* Curseur pour indiquer qu'on peut attraper */
    user-select: none; /* Empêche la sélection du texte pendant le drag */
}

.post-it:active {
    cursor: grabbing; /* Curseur pendant le déplacement */
    z-index: 10; /* Met le Post-it déplacé au premier plan */
}

/* La zone de texte à l'intérieur du Post-it */
.post-it textarea {
    width: 100%;
    height: 100%;
    padding: 10px;
    color: var(--text-color);
    box-sizing: border-box;
    background-color: transparent;
    border: none;
    font-family: 'Caveat', cursive; /* Une police qui ressemble à de l'écriture manuscrite */
    font-size: 18px;
    resize: none; /* Empêche l'utilisateur de redimensionner le textarea */
    outline: none; /* Pas de bordure bleue à la sélection */
}

/* Pour utiliser la police 'Caveat', ajoutez cette ligne dans votre fichier HTML principal (index.html) */
/* <link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet"> */
</style>
