

export default class DataService {
    url = '';

    constructor(url) {
        this.URL = url;
    }

    query(number, str) {
        this.url = '';
            if (str) {
                this.url = `${this.URL}&desc=${str}`
            }
            if (number) {
                this.url = `${this.URL}&number=${number}`
            }
            return new Promise((resolve, reject) => {
                fetch(this.url)
                    .then(res => res.json())
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
    };

    take(skip) {
        return new Promise((resolve, reject) => {
            fetch(`${this.url}&$skip=${skip}`)
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    };

}