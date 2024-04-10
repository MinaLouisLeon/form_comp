export async function getData(url: string) {
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "private-key": process.env.NEXT_PUBLIC_API_KEY
            }
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}