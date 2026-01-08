import { homePageSvgs } from "./Svgs.jsx"


export function NoticeBoard() {

    return (
        <section className="notice-board-container">
            <h3>{homePageSvgs.megaphone} לוח מודעות &nbsp;</h3>
            <div className="notice-board">
                <span></span>
            </div>
        </section>
    )
}