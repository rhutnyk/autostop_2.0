

export class PartModel{
    public Count: number;
    public Items:Part[];
}


 export class Part{
    public id:string;
    public Number:string;
    public Description: string;
    public Qty:number;
    public Price:number;
    public Brand:string;
    public NumberSearch:string;
    public hasAnalog:boolean;
}

// class Item{
//     public Part:Part;
//     //public IsAnalog:boolean;
// }