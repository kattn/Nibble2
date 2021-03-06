import React from 'react';
import { Navbar, NavItem, Icon, Modal, Button, Row, Col, Input } from 'react-materialize';
import { Keyboard } from './Keyboard.jsx';

/* Proxy in order to fire click events*/
/**
 * props:
 *  proxy : callforward, an Observable
 */
export class ClickProxy extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.proxy) {
      this.sub = this.props.proxy.subscribe((a) => {
        if (this.props.onClick) { this.props.onClick(new MouseEvent('PROXY_CLICK')); }
      });
    }
  }
  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  render() {
    return null;
  }
}


/**
 * props:
 *  trigger
 */
export const HelpModal = props => (<Modal
  header="Hjelp"
  trigger={props.trigger}
>
  <div>
    <b>Hvordan legger jeg inn penger?</b>
    <p>
      Du kan legge inn penger manuelt på appen etter du har logget inn eller du kan legge til med ditt kredittkort på online.ntnu.no under min profil.
    </p>
    <b>Det er tomt for en vare, hva gjør jeg?</b>
    <p>Det er funksjonalitet for automatisk varsling under utvikling men foreløpig må du sende mail til trikom@online.ntnu.no.</p>
    <b>Jeg fant en feil, hva gjør jeg?</b>
    <p>Legg til en issue på github.com/dotKom/nibble2/ eller send en mail til dotkom@online.ntnu.no</p>
  </div>
</Modal>);

/**
 * props:
 *  trigger : node
 *  saldoList : [50,200,300]
 *  submit : callback
 */
export class AddSaldoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inval: 0,
      indisable: true,
    };
  }

  inputChange(event) {
    this.setValue(event.target.value);
  }

  setValue(amount, disable) {
    this.setState(Object.assign(this.state, {
      inval: Math.max(amount == null ? this.state.inval : amount, 0),
      indisable: disable == null ? this.state.indisable : disable,
    }));
  }
  diffValue(amount) {
    this.setState(Object.assign(this.state, {
      inval: Math.max((this.state.inval == null ? 0 : this.state.inval) + amount, 0),
    }));
  }
  render() {
    const moneyButtons = [];
    const v = [1, 5, 10, 25];
    const incButtons = [];
    const decButtons = [];
    for (const i in v) {
      const amount = v[i];
      decButtons.push(<Button key={i + 10} large waves="light" className={`money-${amount}`} onClick={() => this.diffValue(-amount)}>{`-${amount}`} kr</Button>);
    }
    for (const i in v) {
      const amount = v[i];
      incButtons.push(<Button key={i + 20} large waves="light" className={`money-${amount}`} onClick={() => this.diffValue(amount)}>{`+${amount}`} kr</Button>);
    }

    for (const i in this.props.saldoList) {
      const amount = this.props.saldoList[i];
      moneyButtons.push(<Button key={i} large waves="light" className={`money-${amount}`} onClick={() => this.setValue(amount, true)}>{amount} kr</Button>);
    }


    let inputAmount = 0;
    const inField = <input placeholder="" name="asaldo" value={this.state.inval} disabled={this.state.indisable} onChange={a => this.inputChange(a)} type="number" />;
    const changeInput = (amount) => {
      inputAmount = amount;
    };


    return (
      <Modal
        key={'cash_modal'}
        header="Legg Til Penger"
        trigger={this.props.trigger}
        modalOptions = {{
          ready: () => this.setValue(0,true)
        }}
        actions={[
          <Button waves="light" modal="close" flat>Avbryt</Button>,
          <Button waves="light" onClick={() => { this.props.onSubmit(parseInt(this.state.inval)); }} modal="close">Sett inn</Button>]}
      >
        <div className="modalCash">
          <p className="modalCashDesc">Legg kontanter i det røde pengeskrinet til venstre, så registrer samme beløp her!</p>
          <div className="radio-group">
            {moneyButtons}
          </div>
          <br />
          <div className="radio-group">
            {incButtons}
          </div>
          <br />
          <div className="radio-group">
            {decButtons}
          </div>
          <br />
          <div className="col input-field">
            {inField}
            <label htmlFor="asaldo" className="active">Velg beløp med knappene over</label>
          </div>
        </div>
      </Modal>
    );
  }
}

