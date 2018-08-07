import React from 'react';
import './loading.css';


export default class Loading extends React.Component {

    state = {
        show: this.props.show,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({ show: nextProps.show })
        }
    }


    render() {

        return (
            this.state.show ?

                 //----------------------------------------- old indicator
                // <div className="wrap">
                //     <div className="loading">
                //         <div className="bounceball"></div>
                //         <div className="text">ЗАГРУЖАЮ ...</div>
                //     </div>
                // </div>

                <div className="loading-window">
                    <div className="car">
                        <div className="strike"></div>
                        <div className="strike strike2"></div>
                        <div className="strike strike3"></div>
                        <div className="strike strike4"></div>
                        <div className="strike strike5"></div>
                        <div className="car-detail spoiler"></div>
                        <div className="car-detail back"></div>
                        <div className="car-detail center"></div>
                        <div className="car-detail center1"></div>
                        <div className="car-detail front"></div>
                        <div className="car-detail wheel"></div>
                        <div className="car-detail wheel wheel2"></div>
                        <div className="text">Завантажую...</div>
                    </div>
                </div>
                :
                null
        )
    }

}