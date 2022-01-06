export default function Error({ text, onDismiss }) {
    return (
        <div className="error">
            <span>{ text }</span>
            <button type="button" onClick={() => onDismiss()}>
                <i className="fas fa-times"></i>
            </button>
        </div>
    )
}
