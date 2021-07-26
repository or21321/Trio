
import Axios from 'axios'

var axios = Axios.create({
    // withCredentials: true
})

const ACCESS_KEY = 'FtAiz5o_uM9Ab_oizQTJSEHWEqQaBm6ygimUsEWNKlc'

export const unsplashService = {
    query
}


async function query(filterBy) {
    try {
        const photos = await axios({
            url: `https://api.unsplash.com/search/photos?query=${filterBy}&client_id=${ACCESS_KEY}&orientation=landscape&per_page=50`,
        })
        return photos.data.results
    } catch (err) {
        console.log('Had a problem getting photos from unsplash', err);
        throw err
    }
}