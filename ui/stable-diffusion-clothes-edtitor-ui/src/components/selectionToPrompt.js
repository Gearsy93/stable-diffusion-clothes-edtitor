export function SelectionToPromptBlock({onClick, genPrompt}) {
    return (
        <>
            <div className="apply-selection">
                <button className="apply-selection-button" type="button" onClick={onClick}>
                    Применить<br/>
                    выделение
                </button>
                <div className="prompt-generation-result-box">
                    <p className="gen-prompt-text">
                        {genPrompt}
                    </p>
                </div>
            </div>
        </>
    )
}