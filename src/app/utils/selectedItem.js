
export default (match, items, key) => items.find((item) => item._id === match.params[key]);

