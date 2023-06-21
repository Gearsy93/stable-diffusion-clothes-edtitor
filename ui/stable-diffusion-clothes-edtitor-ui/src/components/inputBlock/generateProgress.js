import ReactLoading from 'react-loading';

export function GenerateProgress({promptGenStarted, cancelPromptGet}) {
    if (promptGenStarted === true) {
        return (
            <>
                <div className="prompt-loading">
                    <ReactLoading type={"spin"} color={"#FFBB55"} height={"5%"} width={"5%"} />
                </div>
                <button className='reject-button' type='button' onClick={cancelPromptGet}>
                    <p className='result-button-text'>
                        Отменить генерацию
                    </p>
                </button>
            </>
        )
    }
}