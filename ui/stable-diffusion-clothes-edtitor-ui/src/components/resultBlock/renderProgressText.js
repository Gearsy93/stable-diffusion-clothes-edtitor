export function RenderProgressText({progress}) {
    if (progress >= 4) {
        return (
            <p className='progress-text'>
                {progress}%
            </p>
        )
    }
    else {
        return <></>
    }
}