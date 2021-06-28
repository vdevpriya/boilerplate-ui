import React from 'react'
import ClientUtils from '../../clientUtils'
import hexToRgb from 'hex-to-rgba'

class Tooltip extends React.Component {

    render() {
        let metricName = ClientUtils.metricNames(this.props.metricName)
        return (
            <div id="recharts-tooltip" className="clearfix">
                {this.props.multi ? 
                    <div>
                        <span class="tooltip-title"><b>{metricName}</b> : {this.props.label}</span>
                        {this.props.payload.map((item) => {
                            return (
                                <div>
                                    <div class="tooltip-list col-xs-12" style={
                                        {'background-color': hexToRgb(item.color, '.3'), 
                                        'border-left': `4px solid ${item.color}`
                                    }}>    
                                        <div className="col-xs-8">{item.name}</div>
                                        <div className="col-xs-4">{item.value.toLocaleString()}</div>
                                    </div>
                                </div>
                            )    
                        })}
                    </div>
                :
                    <div>
                        <div class="tooltip-title">
                            Frequency: {this.props.label}
                            <div class="tooltip-list"><b>{this.props.metricName}</b></div>
                        </div>
                        {this.props.payload.map((item) => {
                            let name = ClientUtils.metricNames(item.name)
                            return (
                                <div>
                                    <div class="tooltip-list col-xs-12" style={
                                        {'background-color': hexToRgb(item.color, '.3'), 
                                        'border-left': `4px solid ${item.color}`
                                    }}>    
                                        <div className="col-xs-8">{name}</div>
                                        <div className="col-xs-4">{item.payload.metrics[item.name].toLocaleString()}</div>
                                    </div>
                                </div>
                            )    
                        })}
                    </div>
                }
            </div>
        )
    }
}

export default Tooltip