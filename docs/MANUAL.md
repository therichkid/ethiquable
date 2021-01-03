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

Admin-Panel: https://www.ethiquable.de/wp-admin/

## Post-Typen und deren Bearbeitung

### Beiträge

https://www.ethiquable.de/magazin und Startseite.

Felder:

- Abweichender Autor
  - Ausfüllen, falls der Autor des Textes vom WordPress-Benutzer abweicht, sonst leerlassen.
- Textauszug
  - Taucht auf der Übersichtsseite auf.
  - Text sollte möglichst kurz sein.
  - Muss erst in WordPress aktiviert werden: `Ansicht anpassen` (rechts oben) &rarr; `Textauszug`.

Kategorien und Tags müssen nicht gesetzt werden, da sie ignoriert werden.

### Seiten

Straight forward.

Spezielle Seiten:

- **Teaser**: Ändert den großen Schriftzug auf der Startseite.
- **Fachhandel**: Ändert den Text für die Seite unter "Händler-Login". Der Text bis zum Formular kann geändert werden. Das Formular selbst wird automatisch erzeugt. Die Links haben hier ein automatisches Styling.
- **Produktkategorien**: Falls eine Seite existiert, die genauso heißt wie eine Produktkategorie, z.B. `Kaffee`, dann wird diese in der Produktübersicht über der Produktliste angezeigt. Aber noch einmal kurz überprüfen, dass der `Permalink` auch `https://www.ethiquable.de/kaffee/` heißt (und nicht `.../kaffee-1/` o.ä.).
- **Rezepte**: Wie _Produktkategorien_.

### Produkte

Felder:

- Titel
  - **NICHT** komplett in Großbuchstaben schreiben. Alle Überschriften werden dann automatisch in Großbuchstaben umgewandelt.
- Kategorie
  - **Nicht vergessen!** Sonst wird das Produkt nicht angezeigt.
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
- Siegel: Erzeugt automatisch Bilder der Siegel inkl. Verlinkung zu https://www.ethiquable.de/die-siegel.
- Rezept
- Produzent/en: Mehrfachauswahl möglich. Erstellt automatisch einen Textauszug und eine Verlinkung zum Produzenten.
- Produzent/en (Zusatz): Zusätzlicher Text, der oberhalb der verlinkten Produzenten in der rechten Spalte angezeigt wird.

**Reihenfolge ändern**: In der Übersicht ein Element an einer freien Stelle anklicken, dann kann man es mit gedrückter Maustaste verschieben. Je weiter vorne, desto eher erscheint es auf der Seite. Dies funktioniert am besten, wenn man vorher die Auswahl einschränkt: Auf das Menü "Alle Kategorien" oberhalb der Liste klicken, eine Produktkategorie auswählen (z.B. Schokolade) und dann auf "Auswahl einschränken" klicken.

### Produzenten

https://www.ethiquable.de/produzenten

Felder:

- Text: Am besten den Text von einem bereits bestehendem, aktuellen Produzenten oder das [producer-template.html](https://github.com/therichkid/ethiquable/blob/master/docs/producer-template.html) hernehmen. Im Editor werden farbige Umrandungen angezeigt. Beachte hierbei [HTML-Bausteine mit speziellen CSS-Klassen](#html-bausteine-mit-speziellen-css-klassen). Allgemeine Tipps zur Bearbeitung:
  - Es sollte immer nur einen Rahmen der selben Farbe geben.
  - Der gesamte Text sollte innerhalb des ![grau] **grauen** Rahmen sein.
  - Bilder im `ethiquable-grid` austauschen: In WordPress im Editor den `Visuell`-Modus auswählen, ein bestehendes Bild anklicken &rarr; `Bearbeiten` &rarr; `Ersetzen`. Darauf achten, dass alle Bilder im ![blau] **blauen** Rahmen sind.
  - Fließtext: Der Haupttext sollte sich im ![rot] **roten** Rahmen befinden, "In aller Kürze" und "Vor Ort" sollte darunter im ![orange] **orangenen** Rahmen sein.
  - Alternativ: HTML-Struktur im `Text`-Modus überprüfen. Hierbei beachten, dass die `div`-Elemente mit den speziellen Klassen `ethiquable-layout`, `left`, `right` und `ethiquable-grid` den richtigen Text umspannen (`<div>...</div>`) und nur jeweils einmal auftauchen:

```html
<div class="ethiquable-layout">
  <div class="left">
    <div class="ethiquable-grid">
      <img ... />
      ...
    </div>
    Haupttext ...
  </div>
  <div class="right">
    <div style="...">
      <h2>In aller Kürze</h2>
      <ul>
        ...
      </ul>
    </div>
    <h2>Vor Ort</h2>
    ...
  </div>
</div>
```

- Land (Pflichtfeld)
  - Für Filter und Karte.
  - Falls ein Land nicht existiert in der Auswahl, mir Bescheid geben.
- Zutat aus Genossenschaft: Für Filter.
- Produkt/e
- Beitragsbild: Für Übersicht.

### Rezepte

https://www.ethiquable.de/rezepte

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
- Schwierigkeit
- Rezepttyp (vegan, vegetarisch)
- Textfeld:
  - Optional einen kleinen **Einführungstext** schreiben.
  - Dann die **Zubereitung** unbedingt in einer Liste. Am besten `Nummerierte Liste`, aber auch `Aufzählungsliste` geht.
  - Falls es beides gibt und die Zubereitung eine Liste ist, kommt der Einführungstext über die Zutaten, und die Zubereitung unter die Zutaten. Sonst ist alles unter den Zutaten.

### Shops

https://www.ethiquable.de/shopfinder

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

**Reihenfolge ändern**: In der Übersicht ein Element an einer freien Stelle anklicken, dann kann man es mit gedrückter Maustaste verschieben. Je weiter vorne, desto eher erscheint es auf der Seite.

### Formulare

**Kontakt** und **Zugangsdaten für Fachhandel**. Im 2. Tab `E-Mail` kann man die E-Mails, die gesendet werden, anpassen.

Im WordPress-Menü links unter `Kontakt-Formulare` ist die Historie über alle ausgefüllten Formulare inkl. Export.

## HTML-Bausteine mit speziellen CSS-Klassen

Die folgenden Textbausteine haben CSS-Klassen für besondere Styles. Die Textbausteine werden im WordPress-Editor im `Visuell`-Modus farblich umrandet. Einfach die Elemente hier herauskopieren (`STRG` + `C`), in WordPress im Editor `Text` auswählen und dort einfügen (`STRG` + `V`). Für Produzenten am besten das [producer-template.html](https://github.com/therichkid/ethiquable/blob/master/docs/producer-template.html) hernehmen.

`ethiquable-layout` mit `left` und `right`

Farbliche Hervorhebung: ![grau] **grau**, ![rot] **rot**, ![orange] **orange**

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

Farbliche Hervorhebung: ![blau] **blau**

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

[grau]: https://via.placeholder.com/15/607d8b/000000?text=+
[rot]: https://via.placeholder.com/15/f44336/000000?text=+
[orange]: https://via.placeholder.com/15/ff9800/000000?text=+
[blau]: https://via.placeholder.com/15/2196f3/000000?text=+
[rot]: https://via.placeholder.com/15/f44336/000000?text=+
