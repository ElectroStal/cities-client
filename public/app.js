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


function citiesHtml({id, name, photo}) {
    const citiesList = document.getElementById('table-of-cities');
    citiesList.insertAdjacentHTML('beforeend', `
            <table style="border:3px solid coral">
                <tr id="city-table">
                    <td id="curId" style="text-align:center;width:20px;border:3px solid coral">${id}</td>
                    <td style="text-align:center;width:100px;border:3px solid coral">${name}</td>
                    <td style="text-align:center;width:100px;border:3px solid coral"><img src="${photo}" alt="Wrong reference to photo" height="300" width="500"></td>
                    <button type="button" onclick="findCityForEdit('${name}')" id="edit-${id}" style="background-color:red;color:bisque">Edit</button>
                </tr>
            </table>`);
}

async function showResult() {
    const res = (await fetch('http://localhost:8083/pageRequest', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
        body: `{"businessEntity": {"currentPage": ${currentPage},"pageSize": ${pageSize}}}`
    }))
    let url = res.url;
    if (url.match("login")) {
        await getFirstPage();
    }
    const result = res.json()
        .then(t => {
            hasNextPage = t["businessEntity"].hasNextPage;
            hasPreviousPage = t["businessEntity"].hasPreviousPage;
            document.getElementById('next').disabled = !hasNextPage;
            document.getElementById('previous').disabled = !hasPreviousPage;
            console.log(hasNextPage);
            console.log(hasPreviousPage);
            t["businessEntity"].entities.forEach(x => {
                citiesHtml(x)
            })
        })
    console.log(res);
}

function keyup(e) {
    inputTextValue = e.target.value;
    if (e.keyCode === 13) {
        findCity(inputTextValue).then(r => console.log(r));
    }
}

async function findCityForEdit(name) {
    await clearPage();
    const res = (await fetch('http://localhost:8083/cityFind', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
        body: `{"businessEntity":{"entities": [{"id": null, "name": "${name}", "photo": null}]}}`
    })).json()
        .then(t => t["businessEntity"].entities.forEach(x => {
            citiesHtml(x)
        }))
    const citiesList = document.getElementById('table-of-cities');
    currentPage = -1;
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

// eslint-disable-next-line no-unused-vars
async function goUpdateCity() {
    await updateCity(
        document.getElementById("curId").textContent,
        document.getElementById("newName").value,
        document.getElementById("newPhoto").value
    )
}

async function findCity(name) {
    await clearPage();
    const res = (await fetch('http://localhost:8083/cityFind', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
        body: `{"businessEntity":{"entities": [{"id": null, "name": "${name}", "photo": null}]}}`
    })).json()
        .then(t => t["businessEntity"].entities.forEach(x => {
            citiesHtml(x)
        }))
    currentPage = -1;
    console.log(res);
}

async function updateCity(id, name, photo) {
    await clearPage();
    const res = (await fetch('http://localhost:8083/cityUpdate', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
        body: `{"businessEntity":{"entities": [{"id": "${id}", "name": "${name}", "photo": "${photo}"}]}}`
    }))
    let status = res.status;
    if (status !== 200) {
        await nextPage();
        await alert("You don't have access rights to edit cities list!");
        return;
    }
    const result = res.json()
        .then(t => t["businessEntity"].entities.forEach(x => {
            citiesHtml(x)
        }))
    console.log(res);
}