pipeline {
    agent any

    environment {
        IMAGE_NAME = "tejaswaroop29/weather-app"
        VERSION    = "v${BUILD_NUMBER}"
    }

    tools {
        nodejs "node18"
    }

    stages {

        stage('Build React App') {
            steps {
                dir('weather-app') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-user',  // your existing Docker Hub creds
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )
                ]) {
                    bat "docker login -u %USER% -p %PASS%"
                }

                bat "docker build -t %IMAGE_NAME%:%VERSION% ."
                bat "docker push %IMAGE_NAME%:%VERSION%"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')
            ]) {
                 bat """
                 kubectl set image deployment/weather-app weather=%IMAGE_NAME%:%VERSION% --record
                 kubectl rollout status deployment/weather-app
                 """
                }
             }
        }

    }
}
