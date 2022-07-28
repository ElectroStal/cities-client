let currentPage = 0;
let pageSize = 10;

document.getElementById('next').addEventListener('click', async () => {await nextPage()})
document.getElementById('previous').addEventListener('click', async () => {await previousPage()})
document.getElementById('authorise').addEventListener('click', getFirstPage);

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
        <div class="form-check" id="city-table">
            <table style="border:3px solid coral">
                <tr>
                    <td style="text-align:center;width:20px">${id}</td>
                    <td style="text-align:center;width:100px">${name}</td>
                    <td style="text-align:center;width:100px"><img src="${photo}" alt="Wrong reference to photo" height="300" width="500"></td>
                </tr>
            </table>
        </div>`);
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