import React, { Component } from 'react'
import * as V from 'victory'
import { VictoryBar, VictoryLine } from 'victory'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {quarter: 1, earnings: 1},
        {quarter: 2, earnings: 1},
        {quarter: 3, earnings: 1},
        {quarter: 4, earnings: 1}
      ]
    }
    this.randoTimer = setInterval(this.rando.bind(this), 1000)
  }
  rando() {
    this.setState({data: [
      {quarter: 1, earnings: Math.random() * 10000},
      {quarter: 2, earnings: Math.random() * 10000},
      {quarter: 3, earnings: Math.random() * 10000},
      {quarter: 4, earnings: Math.random() * 10000}
    ]})
    console.log(this.state.data)
  }
  render() {
    return (
      <div>
        <p>Chartly</p>
        <VictoryLine data={this.state.data} x="quarter" y="earnings"/>
      </div>
    );
  }
}

export default App;
