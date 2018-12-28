import * as React from 'react';
import dataService from '../services/data.service';

class IProps {
    hideAnalogs: () => void;
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

    componentWillReceiveProps = (nextProps: IProps) => {
        // if (nextProps.analogId != null) {
        //     this.setState({id: nextProps.analogId, item:nextProps.item},() => this.getData())
        // }
        // else{
        //     this.setState({data: []})
        // }
      }

      componentDidMount(){
        //   this.setState({loading:this.props.loading},()=>{
        //     console.log('loading= '+this.state.loading);
            
        //     this.getData();
        //   })
       
        
        this.setState({id: this.props.analogId, item:this.props.item, loading:true},() => this.getData())
        
        
      }

    
    getData = () => {
       
        if (this.state.id >= 0) {
            this.mainService.query(this.url+this.props.analogId)
            .then((res: any) => {
                this.setState({ data: res.Items});
                // window.scrollBy(0 , (document.documentElement.offsetHeight-10));
                
                
            })
        }
    } 


    public render() {
    
        return (
            this.state.data.length > 0  ? 
            <span>
                {/* <div className="container">
                    <div className="row analog-header">
                        <div className="col-12"><p>Аналоги</p></div>
                        <div className="col-12 close-btn">
                        <span onClick={() => this.props.hideAnalogs()}><img src='./image/close up analog.png'/></span>
                    </div>
                </div>
                </div> */}
                  <div className="container analog" >
                  
                  {/* <div className="row" id="analog-first-item">
                        <div className="col-2 col-sm-2">{this.state.item.Part.Number}</div>
                        <div className="col-3 col-sm-4">{this.props.item.Part.Description}</div>
                        <div className="col-1 col-sm-2">{this.props.item.Part.Qty}</div>
                        <div className="col-3 col-sm-2">{this.props.item.Part.Price} грн.</div>
                    </div>  */}
                    {this.state.data.length > 0 ?
                    this.state.data.map((item: any, index: number) =>
                
                    <div className="row" key={index}>
                        <div className="col-2 col-sm-2">{item.Part.Number}</div>
                        <div className="col-3 col-sm-4">{item.Part.Description}</div>
                        <div className="col-1 col-sm-2">{item.Part.Qty}</div>
                        <div className="col-3 col-sm-2">{item.Part.Price} грн.</div>
                    </div>
                
                    ) :null}
                 </div>
            </span>
           : null
            
        )

    }

}
