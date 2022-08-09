let basePath = "http://localhost:8080/justif"

export async function post(endpoint, body, contentType = "application/json") {
    let header = new Headers({'Content-Type':contentType})
    if (contentType === "") header.delete('Content-Type')

    return await fetch(basePath + endpoint, {
        method: 'POST',
        body: body,
        headers: header,
        mode: "cors"
    }).then(response => { return response })
}

export async function get(endpoint) {
    return await fetch(basePath + endpoint)
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Error while fetching data')
        })
}
