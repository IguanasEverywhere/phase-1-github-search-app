const submitForm = document.querySelector("#github-form");
const userList = document.querySelector('#user-list');
const reposList = document.querySelector('#repos-list');
const profileSearchBtn = document.querySelector('#profile-search-btn');
const repoSearchBtn = document.querySelector('#repo-search-btn');

let searchProfiles = false;
let searchRepos = false;

profileSearchBtn.addEventListener('click', () => {
  searchProfiles = true;
  searchRepos = false;
})

repoSearchBtn.addEventListener('click', () => {
  searchProfiles = false;
  searchRepos = true;
})


submitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  userList.innerHTML = '';
  reposList.innerHTML = '';

  if (searchProfiles === true) {
    searchByUser();
  } else if (searchRepos === true) {
    searchByRepo();
  }
})

function searchByUser() {
  let searchValue = document.querySelector('#search').value;
  fetch(`https://api.github.com/search/users?q=${searchValue}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json'
    }
  })
    .then(res => res.json())
    .then(data => data.items.forEach(dataItem => {
      createUserObj(dataItem);
    }));
}

function searchByRepo() {
  console.log('searching by repo')
  let searchValue = document.querySelector('#search').value;
  fetch(`https://api.github.com/search/repositories?q=${searchValue}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json'
    }
  })
  .then(res => res.json())
  .then(repos => repos.items.forEach(repoItem => {
    createRepoObj(repoItem)
  }))

}

function createUserObj(userData) {
  let userObj = {
    username: userData.login,
    avatar: userData.avatar_url,
    profileUrl: userData.html_url
  }
  appendToUserList(userObj)
}

function createRepoObj(repoItem) {
  let repoItemObj = {
    owner: repoItem.owner.login,
    name: repoItem.name,
    html_url: repoItem.html_url
  }
  appendToRepoList(repoItemObj);
}

function getUserRepos(username) {
  fetch(`https://api.github.com/users/${username}/repos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json'
    }
  })
    .then(res => res.json())
    .then(repos => repos.forEach((repo) => {
      createRepoObj(repo)
    }))
}

function appendToUserList(userObj) {

  let listItem = document.createElement('li');

  let profileName = document.createElement('h4');
  profileName.textContent = `${userObj.username}`;
  profileName.addEventListener('click', () => {
    getUserRepos(userObj.username)
  });
  let avatar = document.createElement('img');
  avatar.setAttribute('src', userObj.avatar);
  avatar.classList.add('avatar-img');
  let profileURL = document.createElement('a');
  profileURL.textContent = 'Link To GitHub Profile'
  profileURL.setAttribute('href', userObj.profileUrl);

  listItem.append(profileName);
  listItem.append(avatar);
  listItem.append(profileURL);

  userList.append(listItem);
}

function appendToRepoList(repoObj) {
  let repoOwner = repoObj.owner;

  let repoName = document.createElement('a');
  repoName.textContent = repoObj.name
  repoName.setAttribute('href', repoObj.html_url);

  let repoListItem = document.createElement('li');
  repoListItem.append(repoOwner);
  repoListItem.append(' || ')
  repoListItem.append(repoName);

  reposList.append(repoListItem);
}

