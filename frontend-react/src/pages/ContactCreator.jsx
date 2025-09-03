import { homePageSvgs } from "../cmps/Svgs"

export function ContactCreator() {


    return (
        <section className="contact-creator-container">
            <h2>אהבתם את האפליקציה?</h2>
            <p>אני זמין לכל שאלה, התייעצות או קביעת פגישה. אל תהססו לפנות אליי:</p>
            <div className="contact-creator-icons">
                <a href="https://wa.me/972526861893" target="_blank" rel="noopener noreferrer">{homePageSvgs.whatsappLogo}</a>
            </div>
        </section>
    )
}