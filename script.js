const plectrum = document.getElementById("plectrum");
const snaar = document.getElementById("snaar");

let slepen = false;
let offsetX = 0;
let offsetY = 0;
let vorigePuntY = null;




plectrum.addEventListener("pointerdown", function (event) {

    slepen = true;

    const positie = plectrum.getBoundingClientRect();

    offsetX = event.clientX - positie.left;
    offsetY = event.clientY - positie.top;

    vorigePuntY = positie.bottom;

    plectrum.setPointerCapture(event.pointerId);
});




plectrum.addEventListener("pointermove", function (event) {

    if (!slepen) return;

    plectrum.style.left =
        event.clientX - offsetX + "px";

    plectrum.style.top =
        event.clientY - offsetY + "px";

    plectrum.style.right = "auto";
    plectrum.style.bottom = "auto";

    controleerSnaar();
});


// ==========================
// PLECTRUM LOSLATEN
// ==========================

plectrum.addEventListener("pointerup", stopSlepen);
plectrum.addEventListener("pointercancel", stopSlepen);


function stopSlepen() {
    slepen = false;
    vorigePuntY = null;
}




function controleerSnaar() {

    const pick = plectrum.getBoundingClientRect();
    const string = snaar.getBoundingClientRect();

    // Onderste punt van het plectrum
    const huidigePuntY = pick.bottom;

    // Positie van de snaar
    const snaarY =
        string.top + string.height / 2;

    // Is het plectrum boven de snaar?
    const binnenSnaar =
        pick.right > string.left &&
        pick.left < string.right;


    if (vorigePuntY !== null && binnenSnaar) {

        // Van boven naar beneden
        const naarBeneden =
            vorigePuntY < snaarY &&
            huidigePuntY >= snaarY;

        // Van beneden naar boven
        const naarBoven =
            vorigePuntY > snaarY &&
            huidigePuntY <= snaarY;


        if (naarBeneden || naarBoven) {

            console.log("G-snaar geraakt!");

            // Geluid
            speelGSnaar();

            // Animatie
            laatSnaarTrillen();
        }
    }

    vorigePuntY = huidigePuntY;
}


// ==========================
// G-SNAAR GELUID
// ==========================

function speelGSnaar() {

    const audioContext =
        new (window.AudioContext ||
             window.webkitAudioContext)();


    // Maakt de toon
    const oscillator =
        audioContext.createOscillator();

    // Volume
    const volume =
        audioContext.createGain();


    /*
       G-snaar ongeveer 196 Hz
    */
    oscillator.frequency.setValueAtTime(
        196,
        audioContext.currentTime
    );


    /*
       Iets warmer geluid
    */
    oscillator.type = "triangle";


    // Beginvolume
    volume.gain.setValueAtTime(
        0.25,
        audioContext.currentTime
    );


    // Geluid langzaam zachter maken
    volume.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1.5
    );


    // Alles verbinden
    oscillator.connect(volume);
    volume.connect(audioContext.destination);


    // Geluid starten
    oscillator.start();


    // Geluid stoppen
    oscillator.stop(
        audioContext.currentTime + 1.5
    );
}




function laatSnaarTrillen() {

    snaar.classList.remove("trillen");

    // Animatie resetten
    void snaar.offsetWidth;

    snaar.classList.add("trillen");
}