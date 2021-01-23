const phrases = [
  "What's a nickname for your favorite cumsock?",
  "If you got to make a 18+ videogame what would you title it?",
  "Your favorite thing to build in minecraft is ____",
  "The police break down your door with the order to shoot on sight, your last words are ____",
  "As a gamer you are inherently ____",
  "The ultimate strategy to fending off a redditor is ____",
  "Step one of being a discord mod ____",
  "The worst thing you could put on live leak is ____",
  "A black guy and cop walk into a bar____",
  "The best way to win an argument is ____",
  "Describe your life in 10 words or less ____",
  "You stub your toe and yell out ____",
  "If you were shot buy a drunk guy in a chucke cheese your last words would be ____",
  "Ah yes ____ is the greatest insparation to this country.",
  "Motherfuckers took my ____ can't have shit in detroit.",
  "Say it with me! #____LivesMatter",
  "Say it with me! #____LivesDon'tMatter",
  "Wifi names that would make you consider moving out",
  "Something awkward to say during a virtual meeting",
  "____ is a clown at developing",
];
exports.getPhrases = function () {
  return phrases;
};
exports.randomPhrase = function () {
  return phrases[Math.floor(Math.random() * phrases.length)];
};
