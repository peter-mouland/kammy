/* eslint-disable no-underscore-dangle */
import debug from 'debug';

const Team = require('mongoose').model('Teams');

const log = debug('ff:db/team.actions');

export const saveNewTeam = (teamData) => {
  const newTeam = new Team(teamData);
  return newTeam.save();
};

export const findTeams = (search = {}) => Team.find(search).exec();

export const updateTeam = (team) => team;
