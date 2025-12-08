import React from "react"
import { homePageSvgs } from "./Svgs.jsx"


export function ContactInfo() {
    const lat = 31.250063
    const lng = 34.761478
    const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

    return (
        <section className="contact-info-container">
            <h3>{homePageSvgs.pin} איך מגיעים? &nbsp; <br /> <span>הגאונים 17, באר שבע</span></h3>
            <div className="map-container">
                <iframe
                    title="Business Location"
                    width="100%"
                    height="250"
                    style={{border:"0", borderRadius:"25px"}}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.001}%2C${lat-0.001}%2C${lng+0.001}%2C${lat+0.001}&layer=mapnik&marker=${lat}%2C${lng}`}
                ></iframe>
            </div>
            <div className="apps-btns">
                <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="waze-btn">{homePageSvgs.waze}&nbsp; Waze</a>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="google-btn">{homePageSvgs.googleMaps}&nbsp; Google Maps</a>
            </div>
        </section>
    )
}