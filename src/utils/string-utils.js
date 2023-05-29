export const isBlank = (text) => {
    return text?.trim() ? false : true;
}

export const cleanString = (text) => {
    return text.trim().replace(/\s{2,}/g, " ");
}

export const cleanInput = (input) => {
    return input === undefined ? undefined : cleanString(input);
}

export const isEmail = (text) => {
    const match = text?.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    return match ? true : false;
}