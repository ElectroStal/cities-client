let currentPage = 0;
let pageSize = 10;
let editingId;

document.getElementById('next').addEventListener('click', async () => {await nextPage()})
document.getElementById('previous').addEventListener('click', async () => {await previousPage()})
document.getElementById('authorise').addEventListener('click', getFirstPage);
// document.getElementById("submitButton").addEventListener('click',async () => {await updateCity(editingId,
//     document.getElementById('newName').textContent, document.getElementById('newPhoto').textContent)})

async function getFirstPage() {
    window.location.replace('http://localhost:8081/');
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
                    <td id="curId" style="text-align:center;width:20px">${id}</td>
                    <td style="text-align:center;width:100px">${name}</td>
                    <td style="text-align:center;width:100px"><img src="${photo}" alt="Wrong reference to photo" height="300" width="500"></td>
                    <button type="button" onclick="findCityForEdit('${name}')" id="edit-${id}">Edit</button>
                </tr>
            </table>`);
}

async function showResult() {
    const res = (await fetch('http://localhost:8081/pageRequest', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
        body: `{"businessEntity": {"currentPage": ${currentPage},"pageSize": ${pageSize}}}`
    })).json()
        .then(t => t["businessEntity"].entities.forEach(x => {
            citiesHtml(x)
        }))
    console.log(res);
}

window.onkeyup = keyup;
var inputTextValue;

function keyup(e) {
    inputTextValue = e.target.value;
    if (e.keyCode === 13) {
        findCity(inputTextValue).then(r => console.log(r));
    }
}

async function findCityForEdit(name) {
    await clearPage();
    const res = (await fetch('http://localhost:8081/cityFind', {
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
    citiesList.insertAdjacentHTML('beforeend', `
        <label for="newName">
            <input name="newName" type="text" maxlength="512" id="newName"/>
        </label>
        <label for="newPhoto">
            <input name="newPhoto" type="text" maxlength="512" id="newPhoto"/>
        </label>
        <button type="button" id="submitButton" onclick="goUpdateCity()">Submit</button>`);

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
    const res = (await fetch('http://localhost:8081/cityFind', {
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
    console.log(res);
}

async function updateCity(id, name, photo) {
    await clearPage();
    const res = (await fetch('http://localhost:8081/cityUpdate', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
        body: `{"businessEntity":{"entities": [{"id": "${id}", "name": "${name}", "photo": "${photo}"}]}}`
    })).json()
        .then(t => t["businessEntity"].entities.forEach(x => {
            citiesHtml(x)
        }))
    console.log(res);
}

// let elements = document.getElementsByClassName("button-edit");
//
// for (let i = 0; i < elements.length; i++) {
//     elements[i].addEventListener('click', async () => {await findCity(elements[i].id.substring(0, elements[i].id.lastIndexOf('-')))}, false);
// }