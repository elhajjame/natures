const fs = require('fs');

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));
// -------- get users ----------
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users
    }
  })
}
// -------- get create user ----------
exports.createUser = (req, res) => {
  const newUserID = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newUserID }, req.body);
  users.push(newUser);

  fs.writeFile(`${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    err => {
      res.status(201).json({
        status: "success",
        message: 'the user has ben created successfully',
        data: {
          users
        }
      })
    })
}

//----------- get get User By ID---------
exports.getUserByID = (req, res) => {
  const user = users.find(u => u._id === req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: user
  });
};

//----------- delete user ----------
exports.deleteUser = (req, res) => {
  const user = users.findIndex(u => u._id === req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found'
    });
  };

  res.status(204).json({
    status: 'success',
    data: null
  })
};
