import Select from 'react-select';
import {useEffect} from 'react'

export function DropDownModel({models, dropValue, setDropValue, getModels, isLeftTab, setModelName}) {
  useEffect(() => {
    //getModels();
  }, [isLeftTab])

  function SetCurrentValue(e) {
    setDropValue(e)
    setModelName(e.value)
  }

  return (
      <div className='container'> 
          <Select
              aria-labelledby="aria-label"
              inputId="aria-example-input"
              name="aria-live-color"
              options={models}
              value={dropValue}
              placeholder="Название модели"
              onChange={e => SetCurrentValue(e)}
              styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderRadius: '7px',
                    minHeight: '27px',
                    border: 0,
                    boxShadow: 'none',
                    background: '#FFF4E2',
                    fontFamily: 'Montserrat Medium',
                    fontSize: '16px',
                    fontWeight: 550
                  }),
                  valueContainer: (provided) => ({
                      ...provided,
                      height: '27px',
                      padding: 0,
                      paddingLeft: '6px',
                      fontSize: '14px',
                      background: '#FFF4E2',
                      borderRadius: '7px',
                    }),

                    option: (provided, {isDisabled, isFocused, isSelected}) => ({
                      ...provided,
                      background: isDisabled ? '#d6cbbb' : isFocused ? '#FFF4E2' : '#FFF4E2',
                      ':active': {
                          backgroundColor: isSelected ? '#FFF4E2' : '#FFF4E2'
                        },
                      "background::selection":'#fff',
                      color:'black',
                      height: '24px',
                      paddingTop: 2,
                      fontSize: '15px',
                      fontWeight: 450
                    }),

                    singleValue: provided => ({
                      ...provided,
                      height: '27px',
                      paddingLeft: '2px',
                      fontSize: '15px',
                      marginTop: '3px'
                    }),

                    input: (provided) => ({
                      ...provided,
                      margin: '0px',
                      fontSize: '14px',
                      height: '27px',
                      color: 'transparent'
                    }),

                    indicatorsContainer: (provided) => ({
                      ...provided,
                      height: '27px',
                      fontSize: '14px',
                    }),

                    clearIndicator: (styles) => ({
                      ...styles,
                      paddingTop: 7,
                      paddingBottom: 7,
                    }),
                    menu: (styles) => ({
                      ...styles, 
                      background: '#FFF4E2',
                    }),
                }}
                
          />
      </div>
  ) 
}