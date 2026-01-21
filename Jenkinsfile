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

    stage('checkout ansible') {
      steps {
        git(url: 'https://github.com/destny69/ansibe-appdeploy.git', branch: 'main')
      }
    }

  
    stage('checkin in ansible') {
      steps {
        sh 'echo "Running tests..."'
        sh 'ansible-playbook -i inventory deploy.yml'
      }
    }

    stage('deploy') {
      steps {
        sh 'echo "Deploying the project..."'
        sh 'docker stop $(docker ps -q --filter ancestor=digital-menu:latest) || true'
        sh 'docker run -d -p 8000:8000 digital-menu:latest'
      }
    }

  }
}