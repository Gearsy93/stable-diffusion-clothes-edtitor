import {DropDownModel} from './dropDownService'

export function ServiceInput({blockChange, isLeftTab, setService}) {
    return(
        <div className="param-input" style={{userSelect: 'none'}}>
            <div className="param-input-label">
                <p className="param-input-label-text">
                    Сервис
                </p>
            </div>
            <div className="param-input-body">
              <DropDownModel isLeftTab={isLeftTab} blockChange={blockChange} setService={setService}/>
            </div>
        </div>
    )
}