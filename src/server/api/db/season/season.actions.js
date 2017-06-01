import debug from 'debug';

const log = debug('ff:db/season.actions');

const Seasons = require('mongoose').model('Season');

export const findSeasonById = (id) => Seasons.findById(id).exec();

export const getSeasons = (search = {}) => Seasons.find(search).exec();

export const addSeason = ({ name }) => {
  const newSeason = new Seasons({ name });
  return newSeason.save();
};

export const updateSeasonById = (id, seasonUpdate) =>
  Seasons.findByIdAndUpdate(id, seasonUpdate, { new: true }).exec();

export const addLeague = ({ seasonId, name }) => (
  updateSeasonById(seasonId, { $push: { leagues: { name } } })
    .then((season) => season.leagues.find((league) => league.name === name))
);

