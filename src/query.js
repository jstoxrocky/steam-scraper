const Game = require('../models/game');

exports.graphPoint = async (x, y) => {
  if (x === 'name') {
    return await graphPointSimple(x, y);
  } else {
    return await graphPointNested(x, y);
  }
};

graphPointSimple = async (x, y) => {
  let data = await Game.find();
  data = data.map(game => ({xAxis: game[x], yAxis: game[y]}));
  console.log(data);
  return data;
};

graphPointNested = async (x, y) => {
  let data = await Game.aggregate([
    {
      $unwind: {
        path: `$${x}`,
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: `$${x}.name`,
        review_count: {$sum: `$${y}`},
      },
    },

    {$sort: {_id: 1}},
  ]);
  data = data.map(game => ({xAxis: game._id, yAxis: game[y]}));
  console.log(data);
  return data;
};
