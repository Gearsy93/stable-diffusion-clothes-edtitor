import {DropDownModel} from './dropDown'

export function ModelInput({models, dropValue, setDropValue, getModels, service, isLeftTab, setModelName}) {
    return(
        <div className="param-input" style={{userSelect: 'none'}}>
            <div className="param-input-label">
                <p className="param-input-label-text">
                    Модель
                </p>
            </div>
            <div className="param-input-body">
              <DropDownModel models={models} dropValue={dropValue} setDropValue={setDropValue} getModels={getModels} service={service} isLeftTab={isLeftTab} setModelName={setModelName}/>
            </div>
        </div>
    )
}