/**
 * props:
 *  trigger : node
 *  onSubmit : callback
 *  saldoList : list of selectable saldos
 */
export class RemoveSaldoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inval: 0,
      indisable: true,
    };
  }

  inputChange(event) {
    this.setValue(event.target.value);
  }

  setValue(amount, disable) {
    this.setState(Object.assign(this.state, {
      inval: amount == null ? this.state.inval : amount,
      indisable: disable == null ? this.state.indisable : disable,
    }));
  }
  diffValue(amount) {
    this.setState(Object.assign(this.state, {
      inval: Math.max((this.state.inval == null ? 0 : this.state.inval) + amount, 0),
    }));
  }
  render() {
    const moneyButtons = [];
    const v = [1, 5, 10, 25];
    const incButtons = [];
    const decButtons = [];
    for (const i in v) {
      const amount = v[i];
      decButtons.push(<Button key={i + 10} large waves="light" className={`money-${amount}`} onClick={() => this.diffValue(-amount)}>{`-${amount}`} kr</Button>);
    }
    for (const i in v) {
      const amount = v[i];
      incButtons.push(<Button key={i + 20} large waves="light" className={`money-${amount}`} onClick={() => this.diffValue(amount)}>{`+${amount}`} kr</Button>);
    }

    for (const i in this.props.saldoList) {
      const amount = this.props.saldoList[i];
      moneyButtons.push(<Button key={i} large waves="light" className={`money-${amount}`} onClick={() => this.setValue(amount, true)}>{amount} kr</Button>);
    }


    let inputAmount = 0;
    const inField = <input placeholder="" name="rsaldo" value={this.state.inval} disabled={this.state.indisable} onChange={a => this.inputChange(a)} type="number" />;
    const changeInput = (amount) => {
      inputAmount = amount;
    };

    return (
      <Modal
        key={'cash_modal'}
        header="Ta Ut Penger"
        trigger={this.props.trigger}
        modalOptions = {{
          ready: () => this.setValue(0,true)
        }}
        actions={[
          <Button waves="light" modal="close" flat>Avbryt</Button>,
          <Button waves="light" onClick={() => this.props.onSubmit(-parseInt(this.state.inval))} modal="close">Ta ut</Button>,
        ]}
      >
        <div className="modalCash">
          <p className="modalCashDesc">Velg beløpet du ønsker å ta ut, så ta pengene fra pengekassa i kjøleskapet!</p>
          <div className="radio-group">
            { moneyButtons }
          </div>
          <br />
          <div className="radio-group">
            {incButtons}
          </div>
          <br />
          <div className="radio-group">
            {decButtons}
          </div>
          <br />
          <div className="col input-field">
            { inField }
            <label htmlFor="rsaldo" className="active">Velg beløp med knappene over</label>
          </div>
        </div>
      </Modal>
    );
  }
}


/**
 * props:
 *  trigger : node
 *  onSubmit : callback
 *  orders : list of orders
 *  balance : money left after purchase
 */
