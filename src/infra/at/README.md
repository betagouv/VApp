# AT = Aides Territoires

aid_step_slugs
string
(query)

Avancement du projet.

Vous pouvez passer plusieurs fois ce paramètre pour rechercher sur plusieurs types, ex :
...&aid_step_slugs=preop&aid_step_slugs=postop...

Voir aussi /api/aids/steps/ pour la liste complète.
(mobilziation sterps)

```html
<select class="examples-select-element">
  <!-- op -->
  <option value="1">Mise en œuvre / réalisation</option>
  <!-- preop -->
  <option value="2">Réflexion / conception</option>
  <!-- postop -->
  <option value="3">Usage / valorisation</option>
</select>
```

"Actions concernées"
aid_destination_slugs
string
(query)
Actions concernées.

Vous pouvez passer plusieurs fois ce paramètre pour rechercher sur plusieurs thématiques, ex :
...&aid_destination_slugs=supply&aid_destination_slugs=investment...

Voir aussi /api/aids/destinations/ pour la liste complète.
Examples:

```
investment
supply
```

```html
<select class="examples-select-element">
  <option value="1">Dépenses d’investissement</option>
  <option value="2">Dépenses de fonctionnement</option>
</select>
```

[
Nature de l'aide]()
aid_type_group_slug
string
(query)
Groupe de la nature de l'aide.

```php
public const SLUG_FINANCIAL = 'financial-group';
public const SLUG_TECHNICAL = 'technical-group';
```

```html
<select class="examples-select-element">
  <option value="1">Aide en ingénierie</option>
  <option value="2">Aide financière</option>
</select>
```

aid_type_slugs
Type d'aides financières ou en ingénierie.
Vous pouvez passer plusieurs fois ce paramètre pour rechercher sur plusieurs types, ex :
...&aid_type_slugs=recoverable-advance&aid_type_slugs=legal-engineering...
Voir aussi /api/aids/types/ pour la liste complète.
Nature de l'aide

```php
    public const TYPE_FINANCIAL_SLUGS = ['grant', 'loan', 'recoverable-advance', 'other', 'cee'];
    public const TYPE_TECHNICAL_SLUG = ['technical-engineering', 'financial-engineering', 'legal-engineering'];

    public const SLUG_GRANT = 'grant';
    public const SLUG_LOAN = 'loan';
    public const SLUG_RECOVERABLE_ADVANCE = 'recoverable-advance';
    public const SLUG_CEE = 'cee';
    public const SLUG_OTHER = 'other';

    public const SLUG_TECHNICAL_ENGINEERING = 'technical-engineering';
    public const SLUG_FINANCIAL_ENGINEERING = 'financial-engineering';
    public const SLUG_LEGAL_ENGINEERING = 'legal-engineering';
```

Nature de l'aide

```html
<select class="examples-select-element">
  <!-- technical -->
  <option value="4">Ingénierie financière</option>
  <option value="5">Ingénierie Juridique / administrative</option>
  <option value="6">Ingénierie technique</option>

  <!-- financial -->
  <option value="1">Autre aide financière</option>
  <option value="2">Avance récupérable</option>
  <option value="3">Certificat d'économie d'énergie (CEE)</option
  <option value="7">Prêt</option>
  <option value="8">Subvention</option>
</select>
```

```json
      "aid_types": ["Subvention"],
      "aid_types_full": [
        {
          "id": 1,
          "name": "Subvention",
          "group": {
            "id": 1,
            "name": "Aide financi\u00e8re"
          }
        }
      ],
```

## Notes

For filtering slug are used but they are never send back whent requesting data, only label and numeric id are used.
