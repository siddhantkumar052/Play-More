const dbConnection = require("./mongoConnection");

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

module.exports = {
  user: getCollectionFn('user'),
  playground: getCollectionFn('playground'),
  game: getCollectionFn('game'),
  host: getCollectionFn('host'),
  hostData: getCollectionFn('hostData'),
  players: getCollectionFn('players'),
  review: getCollectionFn('review'),
  comment: getCollectionFn('comment'),
  quiz:getCollectionFn('quiz')
};



