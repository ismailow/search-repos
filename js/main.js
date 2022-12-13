const searchInput = document.querySelector('.search__input');
const autocompliteList = document.querySelector('.search__list');
const favoritesList = document.querySelector('.repos');

function searchRepos() {
    if (searchInput.value) {
        let thisId;
        const repos = fetch(`https://api.github.com/search/repositories?q=${searchInput.value}&per_page=5`);
        repos.then(responce => responce.json())
            .then((data) => {
                clearAutocomplite();
                autocomplite(data);
                return data;
            })
            .then(data => {
                document.querySelectorAll('.search__item').forEach(item => {
                    item.addEventListener('click', () => {
                        thisId = item.dataset.id;
                        clearAutocomplite()
                        searchInput.value = '';
                        const favItem = data.items.find(item => {
                            if (item.id == thisId) {
                                return item;
                            }
                        })
                        renderFavorite(favItem);
                    })
                })
                return data;
            })
    } else {
        clearAutocomplite()
    }
}

function renderFavorite(item) {
    const repoName = item.name;
    const [authorName] = item.full_name.split('/');
    const stars = item.stargazers_count;
    const favTempalte = `<div class="repo">
                            <div class="repo__info">
                                <div class="repo__desc">Name: ${repoName}</div>
                                <div class="repo__desc">Owner: ${authorName}</div>
                                <div class="repo__desc">Stars: ${stars}</div>
                            </div>
                            <div class="repo__control">
                                <button class="repo__btn">
                                    <img src="./img/remove.svg" alt="">
                                </button>
                            </div>
                        </div>`;
    favoritesList.insertAdjacentHTML('afterbegin', favTempalte);
}

function clearAutocomplite() {
    autocompliteList.innerHTML = '';
}

function autocomplite(data) {
    data.items.forEach(repo => {
        const autocompliteItem = document.createElement('li');
        autocompliteItem.classList.add('search__item');
        autocompliteItem.textContent = repo.name;
        autocompliteItem.dataset.id = repo.id;
        autocompliteList.append(autocompliteItem);
    })
}

function debounce(fn, debounceTime) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(fn.bind(this, ...args), debounceTime);
    }
};

const debouncedSearch = debounce(searchRepos, 500);

searchInput.addEventListener('keyup', debouncedSearch);
favoritesList.addEventListener('click', e => {
    if (e.target.closest('.repo__btn')) {
        const thisFav = e.target.closest('.repo');
        thisFav.remove();
    }
})