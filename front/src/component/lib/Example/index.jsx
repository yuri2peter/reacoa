import React, { Component } from 'react';
import axios from 'axios';
import withDebounce from 'debounce-decorator';
import styled from 'styled-components';
import logo from './logo.svg';
import './index.sass';
import defines from '../../../common/defines';

const reacoaStorage = localStorage.getItem('reacoa');
const reacoa = reacoaStorage ? JSON.parse(reacoaStorage) : {};

class Example extends Component {
  inputRef = null;

  state = {
    port: reacoa.port || '80',
    online: false,
    fetching: true,
  };

  componentDidMount() {
    this.post();
  }

  onPortChange = (e) => {
    this.setState({
      port: e.target.value,
    }, this.post);
  };

  @withDebounce(500)
  async post() {
    const url = `http://127.0.0.1:${this.state.port}/test`;
    try {
      this.setState({ fetching: true });
      await axios.post(url);
      this.setState({ online: true });
    } catch (e) {
      this.setState({ online: false });
    } finally {
      this.setState({ fetching: false });
      if (this.inputRef) {
        this.inputRef.focus();
      }
    }
  }
  ;
  render() {
    const onlineStyle = this.state.online
      ? { style: { color: 'green' }, children: '[online]' }
      : { style: { color: 'red' }, children: '[offline]' };
    const linkStatusProps = this.state.fetching
      ? { style: { color: 'yellow' }, children: '[fetching]' }
      : onlineStyle;
    const Env = styled.span`
      position: absolute;
      top: 4px;
      right: 4px;
      color: darkgrey;
      font-size: 12px;
    `;
    return (
      <div className="App">
        <Env>
          {defines.IS_PRODUCTION
            ? 'PRODUCTION'
            : 'DEVELOPMENT'}
        </Env>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <p>
            <span>http://127.0.0.1: </span>
            <input
              style={{ width: `${(this.state.port.length + 1) * 0.6}em` }}
              ref={(ref) => {
                this.inputRef = ref;
                if (ref) { ref.focus(); }
              }}
              className="App-port-input"
              onChange={this.onPortChange}
              disabled={this.state.fetching}
              defaultValue={this.state.port}/>
            <span> /test </span>
            <button
              onClick={this.post.bind(this)}
              title="Retry"
              className="App-link-status"
              {...linkStatusProps} />
            {
              reacoa.electron
                ? <p className="App-server-hint">
                  Enjoying Reacoa in Electron :)</p>
                : <p className="App-server-hint">
                  Start your server by <code>cd ./server && npm start</code></p>
            }
          </p>
          <a
            className="App-link"
            href="https://github.com/yuri2peter/reacoa.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Reacoa
          </a>
        </header>
      </div>
    );
  }
}

export default Example;
