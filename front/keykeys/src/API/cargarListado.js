export async function cargarListado(letra) {
    const res = await fetch(`/listado/${letra}.txt`);
    const texto = await res.text();

    // lo convertimos a array de palabras
    return texto.trim().split("\n").map(p => p.trim());
}