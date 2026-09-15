export const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

export const validateInput = (input) => {
    return input && input.trim() !== '';
};

export const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};