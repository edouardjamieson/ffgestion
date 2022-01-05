export function parseFirebaseDocs(docs) {
    return docs.map(doc => ({ id: doc.id, data: doc.data() }))
}
export function parseFirebaseDoc(doc) {
    return {id: doc.id, data: doc.data()}
}