const crimson_btn = document.querySelector('.crimson-btn')
const cyan_btn = document.querySelector('.dark-cyan-btn')
const default_btn = document.querySelector('.default-btn')
const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')
const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const forecastItemsContainer = document.querySelector('.forecast-items-container')
// end queries
const apiKey = '29e29e3490b167e6ef020313f53deadf'
crimson_btn.addEventListener('click',()=>{
    document.body.style.background = 'crimson'
})
cyan_btn.addEventListener('click',()=>{
    document.body.style.background = 'darkcyan'
})
default_btn.addEventListener('click',()=>{
    document.body.style.background = ''
})
// end color pallete
searchBtn.addEventListener('click',()=>{
    if(cityInput.value.trim()!=''){
    updateWeatherInfo(cityInput.value)
    cityInput.value = ''
    cityInput.blur()
    }
})
cityInput.addEventListener('keydown',(event)=>{
    if(event.key == 'Enter' && cityInput.value.trim()!=''){
    updateWeatherInfo(cityInput.value)    
    cityInput.value = ''
    cityInput.blur()
    }
})

async function getFetchData(endPoint,city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()
}

function getWeatherIcon(id){
    if (id<=232) return 'thunderstorm.svg'
    if (id<=321) return 'drizzle.svg'
    if (id<=521) return 'rain.svg'
    if (id<=622) return 'snow.svg'
    if (id<=781) return 'atmosphere.svg'
    if (id<=800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
    
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather',city)
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name: country,
        main: {temp,humidity},
        weather:[{id,main}],
        wind: {speed}
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'
    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `assets/img/weather/${getWeatherIcon(id)}`
    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastInfo(city){
    const forecastData = await getFetchData('forecast',city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    forecastItemsContainer.innerHTML = ``
    forecastData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken)& !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather)
        }
    })

}

function updateForecastItems(weatherData){
    const {
        dt_txt:date,
        weather:[{id}],
        main:{temp}
    } = weatherData


    const dateToken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResault = dateToken.toLocaleDateString('en-US',dateOption)

    const forecastItem = `<div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">
                        ${dateResault}
                    </h5>
                    <img src="assets/img/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
                    <h5 class="forecast-item-temp">
                        ${Math.round(temp)} °C
                    </h5>
                </div>`

    forecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem)            
}


function showDisplaySection(section){
    [weatherInfoSection,searchCitySection,notFoundSection]
    .forEach(section => section.style.display = 'none')
    section.style.display = 'flex'
}