/**
 * Jenkins Pipeline 生成器
 */
import type { CIOptions } from '../types/index.js'

export class JenkinsGenerator {
  generate(options: CIOptions = { platform: 'jenkins' }): string {
    const { nodeVersions = ['18'], cache = true } = options

    return `pipeline {
  agent any
  
  tools {
    nodejs 'Node ${nodeVersions[0]}'
  }
  
  stages {
    stage('Install') {
      steps {
        sh 'npm install -g pnpm'
        ${cache ? `sh 'pnpm install --frozen-lockfile'` : `sh 'pnpm install'`}
      }
    }
    
    stage('Test') {
      steps {
        sh 'pnpm test:coverage'
      }
    }
    
    stage('Report') {
      steps {
        publishHTML([
          allowMissing: false,
          alwaysLinkToLastBuild: true,
          keepAll: true,
          reportDir: 'coverage/html',
          reportFiles: 'index.html',
          reportName: 'Coverage Report'
        ])
        
        junit 'test-results/**/*.xml'
      }
    }
  }
  
  post {
    always {
      cleanWs()
    }
  }
}
`
  }
}

export function createJenkinsGenerator(): JenkinsGenerator {
  return new JenkinsGenerator()
}



