import debug from 'debug';
import mongoose from 'mongoose';

import { saveNewTeam } from '../team/team.actions';
import { findSeasonById, getLatestSeason } from '../season/season.actions';

const log = debug('kammy:db/user.actions');
const User = mongoose.model('User');

export const saveNewUser = (userData) => {
  const newUser = new User(userData);
  return newUser.save();
};

export const findOneUser = (userDetails) => User.findOne(userDetails).exec();

export const updateUser = (_id, userDetails) =>
  User.findByIdAndUpdate(_id, userDetails, { new: true }).populate('teams').exec();

export const addUser = ({ seasonId, leagueId, name, email, isAdmin, mustChangePassword, password = 'password123' }) => {
  let user;
  const getSeason = (seasonId)
    ? findSeasonById(seasonId)
    : getLatestSeason();

  return Promise.resolve()
    .then(() => saveNewUser({ name, email, password, isAdmin, mustChangePassword }))
    .then((userInserted) => {
      user = userInserted;
      return getSeason;
    })
    .then((response) => {
      // add default in-case user is added before a season is added i.e. admin user
      const season = response || {};
      const leagues = (season && season.leagues && season.leagues) || [];
      const league = leagues.find((lge) => String(lge._id) === String(leagueId)) || {};
      return saveNewTeam({
        user: { _id: user._id, name: user.name || user.email },
        season: { _id: season._id, name: season.name },
        league: { _id: league._id, name: league.name },
      });
    })
    .then((team) => updateUser(user._id, { $push: { teams: team._id } }));
};

export const getUsersWithTeams = () => (
  User.find().populate('teams').exec()
);

export const getUser = ({ email, _id }) => findOneUser({ _id, email });
