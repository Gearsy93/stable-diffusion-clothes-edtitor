export function ExpandButton({expandParams, OnExpandParams}) {
    
    if (expandParams === true) { 
        return (
            <div className="expand-params-body">
                <button type='button' className="expand-params-view" onClick={OnExpandParams}>
                    <p className="expand-params-text">
                    Свернуть параметры
                    </p>
                </button>
            </div>
        )
    }
    else {
        return (
            <div className="expand-params-body">
                <button type='button' className="expand-params-view" onClick={OnExpandParams}>
                    <p className="expand-params-text">
                        Параметры...
                    </p>
                </button>
            </div>
        )
    }
}