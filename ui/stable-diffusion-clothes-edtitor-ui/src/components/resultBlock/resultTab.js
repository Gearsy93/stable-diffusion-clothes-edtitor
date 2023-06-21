export function ResultTab({image, isResultLeftTab, textLeft, textRight, OnResultLeftTabClick, OnResultRightTabClick, }) {
    if (image) {
        if (isResultLeftTab === true) {
            return (
                <div className="input-tab-box">
                    <SelectedTab text={textLeft} onClick={OnResultLeftTabClick}/>  
                    {/*<NoSelectedTab text={textRight} onClick={OnResultRightTabClick}/>*/}
                </div>
            )
        }
        else {
            return (
                <div className="input-tab-box">
                    <NoSelectedTab text={textLeft} onClick={OnResultLeftTabClick}/>  
                    <SelectedTab text={textRight} onClick={OnResultRightTabClick}/>
                </div>
            )
        }
    }
}

function SelectedTab({text, onClick}) {
    return (
        <div className="result-selected-tab" onClick={onClick}>
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
        <div className="result-not-selected-tab" onClick={onClick}>
            <p className="result-tab-text">
                {text}
            </p>
        </div>
    )
}