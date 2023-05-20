export function InputTabBox({image, isLeftTab, textLeft, textRight, onLeftTabClick, onRightTabClick}) {
    if (image) {
        if (isLeftTab === true) {
            return (
                <div className="input-tab-box">
                    <SelectedTab text={textLeft} onClick={onLeftTabClick}/>  
                    <NoSelectedTab text={textRight} onClick={onRightTabClick}/>
                </div>
            )
        }
        else {
            return (
                <div className="input-tab-box">
                    <NoSelectedTab text={textLeft} onClick={onLeftTabClick}/>  
                    <SelectedTab text={textRight} onClick={onRightTabClick}/>
                </div>
            )
        }
    }
}

function SelectedTab({text, onClick}) {
    return (
        <div className="input-selected-tab" onClick={onClick}>
            <p className="input-selected-tab-text">
                {text}
            </p>
            <div className='input-hide-crutch'>
            </div>
        </div>
    )
}

function NoSelectedTab({text, onClick}) {
    return (
        <div className="input-not-selected-tab" onClick={onClick}>
            <p className="result-tab-text">
                {text}
            </p>
        </div>
    )
}