(function () {
  console.clear()
  // write your code here
  //   index: https://movie-list.alphacamp.io/api/v1/movies
  //   show api : https://movie-list.alphacamp.io/api/v1/movies/1
  //  set datapanel
  const dataPanel = document.getElementById('data-panel')
  const genresList = document.querySelector('#genresList')
  const GenresBtn = document.querySelector('.GenresBtn')
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
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
  // call api
  axios
    .get(INDEX_URL).then((response) => {
      // console.log(response.data.results)
      data.push(...response.data.results)
      // console.log(data)
      // displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)
    })
    .catch((err) => console.log(err))

  //  set displayDataList
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach((item) => {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title d-block text-truncate">${item.title}</h6>
              <div class="renderGenres">${displayGenres(item)}</div>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-id="${item.id}" data-target="#show-movie-modal">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  // listen to data panel event
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)  // modify here
    } else if (event.target.matches('.btn-add-favorite')) {
      console.log(typeof (event.target.dataset.id))
      addFavoriteItem(event.target.dataset.id)
    }
  })

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')
    // set request url
    const url = INDEX_URL + id
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
  // add Favorite Item
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  // listen to search form submit event
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'ig')
    results.push(...data.filter(movie => movie.title.match(regex)))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })
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
    let targetItem = event.target.dataset.id
    let genresData = []
    data.forEach(items => {
      let filterGenres = items.genres.filter(genre => {
        (genre === Number(targetItem)) ? genresData.push(items) : ''
      })
    })
    // displayDataList(genresData)
    getTotalPages(genresData)
    getPageData(1, genresData)
  })
  // 收放清單
  GenresBtn.addEventListener('click', e => {
    console.log(e.target)
    genresList.parentElement.classList.toggle("d-sm-block")
    dataPanel.parentElement.classList.toggle("col-sm-12")
  })

  // pagination
  let paginationData = []
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  // generate pagination
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
})()

