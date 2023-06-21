import {DropDownModel} from './dropDownService'

export function ServiceInput({getServices, services, dropValueService, setDropValueService, isLeftTab, setService}) {
    return(
        <div className="param-input" style={{userSelect: 'none'}}>
            <div className="param-input-label">
                <p className="param-input-label-text">
                    Сервис
                </p>
            </div>
            <div className="param-input-body">
              <DropDownModel getServices={getServices} services={services} dropValueService={dropValueService} setDropValueService={setDropValueService} isLeftTab={isLeftTab} setService={setService}/>
            </div>
        </div>
    )
}