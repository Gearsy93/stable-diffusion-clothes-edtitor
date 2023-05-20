import axios from "axios"
import {useEffect, useState} from 'react'
import Select from 'react-select';
import {toast} from "react-toastify"
import '../styleSheets/dropDown.css'

export function DropDownModel({blockChange, service, isLeftTab, setModelName}) {
  const [models, setModels] = useState([]);
  const [dropValue, setDropValue] = useState(0);

  useEffect(() => {
    const getModels = async () => {
      if (service !== "") {
        const res = await axios.get(isLeftTab === true ? "inpaintModels" : "instructModels");
      var result = [];
      for (var i = 0; i < res.data['models'].length; i++) {
        result[i] = {}
        result[i].value = res.data['models'][i]
        result[i].label = res.data['models'][i]      
      }
      setModels(result)
      setDropValue(0)
      setModelName("")
      }
    }
    getModels();
  }, [isLeftTab, setModelName, service])

  function SetCurrentValue(e) {
    if (blockChange === true) {
      toast.warn('В процессе генерации нельзя менять модель', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    return;
    }
    else {
      setDropValue(e)
      setModelName(e.value)
    }
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