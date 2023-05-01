import {MainWindow } from "./mainWindow"

export function MainPage() {
    return (
        <>
          <p className="header">
             Clothes Stable Diffusion
          </p>
          <ul type="circle" className="description">
            <li>Загрузите изображение с предметом одежды</li>
            <li>Выделите необходимый предмет одежды</li>
            <li>Примените выделение для получения описания предмета одежды</li>
            <li>На основе полученного описания введите описание дизайна/выделенного предмета в поле «Подсказка»</li>
            <li>Нажмите «Сгенерировать» для создания изображения</li>
            <li>В разделе «Параметры...» можно изменить параметры/ гнерации изображения</li>
          </ul>
          <MainWindow/>
        </>
    )
}