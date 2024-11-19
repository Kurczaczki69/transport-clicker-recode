const contentContainer = document.getElementById("content-container-changelog");
const verDropdown = document.getElementById("version-dropdown");

// changing contents depending on selected option

verDropdown.addEventListener("change", (event) => {
  const selectedVer = event.target.value;
  contentContainer.innerHTML = contents[selectedVer];
});

// contents array

const contents = [
  "<h3> Wersja ALPHA 0.1.0</h3> <h4>29/05/2023</h4> <br> - Gra została stworzona",
  "<h3> Wersja ALPHA 0.1.1</h3> <h4>30/05/2023</h4> <br> - Naprawiony został błąd z wyświetlaniem w skali 100%",
  "<h3> Wersja ALPHA 0.2.0</h3> <h4>30/05/2023</h4> <br> - Dodano system zapisów gry<br> - Dodano menu Lista zmian <br> - Dodano trzy nowe autobusy: <br> |- Solaris Urbino 24 <br> |- Solaris Alpino 8.6 <br> |- Man Lion's City",
  "<h3> Wersja ALPHA 0.3.0</h3> <h4>01/06/2023</h4> <br> - Zmieniono menu na wyjmowane z lewej <br> - Zmieniono powiększenie w sklepie z autobusami z 1.1 na 1.05 <br> - Zamiast osobnych menu na autobusy, trolejbusy itp. są teraz kategorie <br> - Po najechaniu na opcję w menu wyświetla się mały opis <br> - Zamiast tekstu w menu teraz są ikonki <br> - Poprawiono wyświetlanie na urzadzeniach mobilnych <br> - Dodano automatyczne zapisy <br> - Dodano 4 nowe autobusy: <br> |- Solaris Urbino 12 Hydrogen <br> |- Solaris Urbino 18 Hydrogen <br> |- Jelcz M121M <br> |- Man Lion's City GXL",
  "<h3> Wersja ALPHA 0.3.1</h3> <h4>01/06/2023</h4> <br> - Zmieniono rozmiar czcionki w polach Pieniądze, Autobusy itp.",
  '<h3> Wersja ALPHA 0.4.0</h3> <h4>14/08/2024</h4> <br> - Zmieniono system kupna autobusów. Od teraz można kupować wiele autobusów na raz <br> - Menu "Lista zmian" zostało zmienione aby było bardziej czytelne <br> - Dodano okno dla przycisku "Kody" - na ten moment nie robi nic specjalnego <br> - Dodano okno dla przycisku "Kup ulepszenia" - funkcjonalność zostanie dodana w przyszłości <br> - Kilka błędów zostało naprawionych <br> - Wiadomości "Nie masz wystarczająco pieniędzy!" zostały zamienione na "Nie stać cię!" <br> - Dodano 2 nowe autobusy: <br> |- Solaris Vacanza 12 <br> |- Solaris Vacanza 13 <br> - Wiele innych mniejszych zmian i poprawek',
  "<h3>Wersja ALPHA 0.5.0</h3> <h4>12/10/2024</h4><br /> - Dodano system logowania, tworzenia konta itp. <br /> - Poprawki interfejsu, estetyki <br /> - Wiele poprawek i optymalizacji kodu gry <br /> - Gra zapisuje się teraz co 90 sekund zamiast co 3 sekundy, ponieważ dane są teraz przesyłane na serwery a nie zapisywane lokalnie(jedyne co przechowujemy to dane gry typu ilość pieniędzy itp. oraz twój email więc nie ma się o co martwić 😉) <br /> - Nowe menu listy zmian (tak, znowu) <br /> - Od teraz wpisanie zera w polu ilości autobusów przy kupnie autobusu nie nie zostanie zaakceptowane i nic się nie stanie <br /> - Wiele innych mniejszych zmian i poprawek",
  "<h3>Wersja ALPHA 0.6.0</h3> <h4>12/11/2024</h4> <br /> - Dodano system ulepszeń <br /> - Nowy wygląd menu kupna pojazdów <br /> - Autobusy są od teraz podzielone na trzy podkategorie <br /> - Dodano ekran ładowania <br /> - Nowy system wyświetlania wiadomości dla użytkownika <br /> - Przy otwieraniu i zamykaniu menu nawigacji jest teraz nowa animacja <br /> - Wiele poprawek wyglądu gry, m. in. nowe ikony <br /> - Wiele poprawek błędów <br /> - Wiele małych zmian <br /> - Optymalizacja kodu gry <br />",
  "<h3>Wersja ALPHA 0.6.1</h3> <h4>13/11/2024</h4> <br /> - Dodano brakującą ikonę <br />",
  "<h3>Wersja ALPHA 0.6.2</h3> <h4>19/11/2024</h4> <br /> - Duże liczby są od teraz skrócone <br /> - Ilość pieniędzy zmienia się teraz 10 razy na sekundę <br /> - Dodano weryfikację adresów email <br /> - Dodano dwa nowe autobusy w kategorii Autobusy Wodorowe: <br /> |- Toyota FC Bus <br /> |- Toyota Sora <br /> - Kod gry został bardzo zoptymalizowany i poprawiony, więc gra się szybciej ładuje i wszystko działa sprawniej <br /> - Poprawki błędów <br />",
];

// opening changelog menu
const navItemOpenChangeLog = document.getElementById("nav-item-open-changelog");
navItemOpenChangeLog.addEventListener(
  "click",
  function () {
    const changelogmenu = document.getElementById("changelog");
    changelogmenu.style.display = "block";
  },
  false
);

// closing changelog menu
const closeChangeLogBtn = document.getElementById("close-changelog-btn");
closeChangeLogBtn.addEventListener(
  "click",
  function () {
    const changelogmenu = document.getElementById("changelog");
    changelogmenu.style.display = "none";
  },
  false
);
