import { ipcMain } from "electron"
import { createConnection } from "typeorm"

import { Project } from '../db/project.schema'

export function DBinitialize() {
  console.log('ProjectDB is initialized')

  const runConnection = async() => {
    console.log('Start to create connection')

    let connection = await createConnection({
      type: 'sqlite',
      synchronize: true,
      logging: true,
      logger: 'simple-console',
      database: './src/db/sqlite.db',
      entities: [ Project ],
    })

    let projectRepo = connection.getRepository(Project)

    let defaultProjectContent = () => {
      return {
        fastplan : {
          isFDP : 1,
          isCondensate : 1,
          isEconomics : true,
          isSeparatorOptimizer : false
        },
        sep : {},
        drygas : {},
        surface: {},
        reservoir: {},
        wellhistory: {},
        economics: {},
        operations: {},
        gascondensate: {},
        relPerm: {},
        resKGKO: {},
        resOPT: {}
      }
    }

    // ----------------------------------------------------
    // List Projects
    //
    ipcMain.on('listProjects', async (event, ...args) => {
      try {
        let projectList = await projectRepo.find();
        let result = []

        projectList.forEach(element => {
          result.push({id: element.id, name: element.project_name})
        });

        console.log(result)
        event.returnValue = result

      } catch (err) {
        throw err;
      }
    });

    // ----------------------------------------------------
    // Create new project
    //
    ipcMain.on('createProject', async (event, projectName) => {
      try {
        const project = await projectRepo.create();
        project.project_name = projectName
        project.content = JSON.stringify(defaultProjectContent())
        project.result = {}

        await projectRepo.save(project);
        event.returnValue = await projectRepo.findOne(project.id);
      } catch (err) {
        throw err;
      }
    });
  
    // ----------------------------------------------------
    // Open existing project
    //
    ipcMain.on('openProject', async (event, projectId) => {
      try {
        event.returnValue = await projectRepo.findOne(projectId);
      } catch (err) {
        throw err;
      }
    });

    ipcMain.on('openProject', async (event, _project) => {
      try {
        const project = await projectRepo.create(_project);
        await projectRepo.save(project);
        event.returnValue = await projectRepo.findOne(project.id);
      } catch (err) {
        throw err;
      }
    });
  
    ipcMain.on('deleteProject', async (event, _project) => {
      try {
        const project = await projectRepo.create(_project);
        await projectRepo.remove(project);
        event.returnValue = await projectRepo.find();
      } catch (err) {
        throw err;
      }
    });
  
  }

  runConnection()
}
