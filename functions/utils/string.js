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

export function slugify(string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-')                    // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-')                  // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')                // Remove all non-word characters
        .replace(/\-\-+/g, '-')                  // Replace multiple - with single -
        .replace(/^-+/, '')                      // Trim - from start of text
        .replace(/-+$/, '')                      // Trim - from end of text
}