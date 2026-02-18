export default function (stringsArg, ...exps) {
    const strings = [...stringsArg]; // Writable copy of strings
    const result = [];
    const { isArray } = Array;
    // Inline string expressions (to handle case where a template token may be passed as a quantity)
    let i = 0;
    while (i < exps.length) {
        const exp = exps[i];
        if (typeof exp == 'string') {
            strings[i] += exp + strings[i + 1];
            strings.splice(i + 1, 1);
            exps.splice(i, 1);
        }
        else {
            i++;
        }
    }
    // Convert quantity expressions to [quantity, quantity string] tuples
    exps.forEach((v, i) => {
        if (typeof v == 'number') {
            exps[i] = [v, v];
        }
        else if (isArray(v)) {
            if (typeof v[0] == 'number') {
                exps[i] = [v[0], typeof v[1] == 'function' ? v[1](v[0]) : null];
            }
            else {
                // Edge case where the caller injects an Array but doesn't intend for it
                // to be treated as a quantity.  Not worth solving at present.
                throw TypeError('First item in array must be a Number');
            }
        }
    });
    // Initialize the quantity to use for pluralization
    let quantity = exps.find(isArray);
    let last;
    for (let s of strings) {
        // Trim leading whitespace hidden quantities
        if (isArray(last) && last[1] == null) {
            s = s.replace(/^\s+/, '');
        }
        // Push current string, pluralizing if we have a valid quantity
        if (quantity) {
            result.push(s.replace(/\[([^|]*)\|([^\]]*)\]/g, quantity[0] == 1 ? '$1' : '$2'));
        }
        else {
            result.push(s);
        }
        if (!exps.length)
            break;
        // Locate next quantity
        quantity = exps.find(isArray) || quantity;
        // Push quantity string
        last = exps.shift();
        result.push(last === quantity ? quantity?.[1] : last);
    }
    return result.join('');
}
