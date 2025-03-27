import { Howl } from "howler";
import click1 from "../sound/mouse_click_01.mp3";
import click2 from "../sound/mouse_click_02.mp3";
import click3 from "../sound/mouse_click_03.mp3";
import click4 from "../sound/mouse_click_04.mp3";
import click5 from "../sound/mouse_click_05.mp3";
import cash1 from "../sound/cash_01.mp3";
import cash2 from "../sound/cash_02.mp3";
import cash3 from "../sound/cash_03.mp3";

const isGamePage = window.location.pathname.includes("game.html");

export function playSound(sound) {
  if (!isGamePage) return;
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
  const soundFiles = [click1, click2, click3, click4, click5];

  const randomIndex = Math.floor(Math.random() * soundFiles.length);
  playSound(soundFiles[randomIndex]);
}

export function playRandomCash() {
  const soundFiles = [cash1, cash2, cash3];

  const randomIndex = Math.floor(Math.random() * soundFiles.length);
  playSound(soundFiles[randomIndex]);
}
