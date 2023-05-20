export function ResultTab({image}) {
    if (image) {
        return (
            <div className="result-tab">
                <p className="result-tab-text">
                    Результат
                </p>
                <div className='result-hide-crutch'>
                </div>
            </div>
        )
    }
}