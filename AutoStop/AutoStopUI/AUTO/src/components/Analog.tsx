import * as React from 'react';
import dataService from '../services/data.service';

class IProps {
    hideAnalogs: () => void;
    isLoadingAnalog:(res:boolean) => void;
    analogId: number;
    item:any
    loading:boolean
}


export default class Analog extends React.Component<IProps, any> {

    private mainService = new dataService();
    
    private url = 'http://autostop.bitsorchestra.com/api/parts?analog=';
    private query = 0;

    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
            id: null,
            item:null,
            loading:false
        };
    }

    
    componentDidMount(){
      this.setState({id: this.props.analogId, item:this.props.item, loading:true},() => this.getData())
      }

    
    getData = () => {
       
        if (this.state.id >= 0) {
            this.mainService.query(this.url+this.props.analogId)
            .then((res: any) => {
                this.setState({ data: res.Items}, ()=>{this.props.isLoadingAnalog(false)});
                // window.scrollBy(0 , (document.documentElement.offsetHeight-10));
            })
        }
    } 


    public render() {
    
        return (
            this.state.data.length > 0  ? 
            <span>
                  <div className="container analog" >
                 
                    {this.state.data.length > 0 ?
                    this.state.data.map((item: any, index: number) =>
                
                    <div className="row" key={index}>
                        <div className="col-2 col-sm-2">{item.Part.Number}</div>
                        <div className="col-3 col-sm-4">{item.Part.Description}</div>
                        <div className="col-1 col-sm-2">{item.Part.Qty}</div>
                        <div className="col-3 col-sm-2">{item.Part.Price} грнy.</div>
                    </div>
                
                    ) :null}
                 </div>
            </span>
           : null
            
        )

    }

}
