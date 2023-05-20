import {DropDownModel} from './dropDown'

export function ModelInput({blockChange, service, isLeftTab, setModelName}) {
    return(
        <div className="param-input" style={{userSelect: 'none'}}>
            <div className="param-input-label">
                <p className="param-input-label-text">
                    Модель
                </p>
            </div>
            <div className="param-input-body">
              <DropDownModel blockChange={blockChange} service={service} isLeftTab={isLeftTab} setModelName={setModelName}/>
            </div>
        </div>
    )
}