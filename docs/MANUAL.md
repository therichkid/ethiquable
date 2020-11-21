# Bedienungsanleitung WordPress

- [Bedienungsanleitung WordPress](#bedienungsanleitung-wordpress)
  - [Post-Typen und deren Bearbeitung](#post-typen-und-deren-bearbeitung)
    - [Beiträge](#beiträge)
    - [Seiten](#seiten)
    - [Produkte](#produkte)
    - [Produzenten](#produzenten)
    - [Rezepte](#rezepte)
    - [Shops](#shops)
    - [Slides](#slides)
    - [Formulare](#formulare)
  - [HTML-Bausteine mit speziellen CSS-Klassen](#html-bausteine-mit-speziellen-css-klassen)
  - [Aufgaben, wofür ihr mich konsultieren müsst](#aufgaben-wofür-ihr-mich-konsultieren-müsst)

## Post-Typen und deren Bearbeitung

### Beiträge

http://dev.ethiquable.de/magazin und Startseite.

Straight forward.

Kategorien und Tags müssen nicht gesetzt werden, da sie ignoriert werden.

### Seiten

Straight forward.

Spezielle Seite **Teaser**: Ändert den großen Schriftzug auf der Startseite.

Falls eine Seite existiert, die genauso heißt wie eine Produktkategorie, z.B. `Kaffee`, dann wird diese in der Produktübersicht über der Produktliste angezeigt. Aber noch einmal kurz überprüfen, dass der `Permalink` auch `http://admin.ethiquable.de/kaffee/` heißt (und nicht `.../kaffee-1/` o.ä.).

### Produkte

Felder:

- Titel
  - **NICHT** komplett in Großbuchstaben schreiben. Alle Überschriften werden dann automatisch in Großbuchstaben umgewandelt.
- Kategorie
  - **Nicht vergessen!** Sonst taucht wird das Produkt nicht angezeigt.
  - Falls eine neue Produktkategorie hinzugefügt werden soll, mir Bescheid geben.
- Beitragsbild
  - Sollte einen transparenten Hintergrund haben (`.png`): https://onlinepngtools.com/create-transparent-png
  - Maße sollten auf den Inhalt zugeschnitten sein &rarr; freie Flächen wegschneiden.
- Text:
  - Nährwerttabellen können ganz einfach vom EHTIQUABLE-Shop eingefügt werden. Von einer [Shopseite](https://www.ethiquable-shop.de/aufstrich/87-erdnussmus-350-g.html) die Tabelle kopieren (`STRG` + `C`). In WordPress im Editor den `Visuell`-Modus auswählen und dort einfügen (`STRG` + `V`). Fertig. Alternativ: Tabelle aus Abschnitt [HTML-Bausteine mit speziellen CSS-Klassen](#html-bausteine-mit-speziellen-css-klassen) hernehmen.
- Untertitel: Taucht im Titel unter dem Produktnamen auf.
- Hintergrundfarbe: Wird als Hintergrundfarbe im Titel des Produkts angezeigt.
- Dekobild
  - Taucht im Header rechts auf.
  - Gleiche Regeln wie Beitragsbild.
- Shop-Link
- Siegel: Erzeugt automatisch Bilder der Siegel inkl. Verlinkung zu http://dev.ethiquable.de/die-siegel.
- Rezept
- Produzent/en: Mehrfachauswahl möglich. Erstellt automatisch einen Textauszug und eine Verlinkung zum Produzenten.
- Produzent/en (Zusatz): Zusätzlicher Text, der oberhalb der verlinkten Produzenten in der rechten Spalte angezeigt wird.

### Produzenten

http://dev.ethiquable.de/produzenten

Felder:

- Text: Am besten das [producer-template.html](https://github.com/therichkid/ethiquable/blob/master/docs/producer-template.html) hernehmen. Beachte hierbei [HTML-Bausteine mit speziellen CSS-Klassen](#html-bausteine-mit-speziellen-css-klassen).
- Land (Pflichtfeld)
  - Für Filter und Karte.
  - Falls ein Land nicht existiert in der Auswahl, mir Bescheid geben.
- Zutat aus Genossenschaft: Für Filter.
- Produkt/e
- Beitragsbild: Für Übersicht.

### Rezepte

http://dev.ethiquable.de/rezepte

Felder:

- Kategorie: Die Art des Gerichts.
  - **Nicht vergessen!** Nur eine Möglichkeit nehmen, da immer nur die erste Kategorie hergenommen wird.
- Zutaten:
  - Menge: falls keine ganze Zahl: `0,5` oder `0.5` eingeben. Nur Zahlen sind erlaubt.
  - Einheit
  - Name (Pflichfeld)
  - Shop-Link: Wenn ausgefüllt, wird die Zutat mit dem Shop verlinkt.
- Portionen: Wenn ausgefüllt, können die Zutatenmengen pro Portion berechnet werden.
- Zeitaufwand
- Textfeld:
  - Optional einen kleinen **Einführungstext** schreiben.
  - Dann die **Zubereitung** unbedingt in einer Liste. Am besten `Nummerierte Liste`, aber auch `Aufzählungsliste` geht.
  - Falls es beides gibt und die Zubereitung eine Liste ist, kommt der Einführungstext über die Zutaten, und die Zubereitung unter die Zutaten. Sonst ist alles unter den Zutaten.

### Shops

http://dev.ethiquable.de/shopfinder

Felder:

- Titel: Name des Shops.
- Adresse

### Slides

Füllt den Slider auf der Startseite. Wenn keine Slides hinzugefügt, wird der Slider nicht angezeigt.

Felder:

- Titel
- Textauszug
  - Für den Untertitel.
  - Text sollte möglichst kurz sein.
  - Muss erst in WordPress aktiviert werden: `Ansicht anpassen` (rechts oben) &rarr; `Textauszug`.
- Beitragsbild
  - Möglichst gute Qualität.
  - Sollte Breitbildformat haben.
  - Auflösung am besten um 1200 Pixel breit und 500 Pixel hoch.
- Verlinkung
  - Intern &rarr; innerhalb ETHIQUABLE-Seite: Nur Pfad ohne http(s)/www eingeben (Bsp. `/produzenten`).
  - Extern: Host mit `http(s)` / `www` und optionalem Pfad eingeben (Bsp. `www.ideas.coop` oder `https://www.ideas.coop/home`).

### Formulare

**Kontakt** und **Zugangsdaten für Fachhandel**. Im 2. Tab `E-Mail` kann man die E-Mails, die gesendet werden, anpassen.

Im WordPress-Menü links unter `Kontakt-Formulare` ist die Historie über alle ausgefüllten Formulare inkl. Export.

## HTML-Bausteine mit speziellen CSS-Klassen

Die folgenden Textbausteine haben CSS-Klassen für besondere Styles. Einfach die Elemente hier herauskopieren (`STRG` + `C`), in WordPress im Editor `Text` auswählen und dort einfügen (`STRG` + `V`). Für Produzenten am besten das [producer-template.html](https://github.com/therichkid/ethiquable/blob/master/docs/producer-template.html) hernehmen.

`ethiquable-layout` mit `left` und `right`

Zwei Spalten mit Inhalt nebeneinander, wobei die linke den meisten Platz einnimmt und die rechte schmal ist. Ist für Handys optimiert.

```html
<div class="ethiquable-layout">
  <div class="left">...</div>
  <div class="right">...</div>
</div>
```

`ethiquable-table`

Erzeugt eine Tabelle, z.B. für Nährwerte. Die Kopfzeile wird gefärbt. Standard: ETHIQUABLE-grün, wenn verfügbar: Farbe des Produkts.

```html
<table class="ethiquable-table">
  <thead>
    <tr>
      <th>Kopfzeile 1</th>
      <th>Kopfzeile 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Reihe 1 Zeile 1</td>
      <td>Reihe 1 Zeile 2</td>
    </tr>
    <tr>
      <td>Reihe 2 Zeile 1</td>
      <td>Reihe 2 Zeile 2</td>
    </tr>
  </tbody>
</table>
```

`ethiquable-grid`

Mehrere Bilder nebeneinander anzeigen. Erzeugt zusätzlich einen Rahmen um jedes Bild (Polaroid-Effekt).

```html
<div class="ethiquable-grid">
  <img ... />
  <img ... />
</div>
```

## Aufgaben, wofür ihr mich konsultieren müsst

- Neue Seiten in das Menü
- Neue Produktkategorie
- Neue Länder für Produzenten
- Änderungen im Header, Footer, Menü, spezielle Seiten (Produzentenübersicht, Rezeptübersicht, Händler)
- Hinzufügen zusätzlicher Kontaktformulare
- Änderungen in ACF-Zusatzfeldern
