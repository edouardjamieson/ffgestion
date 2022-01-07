export default function Modal({ children, title, onExit }) {
    return (
        <div className="modal">
            <div className="modal-screen" onClick={() => onExit()}></div>
            <div className="modal-container">

                <div className="modal-head">
                    <span>{ title }</span>
                    <button type="button" onClick={() => onExit()}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-content">
                    { children }
                </div>
            </div>
            
        </div>
    )
}
