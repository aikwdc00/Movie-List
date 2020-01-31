(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const dataPanel = document.getElementById('data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const genresList = document.querySelector('#genresList')
  const GenresBtn = document.querySelector('.GenresBtn')
  const genres = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }
  displayDataList(data)

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  function removeFavoriteItem(id) {
    // find movie by id
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return

    // removie movie and update localStorage
    data.splice(index, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(data))

    // repaint dataList
    displayDataList(data)
  }

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title text-truncate">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-id="${item.id}" data-target="#show-movie-modal">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    // console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      // console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }
  // 呈現卡片內電影類型
  function displayGenres(item) {
    let showGenres = ''
    item.genres.forEach((unit) => {
      showGenres += `<span class="badge badge-info mr-2 data-genre="${unit}">${genres[unit]}</span>`
    })
    return showGenres
  }
  // 呈現左方類型清單
  function showGenresList() {
    let list = ""
    //   Object.values(genres).map(item => {
    //     list += `
    // <li><a href="#" class="nav-link" data-toggle="pill" data-id="${genres}">${item}</a></li>`
    //   })
    for (let i in genres) {
      list += `<li><a href="#" class="nav-link" data-toggle="pill" data-id="${i}">${genres[i]}</a></li>`
    }
    genresList.innerHTML = list
  }
  showGenresList()
  // 左方類型清單監聽
  genresList.addEventListener('click', event => {
    let item = event.target.dataset.id
    let genresData = []
    data.forEach(items => {
      let filterGenres = items.genres.filter(genre => {
        (genre === Number(item)) ? genresData.push(items) : ''
      })
    })
    displayDataList(genresData)
  })
  // 收放清單
  GenresBtn.addEventListener('click', e => {
    console.log(e.target)
    genresList.parentElement.classList.toggle("d-sm-block")
    dataPanel.parentElement.classList.toggle("col-sm-12")

  })
})()