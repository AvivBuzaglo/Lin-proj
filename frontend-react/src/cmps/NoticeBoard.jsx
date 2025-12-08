import { homePageSvgs } from "./Svgs.jsx"


export function NoticeBoard() {

    return (
        <section className="notice-board-container">
            <h3>{homePageSvgs.megaphone} לוח מודעות &nbsp;</h3>
            <div className="notice-board">
                <span>לקוחות יקרים שימו לב. החל מתאריך 10/10/2025 אני שם עליכם זין</span>
            </div>
        </section>
    )
}