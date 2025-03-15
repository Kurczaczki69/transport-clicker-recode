export function playSound(sound) {
  if (!checkSoundPreference()) return;
  let audio = new Howl({
    src: [sound],
    volume: 0.5,
    preload: true,
  });
  audio.play();
}

function checkSoundPreference() {
  const preference = localStorage.getItem("soundPreference");
  if (preference === "on") {
    return true;
  } else if (preference === "off") {
    return false;
  }
  return true;
}

export function playRandomMouseClick() {
  const soundFiles = [
    "./sound/mouse_click_01.flac",
    "./sound/mouse_click_02.mp3",
    "./sound/mouse_click_03.mp3",
    "./sound/mouse_click_04.mp3",
    "./sound/mouse_click_05.mp3",
  ];

  const randomIndex = Math.floor(Math.random() * soundFiles.length);
  playSound(soundFiles[randomIndex]);
}

export function playRandomCash() {
  const soundFiles = ["./sound/cash_01.mp3", "./sound/cash_02.mp3", "./sound/cash_03.mp3"];

  const randomIndex = Math.floor(Math.random() * soundFiles.length);
  playSound(soundFiles[randomIndex]);
}
