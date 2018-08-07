

export default class DataService {
    url = '';

    constructor(url) {
        this.URL = url;
    }

    query() {
      this.url = this.URL
            return new Promise((resolve, reject) => {
                fetch(this.URL)
                    .then(res => res.json())
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
    };

    filter(number, str) {
        this.url = this.URL;
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
        if (!this.url) {
            this.url = this.URL;
        }
        return new Promise((resolve, reject) => {
            fetch(`${this.url}&$skip=${skip}`)
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    };

    select(id) {
        return new Promise((resolve, reject) => {
            fetch(`${this.URL}&analog=${id}`)
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    };

}