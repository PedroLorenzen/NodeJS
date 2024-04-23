export async function fetchGet<T>(url: string): Promise<T | undefined> {
    // Her returnerer man en Promise eller undefined hvis det feiler og <T> er typen
    // <T> er en generisk type som kan være enhver type. Typen defineres i funktionen.
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });
        const result: { data: T } = await response.json();
        return result.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function fetchPost<T>(url: string, body: T): Promise<T | undefined> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const result: { data: T } = await response.json();
        return result.data;
    } catch (error) {
        console.error(error);
        return undefined;   
    }
}
