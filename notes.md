# Ziele

1. Bei jedem von MongoDB zurückgelieferten Dokument soll die Methode `save()` gewrappt sein.
   - Weg: Schema-Middleware 'init' nutzen: `schema.post('init', ...)`
   - OKAY - scheint zu funktionieren
1. Model-Konstruktor anpassen, so dass bei jedem erzeugten Dokument die Methode `save()` gewrappt wird.
   - Weg: Ergebnis von mongoose.model() in neue Klasse einbetten, um Konstruktor überladen zu können...
   - OKAY - scheint zu funktionieren
1. Model-Funktionen anpassen, so dass bei jeder erzeugten Query die Methode `exec()` gewrappt wird.
   - Weg: Ergebnis von mongoose.model() verändern
   - OKAY - scheint zu funktionieren

# Schema

# Model

# Query

- Beispiel 'findOne':
  - aufgrund von `schema.pre('findOne', ...)` liefert jeder synchrone Aufruf von `model.findOne()` eine angepasste Query
  - `query.exec()` und `query.then()` enthalten Wrapper
  - ABER: `await query` benutzt nicht den Wrapper... (keine Testausgabe "query-action" erscheint)
  - PROBLEM: Die Query wird asynchron und daher zu spät angepasst.

```js
const query = Model.findOne()
// query enthält nicht Wrapper
const document = await query
// query enthält Wrapper
```

# Document
