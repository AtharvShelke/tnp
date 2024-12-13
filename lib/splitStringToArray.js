export const stringToArray = (string) => {
    const arrayFromString = string.split(',').map(item=>item.trim());
    return arrayFromString;
}