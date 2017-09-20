/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, FormGroup, FormControl, Button, ControlLabel, Col, Checkbox } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import GameEditorPoints from './GameEditorPoints';
import validate from '../../../modules/validate';
import GamesCollection from '../../../api/Games/Games';
import VenueSelector from './VenueSelector';

class GameEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: { required: true },
        type: { required: true },
        golftype: { required: false },
        rules: { required: false },
        sumpoints: { required: false },
      },
      messages: { 
        title: { required: 'This needs a title' },
        type: { required: 'This needs a type' },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const { game } = this.props;
    const gameId = game._id;

    const updateGame = {
      _id: gameId,
      title: document.querySelector(`[name="titleGame"]`).value,
      type: document.querySelector(`[name="sport"]`).value,
      rules: document.querySelector(`[name="rules"]`).value,
      sumpoints: document.querySelector(`[name="sumpoints"]`).checked,
    };

    if (updateGame.type == "Generic Scoring") {
      updateGame.teeId = "none";
      updateGame.venueId = game.venueId;
      updateGame.golftype = "none";
    } else if (updateGame.type == "Golf") {
      updateGame.venueId = "none";
      updateGame.teeId = game.teeId;
      updateGame.golftype = "Stroke Play";      
    }

    Meteor.call('games.update', updateGame, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game updated!', 'success');
      }
    });
  }

  render() {

    const { game } = this.props;
    
    return (

        game ? (
          <div>
            <PageHeader>
              <small>Update {game.title}</small>
            </PageHeader>

            <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>

              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl type="text" name="titleGame" placeholder="Title" defaultValue={game.title}/>
              </FormGroup>
            
              <FormGroup>
                <ControlLabel>Rules</ControlLabel>
                <FormControl name="rules" componentClass="textarea" placeholder="Rules" defaultValue={game.rules}/>
              </FormGroup>

            <div style={{"textAlign":"center"}}>
               <Button  type="submit" bsStyle="success">Save Settings</Button>
            </div>

            {game.bteam && (
                <FormGroup>
                  <ControlLabel>Game Scoring</ControlLabel>
                  <Checkbox name="sumpoints" defaultChecked={game.sumpoints} onChange={ this.handleSubmit.bind(this) }>Team Points are Sum of Players' Points</Checkbox>
                </FormGroup>
              )}

            <FormGroup>
              <ControlLabel>Sport</ControlLabel>
              <FormControl componentClass="select" name="sport" defaultValue={game.type} onChange={ this.handleSubmit.bind(this) }>
                <option value="Generic Scoring">Generic Scoring</option>
                <option value="Golf">Golf</option>
              </FormControl>
            </FormGroup>

              {game.type == "Golf" ? (
                <FormGroup>
                  <ControlLabel>Golf Scoring</ControlLabel>
                  <FormControl componentClass="select" name="golftype" defaultValue={game.golftype} onChange={ this.handleSubmit.bind(this) }>
                    <option value="Stroke Play">Stroke Play</option>
                  </FormControl>
                </FormGroup>
              ) : (
                null
              )}

            </form>

            <VenueSelector game={game} />
     

            <FormGroup>
              <GameEditorPoints game={game} />
            </FormGroup>
        </div>
      ) : ( <div /> )
    )
  }
}  

GameEditor.propTypes = {
  game: PropTypes.object,
};

export default createContainer(({ gameId }) => {
  const subscription = Meteor.subscribe('games.view', gameId);
  let game;
  if (subscription.ready()) 
    {
      game = GamesCollection.findOne(gameId);
      if (game.sport == "Golf") {
        this.setState({ showCourseSelector: true });
      }
    }
  return {
    game: GamesCollection.findOne(gameId),
  };
}, GameEditor);