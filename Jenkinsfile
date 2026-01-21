pipeline {
  agent any

  stages {
    stage('Checkout App') {
      steps {
        dir('app') {
          git 'https://github.com/destny69/Digital-Menu.git'
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
          git 'https://github.com/destny69/ansibe-appdeploy.git'
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
