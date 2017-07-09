import React from 'react';
import { connect } from 'react-redux';
import Route from 'react-router-dom/Route';

import join from '../../utils/joinPath';
import selectedItem from '../../utils/selectedItem';
import Interstitial from '../../components/Interstitial/Interstitial';
import AdminList from '../../components/Admin/AdminList';
import AddUser from '../../components/Admin/AddUser';
import AdminAddForm from '../../components/Admin/AdminAddForm';
import AssignUserToDivision from '../../components/Admin/AssignUserToDivision';
import SeasonAdminOptions from '../../components/Admin/SeasonAdminOptions';
import DivisionAdminOptions from '../../components/Admin/DivisionAdminOptions';
import UserAdminOptions from '../../components/Admin/UserAdminOptions';
import PlayerAdminOptions from '../../components/Admin/PlayerAdminOptions';
import Auth from '../../authentication/auth-helper';
import {
  fetchSeasons, fetchPlayers, fetchUsersWithTeams, updateTeam, updateSeason, fetchStats,
  addSeason, addDivision, addUser, updatePlayers, assignTeamToDivision, importPlayers,
  saveGameWeekStats,
  ADD_SEASON, ADD_DIVISION, ADD_USER, UPDATE_PLAYERS, ASSIGN_TEAM_TO_DIVISION,
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

  addDivision = (seasonId, name) => {
    this.props.addDivision(seasonId, name);
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

  assignUser = (divisionId, form) => {
    this.props.assignTeamToDivision({ divisionId, divisionName: this.divisionName, ...form });
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
    const addingDivision = loading === ADD_DIVISION;
    const addingUser = loading === ADD_USER;
    const updatingPlayer = loading === UPDATE_PLAYERS;
    const loadingPlayers = loading === FETCH_PLAYERS;
    const assigningUserToDivision = loading === ASSIGN_TEAM_TO_DIVISION;
    const statsLoading = loading === FETCH_STATS;

    const seasonPath = join(match.url, 'season/:seasonId/');
    const divisionPath = join(seasonPath, 'division/:divisionId/');
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
              const divisions = season.divisions;
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
                  <AdminList list={ divisions }
                             path="division"
                             secondary
                  >
                    <AdminAddForm add={ (name) => this.addDivision(season._id, name) }
                               type="division"
                               loading={ addingDivision } />
                  </AdminList>
                  <Route path={divisionPath} render={(divisionProps) => {
                    const division = selectedItem(divisionProps.match, divisions, 'divisionId');
                    if (!division) return null;

                    this.divisionName = division.name;
                    const teams = users.reduce((prev, curr) => prev.concat(curr.teams), []);
                    const divisionTeams = teams.filter(
                      (team) => team.division._id === division._id
                    );
                    return (
                      <DivisionAdminOptions teams={ divisionTeams }
                                          saveUpdates={ (team) => this.updateTeam(team) }>
                        <AssignUserToDivision assignUser={
                          (form) => this.assignUser(division._id, form)
                        }
                                            season={ season }
                                            division={ division }
                                            loading={ assigningUserToDivision }
                                            teams={ teams }
                                            users={ users }
                        />
                      </DivisionAdminOptions>
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
            <li>add <em>more</em> e2e tests</li>
            <li>make season/division names unique</li>
            <li>refactor links to use names rather than id</li>
            <li>refactor arrays to objects to make easier to manipulate</li>
            <li>refactor admin to admin/components</li>
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
    divisionAdded: state.seasons.divisionAdded,
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
    addDivision,
    addUser,
    assignTeamToDivision,
    updatePlayers,
    updateTeam,
    updateSeason,
    saveGameWeekStats,
  }
)(AdminPage);
