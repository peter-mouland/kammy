import debug from 'debug';
import mongoose from 'mongoose';

import { saveNewTeam, updateTeamById } from '../team/team.actions';
import { findSeasonById, getLatestSeason } from '../season/season.actions';

const log = debug('kammy:db/user.actions');
const User = mongoose.model('User');

export const saveNewUser = (userData) => {
  const newUser = new User(userData);
  return newUser.save();
};

export const findOneUser = (userDetails) => User.findOne(userDetails).exec();

export const updateUser = async ({ _id, ...userDetails }) => {
  const user = await User.findByIdAndUpdate(_id, userDetails, { new: true }).populate('teams').exec();
  await updateTeamById(user.teams[0]._id, { user: { _id, name: userDetails.name } });
  return user;
};

export const addUser = ({
  seasonId, divisionId, name, email, isAdmin, mustChangePassword, password = 'password123'
}) => {
  let user;
  const getSeason = (seasonId)
    ? findSeasonById(seasonId)
    : getLatestSeason();

  return Promise.resolve()
    .then(() => saveNewUser({
      name, email, password, isAdmin, mustChangePassword
    }))
    .then((userInserted) => {
      user = userInserted;
      return getSeason;
    })
    .then((response) => {
      // add default in-case user is added before a season is added i.e. admin user
      const season = response || {};
      const divisions = (season && season.divisions && season.divisions) || [];
      const division = divisions.find((lge) => String(lge._id) === String(divisionId)) || {};
      return saveNewTeam({
        user: { _id: user._id, name: user.name || user.email },
        season: { _id: season._id, name: season.name },
        division: { _id: division._id, name: division.name },
      });
    })
    .then((team) => updateUser({ _id: user._id, $push: { teams: team._id } }));
};

export const getUsersWithTeams = () => (
  User.find().populate('teams').exec()
);

export const getUser = ({ email, _id }) => findOneUser({ _id, email });
