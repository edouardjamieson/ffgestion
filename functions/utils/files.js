export function checkIfImage(type, excludedExtensions) {
    const file_type = type.split('/')[0]
    const file_ext = type.split('/')[1]

    if(file_type !== "image") return false
    if(excludedExtensions.includes(file_ext)) return false

    return true

}

export function sanitizeFileName(string) {
    const sanitized = string.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return sanitized.trim();
}