export class CheckoutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_status: props.status || 'await',
    };
    this.c_interval = null;
    this.closeState = true;
  }

  componentWillUnmount() {
    clearInterval(this.c_interval);
  }
  componentWillReceiveProps(props) {
    this.setState(Object.assign(this.state, {
      current_status: props.status || 'await',
    }));
    clearInterval(this.c_interval);
    if (props.status == 'success') {
      this.c_interval = setTimeout(() => {
        this.setState(Object.assign(this.state, {
          current_status: 'complete',
        }));
      }, 1000);
    }
  }
  render() {
    const svgClass = ({
      await: ['', '', ''],
      fail: ['', '', ''],
      success: ['', ' fill-complete success', ' check-complete success'],
      complete: ['path-complete', ' fill-complete success', ' check-complete success'],
    })[this.state.current_status];

    const svgStroke = ({
      await: '#7DB0D5',
      success: '7DB0D5',
      fail: '#F44336',
      complete: '7DB0D5',
    })[this.state.current_status];

    const statusMessage = ({
      await: 'Din ordre behandles...',
      fail: 'Handel feilet!',
      success: 'Handel fullført',
      complete: 'Handel fullført',
    })[this.state.current_status];

    const orderList = [];
    for (const o of this.props.orders) {
      orderList.push(
        <div key={o.item.id}>
          <Col s={6} className="right-align padd">
            { o.item.name }
          </Col>
          <Col s={6} className="left-align padd">
            { o.qty } x { o.item.price },-
          </Col>
        </div>,
      );
    }
    return (
      <Modal
        header={statusMessage}
        trigger={this.props.trigger}
        modalOptions={{
          complete: () => this.props.onSubmit(this.closeState)
        }}
        actions={[
          <Button waves="light" onClick={() => this.closeState = false} modal="close">Ny handel</Button>,
          <Button waves="light" onClick={() => this.closeState = true} modal="close" flat>Logg ut nå ({this.props.time || 0})</Button>,
          this.props.extraClose,
        ]}
      >
        <Row>
          <Col s={12} className="align center-align">
            <div className="checkmark">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" x="0px" y="0px" viewBox="0, 0, 100, 100" id="checkmark">
                <g transform="">
                  <circle className={`path${svgClass[0]}`} fill="none" stroke={svgStroke} strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="44" />
                  <circle className={`fill${svgClass[1]}`} fill="none" stroke={svgStroke} strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="44" />
                  <polyline className={`check${svgClass[2]}`} fill="none" stroke="#7DB0D5" strokeWidth="8" strokeLinecap="square" strokeMiterlimit="10" points="70,35 45,65 30,52  " />
                </g>
              </svg>
            </div>
            <h4 className="thinner">{statusMessage}</h4>
            <Row>
              {orderList}
            </Row>
            <h5 className="thinner grey-text darken-2">
              <b>{ this.props.balance || 0 }kr</b> igjen
            </h5>
          </Col>
        </Row>
      </Modal>
    );
  }
}


/**
 * props:
 *  trigger : node
 *  onSubmit : callback
 */
export class RegModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleSubmit(e) {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.username, this.state.password);
    }
    if (e) { e.preventDefault(); }
  }
  onClose() {
    this.setState(Object.assign(this.state, {
      username: '',
      password: '',
    }));
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  onOpen() {
    this.setState(Object.assign(this.state, {
      username: '',
      password: '',
    }));
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }
  set username(u) {
    this.setState(Object.assign(this.state, {
      username: u,
    }));
  }
  set password(u) {
    this.setState(Object.assign(this.state, {
      password: u,
    }));
  }

  render() {
    return (
      <Modal
        modalOptions={{
          complete: () => this.onClose(),
          ready: () => this.onOpen(),
        }}
        header="Registrer - Nibble"
        trigger={this.props.trigger}
        actions={[
          <Button waves="light" modal="close" onClick={() => this.handleSubmit()}>Registrer</Button>,
          <Button waves="light" modal="close" flat>Avbryt</Button>,
        ]}
      >
        Fyll inn ditt brukernavn og passord for å knytte rfidekortet opp mot din online bruker
        <div className="col input-field">
          <Keyboard onChange={(v)=> this.username = v}>
            <input value={this.state.username} type="text" />
          </Keyboard>
          <label>Brukernavn</label>
        </div>
        <div className="col input-field">
          <Keyboard onChange={(v) => this.password = v}>
            <input value={this.state.password} type="password" />
          </Keyboard>
          <label>Passord</label>
        </div>

      </Modal>
    );
  }
}
