import {GenerateProgress} from "./generateProgress"
import {SelectionToPromptBlock} from "./selectionToPrompt"

export function ExpandSelectionPrompt({cancelPromptGet, isImageSet, promptGenStarted, genPrompt, applyGenPrompt}) {

    if (isImageSet !== null) {
        return (
            <>
                <GenerateProgress promptGenStarted={promptGenStarted} cancelPromptGet={cancelPromptGet}/>
                <SelectionToPromptBlock onClick={applyGenPrompt} genPrompt={genPrompt} promptGenStarted={promptGenStarted}/>
            </>
        )
    }
}