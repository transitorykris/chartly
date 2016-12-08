import React, { Component } from 'react'

export default class Streamer extends Component {
  setUp() {
    this.logSocket = new WebSocket("ws://localhost:8082/stream")
    this.logSocket.onopen = function (event) {
      console.log("Connected to Timberslide")
    }
    this.logSocket.onmessage = function (msg) {
      console.log(msg)
      let event = JSON.parse(msg.data)
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
      <div></div>
    )
  }
}
