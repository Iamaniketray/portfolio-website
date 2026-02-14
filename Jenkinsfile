pipeline {
    agent any

    triggers {
        cron('H/5 * * * *')
        pollSCM('H/2 * * * *')
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Iamaniketray/portfolio-website.git'
            }
        }

        stage('Build') {
            steps {
                echo "Static website - No build required"
            }
        }

        stage('Echo Build Status') {
            steps {
                echo "Portfolio Build Successful!"
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: '**/*.*'
            }
        }
    }
}
