import React from "react"
import Slider from "react-slick"
import { homePageSvgs } from "./Svgs.jsx"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"


export function WorkPreview({setShowPic, setImgUrl}) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    }
    const handleImgClick = (imgUrl) => {
        setImgUrl(imgUrl)
        setShowPic(true)
    }

    return(
        <section className="work-gallery-container">
            <h3>{homePageSvgs.carousel} גלריית עבודות &nbsp;</h3>
            <Slider {...settings}>
                <div className="slide"><img src="/imgs/Lin-Peretz-Job1.jpg" alt="1" className="carousel-img" onClick={() => handleImgClick("/imgs/Lin-Peretz-Job1.jpg")}/></div>
                <div className="slide"><img src="/imgs/Lin-Peretz-Job2.jpg" alt="2" className="carousel-img" onClick={() => handleImgClick("/imgs/Lin-Peretz-Job2.jpg")}/></div>
                <div className="slide"><img src="/imgs/Lin-Peretz-Job3.jpg" alt="3" className="carousel-img" onClick={() => handleImgClick("/imgs/Lin-Peretz-Job3.jpg")}/></div>
                <div className="slide"><img src="/imgs/Lin-Peretz-Job4.jpg" alt="4" className="carousel-img" onClick={() => handleImgClick("/imgs/Lin-Peretz-Job4.jpg")}/></div>
                <div className="slide"><img src="/imgs/Lin-Peretz-Job5.jpg" alt="5" className="carousel-img" onClick={() => handleImgClick("/imgs/Lin-Peretz-Job5.jpg")}/></div>
                <div className="slide"><img src="/imgs/Lin-Peretz-Job6.jpg" alt="6" className="carousel-img" onClick={() => handleImgClick("/imgs/Lin-Peretz-Job6.jpg")}/></div>
                <div className="slide"><img src="/imgs/Lin-Peretz-Job7.jpg" alt="7" className="carousel-img" onClick={() => handleImgClick("/imgs/Lin-Peretz-Job7.jpg")}/></div>
            </Slider>
        </section>
    )

}