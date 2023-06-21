import {Textarea} from '@nextui-org/react';

export function PromptBlock({setPrompt}) {

    const OnPromptChange = function(e) {
        setPrompt(e.target.value);
    }
    
    return (
        <div className="param-input">
            <div className="param-input-label">
                <p className="param-input-label-text">
                    Подсказка
                </p>
            </div>
            <div className="param-input-body">
                <Textarea aria-labelledby=' ' placeholder='Текст подсказки на латинице' onChange={OnPromptChange} animated={false} width='100%' style={{fontFamily: 'Montserrat Medium', fontSize: '15px'}} css={{$$inputColor: "#FFF4E2", borderRadius: '7px'}} spellCheck='false' minRows={2}/>
            </div>
        </div>
    )
}