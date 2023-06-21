export function CancelButton({cancelImageGen, imageGenStarted}) {
    if (imageGenStarted) {
        return (
            <button className='reject-button' type='button' onClick={cancelImageGen}>
                <p className='result-button-text'>
                    Отменить генерацию
                </p>
            </button>
        )
    }
}