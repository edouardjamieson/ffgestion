export default function CalendarCell({ children, styles, dataDate }) {
    return (
        <div className={styles} data-date={dataDate}>
            { children }
        </div>
    )
}
