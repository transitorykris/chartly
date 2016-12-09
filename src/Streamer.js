import React, { Component } from 'react'
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory'

const chartStyle = {
  labels: {fontSize: 12},
  parent: {border: "1px solid #ccc"},
}

const lightGreen500 = "#8BC34A";
const deepOrange600 = "#F4511E";
const lightGrey = "#D3D3D3";

const posLineStyle = {
  data: {
    strokeWidth: 2,
    fill: lightGreen500,
  },
}

const negLineStyle = {
  data: {
    strokeWidth: 2,
    fill: deepOrange600,
  },
}

const zeroLineStyle = {
  data: {
    strokeWidth: 8,
    stroke: lightGrey,
  },
}

export default class Streamer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posData: [{time: Date.now(), score: 0}],
      negData: [{time: Date.now(), score: 0}],
      zeroData: [{time: Date.now(), score: 0}],
    }
  }
  setUp() {
    var that = this
    this.logSocket = new WebSocket("ws://localhost:8082/stream")
    this.logSocket.onopen = function (event) {
      console.log("Connected to Timberslide")
    }
    this.logSocket.onmessage = function (msg) {
      let event = JSON.parse(msg.data)
      if (event.Score > 0) {
        let data = that.state.posData
        data.push({time: Date.now(), score: event.Score})
        that.setState({posData: data})
      } else if (event.Score < 0) {
        let data = that.state.negData
        data.push({time: Date.now(), score: event.Score})
        that.setState({negData: data})
      } else {
        let data = that.state.zeroData
        data.push({time: Date.now(), score: event.Score})
        that.setState({zeroData: data})
      }
      console.log(event)
    }
    this.logSocket.onerror = function (error) {
      console.log("Error:", error)
    }
  }
  tearDown(props) {
    this.logSocket.close();
  }
  componentDidMount() {
    this.setUp(this.props);
  }
  componentWillUnmount() {
    this.tearDown(this.props);
  }
  render() {
    return (
      <VictoryChart style={chartStyle}>
        <VictoryBar style={posLineStyle} data={this.state.posData} x="time" y="score" />
        <VictoryBar style={negLineStyle} data={this.state.negData} x="time" y="score" />
        <VictoryBar style={zeroLineStyle} data={this.state.zeroData} x="time" y="score" />
        <VictoryAxis style={{tickLabels: {fontSize: 0}}} label="" tickValues={[]} />
        <VictoryAxis dependentAxis label="Score" tickValues={[-8, -6, -4, -2, 2, 4, 6, 8]} />
      </VictoryChart>
    )
  }
}
