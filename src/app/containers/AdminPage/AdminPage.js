import React from 'react';
import { connect } from 'react-redux';
import Route from 'react-router-dom/Route';

import AdminList from '../../components/Admin/AdminList';
import AddUser from '../../components/Admin/AddUser';
import AdminAddForm from '../../components/Admin/AdminAddForm';
import AssignUserToLeague from '../../components/Admin/AssignUserToLeague';
import SeasonAdminOptions from '../../components/Admin/SeasonAdminOptions';
import LeagueAdminOptions from '../../components/Admin/LeagueAdminOptions';
import UserAdminOptions from '../../components/Admin/UserAdminOptions';
import PlayerAdminOptions from '../../components/Admin/PlayerAdminOptions';
import Auth from '../../authentication/auth-helper';
import {
  fetchSeasons, fetchPlayers, fetchUsersWithTeams, updateTeam,
  addSeason, addLeague, addUser, updatePlayers, assignTeamToLeague, importPlayers,
  ADD_SEASON, ADD_LEAGUE, ADD_USER, UPDATE_PLAYERS, ASSIGN_TEAM_TO_LEAGUE, FETCH_PLAYERS
} from '../../actions';

import './adminPage.scss';

const Error = ({ error }) => <div>
  <p>Error Loading seasons!</p>
  <p>{ error.message }</p>
</div>;

const Errors = ({ errors }) => <div>
  {errors.map((error, i) => <Error error={error} key={i} />)}
</div>;

const Loading = () => <p>Loading seasons....</p>;

const selectedItem = (match, items, key) => items.find((item) => item._id === match.params[key]);

