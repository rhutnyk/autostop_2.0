

export default class PartModel{
    public Count: number;
    public Items:Array<Item>;
}


class Part{
    // public id:string;
    public Number:string;
    public Description: string;
    public Qty:number;
    public Price:number;
    public Qty1:number;
    public Qty2:number;
    public Brand:string;
}

class Item{
    public Part:Part;
    public IsAnalog:boolean;
}