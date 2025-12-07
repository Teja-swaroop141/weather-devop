pipeline {
    agent any

    environment {
        IMAGE_NAME = "tejaswaroop29/weather-app"
        VERSION = "v${BUILD_NUMBER}"
    }

    tools {
        nodejs "node18"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/Teja-swaroop141/weather-devop.git'
            }
        }

        stage('Build React App') {
            steps {
                bat 'npm install'
                bat 'npm run build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%VERSION% ."
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat "docker login -u %USER% -p %PASS%"
                }
                bat "docker push %IMAGE_NAME%:%VERSION%"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat """
                kubectl set image deployment/weather-app weather=%IMAGE_NAME%:%VERSION%
                kubectl rollout status deployment/weather-app
                """
            }
        }
    }
}
