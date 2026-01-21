pipeline {
  agent any
  stages {
    stage('checkout') {
      steps {
        git(url: 'https://github.com/destny69/Digital-Menu.git', branch: 'main')
      }
    }
    stage('build') {
      steps {
        sh 'echo "Building the project..."'
        sh 'docker build -t digital-menu:latest .'
      }
    }

    stage('deploy') {
      steps {
        sh 'echo "Deploying the project..."'
        sh 'docker run -d -p 8000:8000 digital-menu:latest'
      }
    }

  }
}