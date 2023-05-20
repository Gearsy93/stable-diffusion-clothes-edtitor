import {useEffect} from "react";
import {MainWindow} from "./mainWindow"
import {Description} from "./description"
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SetProgress() {
  const setter = () => {
    for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
      e.style.setProperty('--value', e.value);
      e.style.setProperty('--min', e.min === '' ? '0' : e.min);
      e.style.setProperty('--max', e.max === '' ? '100' : e.max);
      e.addEventListener('input', () => e.style.setProperty('--value', e.value));
    }
  }

  useEffect(()=>
  {
    setter()
  })
}

export function MainPage() {
    SetProgress();
    return (
        <>
          <Description/>
          <MainWindow/>
          <ToastContainer/>
        </>
    )
}