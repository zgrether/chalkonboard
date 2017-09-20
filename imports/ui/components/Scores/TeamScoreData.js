import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import ScoresCollection from '../../../api/Scores/Scores';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Button, Alert, Modal, Row, Col, Well } from 'react-bootstrap';

import './TeamScoreData.scss';

const initializeTeam = (team, game) => {
  const teamScore = {
    raw: 0,
    final: 0,
    teamId: team._id,
    gameId: game._id,
    eventId: game.eventId,
  };

  Meteor.call('scores.insertteam', teamScore, (error, scoreId) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Team added to game!', 'success');
    }
  });
}

const quitGame = (teamId, scoreId, gameId) => {
  Meteor.call('teams.quitGame',  scoreId, teamId, gameId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Team quit', 'success');
    }
  });
}

const editScore = (scoreId, gameId, newScore) => {
  Meteor.call('scores.enterScore', scoreId, null, gameId, newScore, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Score updated!', 'success');
    }
  });
}

const incScore = (scoreId, gameId, inc) => {
  Meteor.call('scores.incrementScore', scoreId, null, gameId, inc, (error) => {
    if (error) {
      Bert.alert(error.response, 'danger');
    } else {
      Bert.alert('Score incremented!', 'success');
    }
  });
}



class TeamScoreData extends React.Component {
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

    const { score, team, game, editing } = this.props;
    let submitScore;

    if (this.state.minus) { 
      submitScore = -parseInt(this.state.scorevalue);
    } else {
      submitScore = parseInt(this.state.scorevalue);
    }

    incScore(score._id, game._id, submitScore);

    this.setState({ showModal: false });
  }
  
  render() {

    const { score, team, game, editing } = this.props;

    return (
      editing ? (
          score ? (
            <tr key={team._id}>
              <td className="teamName">{team.abbrv}</td>
              <td>{score.raw}</td>
              <td><Button bsStyle="primary" onClick={ () => editScore(score._id, game._id, 0) }>Reset</Button></td>
              <td><Button bsStyle="danger"  onClick={ () => quitGame(team._id, score._id, game._id) }>Quit</Button></td>      
            </tr>
          ) : (
            <tr key={team._id}>
              <td className="teamName">{team.abbrv}</td>
              <td>-</td>
              <td colSpan="2"><Button bsStyle="info" block onClick={ () => initializeTeam(team, game) }>Initialize</Button></td>
            </tr>
          )
        ) : (
          score ? (
            <tr key={team._id}>
              <td className="teamName">{team.abbrv}</td>
              <td>{score.raw}</td>
              <td><Button bsStyle="primary" onClick={ () => incScore(score._id, game._id, -1) }>-</Button></td>
              <td><Button bsStyle="primary" onClick={ () => incScore(score._id, game._id, 1) }>+</Button></td>
              <td><Button bsStyle="primary" onClick={ () => this.setState({ showModal: true, scorevalue: "", minus: false }) }>#</Button></td>
            
              <Modal bsSize="small" show={ this.state.showModal } onHide={ () => this.setState({ showModal: false }) }>
                <Modal.Header closeButton>
                  <Modal.Title>Enter Score</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                  <Row>
                    <Well className="styleWell"><span className="centerText">{this.state.minus && "-" }{this.state.scorevalue}</span></Well>
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
                      <Button bsStyle="primary" block onClick={ () => this.setState({ minus: !this.state.minus }) }>-</Button>
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

TeamScoreData.propTypes = {
  score: PropTypes.object,
  loading: PropTypes.bool,
  team: PropTypes.object,
  game: PropTypes.object,
  editing: PropTypes.bool,
};

export default createContainer(({ game, team, editing }) => {
  let scoreId;

  team.games.map((teamGame) => {
    if (teamGame.gameId === game._id) {
      scoreId = teamGame.scoreId;
    }
  });

  if (scoreId) {
    const subscription = Meteor.subscribe('scores.view', scoreId);

    return {
      score: ScoresCollection.findOne(scoreId),
      loading: !subscription.ready(),
      team: team,
      game: game,
    }  
  } else {
    return {
      found: false,
    }
  }
}, TeamScoreData);