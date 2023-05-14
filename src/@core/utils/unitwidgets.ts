const findReplaceCode = (key: string, inputString: string): string | number | undefined => {
    const regex = new RegExp(`\\[${key}:(.*?)\\]`)
    const match = inputString.match(regex);
    if (match && match[1]) {
        // If the value can be converted to a number, return it as a number.
        return isNaN(Number(match[1])) ? match[1] : Number(match[1]);
    }
    return undefined; // Return undefined if the pattern is not found.
}

function findReplaceCodesByKey(inputString: string, key: string): Array<string | number> {
    const regex = new RegExp(`\\[${key}:(.*?)\\]`, 'g');
    const values: Array<string | number> = [];
    let match;

    while ((match = regex.exec(inputString)) !== null) {
        if (match[1]) {
            // If the value can be converted to a number, add it as a number.
            values.push(isNaN(Number(match[1])) ? match[1] : Number(match[1]));
        }
    }
    return values; // Return the array of values.
}


function getValueFromShortcode(shortcode: string): string | number {
    const regex = /\[.*:(.*)\]/;
    const match = shortcode.match(regex);
    return match && match[1] ? (isNaN(Number(match[1])) ? match[1] : Number(match[1])) : '';
}
function getValueFromString(shortcode: string): string | number {
    const regex = /.*:(.*)/;
    const match = shortcode.match(regex);
    return match && match[1] ? (isNaN(Number(match[1])) ? match[1] : Number(match[1])) : '';
}


export {
    findReplaceCode,
    getValueFromShortcode,
    findReplaceCodesByKey,
    getValueFromString
}