---
name: nuova-ricetta
description: Crea una nuova ricetta per il Ricettario Ricciardino a partire da uno o più screenshot forniti dall'utente. Usa questa skill quando l'utente allega un'immagine di una ricetta (foto di un libro, screenshot di un sito/app/social) e chiede di aggiungerla, salvarla o inserirla nel ricettario.
---

# Creare una nuova ricetta da uno screenshot

## Quando attivarla
L'utente allega una o più immagini contenenti una ricetta (ingredienti + procedimento) e chiede di aggiungerla al ricettario, es. "aggiungi questa ricetta", "crea la ricetta da questo screenshot", "inserisci questa nel ricettario".

Se l'utente allega più screenshot in un solo messaggio e sono ricette diverse, ripeti l'intero processo per ciascuna ricetta, creando un file `.md` separato per ognuna.

## Passi

1. **Leggi lo/gli screenshot** allegati con lo strumento Read per capire il contenuto.

2. **Estrai le informazioni testuali** dallo screenshot:
   - Nome della ricetta
   - Tempo di preparazione, solo se indicato esplicitamente nello screenshot (altrimenti ometti il campo, non inventarlo)
   - Elenco ingredienti, uno per riga, mantenendo le quantità come scritte
   - Procedimento, come sequenza di passaggi

3. **Determina il tipo di piatto** in autonomia, scegliendo uno tra: `antipasto`, `primo`, `secondo`, `contorno`, `dolce`. Se non è chiaro in quale categoria rientri, chiedi conferma all'utente invece di indovinare.

4. **Genera lo slug** del nome ricetta: minuscolo, senza accenti né caratteri speciali, spazi sostituiti da trattini. Esempio: "Torta al cioccolato" → `torta-al-cioccolato`. Verifica che `src/ricette/<slug>.md` non esista già: se esiste, chiedi all'utente come procedere (sovrascrivere, rinominare, annullare) invece di sovrascrivere in automatico.

5. **Gestisci l'immagine**, se lo screenshot ne contiene una del piatto finito:
   - Se l'intero screenshot è già una foto del piatto (es. post social, foto di un libro con il piatto in primo piano e poco testo), salvala così com'è in `src/immagini/<slug>.jpg` (o estensione originale).
   - Se lo screenshot contiene sia testo che una foto delimitata del piatto, prova a ritagliare solo la porzione fotografica con uno strumento disponibile sul sistema (Python+Pillow, ImageMagick `convert -crop`, o `sips` su macOS). Se non riesci a ritagliare in modo affidabile, chiedi all'utente se preferisce l'immagine intera oppure nessuna immagine.
   - Se lo screenshot è solo testo, senza alcuna foto del piatto, non creare l'immagine e ometti il campo `immagine`.

6. **Determina i tag**: nome della ricetta, un tag per ciascun ingrediente principale (solo il nome, es. "farina" e non "200g di farina"), e il tipo di piatto del passo 3. Tutti i tag in minuscolo, coerenti con eventuali tag già usati in altre ricette (controlla `src/ricette/*.md` esistenti per riusare la stessa dicitura, es. sempre "pomodoro" e non a volte "pomodori").

7. **Crea il file** `src/ricette/<slug>.md` seguendo esattamente lo schema del frontmatter descritto in [CLAUDE.md](../../../CLAUDE.md). Se hai salvato un'immagine, il campo `immagine` deve puntare a `/immagini/<slug>.jpg`.

8. **Verifica la build**: esegui `npm run build` dalla radice del progetto per controllare che il sito si generi senza errori con la nuova ricetta. Poi elimina la cartella `_site/` generata (non va committata).

9. **Riepiloga** all'utente cosa hai creato (titolo, tipo piatto, tempo se presente, numero ingredienti, tag, se c'è immagine) e chiedi se vuole che tu faccia commit e push su GitHub. Non pubblicare automaticamente: il push va fatto solo quando l'utente lo chiede esplicitamente, come da convenzioni in CLAUDE.md.

## Attenzione
- Se lo screenshot è poco leggibile o alcune informazioni sono ambigue, chiedi chiarimenti invece di inventare dati mancanti.
- Non modificare ricette esistenti a meno che l'utente non lo chieda esplicitamente.
