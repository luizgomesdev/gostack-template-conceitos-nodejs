const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.send(repositories);
});

app.post("/repositories", async (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  response.send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Repository not found " + repositoryIndex });
  }

  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = {};

  response.status(201).send(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Repository not found " + repositoryIndex });
  }

  repositories.splice(repositoryIndex, 1);

  response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Repository not found " + repositoryIndex });
  }

  const repositoryToAddLike = Object.assign(repositories[repositoryIndex]);

  repositoryToAddLike.likes++;

  repositories[repositoryIndex] = repositoryToAddLike;
  response.send(repositories[repositoryIndex]);
});

module.exports = app;
