```javascript --run
runmd.importMap = {
  imports: {
    simplur: './src/simplur.ts',
  },
};
```

# Simplur

Simple, versatile string pluralization

## Upgrading to Version 4

`simplur@4` has no API changes from version 3. The only change is it is now ESM-only. (I.e. CommonJS is no longer supported.) [ESM Module FAQ](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

## Installation

```
npm i simplur
```

```javascript --run
import simplur from 'simplur';
```

## Usage

`simplur` is an ES6 [template tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) that formats pluralization tokens based on the quantities injected into the string.

> [!IMPORTANT]
>
> Quantities must either be `number`s (simple case) or `Array`s. Other types will be ignored.

### Simple case

Pluralization tokens have the form "`[singular|plural]`" and are resolved
using the first expression found to the left of each token or, if no
left-expression is available, the first expression to the right.

```javascript --run
simplur`I have ${1} kitt[en|ies]`; // RESULT
simplur`I have ${3} kitt[en|ies]`; // RESULT

simplur`There [is|are] ${1} m[an|en]`; // RESULT
simplur`There [is|are] ${5} m[an|en]`; // RESULT
```

### Multiple tokens

Multiple tokens and quantities are allowed. These follow the same rules as above.

```javascript --run
simplur`There [is|are] ${1} fox[|es] and ${4} octop[us|i]`; // RESULT
simplur`There [is|are] ${4} fox[|es] and ${1} octop[us|i]`; // RESULT
```

### Tokens as expressions

`simplur` inlines all `string` template values prior to processing, allowing you
to pass pluralization tokens as values.

```javascript --run
const pets = ['dog[|s]', 'lazy cat[|s]', 'wily fox[|es]'];

simplur`I love my ${3} ${pets[1]}`; // RESULT
```

### Custom quantities

Quantity values may be customized using value of the form, `[quantity, format function]`. For example:

```javascript --run
function format(qty) {
  return qty == 1 ? 'sole' : qty == 2 ? 'twin' : qty;
}

simplur`Her ${[1, format]} br[other|ethren] left`; // RESULT
simplur`Her ${[2, format]} br[other|ethren] left`; // RESULT
simplur`Her ${[3, format]} br[other|ethren] left`; // RESULT
```

#### Hiding quantities

Quantities may be hidden by omitting the format function (i.e. just pass the
value in an `Array`), or by returning `null` or `undefined` from the quantity
function.

**Note:** _Whitespace immediately following a hidden quantity will be removed._

```javascript --run
simplur`${[1]} gen[us|era]`; // RESULT
simplur`${[2]} gen[us|era]`; // RESULT

function hideSingular(qty) {
  return qty == 1 ? null : qty;
}

simplur`Delete the ${[1, hideSingular]} cact[us|i]?`; // RESULT
simplur`Delete the ${[2, hideSingular]} cact[us|i]?`; // RESULT
```
