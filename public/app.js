let currentPage = -1;
let pageSize = 10;
let hasNextPage = true;
let hasPreviousPage = false;
let inputTextValue;

window.onkeyup = keyup;
document.getElementById('next').addEventListener('click', async () => {await nextPage()})
document.getElementById('previous').addEventListener('click', async () => {await previousPage()})
document.getElementById('authorise').addEventListener('click', logout);
window.addEventListener('DOMContentLoaded', nextPage)

async function getFirstPage() {
    window.location.replace('http://localhost:8083/');
}

async function logout() {
    window.location.replace('http://localhost:8083/logout');
}

async function nextPage() {
    await clearPage();
    currentPage++;
    await showResult();
}

async function previousPage() {
    await clearPage();
    currentPage--;
    await showResult();
}

async function clearPage() {
    if(document.getElementById("city-table") != null) {
        document.getElementById("table-of-cities").textContent = '';
    }
}


function citiesHtml(id, name, photo) {
    const citiesList = document.getElementById('table-of-cities');
    citiesList.insertAdjacentHTML('beforeend', `
            <table style="border:3px solid coral">
                <tr id="city-table">
                    <td style="text-align:center;width:20px;border:3px solid coral">${id}</td>
                    <td id="curName" style="text-align:center;width:100px;border:3px solid coral">${name}</td>
                    <td style="text-align:center;width:100px;border:3px solid coral"><img id="curPhoto" src="${photo}" alt="Wrong reference to photo" height="300" width="500"></td>
                    <button type="button" onclick="findCityForEdit('${name}')" id="edit-${id}" style="background-color:red;color:bisque">Edit</button>
                </tr>
            </table>`);
}

async function showResult() {
    let curPage = currentPage+1;
    const res = (await fetch(`http://localhost:8083/api/city/${curPage}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
    }))
    let url = res.url;
    if (url.match("login")) {
        await getFirstPage();
    }
    const result = res.json()
        .then(t => {
            hasNextPage = t["hasNextPage"];
            hasPreviousPage = t["hasPreviousPage"];
            document.getElementById('next').disabled = !hasNextPage;
            document.getElementById('previous').disabled = !hasPreviousPage;
            console.log(hasNextPage);
            console.log(hasPreviousPage);
            let i = 1;
            t["citiesList"].forEach(x => {
                citiesHtml((currentPage + 1) * pageSize + i++, x.name, x.photo)
            })
        })
    console.log(res);
}

function keyup(e) {
    inputTextValue = e.target.value;
    if (e.keyCode === 13) {
        findCity(inputTextValue).then(() => {
            currentPage = -1;
            hasPreviousPage = false;
            document.getElementById('previous').disabled = true;
        });
    }
}

async function findCityForEdit(name) {
    await clearPage();
    const res = (await fetch(`http://localhost:8083/api/city?city=${name}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
    })).json()
        .then(t => {citiesHtml(1, t["name"], t["photo"]);
        })
    const citiesList = document.getElementById('table-of-cities');
    citiesList.insertAdjacentHTML('beforeend', `
        <label for="newName">
            &nbsp;&nbsp;New name of city:&nbsp;&nbsp;<input name="newName" type="text" maxlength="512" id="newName"/>
        </label>
        <label for="newPhoto">
            &nbsp;&nbsp;New photo of city:&nbsp;&nbsp;&nbsp;<input name="newPhoto" type="text" maxlength="512" id="newPhoto"/>
        </label>
        <button type="button" id="submitButton" style="background-color:red;color:bisque" onclick="goUpdateCity()">Submit</button>`);

    console.log(res);
}

async function goUpdateCity() {
    await updateCity(
        document.getElementById("curName").textContent,
        document.getElementById("newName").value == null || document.getElementById("newName").value.length === 0
            ? document.getElementById("curName").textContent : document.getElementById("newName").value,
        document.getElementById("newPhoto").value == null || document.getElementById("newPhoto").value.length === 0
            ? document.getElementById("curPhoto").getAttribute("src") : document.getElementById("newPhoto").value,
    )
}

async function findCity(name) {
    await clearPage();
    const res = (await fetch(`http://localhost:8083/api/city?city=${name}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
    })).json()
        .then(t => {citiesHtml(1, t["name"], t["photo"]);
        })
    console.log(hasPreviousPage);
    console.log(res);
}

async function updateCity(oldName, name, photo) {
    await clearPage();
    const res = (await fetch('http://localhost:8083/api/city', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
        body: `{"oldName": "${oldName}", "name": "${name}", "photo": "${photo}"}`
    }))
    let status = res.status;
    if (status !== 200) {
        await nextPage();
        await alert("You don't have access rights to edit cities list!");
        return;
    }
    const result = res.json()
        .then(t => {citiesHtml(1, t["name"], t["photo"]);
        })
    console.log(res);
}