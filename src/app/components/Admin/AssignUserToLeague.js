import React from 'react';
import PropTypes from 'prop-types';
import bemHelper from 'react-bem-helper';

import Svg from '../Svg/Svg';
import football from '../../../assets/football.svg';

const bem = bemHelper({ name: 'admin-list' });

class AssignUserToLeague extends React.Component {

  static propTypes = {
    loading: PropTypes.bool,
  }

  inputs = {};

  assignUser = (e) => {
    e.preventDefault();
    this.props.assignUser({
      teamId: this.inputs.teamId.value,
    });
  };

  teamOption = (teams) => (
    teams.map((team) => (
      <option key={team._id} value={team._id}>
        {team.name || team.user.name || team.user.email} ({team.league.name})
      </option>
    ))
  );

  render() {
    const { loading, league, teams = [] } = this.props;
    const leagueId = league._id;
    const teamsNotInThisLeague = teams.filter((team) => team.league._id !== leagueId);

    return (loading ?
        <div { ...bem('text', 'saving') }><Svg markup={football} /> Saving...</div> :
        <form method="post" onSubmit={ this.assignUser }>
          <div>
            <label htmlFor="user-teamId" required>User:</label>
            <select id="user-teamId"
                    name="user-teamId"
                    ref={(input) => { this.inputs.teamId = input; }}
            >
              { this.teamOption(teamsNotInThisLeague) }
              {/* <optgroup label="Users with a league this Season">*/}
                {/* { this.teamOption(usersWithoutATeamThisSeason) }*/}
              {/* </optgroup>*/}
            </select>
          </div>
          <input className="admin-btn" type="submit" value="Assign User To League"/>
        </form>

    );
  }
}

export default AssignUserToLeague;
