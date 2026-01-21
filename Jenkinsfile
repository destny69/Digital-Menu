pipeline {
  agent any

  stages {
    stage('Checkout App') {
      steps {
        dir('app') {
          git(url: 'https://github.com/destny69/Digital-Menu.git', branch: 'main')

        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t digital-menu:latest app/'
      }
    }

    stage('Checkout Ansible') {
      steps {
        dir('ansible') {

          git(url: 'https://github.com/destny69/ansibe-appdeploy.git', branch: 'main')
        }
      }
    }

    stage('Deploy via Ansible') {
      steps {
        dir('ansible') {
          sh 'ansible-playbook -i inventory deploy.yml'
        }
      }
    }
  }
}
