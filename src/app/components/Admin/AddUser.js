import React from 'react';
import PropTypes from 'prop-types';
import bemHelper from 'react-bem-helper';

import Svg from '../Svg/Svg';
import football from '../../../assets/football.svg';

const bem = bemHelper({ name: 'admin-list' });

class AddUser extends React.Component {

  static propTypes = {
    loading: PropTypes.bool,
  }

  state = {
    leagues: this.props.seasons[0] ? this.props.seasons[0].leagues : []
  }

  inputs = {};

  add = (e) => {
    e.preventDefault();
    this.props.add({
      name: this.inputs.name.value,
      email: this.inputs.email.value,
      leagueId: this.inputs.league.value,
      seasonId: this.inputs.season.value,
    });
  };

  getLeagues = () => {
    const seasonId = this.inputs.season.value;
    const leagues = this.props.seasons.find((season) => season._id === seasonId).leagues;
    this.setState({ leagues });
  }

  render() {
    const { loading, seasons = [] } = this.props;
    const { leagues } = this.state;
    return (loading ?
        <div { ...bem('text', 'saving') }><Svg markup={football} /> Saving...</div> :
        <form method="post" onSubmit={ this.add }>
          <small><em>All new users are added with the password <code>password123</code></em></small>
          <div>
            <label htmlFor="user-name" required>Name:</label>
            <input id="user-name"
                   name="user-name"
                   type="text"
                   autoComplete="off"
                   ref={(input) => { this.inputs.name = input; }}
            />
          </div>
          <div>
            <label htmlFor="user-email" required>Email:</label>
            <input id="user-email"
                   name="user-email"
                   type="email"
                   autoComplete="off"
                   ref={(input) => { this.inputs.email = input; }}
            />
          </div>
          <p>Assign team to:</p>
          <div>
            <label htmlFor="user-season" required>Season:</label>
            <select id="user-season"
                    name="user-season"
                    ref={(input) => { this.inputs.season = input; }}
                    onChange= { this.getLeagues }
            >
              {seasons.map((season) =>
                <option key={season._id} value={season._id}>{season.name}</option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="user-league" required>League:</label>
            <select id="user-league"
                   name="user-league"
                   ref={(input) => { this.inputs.league = input; }}
            >
              {leagues.map((league) =>
                <option key={league._id} value={league._id}>{league.name}</option>
              )}
            </select>
          </div>
          <input className="admin-btn" type="submit" value="Add New User"/>
        </form>

    );
  }
}

export default AddUser;
