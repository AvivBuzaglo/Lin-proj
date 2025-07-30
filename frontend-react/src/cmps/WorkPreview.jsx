
export function WorkPreview({setShowPic, setImgUrl}) {

    const handleImgClick = (imgUrl) => {
        setImgUrl(imgUrl)
        setShowPic(true)
    }

    return(
        <section className="work-gallery-container">
            <ul className="work-gallery-list">
                <li><button onClick={() => handleImgClick("/imgs/Lin-Peretz-Job1.jpg")} className="work-gallery-btn"><img src="/imgs/Lin-Peretz-Job1.jpg"/></button></li>
                <li><button onClick={() => handleImgClick("/imgs/Lin-Peretz-Job2.jpg")} className="work-gallery-btn"><img src="/imgs/Lin-Peretz-Job2.jpg"/></button></li>
                <li><button onClick={() => handleImgClick("/imgs/Lin-Peretz-Job3.jpg")} className="work-gallery-btn"><img src="/imgs/Lin-Peretz-Job3.jpg"/></button></li>
                <li><button onClick={() => handleImgClick("/imgs/Lin-Peretz-Job4.jpg")} className="work-gallery-btn"><img src="/imgs/Lin-Peretz-Job4.jpg"/></button></li>
                <li><button onClick={() => handleImgClick("/imgs/Lin-Peretz-Job5.jpg")} className="work-gallery-btn"><img src="/imgs/Lin-Peretz-Job5.jpg"/></button></li>
                <li><button onClick={() => handleImgClick("/imgs/Lin-Peretz-Job6.jpg")} className="work-gallery-btn"><img src="/imgs/Lin-Peretz-Job6.jpg"/></button></li>
                <li><button onClick={() => handleImgClick("/imgs/Lin-Peretz-Job7.jpg")} className="work-gallery-btn"><img src="/imgs/Lin-Peretz-Job7.jpg"/></button></li>
            </ul>
        </section>
    )

}