export const join = (prefix, postfix) =>
  `${prefix}/${postfix}`.replace(/\/\/\//g, '/').replace(/\/\//g, '/');

class AdminPage extends React.Component {

  static needs = [fetchSeasons, fetchUsersWithTeams];

  componentDidMount() {
    if (!this.props.seasons) {
      this.props.fetchSeasons();
    }
    if (!this.props.users) {
      this.props.fetchUsersWithTeams();
    }
    if (!this.props.players) {
      this.props.fetchPlayers();
    }
  }

  addSeason = (name) => {
    this.props.addSeason(name);
  }

  addLeague = (seasonId, name) => {
    this.props.addLeague(seasonId, name);
  }

  addUser = (form) => {
    this.props.addUser(form);
  }

  importPlayers = () => {
    this.props.importPlayers();
  }

  updatePlayers = (playerUpdates) => {
    this.props.updatePlayers({ playerUpdates });
  }

  assignUser = (leagueId, form) => {
    this.props.assignTeamToLeague({ leagueId, leagueName: this.leagueName, ...form });
  }

  updateTeam = (team) => {
    this.props.updateTeam(team);
  }

  render() {
    const {
      errors = [], userErrors = [], loading, seasons, players = [], users = [], match
    } = this.props;
    const addingSeason = loading === ADD_SEASON;
    const addingLeague = loading === ADD_LEAGUE;
    const addingUser = loading === ADD_USER;
    const updatingPlayer = loading === UPDATE_PLAYERS;
    const loadingPlayers = loading === FETCH_PLAYERS;
    const assigningUserToLeague = loading === ASSIGN_TEAM_TO_LEAGUE;
    const seasonPath = join(match.url, 'season/:seasonId/');
    const leaguePath = join(seasonPath, 'league/:leagueId/');
    const usersPath = join(match.url, 'users/');
    const playersPath = join(match.url, 'players/');

    if (errors.length) {
      return <Errors errors={errors} />;
    } else if (userErrors.length) {
      return <Errors errors={userErrors} />;
    } else if (!seasons) {
      return <Loading />;
    } else if (!Auth.isAdmin()) {
      return <p>You're not admin!</p>;
    }

    return (
      <div className="admin" id="admin-page">
        <h1 >Admin</h1>
        <div className="admin__panels">
          <div className="bg" />

          <section className="admin__panel admin__panel--seasons">
            <AdminList list={ seasons }
                       path="season"
            >
              <AdminAddForm add={ this.addSeason }
                         type="Season"
                         loading={ addingSeason } />
            </AdminList>
            <Route path={seasonPath} render={(seasonProps) => {
              const season = selectedItem(seasonProps.match, seasons, 'seasonId');
              if (!season) return null;
              const leagues = season.leagues;
              return (
                <div>
                  <SeasonAdminOptions season={season} />
                  <AdminList list={ leagues }
                             path="league"
                             secondary
                  >
                    <AdminAddForm add={ (name) => this.addLeague(season._id, name) }
                               type="league"
                               loading={ addingLeague } />
                  </AdminList>
                  <Route path={leaguePath} render={(leagueProps) => {
                    const league = selectedItem(leagueProps.match, leagues, 'leagueId');
                    if (!league) return null;

                    this.leagueName = league.name;
                    const teams = users.reduce((prev, curr) => prev.concat(curr.teams), []);
                    const leagueTeams = teams.filter((team) => team.league._id === league._id);
                    return (
                      <LeagueAdminOptions league={league}
                                          teams={ leagueTeams }
                                          saveUpdates={ (team) => this.updateTeam(team) }>
                        <AssignUserToLeague assignUser={(form) => this.assignUser(league._id, form)}
                                            season={ season }
                                            league={ league }
                                            loading={ assigningUserToLeague }
                                            teams={ teams }
                                            users={ users }
                        />
                      </LeagueAdminOptions>
                    );
                  }}/>
                </div>
              );
            }}/>
          </section>

          <section className="admin__panel admin__panel--users">
            <AdminList list={ [{ name: 'Users' }] }
                       path="users"
            />
            <Route path={usersPath} render={(userProps) => {
              if (!userProps.match) return null;
              return (
                <UserAdminOptions users={ users }>
                  <AddUser add={(form) => this.addUser(form)}
                           loading={ addingUser }
                           seasons={ seasons }
                  />
                </UserAdminOptions>
              );
            }}/>
          </section>


          <section className="admin__panel admin__panel--players">
            <AdminList list={ [{ name: 'Players' }] }
                       path="players"
            />
            <Route path={playersPath} render={(playersMatcher) => {
              if (!playersMatcher.match) return null;
              if (loadingPlayers) return <p>Loading</p>;
              if (!players.length) {
                return (
                  <div className="admin-options">
                    <p>No players found.</p>
                    <button onClick={ this.importPlayers }>Initialise</button>
                  </div>
                );
              }
              return (
                <PlayerAdminOptions players={ players }
                                    saving={ updatingPlayer }
                                    saveUpdates={ this.updatePlayers }
                />
              );
            }}/>
          </section>

          <h3>tech-debt:</h3>
          <ul>
            <li>add e2e tests</li>
            <li>make season/league names unique</li>
            <li>refactor links to use names rather than id</li>
            <li>refactor arrays to objects to make easier to manipulate</li>
            <li>refactor rename league to division</li>
            <li>refactor admin to admin/components</li>
          </ul>

          <h3>todo:</h3>
          <ul>
            <li>admin can run points against current teams</li>
            <li>admin can Increment Game Week</li>
            <li>admin view all teams for exporting</li>
            <li>admin view all players with stats + points for exporting</li>
            <li>users save team without breaking rules</li>
            <li>users can add players to transfer list</li>
            <li>admin can Authorise Transfers</li>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    seasons: state.seasons.data,
    users: state.users.data,
    players: state.players.data,
    userErrors: state.users.errors,
    seasonAdded: state.seasons.seasonAdded,
    leagueAdded: state.seasons.leagueAdded,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchSeasons,
    fetchUsersWithTeams,
    fetchPlayers,
    addSeason,
    importPlayers,
    addLeague,
    addUser,
    assignTeamToLeague,
    updatePlayers,
    updateTeam
  }
)(AdminPage);
