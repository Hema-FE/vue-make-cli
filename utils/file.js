const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')

module.exports.createFile = ({
  from,
  to,
  replace = []
}) => {
  fse.copy(from, to).then(() => {
    fs.readFile(to, 'utf8', (err, data) => {
      if (data) {
        for (let i in replace) data = data.replace(replace[i].from, replace[i].to)
        fs.writeFile(to, data, 'utf8', err => {
          if (err) {
            console.log(`${chalk.red(`[error]`)}`)
          } else {
            console.log(`${chalk.green(`[complete] `)}${path.resolve(to)}`)
          }
        })
      } else {
        console.log(`${chalk.green(`[complete] `)}${path.resolve(to)}`)
      }
    })
  })
}

module.exports.hasFile = ({
  to
}) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path.resolve(to))) {
      inquirer.prompt([{
        type: 'confirm',
        message: 'Target file exists. Continue?',
        name: 'ok',
        default: false
      }]).then(answers => {
        if (answers.ok) {
          resolve()
        } else {
          reject()
        }
      }).catch(_ => {
        console.log(_)
      })
    } else {
      resolve()
    }
  })
}
