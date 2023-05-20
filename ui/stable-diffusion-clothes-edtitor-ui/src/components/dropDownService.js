import axios from "axios"
import {useEffect, useState} from 'react'
import Select from 'react-select';
import {toast} from "react-toastify"
import '../styleSheets/dropDown.css'

export function DropDownModel({isLeftTab, blockChange, setService}) {
    const [services, setServices] = useState([]);
    const [dropValue, setDropValue] = useState(0);
  
    useEffect(() => {
      const getModels = async () => {
        try {
            const res = await axios.get("checkAvailableServices");
            var result = [];
            if (res.data['automatic'] === true) {
                result[0] = {}
                result[0].value = 'automatic'
                result[0].label = 'Automatic1111'
            }
            if (res.data['aihorde'] === true) {
                result[1] = {}
                result[1].value = 'aihorde'
                result[1].label = 'Ai Horde'
            }
            setServices(result)
            setService("")
            setDropValue(0)
        }
        catch(e) {
            toast.error('Сервер недоступен', {
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
      }
      getModels();
    }, [setService, isLeftTab])
  
    async function SetCurrentValue(e) {
      if (blockChange === true) {
        toast.warn('В процессе генерации нельзя менять сервис', {
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
        await axios.post("setService", {
            service: e.value
        })
            .then(res => {
                if (res.data['status'] !== 200) {
                    toast.error('Ошибка во время выбора сервиса', {
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
            })
        setDropValue(e)
        
        setService(e.value)
      }
    }
  
    return (
        <div className='container'> 
            <Select
                aria-labelledby="aria-label"
                inputId="aria-example-input"
                name="aria-live-color"
                options={services}
                value={dropValue}
                placeholder="Название сервиса"
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