const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let numberOfRequests = 0;

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find((element) => element.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  let project = '';

  projects.map((element) => {
    if (element.id == id) project = element;
  });

  if(project) {
    return res.json(project);
  }

  return res.status(400).json('Project not found');
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  existingId = projects.filter((element) => element.id == id);

  if(existingId.length > 0) {
    res.status(400).json('Id already used')
  } else {
    const project = {
      id,
      title,
      tasks: []
    };
  
    projects.push(project);
  
    return res.json(project);
  }
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if(projects.length > 0) {
    let project = '';

    projects.map((element) => {
      if (element.id == id) {
        element.tasks.push(title);
        project = element;
      }
    });

    if(project) {
      res.json(project)
    } else {
      res.status(400).json('Project not found');
    }
  } else {
    res.status(400).json('There is no registered project');
  }
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = '';

  if(projects.length > 0) {
    projects.map((element) => {
      if(element.id == id) {
        element.title = title;
        project = element;
      }
    });

    if(project) {
      res.json(project)
    } else {
      res.status(400).json('Project not found');
    }
  } else {
    res.status(400).json('There is no registered project');
  }
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex((element) => element.id == id);

  projects.splice(projectIndex, 1);
});


server.listen(3000);