import {IconContext} from "react-icons";
import {IoImageOutline} from "react-icons/io5";

export function ImageView({resultImage}) {
    if (resultImage !== null) {
        return (
            <div className='image-body' style={{display: 'flex', justifyContent: 'center'}}>
                <img src={resultImage} alt="Generated" style={{'height':'40vh'}}/>
            </div>
        )
    }
    else {
        return (
            <div className="input-drop">
                <div className="upload-image">
                    <IconContext.Provider value={{ color: "#FFBB55", className: "io5", size: "25px"}}>
                        <IoImageOutline size={80}/>
                    </IconContext.Provider>
                </div>
            </div>
        )
    }
}