const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title, owner} = request.query;

  let results = title ? repositories.filter( repository => repository.title.includes(title) ) : repositories;

  results = owner ? results.filter( repository => repository.owner.includes(owner) ) : results;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex( repository => repository.id === id );

  if ( index < 0 ) {
    return response.status( 400 ).json({ "Error": "Repository id not found"});
  } 

  let repository;

  const { title, url, techs } = request.body;

  repository = {
    id : repositories[index].id,
    title,
    url,
    techs,
    likes: repositories[index].likes,
  }

  repositories[index] = repository;

  return response.json( repository );
  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex( repository => repository.id === id );

  if ( index < 0 ) {
    return response.status( 400 ).json({ "Error": "Repository id not found"});
  } else {
    repositories.splice( index, 1);
    return response.status( 204 ).send();
  }
});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  const repository = repositories.find( repo => repo.id === id);

  if ( !repository ) {
    return response.status( 400 ).json({ "Error": "Repository id not found"});
  }

  repository.likes += 1;

  return response.json(repository);

});

module.exports = app;
