document.getElementById('next').addEventListener('click', async ({id, name, photo}) => {
    const res = (await fetch('http://localhost:8081/pageRequest', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        redirect: 'follow',
        body: '{\n' +
            '  "businessEntity": {\n' +
            '    "currentPage": 0,\n' +
            '    "pageSize": 10\n' +
            '  }\n' +
            '}'
    })).json()
        .then(t => t["businessEntity"].entities.forEach(x => {citiesHtml(x)}))
    console.log(res);
})

document.getElementById('previous').addEventListener('click', async () => {
    let message = {};
    message.businessEntity = {};
    message.businessEntity.currentPage = 0;
    message.businessEntity.pageSize = 10;

    const res = await fetch('http://localhost:8081/pageRequest', {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify(message)
    })
    let result = res.json();
    console.log(result);
})

async function getFirstPage() {
    window.location.replace('http://localhost:8081/');
}

document.getElementById('authorise').addEventListener('click', getFirstPage);


function citiesHtml({id, name, photo}) {
    const citiesList = document.getElementById('cities');
    citiesList.insertAdjacentHTML('beforeend', `
        <div class="form-check">
            <table>
                <tr>
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${photo}</td>
                </tr>
            </table>
        </div>`);
}