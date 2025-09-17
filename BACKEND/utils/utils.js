function capitalizeFirstLetter(name) {
    if (typeof name !== 'string' || name.trim() === '') {
        return name; // Return the input if it's not a string or is an empty string
    }
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

module.exports = {capitalizeFirstLetter}