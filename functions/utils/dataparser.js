export function parseFirebaseDocs(docs) {
    return docs.map(doc => ({ id: doc.id, data: doc.data() }))
}
export function parseFirebaseDoc(doc) {
    return {id: doc.id, data: doc.data()}
}

export function getMonthInFrench(month) {
    switch (month) {
        case "January":
            return "Janvier"
        case "February":
            return "Février"
        case "March":
            return "Mars"
        case "April":
            return "Avril"
        case "May":
            return "Mai"
        case "June":
            return "Juin"
        case "July":
            return "Juillet"
        case "August":
            return "Août"
        case "September":
            return "Septembre"
        case "October":
            return "Octobre"
        case "November":
            return "Novembre"
        case "December":
            return "Décembre"
    }
}