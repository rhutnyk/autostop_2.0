

export default class MainServise {

    public query(url: string): Promise<any> {
          return fetch(url)
          .then((res: any) => res.json())
          .then(res => {return res});
      }
  
  } 