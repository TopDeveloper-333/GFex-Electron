import { ipcMain } from "electron"
import { createConnection } from "typeorm"

import { Project } from '../db/project.schema'

import fs from 'fs'
import path from 'path'

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
        sep : {
          originalStreamComposition1: {},
          originalStreamComposition2: {},
          saturatedReservoirConditions: {},
          separatorConditions: {
            setNumber1: [],
            setNumber2: [],
            setNumber3: [],
            setNumber4: [],
            setNumber5: [],
            setNumber6: [],
            setNumber7: [],
            setNumber8: [],
            setNumber9: []
          }
        },
        drygas : {
          standardConditions: {},
          gasProperties: {},
          rockProperties: {}
        },
        surface: {
          tubingProperties: {},
          wellaheadToManifold: {},
          manifoldToCompression: {},
          compressionToSales: {},
          compressionToStart: {}
        },
        reservoir: {
          reservoirPVT: {},
          reservoirParameters: {},
          dualPorosity: {},          
        },
        wellhistory: {
          historyForecastRun: {},
          operationsData: {},
          wellsNetwork: [],
          gasFlowRates: []
        },
        economics: {
          economics1: {},
          economics2: {},
          economics3: {},
          economics: []
        },
        operations: {
          operationalConstraints: {},
          gasDeliveryRequirements: {}
        },
        gascondensate: {
          cvdData1: {},
          cvdData2: [],
          gasCondensate1: {},
          gasCondensate2: {}
        },
        relPerm: {},
        resKGKO: [],
        resOPT: {}
      }
    }

    let removeUnnecessaries = function () {
      if (fs.existsSync(path.join(__dirname, '../data/ECONOMICS.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/ECONOMICS.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/FASTPLAN.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/FASTPLAN.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/GAS_PVT.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/GAS_PVT.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/KRSG.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/KRSG.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/OPERATIONS.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/OPERATIONS.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PCGR.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PCGR.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PGOR.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PGOR.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PINE.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PINE.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PKRG.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PKRG.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PKRO.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PKRO.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PMAT.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PMAT.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PZ.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PZ.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PZED.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PZED.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESERVOIR.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESERVOIR.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESERVOIR_MON.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESERVOIR_MON.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/SURFACE.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/SURFACE.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/WELL_HISTORY.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/WELL_HISTORY.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/CVD.DAT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/CVD.DAT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/COREY_DATA.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/COREY_DATA.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/CVD.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/CVD.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/ECONOMICS.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/ECONOMICS.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/FASTPLAN.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/FASTPLAN.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/GAS_PVT.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/GAS_PVT.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/KRSG.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/KRSG.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/OPERATIONS.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/OPERATIONS.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PINE.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PINE.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PZED.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PZED.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESERVOIR.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESERVOIR.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESERVOIR_MON.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESERVOIR_MON.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/SURFACE.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/SURFACE.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/WELL_HISTORY.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/WELL_HISTORY.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/CVD.NEW'))) {
        fs.unlinkSync(path.join(__dirname, '../data/CVD.NEW'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/CVD.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/CVD.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/EARNING.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/EARNING.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/ECONOMICS.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/ECONOMICS.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/KGKO_COREY.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/KGKO_COREY.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/MATPLOT.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/MATPLOT.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PINE.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PINE.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PLOT_OF.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PLOT_OF.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PLOT_SI.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PLOT_SI.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PRESSURE_MATCHING.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PRESSURE_MATCHING.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESULTS_OF.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESULTS_OF.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESULTS_SI.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESULTS_SI.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/ECONOMICS.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/ECONOMICS.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/FASTPLAN.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/FASTPLAN.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/GAS_PVT.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/GAS_PVT.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/KRSG.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/KRSG.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/OPERATIONS.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/OPERATIONS.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PCGR.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PCGR.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PGOR.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PGOR.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PINE.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PINE.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PKRG.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PKRG.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PKRO.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PKRO.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PMAT.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PMAT.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PZ.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PZ.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PZED.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PZED.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESERVOIR.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESERVOIR.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESERVOIR_MON.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESERVOIR_MON.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/SURFACE.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/SURFACE.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/WELL_HISTORY.BAK'))) {
        fs.unlinkSync(path.join(__dirname, '../data/WELL_HISTORY.BAK'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/CVD.DAT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/CVD.DAT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/COREY_DATA.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/COREY_DATA.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/CVD.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/CVD.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/ECONOMICS.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/ECONOMICS.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/FASTPLAN.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/FASTPLAN.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/GAS_PVT.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/GAS_PVT.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/KRSG.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/KRSG.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/OPERATIONS.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/OPERATIONS.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PINE.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PINE.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PZED.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PZED.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESERVOIR.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESERVOIR.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESERVOIR_MON.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESERVOIR_MON.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/SURFACE.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/SURFACE.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/WELL_HISTORY.in'))) {
        fs.unlinkSync(path.join(__dirname, '../data/WELL_HISTORY.in'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/CVD.NEW'))) {
        fs.unlinkSync(path.join(__dirname, '../data/CVD.NEW'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/CVD.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/CVD.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/EARNING.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/EARNING.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/ECONOMICS.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/ECONOMICS.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/KGKO_COREY.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/KGKO_COREY.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/MATPLOT.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/MATPLOT.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PINE.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PINE.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PLOT_OF.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PLOT_OF.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PLOT_SI.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PLOT_SI.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/PRESSURE_MATCHING.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/PRESSURE_MATCHING.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESULTS_OF.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESULTS_OF.OUT'))
      }

      if (fs.existsSync(path.join(__dirname, '../data/RESULTS_SI.OUT'))) {
        fs.unlinkSync(path.join(__dirname, '../data/RESULTS_SI.OUT'))
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

    ipcMain.on('saveProject', async (event, _project) => {
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



    ipcMain.on('requestKGKO', async (event, _corey) => {
      try {
        removeUnnecessaries()

        //
        // create contents
        // 
        let contents = ""
        contents = contents + _corey.sgi + " "
        contents = contents + _corey.krgl + " "
        contents = contents + _corey.kroi + " "
        contents = contents + _corey.sor + " "
        contents = contents + _corey.lambda + "\n"

        // add content to file
        let filePath = path.join(__dirname, '../data/COREY_DATA.in')
        fs.appendFileSync(filePath, contents)

        // launch COREY_FUNCTION.exe
        let command = path.resolve(path.join(__dirname, '../data/COREY_FUNCTION.exe'))
        console.log('command: ' + command)
        require('child_process').execSync(
          command,
          {
            cwd: path.resolve(path.join(__dirname, '../data/')),
            stdio: 'inherit'
          }
        );

        // get the result        

        event.returnValue = {}
      }
      catch (err) {
        throw err;
      }
    });

    // async function LaunchExe() {
    //   var child = require('child_process').execFile;
    //   var executablePath = '../data/COREY_FUNCTION.exe';
    //   var parameters = ['Hai', 'Test', 'Dat'];
    //   child(executablePath, parameters, function (err, data) {
    //       console.log(err)
    //       console.log(data.toString());
    //   });
    // }    
  
  }

  runConnection()
}
