import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://fcalc.ne.dc63.ru/api/v1/front/',
  headers: { 'X-Api-Key': '11223344' }
})

function App() {
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [films, setFilms] = useState([])
  const [packages, setPackages] = useState([])
  const [parts, setParts] = useState([])

  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedFilm, setSelectedFilm] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [selectedParts, setSelectedParts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await instance.get('brands')
        setBrands(response.data.data)

        response = await instance.get('film')
        setFilms(response.data.data)

        response = await instance.get('package')
        setPackages(response.data.data)

        response = await instance.get('part')
        setParts(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedBrand) return

    const fetchData = async () => {
      try {
        const response = await instance.get(`models?brand_id=${selectedBrand}`)
        setModels(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [selectedBrand])

  const handleSelect = (selectedItems) => {
    const parts = []
    for (let i = 0; i < selectedItems.length; i++) {
      parts.push(selectedItems[i].value)
    }
    setSelectedParts(parts)
  }

  const calculateCost = async () => {
    try {
      let response
      if (selectedPackage === '4') {
        response = await instance.post(`calculate_individual`, {
          model_id: selectedModel,
          film_id: selectedFilm,
          parts_requested: selectedParts.map((item) => {
            return {
              part_id: item,
              quantity: 1
            }
          })
        })
      } else {
        response = await instance.post(`calculate`, {
          model_id: selectedModel,
          package_id: selectedPackage,
          film_id: selectedFilm
        })
      }
      alert(JSON.stringify(response.data.data))
    } catch (error) {
      console.log(error)
    }
  }

  if (!brands.length) return <div>Загрузка...</div>

  return (
    <div className='App'>
      <div>Калькулятор расчёта стоимости оклейки</div>

      <div className='container'>
        <label htmlFor='brand-select'>Выберите бренд автомобиля:</label>

        <select
          name='brands'
          id='brand-select'
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value=''>--Выберите бренд--</option>
          {brands.map((item) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBrand && (
        <div className='container'>
          <label htmlFor='model-select'>Выберите модель автомобиля:</label>

          <select
            name='models'
            id='model-select'
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value=''>--Выберите модель--</option>
            {models.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className='container'>
        <label htmlFor='film-select'>Выберите модель плёнки:</label>

        <select
          name='films'
          id='film-select'
          value={selectedFilm}
          onChange={(e) => setSelectedFilm(e.target.value)}
        >
          <option value=''>--Выберите плёнку--</option>
          {films.map((item) => (
            <option value={item.id} key={item.id}>
              {item.name} ({item.country}) {item.cost_per_sqm} руб. / м²
            </option>
          ))}
        </select>
      </div>

      <div className='container'>
        <label htmlFor='package-select'>Выберите пакет:</label>

        <select
          name='packages'
          id='package-select'
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
        >
          <option value=''>--Выберите пакет--</option>
          {packages.map((item) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPackage === '4' && (
        <div className='container'>
          <label htmlFor='part-select'>Выберите части автомобиля:</label>

          <select
            multiple
            name='parts'
            id='parts-select'
            value={selectedParts}
            onChange={(e) => {
              handleSelect(e.target.selectedOptions)
            }}
          >
            <option value=''>--Выберите части--</option>
            {parts.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={() => calculateCost()}>Рассчитать</button>
    </div>
  )
}

export default App
