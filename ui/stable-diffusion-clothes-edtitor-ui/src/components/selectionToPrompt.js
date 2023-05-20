export function SelectionToPromptBlock({onClick, genPrompt, promptGenStarted}) {
    if (promptGenStarted !== true) {
        return (
            <>
                <div className="apply-selection">
                    <button className="apply-selection-button" type="button" onClick={onClick}>
                        Сгенерировать<br/>
                        описание
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
}