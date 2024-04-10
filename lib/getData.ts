export async function getData(url: string) {
    //@ts-ignore
    let privateKey:string  = process.env.API_KEY;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "private-key": privateKey
            }
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}