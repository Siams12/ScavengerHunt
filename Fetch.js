
//Submit a postRequest to jayShaffstall.com 
export async function postRequest(formObject, path) {
    //Create formData for request
    const formData = new FormData();
    console.log(formObject);
    try {
        for (const [key, value] of Object.entries(formObject)){
            formData.append(key, value);
        }
    }catch (error){
        console.log("Error creating formData " + error)
        let result = {status: "not okay"}
        return result;
    }
    //Create URL to submit request
    let domain = "https://cpsc345sh.jayshaffstall.com/"
    let fetchURL = domain+path;
    //Create POST request and get results
    try {
        const result =
        await fetch(fetchURL, {
            method: 'POST',
            body: formData
        })
        let newResult = await result.json();
        return newResult
    } catch (error){
        console.log("Error in fetch " + error)
        let result = {status: "not okay"}
        return result;
}
}