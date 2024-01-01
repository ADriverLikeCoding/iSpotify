 (function() {
     window.onload = (event) => {
         console.log('window is onloaded');
         setTimeout(() => {
     //        makeClearly();
     //        sendFocus();
     //        playMusic();
     //        touchPlay();
         }, 4000);
         
     //    logScriptLength();
     //    logHtml();
     };

     function playMusic() {
         const aud = document.createElement('audio');
         aud.src = 'https://samplelib.com/lib/preview/mp3/sample-9s.mp3';
         aud.play();
     }

     function sendFocus() {
         const event = new FocusEvent('focus',{ bubbles: true, cancelable: true });
         window.dispatchEvent(event);
     }

     function touchPlay() {
         const playBtn = document.querySelector('[aria-label="Play"]');
         simulate(playBtn, 'click');
     }

     function logScriptLength() {
         const scripts = document.getElementsByTagName('script');
         console.log('scripts count: ' + scripts.length);
     }

     function logHtml() {
         const txt = document.documentElement.innerHTML;
         console.log(txt);
     }

     document.addEventListener("DOMContentLoaded", (event) => {
       console.log("DOM fully loaded and parsed");
         
     });

 })();
