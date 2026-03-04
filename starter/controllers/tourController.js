const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours
    }
  });
}

// --------- get a single tour by id ----------
exports.getTour = (req, res) => {
  console.log(req.params);
  // loop through the tours for each element check the id and return true or false
  const id = req.params.id * 1; // here the id is string by this line we convert it to a number
  const tour = tours.find(el => el.id === id);
  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "invalid ID"
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
}

//----------- add a tour ------------
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour
        }
      });
    }
  );
}

// --------- delete a tour -----------
exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'ID invalid'
    })
  }
  // 204 means no content
  //in delete we don't sent any data we jus sent null and that mean the data no longer exist
  res.status(204).json({
    status: 'success',
    data: null
  })
};

// -------- update tour ----------
exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "invalid ID"
    })
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: '<updated tour here ...>'
    }
  })
}

