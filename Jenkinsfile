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

    stage('checkout ansible') {
  steps {
    dir('ansible') {
      git credentialsId: '4ba7cfe1-1a3a-4dc6-851b-2b0152766966', url: 'https://github.com/destny69/ansibe-appdeploy.git', branch: 'main'
    }
  }
}


    stage('Deploy via Ansible') {
      steps {
        dir('ansible') {
          sh 'ansible-playbook -i inventory/hosts.yml playbooks/deploy.yml'
        }
      }
    }
  }
}
