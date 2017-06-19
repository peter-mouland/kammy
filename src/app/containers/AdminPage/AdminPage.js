import React from 'react';
import { connect } from 'react-redux';
import Route from 'react-router-dom/Route';

import join from '../../utils/joinPath';
import selectedItem from '../../utils/selectedItem';
import Interstitial from '../../components/Interstitial/Interstitial';
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
  fetchSeasons, fetchPlayers, fetchUsersWithTeams, updateTeam, updateSeason, fetchStats,
  addSeason, addLeague, addUser, updatePlayers, assignTeamToLeague, importPlayers,
  saveGameWeekStats,
  ADD_SEASON, ADD_LEAGUE, ADD_USER, UPDATE_PLAYERS, ASSIGN_TEAM_TO_LEAGUE,
  FETCH_PLAYERS, FETCH_STATS
} from '../../actions';

import './adminPage.scss';

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

  fetchStats = (season, source) => {
    this.props.fetchStats({ currentGW: season.currentGW, source });
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

  updateSeason = (season, update) => {
    this.props.updateSeason({ seasonId: season._id, ...update });
  }

  saveGameWeekStats = (season, update) => {
    this.props.saveGameWeekStats({ seasonId: season._id, update });
  }

  render() {
    const {
      statsErrors = [], loading,
      seasons, players = [], users = [], userErrors = [], match, stats
    } = this.props;

    const addingSeason = loading === ADD_SEASON;
    const addingLeague = loading === ADD_LEAGUE;
    const addingUser = loading === ADD_USER;
    const updatingPlayer = loading === UPDATE_PLAYERS;
    const loadingPlayers = loading === FETCH_PLAYERS;
    const assigningUserToLeague = loading === ASSIGN_TEAM_TO_LEAGUE;
    const statsLoading = loading === FETCH_STATS;

    const seasonPath = join(match.url, 'season/:seasonId/');
    const leaguePath = join(seasonPath, 'league/:leagueId/');
    const usersPath = join(match.url, 'users/');
    const playersPath = join(match.url, 'players/');

    if (!seasons) {
      return <Interstitial />;
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
                  <SeasonAdminOptions season={season}
                                      updateSeason={ (update) => this.updateSeason(season, update) }
                                      fetchStats={ (source) => this.fetchStats(season, source) }
                                      saveGameWeekStats={
                                        (update) => this.saveGameWeekStats(season, update)
                                      }
                                      statsLoading={ statsLoading }
                                      statsErrors={ statsErrors }
                                      stats={ stats }
                  />
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
                           errors={ userErrors }
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
    userErrors: state.users.errors,
    players: state.players.data,
    stats: state.stats.data,
    statsErrors: state.stats.errors,
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
    fetchStats,
    addSeason,
    importPlayers,
    addLeague,
    addUser,
    assignTeamToLeague,
    updatePlayers,
    updateTeam,
    updateSeason,
    saveGameWeekStats,
  }
)(AdminPage);
