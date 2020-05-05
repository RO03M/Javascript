
function SpeechCaller(content) {
    var teste = new SpeechSynthesisUtterance(content);
    speechSynthesis.speak(teste);
}