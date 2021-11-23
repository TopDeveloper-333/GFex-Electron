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
            setNumber1: [[], [], []],
            setNumber2: [[], [], []],
            setNumber3: [[], [], []],
            setNumber4: [[], [], []],
            setNumber5: [[], [], []],
            setNumber6: [[], [], []],
            setNumber7: [[], [], []],
            setNumber8: [[], [], []],
            setNumber9: [[], [], []]
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
        let project = {}

        if (_project.isSaveAs == true) {
          project = await projectRepo.create()
        }
        else {
          project = await projectRepo.findOne(_project.projectId)
        }

        project.project_name = _project.projectName

        let content =  {
          fastplan: {
            isFDP: _project.isFDP, 
            isCondensate: _project.isCondensate,
            isEconomics: _project.isEconomics,
            isSeparatorOptimizer: _project.isSeparatorOptimizer
          },
          sep: _project.sep,
          drygas: _project.drygas,
          surface: _project.surface,
          reservoir: _project.reservoir,
          wellhistory: _project.wellhistory,
          economics: _project.economics,
          operations: _project.operations,
          relPerm: _project.relPerm,
          gascondensate: _project.gascondensate,
          resKGKO: _project.resKGKO
        }
        project.content = JSON.stringify(content)

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
        if (fs.existsSync(path.join(__dirname, '../data/KGKO_COREY.OUT'))) {
          let content = fs.readFileSync(path.join(__dirname, '../data/KGKO_COREY.OUT'))
          let lines = content.toString().split("\r\n")

          var result = []
          for (let i = 1; i < lines.length; i++) {
            var a = lines[i].split(" ")
            let oneline = a.filter(value => { if (value != '') return true})
            if (oneline.length > 0)
              result.push(oneline)
          }
          event.returnValue = result
        }
        else {
          event.returnValue = []
        }
      }
      catch (err) {
        throw err;
      }
    });


    ipcMain.on('requestOPT', async (event, sep) => {
      try {
        removeUnnecessaries()

        //
        // create contents
        // 
        let contents = ""
        contents = contents + sep.originalStreamComposition1.N2 + " "
        contents = contents + sep.originalStreamComposition1.CO2 + " "
        contents = contents + sep.originalStreamComposition1.H2S + " "
        contents = contents + sep.originalStreamComposition1.C1 + " "
        contents = contents + sep.originalStreamComposition1.C2 + " "
        contents = contents + sep.originalStreamComposition1.C3 + " "
        contents = contents + sep.originalStreamComposition1.iC4 + " "
        contents = contents + sep.originalStreamComposition1.nC4 + " "
        contents = contents + sep.originalStreamComposition1.iC5 + " "
        contents = contents + sep.originalStreamComposition1.nC5 + " "
        contents = contents + sep.originalStreamComposition1.C6 + " "
        contents = contents + sep.originalStreamComposition1.C7 + "\n"

        contents = contents + sep.originalStreamComposition2.MolecularWeight + " "
        contents = contents + sep.originalStreamComposition2.SpecificGravity + "\n"

        contents = contents + sep.saturatedReservoirConditions.PSAT + " "
        contents = contents + sep.saturatedReservoirConditions.TRES + "\n"

        let rows = sep.separatorConditions.setNumber1.length
        if (rows == 3 && sep.separatorConditions.setNumber1[2][0] == '') {
          rows = 2
        }

        console.log('Rows : ' + rows)

        // create set numbers
        if (sep.separatorConditions.setNumber1[0][0] != '') { 
          contents = contents + '1' + "\n"
          contents = contents + sep.separatorConditions.setNumber1[0][0] + ' '
          contents = contents + sep.separatorConditions.setNumber1[0][1] + '\n'
          contents = contents + sep.separatorConditions.setNumber1[1][0] + ' '
          contents = contents + sep.separatorConditions.setNumber1[1][1] + '\n'
          if (rows == 3) {
            contents = contents + sep.separatorConditions.setNumber1[2][0] + ' '
            contents = contents + sep.separatorConditions.setNumber1[2][1] + '\n'  
          }
        }

        if (sep.separatorConditions.setNumber2[0][0] != '') { 
          contents = contents + '2' + "\n"
          contents = contents + sep.separatorConditions.setNumber2[0][0] + ' '
          contents = contents + sep.separatorConditions.setNumber2[0][1] + '\n'
          contents = contents + sep.separatorConditions.setNumber2[1][0] + ' '
          contents = contents + sep.separatorConditions.setNumber2[1][1] + '\n'
          if (rows == 3) {
            contents = contents + sep.separatorConditions.setNumber2[2][0] + ' '
            contents = contents + sep.separatorConditions.setNumber2[2][1] + '\n'  
          }
        }

        if (sep.separatorConditions.setNumber3[0][0] != '') { 
          contents = contents + '3' + "\n"
          contents = contents + sep.separatorConditions.setNumber3[0][0] + ' '
          contents = contents + sep.separatorConditions.setNumber3[0][1] + '\n'
          contents = contents + sep.separatorConditions.setNumber3[1][0] + ' '
          contents = contents + sep.separatorConditions.setNumber3[1][1] + '\n'
          if (rows == 3) {
            contents = contents + sep.separatorConditions.setNumber3[2][0] + ' '
            contents = contents + sep.separatorConditions.setNumber3[2][1] + '\n'  
          }
        }

        if (sep.separatorConditions.setNumber4[0][0] != '') { 
          contents = contents + '4' + "\n"
          contents = contents + sep.separatorConditions.setNumber4[0][0] + ' '
          contents = contents + sep.separatorConditions.setNumber4[0][1] + '\n'
          contents = contents + sep.separatorConditions.setNumber4[1][0] + ' '
          contents = contents + sep.separatorConditions.setNumber4[1][1] + '\n'
          if (rows == 3) {
            contents = contents + sep.separatorConditions.setNumber4[2][0] + ' '
            contents = contents + sep.separatorConditions.setNumber4[2][1] + '\n'  
          }
        }

        if (sep.separatorConditions.setNumber5[0][0] != '') { 
          contents = contents + '5' + "\n"
          contents = contents + sep.separatorConditions.setNumber5[0][0] + ' '
          contents = contents + sep.separatorConditions.setNumber5[0][1] + '\n'
          contents = contents + sep.separatorConditions.setNumber5[1][0] + ' '
          contents = contents + sep.separatorConditions.setNumber5[1][1] + '\n'
          if (rows == 3) {
            contents = contents + sep.separatorConditions.setNumber5[2][0] + ' '
            contents = contents + sep.separatorConditions.setNumber5[2][1] + '\n'  
          }
        }

        if (sep.separatorConditions.setNumber6[0][0] != '') { 
          contents = contents + '6' + "\n"
          contents = contents + sep.separatorConditions.setNumber6[0][0] + ' '
          contents = contents + sep.separatorConditions.setNumber6[0][1] + '\n'
          contents = contents + sep.separatorConditions.setNumber6[1][0] + ' '
          contents = contents + sep.separatorConditions.setNumber6[1][1] + '\n'
          if (rows == 3) {
            contents = contents + sep.separatorConditions.setNumber6[2][0] + ' '
            contents = contents + sep.separatorConditions.setNumber6[2][1] + '\n'  
          }
        }

        if (sep.separatorConditions.setNumber7[0][0] != '') { 
          contents = contents + '7' + "\n"
          contents = contents + sep.separatorConditions.setNumber7[0][0] + ' '
          contents = contents + sep.separatorConditions.setNumber7[0][1] + '\n'
          contents = contents + sep.separatorConditions.setNumber7[1][0] + ' '
          contents = contents + sep.separatorConditions.setNumber7[1][1] + '\n'
          if (rows == 3) {
            contents = contents + sep.separatorConditions.setNumber7[2][0] + ' '
            contents = contents + sep.separatorConditions.setNumber7[2][1] + '\n'  
          }
        }

        if (sep.separatorConditions.setNumber8[0][0] != '') { 
          contents = contents + '8' + "\n"
          contents = contents + sep.separatorConditions.setNumber8[0][0] + ' '
          contents = contents + sep.separatorConditions.setNumber8[0][1] + '\n'
          contents = contents + sep.separatorConditions.setNumber8[1][0] + ' '
          contents = contents + sep.separatorConditions.setNumber8[1][1] + '\n'
          if (rows == 3) {
            contents = contents + sep.separatorConditions.setNumber8[2][0] + ' '
            contents = contents + sep.separatorConditions.setNumber8[2][1] + '\n'  
          }
        }

        if (sep.separatorConditions.setNumber9[0][0] != '') { 
          contents = contents + '9' + "\n"
          contents = contents + sep.separatorConditions.setNumber9[0][0] + ' '
          contents = contents + sep.separatorConditions.setNumber9[0][1] + '\n'
          contents = contents + sep.separatorConditions.setNumber9[1][0] + ' '
          contents = contents + sep.separatorConditions.setNumber9[1][1] + '\n'
          if (rows == 3) {
            contents = contents + sep.separatorConditions.setNumber9[2][0] + ' '
            contents = contents + sep.separatorConditions.setNumber9[2][1] + '\n'  
          }
        }

        // add content to file
        let filePath = path.join(__dirname, '../data/SEP.in')
        fs.appendFileSync(filePath, contents)

        // launch SEPOPT.exe
        let command = path.resolve(path.join(__dirname, '../data/SEPOPT.exe'))
        console.log('command: ' + command)
        require('child_process').execSync(
          command,
          {
            cwd: path.resolve(path.join(__dirname, '../data/')),
            stdio: 'inherit'
          }
        );

        // get the result : OPT.OUT
        if (fs.existsSync(path.join(__dirname, '../data/OPT.OUT'))) {
          let content = fs.readFileSync(path.join(__dirname, '../data/OPT.OUT'))
          let lines = content.toString().split("\r\n")

          var result = []
          for (let i = 4; i < lines.length; i++) {
            var a = lines[i].split(" ")
            let oneline = a.filter(value => { if (value != '') return true})
            if (oneline.length > 0)
              result.push(oneline)
          }
          event.returnValue = result
        }
        else {
          event.returnValue = []
        }
      }
      catch (err) {
        throw err;
      }
    });

    ipcMain.on('requestCvdOut', async (event, cvd) => {
      try {
        removeUnnecessaries()

        //
        // create contents
        // 
        let contents = ""
        contents = contents + cvd.cvdData1.Psc + " "
        contents = contents + cvd.cvdData1.Tsc + " "
        contents = contents + cvd.cvdData1.T + " "
        contents = contents + cvd.cvdData1.Gi + " "
        contents = contents + cvd.cvdData1.Rvi + " "
        contents = contents + cvd.cvdData1.SpecificGravityOfOil + " "
        contents = contents + cvd.cvdData1.SpecificGravityOfGas + " "
        contents = contents + cvd.cvdData1.ZFactorOfGas + "\n"

        cvd.cvdData2.forEach(line => {
          contents = contents + line[0] + ' '
          contents = contents + line[1] + ' '
          contents = contents + line[2] + ' '
          contents = contents + line[3] + ' '
          contents = contents + line[4] + ' '
          contents = contents + line[5] + '\n'
        }) 

        // add content to file
        let filePath = path.join(__dirname, '../data/CVD.in')
        fs.appendFileSync(filePath, contents)

        // launch BLACKOIL.exe
        let command = path.resolve(path.join(__dirname, '../data/BLACKOIL.exe'))
        console.log('command: ' + command)
        require('child_process').execSync(
          command,
          {
            cwd: path.resolve(path.join(__dirname, '../data/')),
            stdio: 'inherit'
          }
        );

        // get the result
        if (fs.existsSync(path.join(__dirname, '../data/CVD.OUT'))) {
          let content = fs.readFileSync(path.join(__dirname, '../data/CVD.OUT'))
          let lines = content.toString().split("\r\n")

          var result = []
          for (let i = 7; i < lines.length; i++) {
            var a = lines[i].split(" ")
            let oneline = a.filter(value => { if (value != '') return true})
            if (oneline.length > 2)
              result.push(oneline)
          }
          event.returnValue = result
        }
        else {
          event.returnValue = []
        }
      }
      catch (err) {
        throw err;
      }
    });


    let createFastPlan = (fastPlan) => {
      let contents = ""

      if (fastPlan.isFDP == 1)
        contents = contents + '0' + '\n'
      else
        contents = contents + '1' + '\n'

      contents = contents + fastPlan.isCondensate + '\n'
      
      if (fastPlan.isEconomics == true)
        contents = contents + '1' + '\n'
      else
        contents = contents + '0' + '\n'

      if (fastPlan.isSeparatorOptimizer == true)
        contents = contents + '1' + '\n'
      else
        contents = contents + '0' + '\n'
      
      contents = contents + '1' + '\n'

      let filePath = path.join(__dirname, '../data/FASTPLAN.in')
      fs.appendFileSync(filePath, contents)
    }

    let createDryGas = (dryGas) => {
      let contents = ""

      contents = contents + dryGas.standardConditions.Psc + ' '
      contents = contents + dryGas.standardConditions.Tsc + '\n'

      contents = contents + dryGas.gasProperties.gasCompressibility + ' '
      contents = contents + dryGas.gasProperties.gasViscosity + ' '
      contents = contents + dryGas.gasProperties.specificGravity + ' '
      contents = contents + dryGas.gasProperties.resTemp + ' '
      contents = contents + dryGas.gasProperties.N2 + ' '
      contents = contents + dryGas.gasProperties.CO2 + ' '
      contents = contents + dryGas.gasProperties.H2S + '\n'

      contents = contents + dryGas.rockProperties.conateWaterSaturation + ' '
      contents = contents + dryGas.rockProperties.waterCompressibility + ' '
      contents = contents + dryGas.rockProperties.rockCompressibility + '\n'

      let filePath = path.join(__dirname, '../data/GAS_PVT.in')
      fs.appendFileSync(filePath, contents)
    }

    let createGasCondensate = (gasCondensate) => {
      let contents = ""

      contents = contents + gascondensate.gasCondensate1.Psat + ' '
      contents = contents + gascondensate.gasCondensate1.Swi + '\n'

      gasCondensate.gasCondensate2.forEach(element => {
        contents = contents + element[0] + ' '
        contents = contents + element[1] + ' '
        contents = contents + element[2] + ' '
        contents = contents + element[3] + ' '
        contents = contents + element[4] + ' '
        contents = contents + element[5] + ' '
        contents = contents + element[6] + ' '
        contents = contents + element[7] + '\n'
      });

      let filePath = path.join(__dirname, '../data/PINE.in')
      fs.appendFileSync(filePath, contents)
    }

    let createKRSG = (krsg) => {
      let contents = ''

      krsg.forEach(element => {
        contents = contents + element[0] + ' '
        contents = contents + element[1] + ' '
        contents = contents + element[2] + '\n'
      })

      let filePath = path.join(__dirname, '../data/KRSG.in')
      fs.appendFileSync(filePath, contents)
    }

    let createSurface = (surface) => {
      let contents = ''

      contents = contents + surface.tubingProperties.Length + ' '
      contents = contents + surface.tubingProperties.Size + ' '
      contents = contents + surface.tubingProperties.Perfs + ' '
      contents = contents + surface.tubingProperties.SSSV_ID + ' '
      contents = contents + surface.tubingProperties.SSSV_Depth + ' '
      contents = contents + surface.tubingProperties.Temperature + ' '
      contents = contents + surface.tubingProperties.GasZFactor + '\n'

      contents = contents + surface.wellaheadToManifold.Length + ' '
      contents = contents + surface.wellaheadToManifold.Size + ' '
      contents = contents + surface.wellaheadToManifold.Temperature + ' '
      contents = contents + surface.wellaheadToManifold.GasZFactor + '\n'

      contents = contents + surface.manifoldToCompression.Length + ' '
      contents = contents + surface.manifoldToCompression.Size + ' '
      contents = contents + surface.manifoldToCompression.Temperature + ' '
      contents = contents + surface.manifoldToCompression.GasZFactor + '\n'

      contents = contents + surface.compressionToSales.Length + ' '
      contents = contents + surface.compressionToSales.Size + ' '
      contents = contents + surface.compressionToSales.Temperature + ' '
      contents = contents + surface.compressionToSales.GasZFactor + '\n'

      contents = contents + surface.compressionToStart.CompressionDischargeRatio + ' '
      contents = contents + surface.compressionToStart.DELTA_P_MIN + '\n'

      let filePath = path.join(__dirname, '../data/SURFACE.in')
      fs.appendFileSync(filePath, contents)
    }

    let createReservoir = (reservoir) => {
      let contents = ''

      contents = contents + reservoir.reservoirPVT.Viscosity + ' '
      contents = contents + reservoir.reservoirPVT.GasZFactor + ' '
      contents = contents + reservoir.reservoirPVT.SpecificGravity + ' '
      contents = contents + reservoir.reservoirPVT.ReservoirTemperature + '\n'

      contents = contents + reservoir.reservoirParameters.GIIP + ' '
      contents = contents + reservoir.reservoirParameters.ReservoirPressure + '\n'

      contents = contents + reservoir.hasDualPorosity + '\n'

      if (reservoir.hasDualPorosity == 1) {
        contents = contents + reservoir.dualPorosity.km + ' '
        contents = contents + reservoir.dualPorosity.hm + ' '
        contents = contents + reservoir.dualPorosity.ShapeFactorSigma + ' '
        contents = contents + reservoir.dualPorosity.MatrixGIIP + '\n'
      }

      contents = contents + reservoir.wellTestData + '\n'
      if (reservoir.wellTestData == 1) {
        contents = contents + reservoir.cnModel.C + ' '
        contents = contents + reservoir.cnModel.n + '\n'
      }
      else if (reservoir.wellTestData == 2) {
        contents = contents + reservoir.verticalModel.k + ' '
        contents = contents + reservoir.verticalModel.Porosity + ' '
        contents = contents + reservoir.verticalModel.NetPay + ' '
        contents = contents + reservoir.verticalModel.DrainageArea + ' '
        contents = contents + reservoir.verticalModel.WellboreID + ' '
        contents = contents + reservoir.verticalModel.Skin + '\n'
      }
      else if (reservoir.wellTestData == 3) {
        contents = contents + reservoir.horizontalModel.k + ' '
        contents = contents + reservoir.horizontalModel.Porosity + ' '
        contents = contents + reservoir.horizontalModel.NetPay + ' '
        contents = contents + reservoir.horizontalModel.DrainageArea + ' '
        contents = contents + reservoir.horizontalModel.WellboreID + ' '
        contents = contents + reservoir.horizontalModel.Skin + ' '
        contents = contents + reservoir.horizontalModel.WellLength + ' '
        contents = contents + reservoir.horizontalModel.KvKh + '\n'
      }

      let filePath = path.join(__dirname, '../data/RESERVOIR.in')
      fs.appendFileSync(filePath, contents)
    }

    let createReservoirMon = (reservoir) => {
      let contents = ''

      contents = contents + reservoir.reservoirPVT.Viscosity + ' '
      contents = contents + reservoir.reservoirPVT.GasZFactor + ' '
      contents = contents + reservoir.reservoirPVT.SpecificGravity + ' '
      contents = contents + reservoir.reservoirPVT.ReservoirTemperature + ' '
      contents = contents + reservoir.reservoirPVT.Viscosity + '\n'

      contents = contents + reservoir.reservoirParameters.GIIP + ' '
      contents = contents + reservoir.reservoirParameters.ReservoirPressure + '\n'

      contents = contents + reservoir.hasDualPorosity + '\n'

      if (reservoir.hasDualPorosity == 1) {
        contents = contents + reservoir.dualPorosity.km + ' '
        contents = contents + reservoir.dualPorosity.hm + ' '
        contents = contents + reservoir.dualPorosity.ShapeFactorSigma + ' '
        contents = contents + reservoir.dualPorosity.MatrixGIIP + '\n'
      }

      let filePath = path.join(__dirname, '../data/RESERVOIR_MON.in')
      fs.appendFileSync(filePath, contents)
    }

    let createEconomics = (economics) => {
      let contents = ''

      contents = contents + economics.economics1.PriceOfGas + ' '
      contents = contents + economics.economics1.PriceOfCondensate + ' '
      contents = contents + economics.economics1.PriceOfCompression + ' '
      contents = contents + economics.economics1.Life + ' '
      contents = contents + economics.economics1.SalvageRateOfCAPEX + '\n'

      contents = contents + economics.economics2.Investment + ' '
      contents = contents + economics.economics2.ROR + ' '
      contents = contents + economics.economics2.Royalty + ' '
      contents = contents + economics.economics2.Tax + '\n'

      contents = contents + economics.economics3.FirstYearOfProject + ' '
      contents = contents + economics.economics3.FirstYearOfProduction + '\n'

      economics.economics.forEach(element => {
        contents = contents + element[0] + ' '
        contents = contents + element[1] + ' '
        contents = contents + element[2] + '\n'
      })

      let filePath = path.join(__dirname, '../data/ECONOMICS.in')
      fs.appendFileSync(filePath, contents)
    }

    let createOperations = (operations) => {
      let contents = ''

      contents = contents + operations.operationalConstraints.StartOfOperations + ' '
      contents = contents + operations.operationalConstraints.EndOfContract + ' '
      contents = contents + operations.operationalConstraints.MaximumNumberOfWells + ' '
      contents = contents + operations.operationalConstraints.RigSchedule + '\n'

      contents = contents + operations.gasDeliveryRequirements.SalesPressuire + ' '
      contents = contents + operations.gasDeliveryRequirements.TargetRate + ' '
      contents = contents + operations.gasDeliveryRequirements.PressureLimit + ' '
      contents = contents + operations.gasDeliveryRequirements.EconomicsRate + ' '
      contents = contents + operations.gasDeliveryRequirements.MaxFieldRecovery + '\n'

      let filePath = path.join(__dirname, '../data/OPERATIONS.in')
      fs.appendFileSync(filePath, contents)
    }

    let createWellHistory = (wellhistory) => {
      let contents = ''

      contents = contents + wellhistory.historyForecastRun.FirstYearOfProduction + ' ' 
      contents = contents + wellhistory.historyForecastRun.LifeOfTheField + '\n' 

      contents = contents + wellhistory.operationsData.SalesPressure + ' '
      contents = contents + wellhistory.operationsData.PressureLimit + ' '
      contents = contents + wellhistory.operationsData.EconomicsRate + ' '
      contents = contents + wellhistory.operationsData.QgtotInitial + '\n'

      contents = contents + wellhistory.matching + '\n'
      if (wellhistory.matching == 1) {
        contents = contents + wellhistory.numberOfRates + '\n'
        wellhistory.gasFlowRates.forEach(element => {
          contents = contents + element + '\n'
        })
      }

      contents = contents + wellhistory.numberOfWells + '\n'
      wellhistory.wellsNetwork.forEach(element => {
        contents = contents + element.wellTestData + '\n'

        if (element.wellTestData == 1) {
          contents = contents + element.cnModel.C + ' '
          contents = contents + element.cnModel.n + ' '
          contents = contents + element.cnModel.WellToTiePoint + '\n'

          contents = contents + element.cnModel1.PressureAtShutIn + ' '
          contents = contents + element.cnModel1.PressureAtReOpening + '\n'
        }
        else if (element.wellTestData == 2) {
          contents = contents + element.verticalModel.k + ' '
          contents = contents + element.verticalModel.Porosity + ' '
          contents = contents + element.verticalModel.NetPay + ' '
          contents = contents + element.verticalModel.DrainageArea + ' '
          contents = contents + element.verticalModel.WellboreID + ' '
          contents = contents + element.verticalModel.Skin + ' '
          contents = contents + element.verticalModel.WellToTiePoint + '\n'

          contents = contents + element.verticalModel1.PressureAtShutIn + ' '
          contents = contents + element.verticalModel1.PressureAtReOpening + '\n'
        }
        else if (element.wellTestData == 3) {
          contents = contents + element.horizontalModel.k + ' '
          contents = contents + element.horizontalModel.Porosity + ' '
          contents = contents + element.horizontalModel.NetPay + ' '
          contents = contents + element.horizontalModel.DrainageArea + ' '
          contents = contents + element.horizontalModel.WellboreID + ' '
          contents = contents + element.horizontalModel.Skin + ' '
          contents = contents + element.horizontalModel.WellLength + ' '
          contents = contents + element.horizontalModel.KvKh + ' '
          contents = contents + element.horizontalModel.WellToTiePoint + '\n'

          contents = contents + element.horizontalModel1.PressureAtShutIn + ' '
          contents = contents + element.horizontalModel1.PressureAtReOpening + '\n'
        }
      })

      let filePath = path.join(__dirname, '../data/WELL_HISTORY.in')
      fs.appendFileSync(filePath, contents)
    }

    ipcMain.on('runDryGas', async (event, payload) => {
      try {
        removeUnnecessaries()

        //
        // create contents
        // 
        let content =  {
          fastplan: {
            isFDP: payload.isFDP, 
            isCondensate: payload.isCondensate,
            isEconomics: payload.isEconomics,
            isSeparatorOptimizer: payload.isSeparatorOptimizer
          },
          drygas: payload.drygas,
          surface: payload.surface,
          reservoir: payload.reservoir,
          economics: payload.economics,
          operations: payload.operations,
        }

        console.log("RunDryGas: " + JSON.stringify(content))

        createFastPlan(content.fastplan)
        createDryGas(content.drygas)
        createSurface(content.surface)
        createReservoir(content.reservoir)
        if (content.fastplan.isEconomics == true) {
          createEconomics(content.economics)
        }
        createOperations(content.operations)

        // launch ConsoleApplicationFDPHIST.exe
        let command = path.resolve(path.join(__dirname, '../data/ConsoleApplicationFDPHIST.exe'))
        console.log('command: ' + command)
        require('child_process').execSync(
          command,
          {
            cwd: path.resolve(path.join(__dirname, '../data/')),
            stdio: 'inherit'
          }
        );

        // -----------------------------
        // get the result        
        // 

        // Parse PLOT_OF.OUT file
        let result = {}

        if (fs.existsSync(path.join(__dirname, '../data/PLOT_OF.OUT'))) {
          let content = fs.readFileSync(path.join(__dirname, '../data/PLOT_OF.OUT'))
          let lines = content.toString().split("\r\n")

          result.PLOT_OF = content.toString()
          result.RES_PLOT_OF = []

          for (let i = 3; i < lines.length; i++) {
            var a = lines[i].split(" ")
            let oneline = a.filter(value => { if (value != '') return true})
            if (oneline.length > 0)
              result.RES_PLOT_OF.push(oneline)              
          }
        }

        if (fs.existsSync(path.join(__dirname, '../data/ECONOMICS.OUT'))) {
          let content = fs.readFileSync(path.join(__dirname, '../data/ECONOMICS.OUT'))
          let lines = content.toString().split("\r\n")

          result.ECONOMICS = content.toString()
          result.RES_ECONOMICS = []

          for (let i = 2; i < lines.length; i++) {
            var a = lines[i].split(" ")
            let oneline = a.filter(value => { if (value != '') return true})
            if (oneline.length > 0)
              result.RES_ECONOMICS.push(oneline)              
          }
        }

        if (fs.existsSync(path.join(__dirname, '../data/RESULTS_OF.OUT'))) {
          let content = fs.readFileSync(path.join(__dirname, '../data/RESULTS_OF.OUT'))
          result.RESULT_OF = content.toString()
        }

        event.returnValue = result
      }
      catch (err) {
        // throw err;
        event.returnValue = {}
      }
    });


  }

  runConnection()
}
