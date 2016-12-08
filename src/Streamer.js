import React, { Component } from 'react'
import { VictoryLine } from 'victory'

export default class Streamer extends Component {
  constructor(props) {
    super(props)
    this.state = {data: []}
  }
  setUp() {
    var that = this
    this.logSocket = new WebSocket("ws://localhost:8082/stream")
    this.logSocket.onopen = function (event) {
      console.log("Connected to Timberslide")
    }
    this.logSocket.onmessage = function (msg) {
      let event = JSON.parse(msg.data)
      let data = that.state.data
      data.push({score: event.Score})
      that.setState({data: data})
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
      <VictoryLine data={this.state.data} x="time" y="score" />
    )
  }
}
