# Ricettario Ricciardino

Ricettario di famiglia pubblicato come sito statico. Le ricette vengono aggiunte a partire da screenshot (foto di libri, screenshot di siti/app/social) che l'utente fornisce; il testo viene letto dallo screenshot e trasformato in un file di ricetta del sito.

## Stack tecnico

- Generatore di sito statico: [Eleventy (11ty) 3.x](https://www.11ty.dev/)
- Template: Nunjucks (`.njk`)
- Hosting: GitHub Pages, repository pubblico [Gloria981/ricettario-ricciardino](https://github.com/Gloria981/ricettario-ricciardino)
- Deploy: automatico via GitHub Actions (`.github/workflows/deploy.yml`) a ogni push su `main`
- Sito pubblicato su: https://gloria981.github.io/ricettario-ricciardino/

## Comandi

```bash
npm run build   # genera il sito in _site/
npm run serve   # server locale con live reload, per vedere le modifiche
```

`_site/` è generata e ignorata da git: non va mai committata.

## Struttura del progetto

```
src/
  ricette/            ricette, un file .md per ricetta
    ricette.json      dati di default per la cartella (imposta il layout ricetta.njk)
  immagini/            foto delle ricette
  _includes/
    base.njk          layout HTML di base (header, nav, footer)
    ricetta.njk        layout di una singola ricetta
  index.njk            homepage: elenco alfabetico di tutte le ricette
  tags.njk              /tag/ elenco di tutti i tag
  tag.njk                /tag/<tag>/ pagina di un singolo tag (una per tag, via pagination)
  cerca.njk              /cerca/ ricerca testuale lato client per nome ricetta
  ricette-indice.11ty.js  genera /ricette-indice.json, usato dalla pagina di ricerca
  style.css
eleventy.config.js
.github/workflows/deploy.yml
.claude/skills/nuova-ricetta/   skill per creare una ricetta da uno screenshot
```

## Schema di una ricetta (`src/ricette/<slug>.md`)

Frontmatter YAML + corpo markdown per il procedimento:

```markdown
---
titolo: "Torta al cioccolato"
tempo_preparazione: "45 minuti"
porzioni: "4 persone"
tipo_piatto: "dolce"
immagine: "/immagini/torta-al-cioccolato.jpg"
tags:
  - torta al cioccolato
  - cioccolato
  - farina
  - uova
  - dolce
ingredienti:
  - "200g di cioccolato fondente"
  - "150g di farina"
  - "3 uova"
  - "150g di zucchero"
extra: |
  Valori nutrizionali: ~350 kcal a porzione.
  Considerazioni: perfetta per i compleanni, si mantiene morbida per 3 giorni.
---
1. Sciogliere il cioccolato a bagnomaria.
2. Montare le uova con lo zucchero.
3. Unire il cioccolato e la farina setacciata.
4. Cuocere in forno a 180°C per 30 minuti.
```

Campi:

- **titolo** (obbligatorio): nome della ricetta.
- **tempo_preparazione** (opzionale): solo se indicato nella fonte originale, non va inventato.
- **porzioni** (opzionale): per quante persone/porzioni sono le quantità indicate, solo se presente nella fonte originale (es. "4 persone").
- **tipo_piatto** (obbligatorio): uno tra `antipasto`, `primo`, `secondo`, `contorno`, `dolce`.
- **immagine** (opzionale): percorso assoluto `/immagini/<slug>.<estensione>`, solo se nello screenshot originale era presente una foto del piatto.
- **tags** (obbligatorio): il nome della ricetta, un tag per ogni ingrediente principale (solo il nome dell'ingrediente, non la quantità), più il tipo di piatto. Sempre minuscolo.
- **ingredienti** (obbligatorio): elenco con quantità.
- **extra** (opzionale): testo con altre informazioni presenti nella fonte originale che non rientrano negli altri campi (es. valori nutrizionali, considerazioni/note dell'autore, voto). Non va scartato: se la fonte contiene questi contenuti, vanno riportati qui così com'erano, non riassunti né inventati. Non includere didascalie puramente social (call-to-action, hashtag, ringraziamenti/crediti ad altri account) che non riguardano la ricetta in sé.
- **corpo del file** (dopo il frontmatter): il procedimento, come elenco numerato.

### Convenzioni di naming

- Nome file ricetta e nome file immagine condividono lo stesso slug: minuscolo, senza accenti, spazi sostituiti da `-` (es. "Torta al cioccolato" → `torta-al-cioccolato.md` / `torta-al-cioccolato.jpg`).
- I tag sono sempre in minuscolo. Riusa la stessa dicitura già usata in altre ricette per lo stesso ingrediente (es. sempre "pomodoro", mai a volte "pomodori") per evitare tag duplicati/simili nella pagina `/tag/`.

## Come funziona il routing (`pathPrefix`)

Il sito è ospitato come *project site* GitHub Pages, quindi vive sotto il sottopercorso `/ricettario-ricciardino/` (non alla radice del dominio). Per questo:

- `eleventy.config.js` imposta `pathPrefix` dalla variabile d'ambiente `ELEVENTY_PATH_PREFIX` (il workflow la imposta a `/ricettario-ricciardino/` in produzione; in locale resta `/`).
- **Tutti** i link interni nei template usano il filtro `| url` (es. `{{ '/tag/' | url }}`, `{{ ricetta.url | url }}`) invece di percorsi assoluti scritti a mano, altrimenti in produzione i link puntano nel posto sbagliato.
- Se aggiungi nuovi link interni o nuovi asset statici, ricordati di passarli sempre attraverso `| url`.

## Aggiungere una ricetta

Usa la skill `nuova-ricetta` (in `.claude/skills/nuova-ricetta/SKILL.md`): fornisci uno screenshot della ricetta e chiedi di aggiungerla al ricettario. La skill legge lo screenshot, genera il file `.md` secondo lo schema sopra e salva l'immagine se presente.

## Pubblicazione (git push)

**Non fare commit/push automaticamente.** Il deploy è automatico a ogni push su `main`, quindi ogni push pubblica subito sul sito live: fai commit e push solo quando l'utente lo chiede esplicitamente, anche per singole ricette aggiunte una alla volta.
