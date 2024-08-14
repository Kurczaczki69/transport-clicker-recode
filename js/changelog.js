const contentContainer = document.getElementById("content-container-changelog");

// version btns

const alpha04 = document.getElementById("al4");
const alpha031 = document.getElementById("al31");
const alpha03 = document.getElementById("al3");
const alpha02 = document.getElementById("al2");
const alpha011 = document.getElementById("al11");
const alpha01 = document.getElementById("al1");

// event listeners

alpha04.addEventListener(
  "click",
  function () {
    changeVer(4);
  },
  false
);
alpha031.addEventListener(
  "click",
  function () {
    changeVer(31);
  },
  false
);
alpha03.addEventListener(
  "click",
  function () {
    changeVer(3);
  },
  false
);
alpha02.addEventListener(
  "click",
  function () {
    changeVer(2);
  },
  false
);
alpha011.addEventListener(
  "click",
  function () {
    changeVer(11);
  },
  false
);
alpha01.addEventListener(
  "click",
  function () {
    changeVer(1);
  },
  false
);

// contents array

const contents = [
  '<h3> Wersja Alpha 0.4</h3> <br> - Zmieniono system kupna autobusów. Od teraz można kupować wiele autobusów na raz <br> - Menu "Lista zmian" zostało zmienione aby było bardziej czytelne <br> - Dodano okno dla przycisku "Kody" - na ten moment nie robi nic specjalnego <br> - Dodano okno dla przycisku "Kup ulepszenia" - funkcjonalność zostanie dodana w przyszłości <br> - Kilka błędów zostało naprawionych <br> - Wiadomości "Nie masz wystarczająco pieniędzy!" zostały zamienione na "Nie stać cię!" <br> - Dodano 2 nowe autobusy: <br> |- Solaris Vacanza 12 <br> |- Solaris Vacanza 13 <br> - Wiele innych mniejszych zmian i poprawek',
  "<h3> Wersja Alpha 0.3.1</h3> <h4>01/06/2023</h4> <br> - Zmieniono rozmiar czcionki w polach Pieniądze, Autobusy itp.",
  "<h3> Wersja Alpha 0.3</h3> <h4>01/06/2023</h4> <br> - Zmieniono menu na wyjmowane z lewej <br> - Zmieniono powiększenie w sklepie z autobusami z 1.1 na 1.05 <br> - Zamiast osobnych menu na autobusy, trolejbusy itp. są teraz kategorie <br> - Po najechaniu na opcję w menu wyświetla się mały opis <br> - Zamiast tekstu w menu teraz są ikonki <br> - Poprawiono wyświetlanie na urzadzeniach mobilnych <br> - Dodano automatyczne zapisy <br> - Dodano 4 nowe autobusy: <br> |- Solaris Urbino 12 Hydrogen <br> |- Solaris Urbino 18 Hydrogen <br> |- Jelcz M121M <br> |- Man Lion's City GXL",
  "<h3> Wersja Alpha 0.2</h3> <h4>30/05/2023</h4> <br> - Dodano system zapisów gry<br> - Dodano menu Lista zmian <br> - Dodano trzy nowe autobusy: <br> |- Solaris Urbino 24 <br> |- Solaris Alpino 8.6 <br> |- Man Lion's City",
  "<h3> Wersja Alpha 0.1.1</h3> <h4>30/05/2023</h4> <br> - Naprawiony został błąd z wyświetlaniem w skali 100%",
  "<h3> Wersja Alpha 0.1</h3> <h4>29/05/2023</h4> <br> - Gra została stworzona",
];

// changelog processor

function changeVer(versionNumber) {
  if (versionNumber === 4) {
    contentContainer.innerHTML = contents[0];
  } else if (versionNumber === 31) {
    contentContainer.innerHTML = contents[1];
  } else if (versionNumber === 3) {
    contentContainer.innerHTML = contents[2];
  } else if (versionNumber === 2) {
    contentContainer.innerHTML = contents[3];
  } else if (versionNumber === 11) {
    contentContainer.innerHTML = contents[4];
  } else if (versionNumber === 1) {
    contentContainer.innerHTML = contents[5];
  }
}
