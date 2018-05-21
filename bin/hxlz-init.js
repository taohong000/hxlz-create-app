#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const inquirer = require('inquirer')
const download = require('../lib/download')
const ask = require('../lib/ask')
const generator = require('../lib/generator')
const rm = require('rimraf').sync

const { templateRepo } = require('../config')

program.usage('<project-name>').parse(process.argv)



// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) { // project-name 必填
    // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
    program.help()
    return
}

go()

function go() {
    inquirer.prompt([{
        type: 'list',
        name: 'templateType',
        message: '模板类型',
        choices: [{
            name: 'dashboard 后台管理系统',
            value: 'dashboard'
        },{
            name: 'webApp 移动端应用',
            value: 'webApp'
        },{
            name: 'simplePage 简单页面',
            value: 'simplePage'
        }]
    }]).then(answers => {
    		const repo = templateRepo[answers.templateType]
        return download(projectName, repo)
            .then(target => {
                return {
                    projectName,
                    target
                }
            })
    }).then(({target}) => {
      const promptdata = require(path.join(target,'meta.json'))
      return ask(promptdata.prompts).then(metadata=>{
      	return {metadata,target}
      })
    }).then(({metadata,target})=>{
    	const src = path.join(target,'template')
    	const dest = path.join(target,'..')
    	generator(metadata,src,dest).then(()=>{
    		rm(target)
    		console.log('渲染成功')
    	})
    })
    .catch(err => console.log(err))

}
