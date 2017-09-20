import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import ScoresCollection from '../../../api/Scores/Scores';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Button, Alert, Modal, Row, Col, Well, Table } from 'react-bootstrap';

import './PlayerScoreData.scss';

const initializePlayer = (player, team, game) => {
  const playerScore = {
    raw: 0,
    final: 0,
    playerId: player._id,
    gameId: game._id,
    eventId: game.eventId,
  };
  
  Meteor.call('scores.insertplayer', playerScore, team._id, (error, scoreId) => {
    
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Player added to game!', 'success');
    }
  });
}

const quitGame = (player, team, scoreId, gameId) => {
  Meteor.call('players.quitGame', scoreId, player._id, team, gameId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Player quit', 'success');
    }
  });
}

const editScore = (player, playerTeamId, scoreId, gameId, newScore) => {
  Meteor.call('scores.enterScore', scoreId, playerTeamId, gameId, newScore, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Score updated!', 'success');
    }
  });
}

const incScore = (player, playerTeamId, scoreId, gameId, inc) => {
  Meteor.call('scores.incrementScore', scoreId, playerTeamId, gameId, inc, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Score updated!', 'success');
    }
  });
}

const calculateNewScore = (prevScore, minus, addScore) => {
  let prevScoreNum = addScoreNum = 0;

  if (prevScore) {
    prevScoreNum = parseInt(prevScore);
  }
  if (addScore) {
    addScoreNum = parseInt(addScore);
  }
  if (minus) {
    addScoreNum = -addScoreNum;
  }
  return prevScoreNum + addScoreNum;
}

class PlayerScoreData extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showModal: false,
      title: "",
      scorevalue: "",
      minus: false,
    };
  }
  
  handleSubmitValue(e) {
    e.preventDefault();

    const { score, player, team, game, editing } = this.props;
    let submitScore;

    if (this.state.minus) { 
      submitScore = -parseInt(this.state.scorevalue);
    } else {
      submitScore = parseInt(this.state.scorevalue);
    }

    incScore(player, player.events[0].teamId, score._id, game._id, submitScore);

    this.setState({ showModal: false });
  }

  render() {
    const { score, player, team, game, editing } = this.props;

    return (
       editing ? (
        score ? (
          <tr key={player._id}>
            <td className="playerName">{player.name}</td>
            <td className="playerScore">{score.raw}</td>
            <td><Button bsStyle="primary" onClick={ () => editScore(player, player.events[0].teamId, score._id, game._id, 0) }>Reset</Button></td>
            <td><Button bsStyle="danger"  onClick={ () => quitGame(player, team, score._id, game._id) }>Quit</Button></td>      
          </tr>
        ) : (
          <tr key={player._id}>
            <td className="playerName">{player.name}</td>
            <td className="playerScore">-</td>
            <td colSpan="2"><Button bsStyle="info" block onClick={ () => initializePlayer(player, team, game) }>Initialize</Button></td>
          </tr>
        )
      ) : (
        score ? (
          <tr key={player._id}>
            <td className="playerName">{player.name}</td>
            <td className="playerScore">{score.raw}</td>
            <td><Button bsStyle="primary" onClick={ () => incScore(player, player.events[0].teamId, score._id, game._id, -1) }>-</Button></td>
            <td><Button bsStyle="primary" onClick={ () => incScore(player, player.events[0].teamId, score._id, game._id, 1) }>+</Button></td>
            <td><Button bsStyle="primary" onClick={ () => this.setState({ showModal: true, scorevalue: "", minus: false }) }>#</Button></td>
          
            <Modal bsSize="small" show={ this.state.showModal } onHide={ () => this.setState({ showModal: false }) }>
              <Modal.Header closeButton>
                <Modal.Title>Enter Score</Modal.Title>
              </Modal.Header>
              
              <Modal.Body>
                <Row>
                    <Table>
                      <tbody>
                        <tr className="modalNum">
                          <td className="modalDataLarge">{score.raw}</td>
                          <td className="modalData">+</td>
                          <td className="modalDataLarge">{this.state.minus && "-" }{this.state.scorevalue}</td>
                          <td className="modalData">=</td>
                          <td className="modalDataLarge">{calculateNewScore(score.raw, this.state.minus, this.state.scorevalue)}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td>Current</td>
                          <td />
                          <td />
                          <td />
                          <td>New Score</td>
                        </tr>
                      </tfoot>
                    </Table>
                </Row>
            
                <Row>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 1) }) }>1</Button>
                  </Col>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 2) }) }>2</Button>
                  </Col>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 3) }) }>3</Button>
                  </Col>
                </Row>

                <br />

                <Row>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 4) }) }>4</Button>
                  </Col>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 5) }) }>5</Button>
                  </Col>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 6) }) }>6</Button>
                  </Col>
                </Row>

                <br />

                <Row>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 7) }) }>7</Button>
                  </Col>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 8) }) }>8</Button>
                  </Col>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 9) }) }>9</Button>
                  </Col>
                </Row>

                <br />

                <Row>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: "" })}>Clear</Button>
                  </Col>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ scorevalue: (this.state.scorevalue + 0) }) }>0</Button>
                  </Col>
                  <Col xs={4} md={4}>
                    <Button bsStyle="primary" block onClick={ () => this.setState({ minus: !this.state.minus }) }>+/-</Button>
                  </Col>
                </Row>

                <br />

                <Row>
                  <Col xs={4} xsOffset={4} md={4} mdOffset={4}>
                    <Button bsStyle="success" block onClick={ this.handleSubmitValue.bind(this)}>Submit</Button>
                  </Col>
                </Row>

              </Modal.Body>
            
            </Modal>
          </tr>
        ) : (
          <tr />
        )
      )
    )
  }
}
      
PlayerScoreData.propTypes = {
  score: PropTypes.object,
  loading: PropTypes.bool,
  player: PropTypes.object,
  team: PropTypes.object,
  game: PropTypes.object,
  editing: PropTypes.bool,
};

export default createContainer(({ game, player, editing }) => {
  let scoreId;

  if (player.games) {
    player.games.forEach((playerGame) => {
      if (playerGame.gameId === game._id) {
        scoreId = playerGame.scoreId;
      }
    });  
  }

  if (scoreId) {
    const subscription = Meteor.subscribe('scores.view', scoreId);

    return {
      score: ScoresCollection.findOne(scoreId),
      loading: !subscription.ready(),
      player: player,
      game: game,
    }  
  } else {
    return {
      found: false,
    }
  }
}, PlayerScoreData);