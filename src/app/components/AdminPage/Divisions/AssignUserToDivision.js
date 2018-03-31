import React from 'react';
import PropTypes from 'prop-types';
import Interstitial from '@kammy/interstitial';

class AssignUserToDivision extends React.Component {
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
        {team.name || team.user.name || team.user.email} ({team.division.name})
      </option>
    ))
  );

  render() {
    const { loading, division, teams = [] } = this.props;
    const divisionId = division._id;
    const teamsNotInThisDivision = teams.filter((team) => team.division._id !== divisionId);

    return (
      loading
        ? <Interstitial>Saving</Interstitial>
        : <form method="post" onSubmit={ this.assignUser }>
          <div>
            <label htmlFor="user-teamId" required>User:</label>
            <select
              id="user-teamId"
              name="user-teamId"
              ref={(input) => { this.inputs.teamId = input; }}
            >
              { this.teamOption(teamsNotInThisDivision) }
              {/* <optgroup label="Users with a division this Season"> */}
              {/* { this.teamOption(usersWithoutATeamThisSeason) } */}
              {/* </optgroup> */}
            </select>
          </div>
          <input className="admin-btn" type="submit" value="Assign User To Division"/>
        </form>

    );
  }
}

export default AssignUserToDivision;
