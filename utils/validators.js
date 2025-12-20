function isValidImageUrl(url) {
    try {
        const parsed = new URL(url);
        const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        return validExtensions.some(ext => parsed.pathname.toLowerCase().endsWith(ext));
    } catch {
        return false;
    }
}

module.exports = { isValidImageUrl };
